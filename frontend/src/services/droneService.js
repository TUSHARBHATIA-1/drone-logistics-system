import API from './api';

// Get drones — optionally filtered by the logged-in company
export const getDrones = () => API.get('/drones');

// Create a drone (must be authenticated)
export const addDrone = (data) => API.post('/drones', data);

// Update any drone field (status, battery, location, etc.)
export const updateDrone = (id, data) => API.put(`/drones/${id}`, data);

// Quick shortcut: mark a drone as maintenance
export const markRepair = (id) => API.put(`/drones/${id}/repair`);

// Delete / decommission a drone
export const deleteDrone = (id) => API.delete(`/drones/${id}`);