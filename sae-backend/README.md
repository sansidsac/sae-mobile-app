# Flutter Node.js REST API Backend

A production-ready REST API designed to serve Flutter mobile applications. Built with Node.js, Express, and MongoDB.

## Tech Stack
- **Node.js**: Runtime
- **Express**: Web framework
- **MongoDB**: NoSQL Database (via Mongoose)
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Multer**: File uploads

## Project Structure
This backend follows an MVC-style architecture:
- `src/config/`: App configuration (Database, etc.)
- `src/controllers/`: Business logic & route handlers
- `src/middlewares/`: Custom middlewares (Auth, Multer, Error handling)
- `src/models/`: Mongoose Database Schemas
- `src/routes/`: Route definitions mapped to controllers
- `src/utils/`: shared utilities (Response formatter)

## Setup & installation

1. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Variables**
   - Copy the `.env.example` file to `.env`:
     \`\`\`bash
     cp .env.example .env
     \`\`\`
   - Open `.env` and configure your settings:
     - Set `MONGODB_URI` to a real MongoDB connection string.
     - (Optional) Change the `JWT_SECRET` string.
     - Configure the `PORT` (default is 5000).

3. **Run the server**
   - **Development Mode** (with Nodemon):
     \`\`\`bash
     npm run dev
     \`\`\`
   - **Production Mode**:
     \`\`\`bash
     npm start
     \`\`\`

## Available API Routes (Base: `/api/v1`)

### Health
- \`GET /api/v1/health\` - Checks if the API is running and the DB is connected.

### Authentication
- \`POST /api/v1/auth/register\` - Register a new user (`name`, `email`, `password` required)
- \`POST /api/v1/auth/login\` - Login user, returns JWT (`email`, `password` required)
- \`GET /api/v1/auth/me\` - Returns the current authenticated user's profile (Needs `Authorization: Bearer <token>`)

## Global Standards
- **Unified JSON Response:**
  - Success responses: `{ "success": true, "message": "...", "data": {...} }`
  - Error responses: `{ "success": false, "message": "...", "error": "..." }`
- **File Uploads:**
  - `Multer` is preconfigured in `middlewares/uploadMiddleware.js`.
  - Stored files can be served locally through static path `/uploads/[filename]`.
