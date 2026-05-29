import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

API.interceptors.request.use((req) => {
  const profile = localStorage.getItem('profile');

  if (profile) {
    req.headers.Authorization = `Bearer ${JSON.parse(profile).token}`;
  }

  return req;
});

export const login = (formData) =>
  API.post('/auth/login', formData);

export const register = (formData) =>
  API.post('/auth/register', formData);

export const getUserByAppID = (appID) =>
  API.get(`/auth/user/${appID}`);

export const getMessages = (sId, rId) =>
  API.get(`/messages/${sId}/${rId}`);

export const getContacts = (userId) =>
  API.get(`/messages/contacts/${userId}`);