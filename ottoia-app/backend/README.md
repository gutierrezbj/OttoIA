# OttoIA Backend - Node.js/Express Migration

This is the Node.js/Express backend for OttoIA, migrated from the original Python FastAPI implementation.

## Architecture

### Directory Structure

```
backend/
├── server.js                 # Main Express app with MongoDB connection
├── routes/                   # Route modules (modular endpoints)
│   ├── auth.js              # Authentication (session exchange, /me, /logout)
│   ├── children.js          # Child profile CRUD
│   ├── skills.js            # Skills listing endpoint
│   ├── exercises.js         # Exercise generation (Claude API + fallback)
│   ├── attempts.js          # Record exercise attempts
│   ├── chat.js              # Tutor chat (Claude API + fallback responses)
│   ├── checkin.js           # Daily check-in endpoints
│   ├── progress.js          # Progress summary
│   └── report.js            # Weekly parent reports
├── middleware/
│   └── auth.js              # Auth middleware (getCurrentUser)
└── data/
    ├── skills.js            # SKILLS_DATA export
    └── exercises.js         # EXERCISE_BANK export
```

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js 4.21
- **Database**: MongoDB (native driver)
- **AI**: @anthropic-ai/sdk (Claude API)
- **Auth**: Cookie-based sessions (TODO: Google OAuth integration)
- **Other**: UUID, Axios, CORS, cookie-parser, dotenv

## API Routes

All routes are prefixed with `/api/`.

### Authentication (`/auth`)
- `GET /session?session_id=xxx` - Exchange Emergent session for user data + cookie
- `GET /me` - Get current authenticated user
- `POST /logout` - Clear session and logout

### Children (`/children`)
- `GET /` - Get all children for current parent
- `POST /` - Create new child profile
- `GET /:child_id` - Get specific child
- `DELETE /:child_id` - Delete child profile

### Skills (`/skills`)
- `GET /?subject=xxx&grade=2` - Get skills (optionally filtered by subject and grade)

### Exercises (`/exercises`)
- `POST /generate` - Generate exercise using Claude API (with EXERCISE_BANK fallback)

### Attempts (`/attempts`)
- `POST /` - Record an attempt and update skill progress

### Chat (`/chat`)
- `POST /:child_id` - Chat with tutor (Claude API with 18 keyword-based fallback responses)
- `GET /:child_id/history?limit=50` - Get chat history

### Check-in (`/checkin`)
- `POST /:child_id` - Record daily check-in (mood, energy, note)
- `GET /:child_id/today` - Get today's check-in

### Progress (`/progress`)
- `GET /:child_id` - Get skill progress and weekly stats

### Reports (`/report`)
- `GET /:child_id/weekly` - Get weekly report with recommendations

## Authentication

Currently uses cookie-based session authentication:
- Session token stored in `user_sessions` collection
- Tokens set in httpOnly, secure, sameSite=none cookies (7-day expiry)
- Fallback to Bearer token in Authorization header
- Auth middleware validates token and attaches user to `req.user`

**TODO**: Replace Emergent auth with Google OAuth using passport.js

## Database

MongoDB collections:
- `users` - User profiles (indexed by user_id, email)
- `user_sessions` - Active sessions (indexed by session_token, user_id)
- `children` - Child profiles (indexed by child_id, parent_id)
- `exercises` - Generated exercises (indexed by exercise_id, child_id)
- `attempts` - Exercise attempts (indexed by child_id)
- `skill_progress` - Skill mastery tracking (indexed by child_id, skill_id)
- `chat_messages` - Chat history (indexed by child_id, created_at)
- `checkins` - Daily check-ins (indexed by child_id, created_at)

## Key Features

### Exercise Generation
- Uses Claude API to generate contextual exercises
- Falls back to EXERCISE_BANK with 26+ pre-made exercises if API fails
- Supports all 4 subjects (matemáticas, lengua, ciencias, inglés)

### Chat/Tutor
- Uses Claude API with system prompt for pedagogical guidance
- Falls back to 18 keyword-based responses covering core topics
- Maintains chat history for context
- Responds only in Spanish

### Progress Tracking
- Automatically updates skill_progress on each attempt
- Calculates accuracy by skill and subject
- Tracks practice streaks
- Generates recommendations based on weak areas

### Skill Data
- 26 total skills across 4 subjects
- Grade-level aware (grades 1-6)
- Structured prerequisites and descriptions

## Environment Variables

```
PORT=5000
MONGO_URL=mongodb://localhost:27017
DB_NAME=ottoia
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
ANTHROPIC_API_KEY=sk-ant-xxx
```

See `.env.example` for template.

## Installation & Running

```bash
# Install dependencies
npm install

# Development (with nodemon)
npm run dev

# Production
npm start
```

## Migration Notes

### From FastAPI to Express
- Removed: async Motor (motor-asyncio) → using native MongoDB driver
- Removed: Pydantic models → using plain objects/validation
- Kept: Same API routes, response formats, cookie settings
- Kept: UUID ID generation pattern (child_xxx, ex_xxx, att_xxx, msg_xxx, chk_xxx)
- Kept: All SKILLS_DATA and EXERCISE_BANK definitions
- Kept: All fallback chat responses (18 keyword-based)
- Kept: Timezone handling (UTC for all timestamps)

### Key Changes
1. **Database**: FastAPI's motor → MongoDB native driver
2. **ID Generation**: FastAPI's uuid.uuid4() → uuid npm package
3. **Datetime**: Python's datetime → JavaScript Date + ISO strings
4. **JSON Handling**: Pydantic → plain objects
5. **HTTP Client**: httpx → axios

## Error Handling

All routes implement try-catch with error responses:
- 400: Bad request (missing fields)
- 401: Unauthorized (invalid session)
- 403: Forbidden (no authorization)
- 404: Not found (resource doesn't exist)
- 500: Server error

## Security Notes

- Cookie settings: httpOnly, secure, sameSite=none
- CORS configured to whitelist frontend origins
- Session validation on every protected route
- No hardcoded URLs in auth flow (follows original pattern)

## TODO

1. **Google OAuth Integration**: Replace Emergent auth with passport.js
2. **Input Validation**: Add schema validation (joi/zod)
3. **Rate Limiting**: Add rate limiter for API endpoints
4. **Logging**: Implement structured logging
5. **Tests**: Add Jest tests for all routes
6. **Docker**: Complete Dockerfile and docker-compose
7. **Analytics**: Track API metrics and performance

## License

Same as OttoIA project
