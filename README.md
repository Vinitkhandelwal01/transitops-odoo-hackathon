# TransitOps MERN - Vehicle Registry

## Backend
cd backend
cp .env.example .env
npm install
npm run dev

MongoDB must be running locally, or replace MONGO_URI in .env with MongoDB Atlas URI.

## Frontend
Open another terminal:
cd frontend
npm install
npm run dev

Open http://localhost:5173

Features:
- Vehicle CRUD
- Unique registration validation
- Search
- Type/status filters
- Edit and delete
- On Trip delete protection
- Dark Vehicle Registry UI matching the supplied design
