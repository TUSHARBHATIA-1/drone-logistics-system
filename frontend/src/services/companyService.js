import API from './api';

export const submitCompanySetup = (data) => API.post('/company', data);
export const getCompanyProfile = () => API.get('/company/me');
