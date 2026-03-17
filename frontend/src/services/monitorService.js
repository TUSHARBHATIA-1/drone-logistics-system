import API from './api';

export const getDronesMonitoring = async () => {
  const res = await API.get('/monitor/drones');
  return res.data;
};

export const updateDroneLocation = async (droneId, location) => {
  const res = await API.put(`/monitor/update-location/${droneId}`, { location });
  return res.data;
};

export const updateDroneBattery = async (droneId, batteryLevel) => {
  const res = await API.put(`/monitor/update-battery/${droneId}`, { batteryLevel });
  return res.data;
};
