// @flow
// import API from 'services/API';
import jwt from 'jsonwebtoken';
import { type User } from 'types/app';

const getAccess = (): User => {
  const access = localStorage.getItem('access');
  return access ? JSON.parse(access) : {};
};

const getToken = () => {
  const access: User = getAccess();
  return access && access.token;
};

const getCurrentUser = () => {
  const access = getAccess();
  const decodedToken = access && jwt.decode(access.token);
  return decodedToken && decodedToken?.user;
};

const isAuthenticated = () => {
  return getToken() !== null;
};

const logout = async () => {
  // const response = await API.get('users/logout'); // TODO: replace with logout
  cleanLocalStorage();
};

const cleanLocalStorage = () => {
  localStorage.clear();
  sessionStorage.clear();
};

const getRedirectPage = () => {
  return localStorage.getItem('redirectPage');
};

export { getToken, getCurrentUser, isAuthenticated, logout, cleanLocalStorage, getRedirectPage };
