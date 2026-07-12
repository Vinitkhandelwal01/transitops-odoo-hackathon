import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Settings from './pages/Settings.jsx'
import Layout from './components/layout/Layout.jsx'
import VehicleRegistry from './pages/VehicleRegistry.jsx'
import DriverSafety from './pages/DriverSafety.jsx'
import TripDispatcher from './pages/TripDispatcher.jsx'
import Maintenance from './pages/Maintenance.jsx'
import FuelExpenses from './pages/FuelExpenses.jsx'
import Analytics from './pages/Analytics.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fleet" element={<VehicleRegistry />} />
        <Route path="/drivers" element={<DriverSafety />} />
        <Route path="/trips" element={<TripDispatcher />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/fuel-expenses" element={<FuelExpenses />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;