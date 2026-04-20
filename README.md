## 🧩 Project Overview

Backend for an Event Management system. Supports user registration, event creation and management, and participant handling.

---

## 🗂 API

## 📖 API Documentation

Interactive Swagger documentation is available at [`/api-docs`](http://localhost:5000/api-docs) after starting the server.

### 🔐 Authentication

| Method | Endpoint         | Description                        |
| ------ | ---------------- | ---------------------------------- |
| POST   | `/auth/register` | Register a new user                |
| POST   | `/auth/login`    | Login (returns tokens via cookies) |
| POST   | `/auth/refresh`  | Refresh session                    |
| POST   | `/auth/logout`   | Logout                             |

### 🗓 Events

| Method | Endpoint            | Description     |
| ------ | ------------------- | --------------- |
| GET    | `/events`           | Get all events  |
| GET    | `/events/:id`       | Get event by ID |
| POST   | `/events`           | Create an event |
| PATCH  | `/events/:id`       | Update an event |
| DELETE | `/events/:id`       | Delete an event |
| POST   | `/events/:id/join`  | Join an event   |
| POST   | `/events/:id/leave` | Leave an event  |

### 👤 User

| Method | Endpoint    | Description           |
| ------ | ----------- | --------------------- |
| GET    | `/users/me` | Get current user info |

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# App
PORT=5000
NODE_ENV=development
IS_DOCKER=false

# CORS
CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_HOST=db
DATABASE_PORT=5432
POSTGRES_DB=your_db_name
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password

# JWT
JWT_ACCESSTOKEN_SECRET=your_access_secret
JWT_REFRESHTOKEN_SECRET=your_refresh_secret
```

---

## ▶️ Running the Project

### Docker

```bash
docker compose up --build
```

> Migrations run automatically on container startup.  
> Seeds must be run manually after Docker is up:

```bash
npm run seed
```

### Local

```bash
npm install
npm run migration:run
npm run seed
npm run start:dev
```
