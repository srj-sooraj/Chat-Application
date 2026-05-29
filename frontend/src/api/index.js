import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const getUserByAppID = (appID) => API.get(`/auth/user/${appID}`);

export const getMessages = (sId, rId) => API.get(`/messages/${sId}/${rId}`);
export const getContacts = (userId) => API.get(`/messages/contacts/${userId}`);
