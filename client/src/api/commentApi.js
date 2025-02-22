import axiosClient from './axiosClient';

const commentApi = {
  getComments(paramString = '') {
    return axiosClient.get(`/comments?${paramString}`);
  },
  getById(id) {
    return axiosClient.get(`/comments/${id}`);
  },
  create(data) {
    return axiosClient.post('/comments', data);
  },
  update(id, data) {
    return axiosClient.patch(`/comments/${id}`, data);
  },
  delete(id) {
    return axiosClient.delete(`/comments/${id}`);
  },
};

export default commentApi;
