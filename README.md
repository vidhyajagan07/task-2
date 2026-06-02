# Client Lead Management System (Mini CRM)

A full-stack lead management application for tracking incoming website leads, recording follow-up notes, and monitoring conversion performance.

## Features

- Secure admin login with JWT
- Lead management with status workflow: New → Contacted → Converted
- Follow-up notes with history
- Search and filter leads
- Conversion analytics dashboard
- Mobile responsive React frontend
- Express + MongoDB backend API

## Project Structure

- `client/` — React frontend
- `server/` — Node.js + Express backend

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm
- MongoDB instance (local or cloud)

### Backend

1. Open `server/`.
2. Copy `.env.example` to `.env`.
3. Update `MONGO_URI` and `JWT_SECRET`.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the backend:
   ```bash
   npm run dev
   ```

### Frontend

1. Open `client/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```

### Default Admin

The backend seeds a default admin if none exists.

- Username: `admin`
- Email: `admin@example.com`
- Password: `Admin@123`

## API Endpoints

- `POST /api/auth/login`
- `GET /api/leads`
- `POST /api/leads`
- `PUT /api/leads/:id`
- `DELETE /api/leads/:id`
- `POST /api/leads/:id/notes`

## Notes

- The frontend runs on port `5173`.
- The backend runs on port `5000`.
- Use the login page to authenticate and access protected routes.
