import axiosClient from './axiosClient';

const userApi = {
  getUsers(paramString = '') {
    return axiosClient.get(`/users?${paramString}`);
  },
  create(data) {
    return axiosClient.post('/users', data);
  },
  update(id, data) {
    return axiosClient.patch(`/users/${id}`, data);
  },
  delete(id) {
    return axiosClient.delete(`/users/${id}`);
  },
};

export default userApi;
