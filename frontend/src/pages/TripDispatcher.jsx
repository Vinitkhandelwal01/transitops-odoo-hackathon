import React, { useState, useEffect } from 'react';
import { getTrips, getAvailableVehicles, getAvailableDrivers, createTrip, updateTripStatus } from '../services/api';
import { Search, UserCircle, MapPin, Truck, AlertCircle, CheckCircle } from 'lucide-react';

const TripDispatcher = () => {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    vehicle: '',
    driver: '',
    cargoWeight: '',
    plannedDistance: ''
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
        getTrips(),
        getAvailableVehicles(),
        getAvailableDrivers()
      ]);
      setTrips(tripsRes.data);
      setVehicles(vehiclesRes.data);
      setDrivers(driversRes.data);
    } catch (err) {
      console.error('Error fetching data', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const getSelectedVehicleCapacity = () => {
    if (!formData.vehicle) return null;
    const v = vehicles.find(v => v._id === formData.vehicle);
    return v ? v.maxLoadCapacity : null;
  };

  const validateForm = () => {
    if (!formData.source || !formData.destination || !formData.vehicle || !formData.driver || !formData.cargoWeight || !formData.plannedDistance) {
      setError('All fields are required');
      return false;
    }
    const capacity = getSelectedVehicleCapacity();
    if (capacity && Number(formData.cargoWeight) > capacity) {
      setError(`Capacity exceeded! Vehicle capacity is ${capacity} kg, but cargo weight is ${formData.cargoWeight} kg.`);
      return false;
    }
    return true;
  };

  const handleCreateDraft = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await createTrip(formData);
      setFormData({ source: '', destination: '', vehicle: '', driver: '', cargoWeight: '', plannedDistance: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating trip');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (tripId, status) => {
    try {
      await updateTripStatus(tripId, status);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const capacity = getSelectedVehicleCapacity();
  const capacityExceeded = capacity && Number(formData.cargoWeight) > capacity;

  return (
    <div className="page-container">
      <h1 className="page-title">Trip Dispatcher</h1>

      <div className="lifecycle-bar" style={{ padding: '16px 24px' }}>
        <div style={{ position: 'absolute', top: '12px', left: '24px', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Lifecycle Workflow Legend
        </div>
        <div className="lifecycle-line" style={{ top: '50px' }}></div>
        {[
          { name: 'Draft', color: 'var(--text-secondary)' }, 
          { name: 'Dispatched', color: 'var(--accent-color)' }, 
          { name: 'Completed', color: 'var(--success-color)' }, 
          { name: 'Cancelled', color: 'var(--danger-color)' }
        ].map((step, index) => (
          <div key={step.name} className="lifecycle-step" style={{ marginTop: '20px' }}>
            <div className="step-dot" style={{ borderColor: step.color, backgroundColor: step.name === 'Draft' ? 'var(--bg-input)' : `${step.color}20` }}></div>
            <div className="step-label" style={{ color: step.color, fontWeight: '600' }}>{step.name}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* CREATE TRIP FORM */}
        <div className="form-section live-board">
          <div className="board-header">Create Trip</div>
          <form onSubmit={handleCreateDraft} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label>Source</label>
              <input type="text" name="source" className="form-control" placeholder="e.g. Gandhinagar Depot" value={formData.source} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Destination</label>
              <input type="text" name="destination" className="form-control" placeholder="e.g. Ahmedabad Hub" value={formData.destination} onChange={handleInputChange} />
            </div>
            
            <div className="form-group">
              <label>Vehicle (Available Only)</label>
              <select name="vehicle" className="form-control" value={formData.vehicle} onChange={handleInputChange}>
                <option value="">Select a Vehicle</option>
                {vehicles.map(v => (
                  <option key={v._id} value={v._id}>{v.registrationNumber} - {v.maxLoadCapacity} kg capacity</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Driver (Available Only)</label>
              <select name="driver" className="form-control" value={formData.driver} onChange={handleInputChange}>
                <option value="">Select a Driver</option>
                {drivers.map(d => (
                  <option key={d._id} value={d._id}>{d.name} ({d.licenseNumber})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Cargo Weight (kg)</label>
              <input type="number" name="cargoWeight" className="form-control" value={formData.cargoWeight} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Planned Distance (km)</label>
              <input type="number" name="plannedDistance" className="form-control" value={formData.plannedDistance} onChange={handleInputChange} />
            </div>

            {(error || capacityExceeded) && (
              <div className="error-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                  <AlertCircle size={18} /> Error
                </div>
                {capacityExceeded && <div>Vehicle Capacity: {capacity} kg<br/>Cargo Weight: {formData.cargoWeight} kg</div>}
                <div style={{ color: 'var(--danger-color)' }}>{error || 'Capacity exceeded - dispatch blocked'}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting || capacityExceeded}>
                Create Draft
              </button>
            </div>
          </form>
        </div>

        {/* LIVE BOARD */}
        <div className="live-board">
          <div className="board-header">Live Board</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {trips.map(trip => (
              <div key={trip._id} className="trip-card">
                <div className="trip-header">
                  <div className="trip-id">{trip.tripNumber}</div>
                  <div className="trip-entities">
                    <Truck size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    {trip.vehicle?.registrationNumber || 'Unknown'} / {trip.driver?.name || 'Unknown'}
                  </div>
                </div>
                
                <div className="trip-route">
                  <MapPin size={16} color="var(--accent-color)" />
                  <span style={{ color: 'var(--text-secondary)', margin: '0 8px' }}>{trip.source}</span>
                  <span style={{ color: 'var(--border-color)' }}>→</span>
                  <span style={{ color: 'var(--text-secondary)', margin: '0 8px' }}>{trip.destination}</span>
                </div>

                <div className="trip-footer">
                  <span className={`badge badge-${trip.status.toLowerCase()}`}>{trip.status}</span>
                  
                  {trip.status === 'Draft' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleStatusChange(trip._id, 'Dispatched')} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Dispatch</button>
                      <button onClick={() => handleStatusChange(trip._id, 'Cancelled')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Cancel</button>
                    </div>
                  )}
                  {trip.status === 'Dispatched' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleStatusChange(trip._id, 'Completed')} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: 'var(--success-color)' }}><CheckCircle size={14} /> Complete</button>
                      <button onClick={() => handleStatusChange(trip._id, 'Cancelled')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {trips.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>No trips found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDispatcher;
