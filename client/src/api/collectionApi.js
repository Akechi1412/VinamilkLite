import axiosClient from './axiosClient';

const collectionApi = {
  getCollections(paramString = '') {
    return axiosClient.get(`/collections?${paramString}`);
  },
  getById(id) {
    return axiosClient.get(`/collections/${id}`);
  },
  create(data) {
    return axiosClient.post('/collections', data);
  },
  update(id, data) {
    return axiosClient.patch(`/collections/${id}`, data);
  },
  delete(id) {
    return axiosClient.delete(`/collections/${id}`);
  },
};

export default collectionApi;
