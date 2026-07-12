import React from 'react';
import TripDispatcher from './pages/TripDispatcher';
import { Truck } from 'lucide-react';

function App() {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <Truck color="var(--accent-color)" size={28} />
          <span>TransitOps</span>
        </div>
        <ul className="nav-menu">
          <li className="nav-item">Dashboard</li>
          <li className="nav-item">Fleet</li>
          <li className="nav-item">Drivers</li>
          <li className="nav-item active">Trips</li>
          <li className="nav-item">Maintenance</li>
          <li className="nav-item">Fuel & Expenses</li>
          <li className="nav-item">Analytics</li>
          <li className="nav-item" style={{ marginTop: 'auto' }}>Settings</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="user-profile">
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Raven K.</span>
            <div className="user-avatar">RK</div>
          </div>
        </header>

        {/* Page Content */}
        <TripDispatcher />
      </main>
    </div>
  );
}

export default App;
