// @flow
// import API from 'services/API';
import jwt from 'jsonwebtoken';

const getAccess = (): Object => {
  const access = localStorage.getItem('access');
  return access && JSON.parse(access);
};

const getToken = () => {
  const access = getAccess();
  return access && access.token;
};

const transformUnixTimeStampToDate = (unixTimestamp: number) => {
  const milliseconds = parseInt(unixTimestamp, 10) * 1000; // 1575909015000
  return new Date(milliseconds);
};

const getCurrentSessionExpirationDate = () => {
  const access = getAccess();
  const decodedToken: Object = access && jwt.decode(access.token);
  const expDate = transformUnixTimeStampToDate(decodedToken?.exp);
  return expDate && decodedToken ? expDate : null;
};

const getCurrentUser = () => {
  const access = getAccess();
  const decodedToken: Object = access && jwt.decode(access.token);
  return decodedToken && decodedToken?.user;
};

const isAuthenticated = () => {
  return getToken() !== null;
};

const logout = async () => {
  cleanLocalStorage();
};

const cleanLocalStorage = () => {
  localStorage.clear();
  sessionStorage.clear();
};

export {
  getToken,
  getCurrentUser,
  isAuthenticated,
  logout,
  cleanLocalStorage,
  getCurrentSessionExpirationDate
};
