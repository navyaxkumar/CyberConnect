# CyberConnect — Software Requirements Specification

## 1. Project Overview

### 1.1 Project Name

**CyberConnect — Cybersecurity Blogging and Community Platform**

### 1.2 Purpose

CyberConnect is a web-based platform that brings together cybersecurity enthusiasts, students, developers, and professionals. It lets users publish technical articles, share knowledge, explore security topics, and take part in community discussions.

The platform also provides administrative moderation tools to keep content appropriate and the community safe.

---

# 2. Problem Statement

Cybersecurity knowledge is spread across many blogs, forums, and social platforms. Students and beginners find it hard to locate quality technical content, and contributors lack a dedicated space to publish structured articles, receive feedback, and build a reputation.

General blogging platforms are not designed for technical security content, such as code blocks, structured Markdown, and topic-based organisation by security domain.

CyberConnect proposes a dedicated, secure, community-driven platform for cybersecurity writing and discussion.

---

# 3. Objectives

The system shall:

1. Allow users to register, log in, and manage profiles.
2. Allow users to create, edit, delete, and manage technical articles.
3. Provide a Markdown editor with live preview.
4. Support image uploads for covers, profiles, and articles.
5. Allow users to comment on articles and reply to comments.
6. Allow users to like and bookmark articles.
7. Organise content using tags and categories.
8. Provide search and discovery of articles, users, and tags.
9. Allow users to report inappropriate content.
10. Provide administrators with moderation tools.
11. Apply secure development practices throughout.

---

# 4. Scope

## 4.1 In Scope

- User registration and authentication
- Role-based authorization
- User profiles
- Article creation, editing, deletion, and drafts
- Markdown editing with live preview
- Image uploads
- Comments and replies
- Likes and bookmarks
- Tags and categories
- Search and discovery
- Content reporting
- Administrative moderation dashboard
- Security hardening and validation
- Testing and deployment

## 4.2 Out of Scope

The initial version will not include:

- Follow and connect functionality
- Real-time notifications
- Contributor reputation and ranking
- Trending articles and personalised recommendations
- CTF challenges and competitions
- Cybersecurity news and threat intelligence integration
- Verified contributor profiles
- Direct messaging between users
- Monetisation or paid content
- Mobile native applications

---

# 5. User Roles

## 5.1 Visitor (Unauthenticated)

A visitor can:

- Browse published articles
- Read articles and comments
- Search articles, users, and tags
- View public profiles
- Register or log in

## 5.2 Registered User

A registered user can do everything a visitor can, and also:

- Create, edit, and delete their own articles
- Save drafts and publish articles
- Upload images
- Comment on articles and reply to comments
- Like and bookmark articles
- Edit their own profile
- Report inappropriate content

## 5.3 Administrator

An administrator can:

- View and review reports
- Update report status
- Remove inappropriate posts and comments
- View moderation activity

Administrative access must be protected by role-based authorization.

---

# 6. Functional Requirements

## FR-01: User Registration

The system shall allow users to create an account.

Required information:

- Username
- Email
- Password

The system shall validate input and prevent duplicate usernames and emails.

---

## FR-02: User Authentication

The system shall allow registered users to log in securely.

The system shall:

- Validate credentials.
- Issue a JWT on successful login.
- Restrict protected resources to authenticated users.
- Provide logout functionality (client-side token removal).
- Return the current user through `GET /api/auth/me`.

---

## FR-03: User Profiles

The system shall provide user profiles.

A profile shall include:

- Username
- Biography
- Profile image
- List of published articles

Users shall be able to edit only their own profile.

---

## FR-04: Article Management

The system shall allow users to create, edit, delete, and view articles.

Each article shall contain:

- Title
- Markdown content
- Cover image (optional)
- Author
- Tags
- Publication status (draft or published)
- Created and updated timestamps

Users shall only be able to modify or delete their own articles.

---

## FR-05: Markdown Editor

The system shall provide a Markdown editor with live preview.

The editor shall support:

- Headings
- Lists
- Links
- Code blocks
- Quotations
- Image insertion

Rendered content shall be sanitised to reduce stored XSS risk.

---

## FR-06: Image Uploads

The system shall allow users to upload images for:

- Article cover images
- Profile pictures
- Images within articles

The system shall validate file type and size, and store images in Cloudinary.

---

## FR-07: Comments and Discussions

The system shall allow authenticated users to comment on articles.

The system shall:

- Display comments on an article.
- Support replies through parent comment references.
- Allow authors and administrators to delete comments.

---

## FR-08: Likes and Bookmarks

The system shall allow authenticated users to:

- Like and unlike an article.
- Bookmark and remove bookmarks.
- View their saved articles.

The system shall track which user liked or bookmarked which article.

---

## FR-09: Tags and Categories

The system shall organise articles using tags and categories.

Example cybersecurity domains:

- Web security
- Network security
- Malware analysis
- Cryptography
- Digital forensics
- Penetration testing
- Cloud security
- OSINT
- CTF write-ups
- Secure coding

The system shall allow filtering articles by tag.

---

## FR-10: Search and Discovery

The system shall allow users to search:

- Articles
- Users
- Tags

The system shall provide article listings that can be filtered and browsed.

---

## FR-11: Content Reporting

The system shall allow authenticated users to report posts or comments.

A report shall contain:

- Reported content
- Reporting user
- Reason
- Moderation status

---

## FR-12: Administrative Moderation

The system shall provide administrators with a moderation dashboard.

Administrators shall be able to:

- View reports.
- Update report status.
- Remove reported posts.

All administrative operations shall require the admin role.

---

# 7. Non-Functional Requirements

## NFR-01: Security

- Passwords shall be hashed with bcrypt.
- Authentication shall use JWT.
- Role-based access control shall separate users and administrators.
- Ownership shall be verified on the server.
- Input shall be validated and sanitised.
- Secrets shall be loaded from environment variables.

## NFR-02: Performance

- Article lists shall use pagination.
- Common queries shall use database indexes.
- Pages should load within a reasonable time on a standard connection.

## NFR-03: Usability

- The interface shall be responsive on desktop and mobile.
- Navigation shall be simple and consistent.
- Error messages shall be clear and safe.

## NFR-04: Maintainability

- Code shall follow a modular structure (routes, controllers, services, models).
- Environment configuration shall be separated from code.
- Reusable frontend components shall be used.

## NFR-05: Reliability

- The API shall return consistent error responses.
- Invalid input shall not crash the server.

## NFR-06: Compatibility

- The frontend shall work on current versions of major browsers.

---

# 8. Security Requirements

- Hash passwords using bcrypt before storage.
- Require valid JWTs for protected endpoints.
- Verify ownership server-side for edit and delete operations.
- Restrict administrative endpoints to the admin role.
- Sanitise Markdown to mitigate XSS.
- Validate file type and size for uploads.
- Apply rate limiting to authentication and sensitive endpoints.
- Use Helmet for secure HTTP headers.
- Restrict CORS to the configured client origin.
- Never commit secrets to source control.

---

# 9. Technology Constraints

- Frontend: React.js, React Router, Tailwind CSS, Axios, React Markdown
- Backend: Node.js, Express.js, REST API
- Database: MongoDB with Mongoose
- Image storage: Cloudinary
- Authentication: JWT and bcrypt
- File uploads: Multer

---

# 10. Assumptions and Constraints

- Users have a modern web browser and internet access.
- JWT is stateless, so logout is handled by discarding the token on the client.
- Article authors are responsible for the content they publish.
- The initial version targets a single deployment environment.

---

# 11. Development Phases

**Phase 1 – Foundation**
Frontend and backend setup, MongoDB integration, architecture and routing.

**Phase 2 – Authentication & Profiles**
Registration and login, JWT authentication, user profiles and authorization.

**Phase 3 – Blogging System**
Markdown editor, article creation and management, image uploads and tags.

**Phase 4 – Community Features**
Likes and comments, bookmarks, search and content discovery.

**Phase 5 – Administration & Security**
Reporting and moderation, admin dashboard, security hardening and validation.

**Phase 6 – Testing & Deployment**
API and integration testing, frontend testing, deployment and production configuration.

---

# 12. Future Enhancements

- Follow and connect functionality
- Real-time notifications
- Contributor reputation and ranking system
- Trending articles and personalised recommendations
- CTF challenges and cybersecurity competitions
- Integration with cybersecurity news and threat intelligence sources
- Verified contributor profiles