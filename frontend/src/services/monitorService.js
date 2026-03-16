import api from './api';

/**
 * Monitor Service
 * Handles real-time telemetry and drone monitoring API calls.
 */

export const getDronesMonitoring = async () => {
    const response = await api.get('/monitor/drones');
    return response.data.data;
};

export const updateDroneLocation = async (droneId, location) => {
    const response = await api.put(`/monitor/update-location/${droneId}`, { location });
    return response.data.data;
};

export const updateDroneBattery = async (droneId, batteryLevel) => {
    const response = await api.put(`/monitor/update-battery/${droneId}`, { batteryLevel });
    return response.data.data;
};
