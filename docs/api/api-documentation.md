# CyberConnect — API Documentation

This document describes the REST API implemented in `backend/`. It is the contract between the backend and the frontend.

**Status:** Phase 1 (foundation) and Phase 2 backend (authentication) are implemented. Endpoints listed under [Planned endpoints](#8-planned-endpoints) do **not** exist yet.

---

## 1. Overview

| Item | Value |
|---|---|
| Base URL (local) | `http://localhost:5000/api` |
| Format | JSON (`Content-Type: application/json`) |
| Authentication | JWT stored in an **httpOnly cookie** named `token` |
| Allowed frontend origin | `http://localhost:5173` (set by `CLIENT_URL`) |

All example paths below are relative to the base URL. For example, `POST /auth/login` means `POST http://localhost:5000/api/auth/login`.

---

## 2. Rules for the frontend

1. **Send credentials with every request.** The cookie is only sent when the request is made with credentials. With Axios: `axios.create({ baseURL, withCredentials: true })`. With `fetch`: `credentials: "include"`.
2. **Never store the token yourself.** The cookie is `httpOnly`, so JavaScript cannot read it, and it must not be copied into `localStorage` or state.
3. **To find out whether the user is logged in, call `GET /auth/me`.** A `401` means "not logged in" and is expected, not a bug.
4. **Run the frontend at exactly `http://localhost:5173`.** Other origins are blocked by CORS.
5. **Do not send `role`.** The server ignores it. Roles are assigned by the backend only.
6. **Client-side validation is for convenience only.** The server validates everything again.

---

## 3. Authentication model

- A successful `register` or `login` response includes a `Set-Cookie` header:

  ```text
  token=<jwt>; Path=/; Max-Age=604800; HttpOnly; SameSite=Lax
  ```

  - `HttpOnly`: not readable from JavaScript.
  - `SameSite=Lax`: sent on same-site requests (for example `localhost:5173` to `localhost:5000`).
  - `Secure`: added automatically when the backend runs with `NODE_ENV=production`.
  - Lifetime: 7 days (`JWT_EXPIRES_DAYS`).
- The browser attaches the cookie automatically to later requests.
- `POST /auth/logout` clears the cookie.
- Authenticated state-changing requests require a signed CSRF token in both the `csrfToken` cookie and `X-CSRF-Token` header. Obtain the value from `GET /auth/csrf`; the frontend Axios client does this automatically. Registration and login do not require a CSRF token. Logout requires one when an auth cookie is present.
- Protected endpoints return `401` if the cookie is missing, expired, tampered with, or belongs to a deleted account.
- The user is reloaded from the database on every protected request, so role changes and account deletion take effect immediately.

For deployment, serve the frontend and API from the same site (for example `app.example.com` and `api.example.com`), otherwise `SameSite=Lax` cookies will not be sent.

---

## 4. Data objects

### User

Returned by auth endpoints. The password and hash are **never** returned.

```json
{
  "_id": "674f1c2a9d3b4a0012a3b4c5",
  "username": "navya_1",
  "email": "navya@example.com",
  "role": "user",
  "bio": "",
  "createdAt": "2026-11-21T07:09:10.000Z",
  "updatedAt": "2026-11-21T07:09:10.000Z"
}
```

| Field | Type | Notes |
|---|---|---|
| `_id` | string | Unique user id |
| `username` | string | 3-30 chars, stored **lowercase** (`Navya_1` becomes `navya_1`) |
| `email` | string | Stored lowercase |
| `role` | string | `"user"` or `"admin"` |
| `bio` | string | Up to 300 chars, empty by default |
| `profilePictureUrl` | string or `null` | Optional HTTP(S) URL; uploads are not implemented |
| `createdAt`, `updatedAt` | string | ISO 8601 timestamps |

---

## 5. Endpoints

### 5.1 `GET /health`

Checks that the API is running. No authentication.

**200 OK**
```json
{ "status": "ok", "db": "connected" }
```
`db` is `"connected"` or `"disconnected"`.

---

### 5.2 `POST /auth/register`

Creates an account and logs the user in (sets the cookie).

**Request body**
```json
{
  "username": "navya_1",
  "email": "navya@example.com",
  "password": "correct-horse-1"
}
```

| Field | Rules |
|---|---|
| `username` | Required string. 3-30 characters. Letters, numbers and underscores only. |
| `email` | Required string. Must be a valid email address. |
| `password` | Required string. 8-72 characters. |

**201 Created** (also sets the `token` cookie)
```json
{ "user": { "_id": "674f1c2a9d3b4a0012a3b4c5", "username": "navya_1", "email": "navya@example.com", "role": "user", "bio": "", "createdAt": "...", "updatedAt": "..." } }
```

**Errors**

| Status | When | Body |
|---|---|---|
| 400 | Validation failed | `{ "message": "Validation failed", "errors": [{ "field": "password", "message": "Password must be 8-72 characters" }] }` |
| 409 | Username or email already taken | `{ "message": "Username or email is already in use" }` |
| 429 | Rate limit exceeded | `{ "message": "Too many attempts. Please try again later." }` |

---

### 5.3 `POST /auth/login`

Logs a user in with email and password (sets the cookie).

**Request body**
```json
{ "email": "navya@example.com", "password": "correct-horse-1" }
```

The email is case-insensitive.

**200 OK** (also sets the `token` cookie)
```json
{ "user": { "_id": "...", "username": "navya_1", "email": "navya@example.com", "role": "user", "bio": "", "createdAt": "...", "updatedAt": "..." } }
```

**Errors**

| Status | When | Body |
|---|---|---|
| 400 | Missing or non-string `email` or `password` | `{ "message": "Validation failed", "errors": [...] }` |
| 401 | Wrong password **or** unknown email | `{ "message": "Invalid email or password" }` |
| 429 | Rate limit exceeded | `{ "message": "Too many attempts. Please try again later." }` |

The 401 message is intentionally identical for a wrong password and an unknown email, so attackers cannot discover which emails are registered. Do not try to distinguish them in the UI.

---

### 5.4 `POST /auth/logout`

Clears the cookie. No body. Safe to call when not logged in.

**200 OK**
```json
{ "message": "Logged out" }
```

---

### 5.5 `GET /auth/me`

Returns the currently logged-in user. Use this when the app loads to restore the session.

**200 OK**
```json
{ "user": { "_id": "...", "username": "navya_1", "email": "navya@example.com", "role": "user", "bio": "", "createdAt": "...", "updatedAt": "..." } }
```

**401 Unauthorized** (not logged in, or cookie invalid or expired)
```json
{ "message": "Not authenticated" }
```

### 5.6 `GET /auth/csrf`

Requires authentication. Returns the signed CSRF cookie value for clients that need to make authenticated state-changing requests.

**200 OK**
```json
{ "csrfToken": "<signed-token>" }
```

Send the returned value in the `X-CSRF-Token` header. A missing, mismatched, or invalid token receives `403 Invalid CSRF token`.

### 5.7 `GET /users/me`

Requires authentication through the HTTP-only `token` cookie. Returns the current account profile; the user ID comes from the verified session, not request data. The response omits the password and password hash.

**200 OK**
```json
{
  "user": {
    "_id": "674f1c2a9d3b4a0012a3b4c5",
    "username": "navya_1",
    "email": "navya@example.com",
    "role": "user",
    "bio": "Cybersecurity student",
    "profilePictureUrl": null
  }
}
```

**401 Unauthorized:** missing or invalid authentication cookie. **404 Not Found:** the account no longer exists.

### 5.8 `PATCH /users/me`

Requires authentication and a valid CSRF token. Only `username` and `bio` can be updated. At least one field is required. Email, password, role, profile picture URL, IDs, and all other fields are rejected with `400`; they are never applied.

**Request body**
```json
{ "username": "navya_cyber", "bio": "Cybersecurity student" }
```

Username must be 3-30 letters, numbers, or underscores. It is stored lowercase. Bio must be a string of at most 300 characters.

**200 OK** (response uses the authenticated profile shape from `GET /users/me`)
```json
{
  "user": {
    "_id": "674f1c2a9d3b4a0012a3b4c5",
    "username": "navya_cyber",
    "email": "navya@example.com",
    "role": "user",
    "bio": "Cybersecurity student",
    "profilePictureUrl": null
  }
}
```

**Errors:** `400 Validation failed` for invalid fields or protected fields; `401 Not authenticated`; `403 Invalid CSRF token`; `404 User not found`; `409 Username is already in use`.

### 5.9 `GET /users/:username`

Public endpoint; authentication is not required. Returns only username, bio, and profile picture URL. Email, role, account ID, password, and other account data are excluded.

**200 OK**
```json
{
  "user": {
    "username": "navya_cyber",
    "bio": "Cybersecurity student",
    "profilePictureUrl": null
  }
}
```

**400 Bad Request:** invalid username format. **404 Not Found:** no user has that username.

---

## 6. Errors

All errors are JSON with a `message` field.

| Status | Meaning | Body |
|---|---|---|
| 400 | Validation failed | `{ "message": "Validation failed", "errors": [{ "field", "message" }] }` |
| 400 | Malformed JSON body | `{ "message": "Invalid request" }` |
| 401 | Not authenticated or bad credentials | `{ "message": "..." }` |
| 404 | Unknown route | `{ "message": "Route not found" }` |
| 409 | Conflict (duplicate account) | `{ "message": "Username or email is already in use" }` |
| 413 | Request body larger than 10 kb | `{ "message": "request entity too large" }` |
| 429 | Too many requests | `{ "message": "Too many attempts. Please try again later." }` |
| 500 | Unexpected server error | `{ "message": "Internal server error" }` |

**Validation errors (400):** the `errors` array can contain more than one entry for the same field (for example both "Username is required" and "Username must be 3-30 characters"). Show the **first** message per field.

---

## 7. Limits and security behaviour

- **Rate limit:** `POST /auth/register` and `POST /auth/login` share one limit of **20 requests per 15 minutes per IP address**. Every request counts, including failed ones. The 21st returns `429` with a `Retry-After` header. `RateLimit-Limit`, `RateLimit-Remaining` and `RateLimit-Reset` headers are included on these responses. Normal authenticated requests are not rate limited by this auth limiter.
- **Body size:** JSON bodies larger than 10 kb are rejected with `413`.
- **Passwords** are hashed with bcrypt and never returned.
- **Mass assignment:** only `username`, `email` and `password` are read from the register body. Any `role` value is ignored, and new accounts are always `user`.
- **Administrator provisioning:** there is no public admin registration endpoint. An operator can promote an existing account with `ENABLE_ADMIN_PROVISIONING=true`, `ADMIN_EMAIL=<existing-account-email>`, and `npm run provision-admin` from `backend`; disable the flag after use.
- **Injection:** non-string values (for example `{"$ne": null}`) in `email` or `password` are rejected with `400`.
- **Security headers** are set by Helmet. CORS allows only `CLIENT_URL`, with credentials.

---

## 8. Planned endpoints

These are **not implemented yet** and may change. They are listed so the frontend can plan ahead.

| Phase | Endpoint | Purpose |
|---|---|---|
| 3 | `GET /users` (admin) | List users |
| 3 | `PATCH /users/:id/role` (admin) | Change a user's role |
| 4 | `GET /posts`, `GET /posts/:id` | List and read posts |
| 4 | `POST /posts` | Create a post (login required) |
| 4 | `PUT /posts/:id`, `DELETE /posts/:id` | Edit or delete a post (author or admin) |
| 5 | `GET /search?q=&type=` | Search posts and users |

Future scope (not scheduled): comments, likes, bookmarks, image uploads, tags, reporting and moderation, password reset, refresh tokens.

---

## 9. Quick test (Windows PowerShell)

Run the backend (`npm run dev` in `backend`), then in another terminal:

```powershell
$body = @{ username = "testuser"; email = "test@example.com"; password = "correct-horse-1" } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5000/api/auth/register -Method Post -ContentType "application/json" -Body $body -SessionVariable s
Invoke-RestMethod -Uri http://localhost:5000/api/auth/me -WebSession $s
$csrf = Invoke-RestMethod -Uri http://localhost:5000/api/auth/csrf -WebSession $s
Invoke-RestMethod -Uri http://localhost:5000/api/auth/logout -Method Post -WebSession $s -Headers @{ "X-CSRF-Token" = $csrf.csrfToken }
Invoke-RestMethod -Uri http://localhost:5000/api/auth/me -WebSession $s   # 401 expected
```

`-SessionVariable` and `-WebSession` keep the cookie between calls, the same way a browser does.
