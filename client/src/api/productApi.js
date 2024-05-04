import axiosClient from './axiosClient';

const productApi = {
  getProducts(paramString = '') {
    return axiosClient.get(`/products?${paramString}`);
  },
  create(data) {
    return axiosClient.post('/products', data);
  },
  update(id, data) {
    return axiosClient.patch(`/products/${id}`, data);
  },
  delete(id) {
    return axiosClient.delete(`/products/${id}`);
  },
};

export default productApi;
