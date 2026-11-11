# CyberConnect — System Architecture

## 1. Overview

CyberConnect is a cybersecurity blogging and community platform. It combines technical article publishing, a Markdown editor, community discussions, content discovery, and administrative moderation.

The architecture is modular so that authentication, content management, community features, and moderation can evolve independently.

---

## 2. High-Level Architecture

```text
                         ┌───────────────────────┐
                         │         USERS         │
                         │                       │
                         │ Students / Developers │
                         │ Professionals / Fans  │
                         │ Administrators        │
                         └───────────┬───────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │       PRESENTATION LAYER       │
                    │       React Web Frontend       │
                    │                                │
                    │ Home / Feed                    │
                    │ Article Reader                 │
                    │ Markdown Editor                │
                    │ User Profiles                  │
                    │ Search & Discovery             │
                    │ Bookmarks                      │
                    │ Admin Dashboard                │
                    └───────────────┬────────────────┘
                                    │
                              HTTPS / REST API
                                    │
                                    ▼
                    ┌────────────────────────────────┐
                    │       APPLICATION LAYER        │
                    │   Node.js + Express.js API     │
                    │                                │
                    │ Authentication & Users         │
                    │ Post Service                   │
                    │ Comment Service                │
                    │ Tag Service                    │
                    │ Interaction Service            │
                    │ Upload Service                 │
                    │ Moderation Service             │
                    └───────────────┬────────────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │                             │
                     ▼                             ▼
          ┌──────────────────────┐      ┌──────────────────────┐
          │      DATA LAYER      │      │    FILE STORAGE      │
          │                      │      │                      │
          │ MongoDB (Mongoose)   │      │ Cloudinary           │
          │ Users                │      │ Cover images         │
          │ Posts                │      │ Profile pictures     │
          │ Comments             │      │ Article images       │
          │ Tags                 │      └──────────────────────┘
          │ Likes                │
          │ Bookmarks            │
          │ Reports              │
          └──────────────────────┘
```

---

## 3. Request Flow

```text
React Frontend
      |
      v
Axios / REST API
      |
      v
Express.js Server
      |
      v
Middleware (security headers, CORS, rate limiting, auth, validation)
      |
      v
Controllers
      |
      v
Services
      |
      v
Mongoose Models
      |
      v
MongoDB
```

---

## 4. Architecture Layers

### 4.1 Presentation Layer

The presentation layer provides the user-facing web interface, built with React, React Router, Tailwind CSS, Axios, and React Markdown.

Main modules:

- Home feed and article listing
- Article reader with comments
- Markdown editor with live preview
- User profile pages
- Search and discovery
- Bookmarks
- Login and registration
- Administrator dashboard

The frontend communicates with the backend through HTTPS REST APIs.

### 4.2 Application Layer

The backend contains the application's business logic.

#### Authentication and User Service

- User registration and login
- Password hashing (bcrypt)
- JWT creation and verification
- Role management (user, admin)
- Profile management

#### Post Service

- Create, read, update, and delete articles
- Draft and published states
- Ownership verification
- Tag association
- Cover image handling

#### Comment Service

- Comments on articles
- Threaded replies through parent comment references
- Comment deletion by author or administrator

#### Tag Service

- Tag creation and lookup
- Category association
- Filtering articles by tag

#### Interaction Service

- Likes
- Bookmarks
- Per-user interaction state

#### Upload Service

- Multer file handling
- File type and size validation
- Upload to Cloudinary

#### Moderation Service

- Content reports
- Report review and status updates
- Administrative removal of posts

---

## 5. Authentication Architecture

```text
Register / Login
       │
       ▼
┌──────────────────┐
│ Input Validation │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ bcrypt hash /    │
│ compare          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Issue JWT        │
└────────┬─────────┘
         │
         ▼
Client stores token, sends it as a Bearer token
         │
         ▼
┌──────────────────┐
│ Auth Middleware  │──► verifies token, loads user
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Role / Ownership │──► allow or reject
│ Check            │
└──────────────────┘
```

Key rules:

- Passwords are hashed before storage and never returned in responses.
- Ownership is verified on the server and never trusted from client requests.
- Administrative routes require the admin role.
- Logout is handled client-side by discarding the token (JWT is stateless).

---

## 6. Content Pipeline

```text
Author writes Markdown
         │
         ▼
Live preview (sanitised rendering in browser)
         │
         ▼
Submit to API
         │
         ▼
Validation and sanitisation (server)
         │
         ▼
Store in MongoDB (draft or published)
         │
         ▼
Reader requests article
         │
         ▼
Sanitised rendering with React Markdown
```

Markdown is sanitised on both the server and the client to reduce stored XSS risk.

---

## 7. Image Upload Flow

```text
Client selects image
         │
         ▼
Multer receives file
         │
         ▼
Validate file type and size
         │
         ▼
Upload to Cloudinary
         │
         ▼
Store returned image URL in MongoDB
```

---

## 8. Moderation Flow

```text
User reports a post or comment
         │
         ▼
Report saved (status: pending)
         │
         ▼
Admin reviews in dashboard
         │
    ┌────┴─────┐
    ▼          ▼
Dismiss     Take action
            (remove content)
         │
         ▼
Report status updated
```

---

## 9. Security Architecture

- bcrypt password hashing
- JWT authentication
- Role-based access control
- Server-side ownership verification
- Request validation and sanitisation
- Markdown sanitisation against XSS
- File type and size validation for uploads
- Rate limiting on authentication and sensitive endpoints
- Secure HTTP headers using Helmet
- Restricted CORS configuration
- Secrets loaded from environment variables

---

## 10. Planned Scalability and Future Work

- Follow and connect functionality
- Real-time notifications
- Contributor reputation and ranking
- Trending articles and personalised recommendations
- CTF challenges and cybersecurity competitions
- Cybersecurity news and threat intelligence integration
- Verified contributor profiles