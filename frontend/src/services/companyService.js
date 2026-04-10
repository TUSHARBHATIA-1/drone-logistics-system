import API from './api';

// Submit company setup (create or update)
export const submitCompanySetup = (data) => API.post('/company/setup', data);

// Fetch current user's company profile
export const getCompanyProfile = () => API.get('/company/profile');
