import "dotenv/config";
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import request from "supertest";

process.env.JWT_SECRET ||= "test-only-secret-that-is-at-least-32-characters";
process.env.CLIENT_URL ||= "http://localhost:5173";

const { default: app } = await import("../src/app.js");
const { default: User } = await import("../src/models/User.js");
const { createCsrfToken, isValidCsrfToken, setAuthCookie, clearAuthCookie } = await import("../src/utils/generateToken.js");
const { requireCsrf } = await import("../src/middleware/csrfMiddleware.js");
const { authorizeRoles } = await import("../src/middleware/rbacMiddleware.js");
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
const integration = { skip: !mongoUri && "Set MONGO_URI to run MongoDB-backed auth tests" };

before(async () => {
  if (mongoUri) await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
});
after(async () => {
  if (mongoose.connection.readyState) await mongoose.disconnect();
});

const userData = () => {
  const suffix = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return { username: `test_${suffix}`.slice(0, 30), email: `${suffix}@example.test`, password: "correct-horse-42" };
};

test("registration hashes password, ignores requested admin role, and sets secure cookie attributes", integration, async () => {
  const data = userData();
  const response = await request(app).post("/api/auth/register").send({ ...data, role: "admin" });
  assert.equal(response.status, 201);
  assert.equal(response.body.user.role, "user");
  assert.equal("password" in response.body.user, false);
  const stored = await User.findById(response.body.user._id).select("+password");
  assert.notEqual(stored.password, data.password);
  assert.match(stored.password, /^\$2[aby]\$/);
  const cookies = response.headers["set-cookie"];
  const authCookie = cookies.find((cookie) => cookie.startsWith("token="));
  const csrfCookie = cookies.find((cookie) => cookie.startsWith("csrfToken="));
  assert.match(authCookie, /HttpOnly/i);
  assert.match(authCookie, /SameSite=Lax/i);
  assert.match(authCookie, /Path=\//i);
  assert.match(authCookie, /Max-Age=/i);
  assert.doesNotMatch(csrfCookie, /HttpOnly/i);
  await User.deleteOne({ _id: stored._id });
});

test("duplicate registration is rejected", integration, async () => {
  const data = userData();
  const first = await request(app).post("/api/auth/register").send(data);
  const duplicate = await request(app).post("/api/auth/register").send(data);
  assert.equal(first.status, 201);
  assert.equal(duplicate.status, 409);
  await User.deleteOne({ email: data.email });
});

test("login succeeds and incorrect password returns a generic error", integration, async () => {
  const data = userData();
  await request(app).post("/api/auth/register").send(data);
  const login = await request(app).post("/api/auth/login").send({ email: data.email, password: data.password });
  assert.equal(login.status, 200);
  assert.ok(login.headers["set-cookie"].some((cookie) => cookie.startsWith("token=")));
  const incorrect = await request(app).post("/api/auth/login").send({ email: data.email, password: "wrong-password" });
  assert.equal(incorrect.status, 401);
  assert.equal(incorrect.body.message, "Invalid email or password");
  await User.deleteOne({ email: data.email });
});

test("protected endpoint rejects missing, invalid, expired, and deleted-user authentication", integration, async () => {
  assert.equal((await request(app).get("/api/auth/me")).status, 401);
  assert.equal((await request(app).get("/api/auth/me").set("Cookie", "token=not-a-jwt")).status, 401);
  const expired = jwt.sign({ id: new mongoose.Types.ObjectId().toString(), exp: Math.floor(Date.now() / 1000) - 60 }, process.env.JWT_SECRET, { algorithm: "HS256" });
  assert.equal((await request(app).get("/api/auth/me").set("Cookie", `token=${expired}`)).status, 401);

  const data = userData();
  const response = await request(app).post("/api/auth/register").send(data);
  await User.deleteOne({ _id: response.body.user._id });
  assert.equal((await request(app).get("/api/auth/me").set("Cookie", response.headers["set-cookie"].find((cookie) => cookie.startsWith("token=")).split(";")[0])).status, 401);
});

test("logout clears both cookies and authenticated logout requires CSRF token", integration, async () => {
  const agent = request.agent(app);
  const data = userData();
  await agent.post("/api/auth/register").send(data);
  const blocked = await agent.post("/api/auth/logout");
  assert.equal(blocked.status, 403);
  const csrf = await agent.get("/api/auth/csrf");
  assert.equal(csrf.status, 200);
  const logout = await agent.post("/api/auth/logout").set("X-CSRF-Token", csrf.body.csrfToken);
  assert.equal(logout.status, 200);
  assert.ok(logout.headers["set-cookie"].some((cookie) => cookie.startsWith("token=;")));
  assert.ok(logout.headers["set-cookie"].some((cookie) => cookie.startsWith("csrfToken=;")));
  await User.deleteOne({ email: data.email });
});

test("regular users cannot pass admin role authorization", () => {
  let error;
  authorizeRoles("admin")({ user: { role: "user" } }, {}, (nextError) => { error = nextError; });
  assert.equal(error.status, 403);
});

test("cookie creation and clearing use consistent security attributes", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  const created = [];
  const cleared = [];
  const response = {
    cookie: (name, value, options) => created.push({ name, value, options }),
    clearCookie: (name, options) => cleared.push({ name, options }),
  };
  try {
    setAuthCookie(response, new mongoose.Types.ObjectId().toString());
    clearAuthCookie(response);
  } finally {
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
  }

  const auth = created.find(({ name }) => name === "token");
  const csrf = created.find(({ name }) => name === "csrfToken");
  assert.equal(auth.options.httpOnly, true);
  assert.equal(auth.options.secure, true);
  assert.equal(auth.options.sameSite, "lax");
  assert.equal(auth.options.path, "/");
  assert.equal(auth.options.maxAge, 7 * 24 * 60 * 60 * 1000);
  assert.equal(csrf.options.httpOnly, undefined);
  assert.equal(csrf.options.secure, true);
  assert.equal(csrf.options.sameSite, auth.options.sameSite);
  assert.equal(csrf.options.path, auth.options.path);
  assert.equal(cleared.find(({ name }) => name === "token").options.path, auth.options.path);
  assert.equal(cleared.find(({ name }) => name === "csrfToken").options.path, csrf.options.path);
});

test("CSRF middleware accepts only matching signed cookie and request header", () => {
  const token = createCsrfToken();
  assert.equal(isValidCsrfToken(token), true);
  assert.equal(isValidCsrfToken(`${token}tampered`), false);
  let error;
  requireCsrf({ cookies: { csrfToken: token }, get: () => "different-token" }, {}, (nextError) => { error = nextError; });
  assert.equal(error.status, 403);
  let passed = false;
  requireCsrf({ cookies: { csrfToken: token }, get: () => token }, {}, (nextError) => { passed = !nextError; });
  assert.equal(passed, true);
});
