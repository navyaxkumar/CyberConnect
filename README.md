# CyberConnect

CyberConnect is a cybersecurity blogging and community platform that brings together cybersecurity enthusiasts, students, developers, and professionals. It provides a collaborative environment for publishing technical articles, sharing knowledge, exploring security topics, and engaging with the community.

## Project Status

Development is planned around a modular Full-Stack architecture. The authentication backend is implemented; article publishing, Markdown editing, image uploads, community interactions, content discovery, and administrative moderation remain planned.

Secure authentication, role-based authorization, content management, and database-backed community features will be implemented progressively across the phases listed under Development Scope.

## Core Features

- **User Authentication:** Registration, login, logout, and protected routes.
- **Blog Publishing:** Create, edit, delete, and manage technical articles.
- **Markdown Editor:** Structured articles with live preview.
- **Image Uploads:** Cover images, profile pictures, and in-article images.
- **Comments & Discussions:** Comment on articles and take part in discussions.
- **Likes & Bookmarks:** Interact with articles and save content for later.
- **Tags & Categories:** Organise articles by cybersecurity domain and topic.
- **User Profiles:** Biographies, profile images, and published articles.
- **Search & Discovery:** Search articles, users, and tags.
- **Content Moderation:** Report inappropriate content and use administrative moderation tools.

## Technology Stack

### Frontend
- React.js
- React Router
- Tailwind CSS
- Axios
- React Markdown

### Backend
- Node.js
- Express.js
- REST API architecture

### Database & Storage
- MongoDB
- Mongoose ODM
- Cloudinary for image storage

## Application Architecture

The application follows a layered client-server structure:

```text
React Frontend -> Axios -> REST API -> Express.js -> Middleware -> Controllers -> Services -> Mongoose Models -> MongoDB
```

Project layout:

```text
frontend/
  src/
    components/
    pages/
    layouts/
    context/
    hooks/
    services/
    utils/
    App.jsx
    main.jsx

backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    validators/
    utils/
    app.js
    server.js
```

## Database Models

- **Users:** Credentials, profile information, roles, and user details.
- **Posts:** Titles, Markdown content, cover images, authors, tags, and publication status.
- **Comments:** Content, associated article, author, and parent comment reference.
- **Tags:** Names, identifiers, and associated categories.
- **Likes:** User and article references for each like.
- **Bookmarks:** User-specific saved articles.
- **Reports:** Reported content, reporting user, reason, and moderation status.

Relationships are maintained with MongoDB document references where appropriate.

## Configuration

The backend expects its settings from environment variables. Do not commit secrets to source control; use a local `.env` file (git-ignored) or your deployment's secret manager.

Example variables (names may change during implementation):

```text
PORT
MONGODB_URI
JWT_SECRET
JWT_EXPIRES_DAYS
CLIENT_URL
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

`JWT_SECRET` should be a long, random value. `CLIENT_URL` is used for the restricted CORS configuration.

## Run Locally

From the repository root:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in a second terminal)
cd frontend
npm install
npm run dev
```

Health check :

```text
GET /api/health
```

## Authentication And Authorization

Authentication uses JSON Web Tokens (JWT).

- Passwords are hashed with bcrypt before storage and never returned.
- Protected endpoints use a JWT in the HTTP-only `token` cookie; browser code must never read or store the JWT.
- Role-based access control distinguishes regular users and administrators.
- Users may only modify or delete their own articles.
- Administrative operations require the Admin role.
- Ownership is verified on the server and never trusted from client requests.
- Logout clears the authentication and CSRF cookies.
- Authenticated state-changing requests use a signed double-submit CSRF token. The frontend obtains it from `GET /api/auth/csrf` and sends it as `X-CSRF-Token`; its Axios client handles this automatically. Login and registration are exempt; authenticated logout requires the token.

Primary auth endpoints:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
GET  /api/auth/csrf
```

Public registration always creates a regular user. To promote an existing account, set `ENABLE_ADMIN_PROVISIONING=true` and `ADMIN_EMAIL` in the backend environment, then run `npm run provision-admin` from `backend`. The command requires the configured MongoDB URI, fails unless the account already exists, and should be run as a controlled operator action; unset the flag afterward. No admin credentials are created by the application.

## API Groups

```text
/api/auth
/api/users
/api/posts
/api/comments
/api/tags
/api/bookmarks
/api/reports
/api/admin
```

### Posts
```text
GET    /api/posts
GET    /api/posts/:id
POST   /api/posts
PUT    /api/posts/:id
DELETE /api/posts/:id
```

### Comments & Interactions
```text
GET  /api/posts/:id/comments
POST /api/posts/:id/comments
POST /api/posts/:id/like
POST /api/posts/:id/bookmark
```

### User Profiles
```text
GET   /api/users/me
PATCH /api/users/me
GET   /api/users/:username
```

### Administration
```text
GET    /api/admin/reports
PATCH  /api/admin/reports/:id
DELETE /api/admin/posts/:id
```

*Endpoint definitions represent the planned API structure and may evolve during implementation.*

## Content Management

- Markdown formatting with live preview.
- Headings, lists, links, code blocks, and quotations.
- Image insertion and cover image uploads.
- Tag-based organisation.
- Draft and published article states.
- Article editing and deletion.
- Sanitised rendering to reduce stored XSS risk.

## Security Notes

- Passwords are hashed with bcrypt.
- JWT-based authentication with role-based access control.
- Server-side ownership verification.
- Request validation and sanitisation.
- Markdown sanitisation to mitigate XSS.
- File type and size validation for image uploads.
- Rate limiting on authentication and sensitive endpoints.
- Secure HTTP headers using Helmet.
- Sensitive credentials come from environment configuration, not source.
- CORS is restricted rather than unrestricted wildcard.

## Development Scope

**Phase 1 – Foundation:** frontend and backend setup, MongoDB integration, architecture and routing.

**Phase 2 – Authentication & Profiles:** registration and login, JWT authentication, user profiles and authorization.

**Phase 3 – Blogging System:** Markdown editor, article creation and management, image uploads and tags.

**Phase 4 – Community Features:** likes and comments, bookmarks, search and content discovery.

**Phase 5 – Administration & Security:** reporting and moderation, admin dashboard, security hardening and validation.

**Phase 6 – Testing & Deployment:** API and integration testing, frontend testing, deployment and production configuration.

## Testing

Testing is planned for Phase 6 and will cover API and integration tests, security-focused tests (authorization, ownership, validation, upload restrictions), and frontend tests.

## Future Enhancements

The following are intentionally outside the initial scope:

- Follow and connect functionality
- Real-time notifications
- Contributor reputation and ranking
- Trending articles and personalised recommendations
- CTF challenges and cybersecurity competitions
- Integration with cybersecurity news and threat intelligence sources
- Verified contributor profiles

## Project Objectives

CyberConnect aims to establish a dedicated digital ecosystem for cybersecurity knowledge sharing, technical publishing, and community collaboration, combining content creation, interactive discussions, and secure user management.
