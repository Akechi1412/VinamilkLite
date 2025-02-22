import axiosClient from './axiosClient';

const addressApi = {
  getProvinces() {
    return axiosClient.get('/addresses/provinces');
  },
  getDistricts(provinceId) {
    return axiosClient.get(`/addresses/districts/${provinceId}`);
  },
  getWards(districtId) {
    return axiosClient.get(`/addresses/wards/${districtId}`);
  },
  getaddresses(paramString = '') {
    return axiosClient.get(`/addresses?${paramString}`);
  },
  getUserAddresses() {
    return axiosClient.get('/addresses/user');
  },
  getById(id) {
    return axiosClient.get(`/addresses/${id}`);
  },
  create(data) {
    return axiosClient.post('/addresses', data);
  },
  update(id, data) {
    return axiosClient.patch(`/addresses/${id}`, data);
  },
  delete(id) {
    return axiosClient.delete(`/addresses/${id}`);
  },
};

export default addressApi;
