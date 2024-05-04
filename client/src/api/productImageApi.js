import axiosClient from './axiosClient';

const productImageApi = {
  getProductImages(paramString = '') {
    return axiosClient.get(`/product-images?${paramString}`);
  },
  create(data) {
    return axiosClient.post('/product-images', data);
  },
  update(id, data) {
    return axiosClient.patch(`/product-images/${id}`, data);
  },
  delete(id) {
    return axiosClient.delete(`/product-images/${id}`);
  },
};

export default productImageApi;
