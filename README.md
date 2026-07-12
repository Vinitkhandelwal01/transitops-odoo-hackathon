# TransitOps MERN - Smart Transport Operations Platform

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


Features:

**Vehicle Registry:**
- Vehicle CRUD
- Unique registration validation
- Search
- Type/status filters
- Edit and delete
- On Trip delete protection
- Dark Vehicle Registry UI matching the supplied design

**Trip Management:**
- Interactive Trip Dispatcher Board
- Real-time Trip Lifecycle Tracking (Draft -> Dispatched -> Completed/Cancelled)
- Automatic Vehicle Capacity Validation
- Driver License Expiry Checking
- Automated Status Transitions for Vehicles and Drivers upon dispatch
- Premium Dark Mode UI with Glassmorphism

Database Collections (MongoDB)

Core collections:

👤 Users
name
email
password
role (enum)
assignedVehicle (optional)
🚛 Vehicles
registrationNumber
model
type
status → ACTIVE | IN_MAINTENANCE | INACTIVE
assignedDriver
mileage
🔧 Maintenance
vehicleId
description
status → OPEN | IN_PROGRESS | COMPLETED
startDate
endDate
cost
⛽ Fuel Logs
vehicleId
liters
cost
date
recordedBy
💰 Expenses
vehicleId
type
amount
date
notes
🧾 Trips
vehicleId
driverId
startLocation
endLocation
distance
status
