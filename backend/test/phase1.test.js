import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";
import { authorizeRoles } from "../src/middleware/rbacMiddleware.js";

process.env.CLIENT_URL = "http://localhost:5173";

test("health endpoint reports application and database status", async () => {
  const response = await request(app).get("/api/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
  assert.equal(typeof response.body.db, "string");
});

test("protected endpoint rejects unauthenticated requests", async () => {
  const response = await request(app).get("/api/auth/me");

  assert.equal(response.status, 401);
  assert.equal(response.body.message, "Not authenticated");
});

test("unknown routes use the central not-found response", async () => {
  const response = await request(app).get("/api/does-not-exist");

  assert.equal(response.status, 404);
  assert.equal(response.body.message, "Route not found");
});

test("CORS rejects origins outside CLIENT_URL", async () => {
  const response = await request(app)
    .get("/api/health")
    .set("Origin", "https://untrusted.example");

  assert.equal(response.status, 403);
});

test("RBAC allows only configured roles", () => {
  const adminOnly = authorizeRoles("admin");
  let nextError;

  adminOnly({ user: { role: "user" } }, {}, (error) => {
    nextError = error;
  });

  assert.equal(nextError.status, 403);

  let nextCalled = false;
  adminOnly({ user: { role: "admin" } }, {}, (error) => {
    assert.equal(error, undefined);
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
});
