import axiosClient from './axiosClient';

const authApi = {
  register(data) {
    return axiosClient.post('/auth/register', data);
  },
  login(data) {
    return axiosClient.post('/auth/login', data);
  },
  logout() {
    return axiosClient.post('/auth/logout');
  },
  refresh() {
    return axiosClient.post('/auth/refresh');
  },
};

export default authApi;
