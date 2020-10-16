// eslint-disable-next-line import/no-cycle
import { getToken, cleanLocalStorage } from 'services/Authentication';
import axios from 'axios';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const redirectTime = () => {
  setTimeout(() => {
    window.location.pathname = '/login';
  }, 1000);
};

// Create instance API axios
const instance = axios.create({
  baseURL: `${(window.PICOLIN_ENV && window.PICOLIN_ENV.API_URL) || process.env.REACT_APP_API_URL}`,
  responseType: 'json'
});

instance.defaults.headers.Timezone = -new Date().getTimezoneOffset() / 60;

// Add a request interceptor
instance.interceptors.request.use(
  request => {
    const token = getToken();
    if (token) request.headers.Authorization = `Bearer ${token}`;
    return request;
  },
  error => {
    Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (!error?.response?.status) {
      return Promise.reject(error);
    }

    if (error.response.status === 403 && error.response.data.isInactive) {
      cleanLocalStorage();
      if (error.response.data.redirect) {
        redirectTime();
      }
    }

    if (
      (error.response.status === 400 ||
        error.response.status === 404 ||
        error.response.status === 500) &&
      originalRequest.url === '/users/token/refresh'
    ) {
      cleanLocalStorage();
      redirectTime();
    }

    // eslint-disable-next-line no-underscore-dangle
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      // eslint-disable-next-line no-underscore-dangle
      originalRequest._retry = true;
      isRefreshing = true;

      // const refreshToken = getRefreshToken();

      // return new Promise((resolve, reject) => {
      //   instance
      //     .post('/users/token/refresh', { refresh_token: refreshToken })
      //     .then(response => {
      //       if (response.status === 200 || response.status === 201) {
      //         localStorage.setItem('access', JSON.stringify(response.data.token));
      //         axios.defaults.headers.Authorization = `Bearer ${response.data.token}`;
      //         axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
      //         originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
      //         processQueue(null, response.data.token);
      //         resolve(instance(originalRequest));
      //       }
      //     })
      //     .catch(err => {
      //       processQueue(err, null);
      //       reject(err);
      //     })
      //     .finally(() => {
      //       isRefreshing = false;
      //     });
      // });
    }

    return Promise.reject(error);
  }
);

export default instance;
