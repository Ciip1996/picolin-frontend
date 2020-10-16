// eslint-disable-next-line import/no-cycle
import API from 'services/API';
import jwt from 'jsonwebtoken';

const getAccess = () => {
  const access = localStorage.getItem('access');
  return access && JSON.parse(access);
};

const getToken = () => {
  const access = getAccess();
  return access && access.token;
};

const getRefreshToken = () => {
  const access = getAccess();
  return access && access.refreshToken;
};

const getCurrentUser = () => {
  const access = getAccess();

  const decodedToken = access && jwt.decode(access.token);
  return decodedToken && decodedToken.data.user;
};

const isAuthenticated = () => {
  return getToken() !== null;
};

const logout = async () => {
  await API.get('users/logout');

  cleanLocalStorage();
  logoutMicrosoft();
};

const logoutMicrosoft = () => {
  const postLogoutUrl = `${(window.PICOLIN_ENV && window.PICOLIN_ENV.LOGOUT_REDIRECT_URL) ||
    process.env.REACT_APP_REDIRECT_URL}`;

  window.location.replace(
    `${process.env.REACT_APP_MICROSOFT_URL}${process.env.REACT_APP_TENANT_URL}/oauth2/v2.0/logout?post_logout_redirect_uri=${postLogoutUrl}`
  );
};

const cleanLocalStorage = () => {
  localStorage.clear();
  sessionStorage.clear();
};

const getRedirectPage = () => {
  return localStorage.getItem('redirectPage');
};

export {
  getToken,
  getCurrentUser,
  getRefreshToken,
  isAuthenticated,
  logout,
  cleanLocalStorage,
  getRedirectPage
};
