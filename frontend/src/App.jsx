import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Settings from "./pages/Settings.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import TripDispatcher from "./pages/TripDispatcher.jsx";
import DriverSafety from "./pages/DriverSafety.jsx";
import VehicleRegistry from "./pages/VehicleRegistry.jsx";
import FuelExpenses from "./pages/FuelExpenses.jsx";
import Maintenance from "./pages/Maintenance.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fleet" element={<VehicleRegistry />} />
        <Route path="/trips" element={<TripDispatcher />} />
        <Route path="/drivers" element={<DriverSafety />} />
        <Route path="/fuel-expenses" element={<FuelExpenses />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;