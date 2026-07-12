import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getTrips = () => api.get('/trips');
export const createTrip = (tripData) => api.post('/trips', tripData);
export const updateTripStatus = (id, status) => api.patch(`/trips/${id}/status`, { status });
export const getAvailableVehicles = () => api.get('/trips/vehicles/available');
export const getAvailableDrivers = () => api.get('/trips/drivers/available');

export default api;
