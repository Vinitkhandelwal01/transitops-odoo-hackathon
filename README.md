# 🚛 TransitOps - Smart Transport Operations Platform

![Tech Stack](https://img.shields.io/badge/Tech_Stack-MERN-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Hackathon_Ready-success?style=for-the-badge)

TransitOps is a comprehensive web-based platform built with the MERN stack designed to streamline fleet and transport management operations. It provides real-time control over vehicle registries, drivers, and complete trip lifecycles with an intuitive, premium dark-mode interface.

---

## 🌟 Key Features

### 🚙 Vehicle Registry
* **Vehicle CRUD**: Seamlessly add, view, edit, and delete fleet vehicles.
* **Smart Validations**: Unique registration checking and 'On-Trip' deletion protection.
* **Advanced Filtering**: Quickly search and filter by vehicle type and current status.
* **Aesthetic Interface**: Dark Vehicle Registry UI matching the supplied design specifications.

### 🗺️ Trip Management
* **Interactive Dispatcher Board**: A centralized live board to manage and monitor all trips.
* **Real-time Lifecycle Tracking**: Smooth state transitions from `Draft` -> `Dispatched` -> `Completed` / `Cancelled`.
* **Automated Validations**: 
  * Blocks creation if cargo weight exceeds vehicle capacity.
  * Strict driver license expiry checking.
* **Automated Status Sync**: Automatically updates Vehicle and Driver availability when dispatched or completed.
* **Premium UI**: Dark mode UI utilizing glassmorphism and modern design principles.

---

## 🛠️ Technology Stack
* **Frontend**: React.js, Vite, Vanilla CSS (Premium Dark Theme)
* **Backend**: Node.js, Express.js
* **Database**: MongoDB & Mongoose
* **Icons & Assets**: Lucide React

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
# Create your .env file with your PORT and MONGO_URI
npm run dev
```
> *Note: MongoDB must be running locally, or replace `MONGO_URI` in `.env` with your MongoDB Atlas URI.*

### 2. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

---

## 🗄️ Database Architecture (MongoDB)

Our application relies on several core collections to maintain state across the platform:

| Collection | Key Fields | Description |
|------------|------------|-------------|
| **👤 Users** | `name`, `email`, `role`, `assignedVehicle` | Manages system access and staff roles. |
| **🚛 Vehicles**| `registrationNumber`, `model`, `type`, `status` (`ACTIVE`, `IN_MAINTENANCE`, `INACTIVE`), `mileage` | Master registry of all fleet assets. |
| **🧾 Trips** | `tripNumber`, `vehicle`, `driver`, `source`, `destination`, `cargoWeight`, `status` | Core operations tracking. |
| **👨‍✈️ Drivers** | `name`, `licenseNumber`, `licenseExpiryDate`, `status` | Registry of certified drivers. |
| **🔧 Maintenance**| `vehicleId`, `description`, `status` (`OPEN`, `IN_PROGRESS`, `COMPLETED`), `cost` | Tracks fleet repairs. |
| **⛽ Fuel Logs** | `vehicleId`, `liters`, `cost`, `date` | Fuel consumption tracking. |
| **💰 Expenses** | `vehicleId`, `type`, `amount`, `date` | Operational expense management. |
