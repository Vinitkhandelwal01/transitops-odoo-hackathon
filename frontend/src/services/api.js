import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('transitops_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  getMe: () => api.get('/auth/me'),
}

export const dashboardApi = {
  getKpis: () => api.get('/dashboard/kpis'),
  getRecentTrips: (limit) => api.get('/dashboard/recent-trips', { params: { limit } }),
  getVehicleStatus: () => api.get('/dashboard/vehicle-status'),
}

export const settingsApi = {
  get: () => api.get('/settings'),
  update: (payload) => api.put('/settings', payload),
  getRbac: () => api.get('/settings/rbac'),
}

export const getTrips = () => api.get('/trips')
export const createTrip = (tripData) => api.post('/trips', tripData)
export const updateTripStatus = (id, status) => api.patch(`/trips/${id}/status`, { status })
export const getAvailableVehicles = () => api.get('/trips/vehicles/available')
export const getAvailableDrivers = () => api.get('/trips/drivers/available')

export default api
