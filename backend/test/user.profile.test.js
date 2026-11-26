import "dotenv/config";
import test, { before, after, afterEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";

process.env.JWT_SECRET ||= "test-only-secret-that-is-at-least-32-characters";
process.env.CLIENT_URL ||= "http://localhost:5173";

const { default: app } = await import("../src/app.js");
const { default: User } = await import("../src/models/User.js");
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
const integration = { skip: !mongoUri && "Set MONGO_URI to run MongoDB-backed profile tests" };
const createdEmails = new Set();

before(async () => {
  if (mongoUri) await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
});
afterEach(async () => {
  if (mongoose.connection.readyState && createdEmails.size) {
    await User.deleteMany({ email: { $in: [...createdEmails] } });
    createdEmails.clear();
  }
});
after(async () => {
  if (mongoose.connection.readyState) await mongoose.disconnect();
});

const userData = () => {
  const suffix = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    username: `profile_${suffix}`.slice(0, 30),
    email: `${suffix}@example.test`,
    password: "correct-horse-42",
  };
};

const registerAgent = async (overrides = {}) => {
  const agent = request.agent(app);
  const data = { ...userData(), ...overrides };
  createdEmails.add(data.email);
  const response = await agent.post("/api/auth/register").send(data);
  assert.equal(response.status, 201);
  return { agent, data, user: response.body.user };
};

const patchWithCsrf = async (agent, body) => {
  const csrf = await agent.get("/api/auth/csrf");
  assert.equal(csrf.status, 200);
  return agent.patch("/api/users/me").set("X-CSRF-Token", csrf.body.csrfToken).send(body);
};

test("fetches the authenticated user's private profile without a password", integration, async () => {
  const { agent, user } = await registerAgent();
  const response = await agent.get("/api/users/me");
  assert.equal(response.status, 200);
  assert.equal(response.body.user._id, user._id);
  assert.equal(response.body.user.email, user.email);
  assert.equal(response.body.user.role, "user");
  assert.equal("password" in response.body.user, false);
});

test("updates the authenticated user's username and bio", integration, async () => {
  const { agent } = await registerAgent();
  const response = await patchWithCsrf(agent, { username: "updated_profile", bio: "Cybersecurity student" });
  assert.equal(response.status, 200);
  assert.equal(response.body.user.username, "updated_profile");
  assert.equal(response.body.user.bio, "Cybersecurity student");
  assert.equal(response.body.user.role, "user");
});

test("rejects a profile update without authentication", async () => {
  const response = await request(app).patch("/api/users/me").send({ username: "another_name" });
  assert.equal(response.status, 401);
});

test("validates public profile username format before lookup", async () => {
  const response = await request(app).get("/api/users/bad-name");
  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Validation failed");
});

test("rejects attempts to change role", integration, async () => {
  const { agent, user } = await registerAgent();
  const response = await patchWithCsrf(agent, { role: "admin" });
  assert.equal(response.status, 400);
  assert.equal((await User.findById(user._id)).role, "user");
});

test("rejects attempts to change email", integration, async () => {
  const { agent, user } = await registerAgent();
  const response = await patchWithCsrf(agent, { email: "new@example.test" });
  assert.equal(response.status, 400);
  assert.equal((await User.findById(user._id)).email, user.email);
});

test("rejects attempts to change password", integration, async () => {
  const { agent, user } = await registerAgent();
  const response = await patchWithCsrf(agent, { password: "new-password-123" });
  assert.equal(response.status, 400);
  const stored = await User.findById(user._id).select("+password");
  assert.notEqual(stored.password, "new-password-123");
});

test("returns a conflict when a username is already taken", integration, async () => {
  const { agent } = await registerAgent();
  const other = await registerAgent();
  const response = await patchWithCsrf(agent, { username: other.user.username });
  assert.equal(response.status, 409);
  assert.equal(response.body.message, "Username is already in use");
});

test("fetches a public profile without private account fields", integration, async () => {
  const { data } = await registerAgent();
  const response = await request(app).get(`/api/users/${data.username}`);
  assert.equal(response.status, 200);
  assert.equal(response.body.user.username, data.username);
  assert.equal(response.body.user.bio, "");
  for (const privateField of ["email", "password", "role", "_id"]) {
    assert.equal(privateField in response.body.user, false);
  }
});

test("returns 404 for a nonexistent public username", integration, async () => {
  const response = await request(app).get("/api/users/no_such_profile_92");
  assert.equal(response.status, 404);
  assert.equal(response.body.message, "User not found");
});

test("validates profile username and bio", integration, async () => {
  const { agent } = await registerAgent();
  const invalidUsername = await patchWithCsrf(agent, { username: "x!" });
  assert.equal(invalidUsername.status, 400);
  const invalidBio = await patchWithCsrf(agent, { bio: "b".repeat(301) });
  assert.equal(invalidBio.status, 400);
});
