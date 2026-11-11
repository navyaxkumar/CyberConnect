# CyberConnect — Project Folder Structure

## 1. Recommended Project Structure

Files marked as planned will be created as each phase is implemented.

```text
CyberConnect/
│
├── README.md
├── architecture.md
├── requirements.md
├── structure.md
├── .gitignore
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   └── Alert.jsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   │
│   │   │   ├── posts/
│   │   │   │   ├── PostCard.jsx
│   │   │   │   ├── PostList.jsx
│   │   │   │   ├── MarkdownEditor.jsx
│   │   │   │   ├── MarkdownRenderer.jsx
│   │   │   │   └── TagBadge.jsx
│   │   │   │
│   │   │   ├── comments/
│   │   │   │   ├── CommentList.jsx
│   │   │   │   ├── CommentItem.jsx
│   │   │   │   └── CommentForm.jsx
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   ├── ProfileHeader.jsx
│   │   │   │   └── ProfileForm.jsx
│   │   │   │
│   │   │   ├── search/
│   │   │   │   └── SearchBar.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── ReportTable.jsx
│   │   │       └── ModerationActions.jsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── PostDetail.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── EditPost.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Bookmarks.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── postService.js
│   │   │   ├── commentService.js
│   │   │   ├── userService.js
│   │   │   └── adminService.js
│   │   │
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── cloudinary.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── postController.js
│   │   │   ├── commentController.js
│   │   │   ├── tagController.js
│   │   │   ├── interactionController.js
│   │   │   ├── reportController.js
│   │   │   └── adminController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   ├── uploadMiddleware.js
│   │   │   ├── rateLimiter.js
│   │   │   ├── validateRequest.js
│   │   │   └── errorHandler.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   ├── Comment.js
│   │   │   ├── Tag.js
│   │   │   ├── Like.js
│   │   │   ├── Bookmark.js
│   │   │   └── Report.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── postRoutes.js
│   │   │   ├── commentRoutes.js
│   │   │   ├── tagRoutes.js
│   │   │   ├── bookmarkRoutes.js
│   │   │   ├── reportRoutes.js
│   │   │   └── adminRoutes.js
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── postService.js
│   │   │   ├── commentService.js
│   │   │   ├── interactionService.js
│   │   │   ├── uploadService.js
│   │   │   └── moderationService.js
│   │   │
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   ├── postValidator.js
│   │   │   └── commentValidator.js
│   │   │
│   │   ├── utils/
│   │   │   ├── generateToken.js
│   │   │   └── sanitize.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── diagrams/
│   │   ├── er-diagram.md
│   │   ├── dfd-level-0.md
│   │   ├── dfd-level-1.md
│   │   └── use-case.md
│   │
│   ├── api/
│   │   └── api-documentation.md
│   │
│   └── testing/
│       └── test-plan.md
│
└── tests/
    ├── frontend/
    └── backend/
```

---

# 2. Frontend Structure

The frontend contains everything related to the user interface.

```text
frontend/
└── src/
    ├── components/
    ├── layouts/
    ├── pages/
    ├── services/
    ├── hooks/
    ├── context/
    └── utils/
```

### `components/`

Reusable UI components organised by feature.

```text
components/
├── common/
├── layout/
├── posts/
├── comments/
├── profile/
├── search/
└── admin/
```

### `layouts/`

Page wrappers that provide shared structure (navigation, footer, admin sidebar).

### `pages/`

Pages represent complete application screens and are mapped to routes with React Router.

```text
pages/
├── Home.jsx
├── Login.jsx
├── Register.jsx
├── PostDetail.jsx
├── CreatePost.jsx
├── EditPost.jsx
├── Profile.jsx
├── Bookmarks.jsx
├── Search.jsx
├── AdminDashboard.jsx
└── NotFound.jsx
```

### `services/`

API communication through Axios. Each service wraps one API group.

### `context/` and `hooks/`

Global state (such as the authenticated user) and reusable hooks.

### `utils/`

Small helper functions shared across the frontend.

---

# 3. Backend Structure

The backend contains the REST API and business logic.

```text
backend/
└── src/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    ├── validators/
    ├── utils/
    ├── app.js
    └── server.js
```

### `config/`

Database connection and third-party service configuration (MongoDB, Cloudinary).

### `routes/`

Defines endpoints and maps them to controllers.

### `controllers/`

Handles HTTP requests and responses. Controllers stay thin and call services.

### `services/`

Contains business logic, kept separate from HTTP handling.

### `models/`

Mongoose schemas for the database collections.

### `middleware/`

Authentication, role checks, uploads, rate limiting, validation, and error handling.

### `validators/`

Request validation rules for each endpoint group.

### `utils/`

Helpers such as token generation and content sanitisation.

### `app.js` and `server.js`

`app.js` configures Express and middleware. `server.js` connects to MongoDB and starts the server.

---

# 4. Layered Flow

```text
Routes → Middleware → Controllers → Services → Models → MongoDB
```

---

# 5. API Groups

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

---

# 6. Environment Files

Real `.env` files are git-ignored. Only `.env.example` files with placeholder values are committed.

```text
backend/.env.example
frontend/.env.example
```

---

# 7. Documentation Folder

```text
docs/
├── diagrams/    ER diagram, DFDs, use-case diagram
├── api/         API documentation
└── testing/     Test plan
```

---

# 8. Tests Folder

```text
tests/
├── frontend/    Component and page tests
└── backend/     API, integration, and security tests
```

Security-focused tests should cover authorization, ownership checks, input validation, and upload restrictions.