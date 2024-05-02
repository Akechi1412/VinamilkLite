import axiosClient from './axiosClient';

const collectionApi = {
  getCollections(paramString = '') {
    return axiosClient.get(`/collections?${paramString}`);
  },
  getById(id) {
    return axiosClient.get(`/collections/${id}`);
  },
  createCollection() {
    return axiosClient.post('/collections');
  },
  updateCollection(id, data) {
    return axiosClient.patch(`/collections/${id}`, data);
  },
  deleteCollection(id) {
    return axiosClient.delete(`/collections/${id}`);
  },
};

export default collectionApi;
