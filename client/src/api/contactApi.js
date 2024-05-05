import axiosClient from './axiosClient';

const contactApi = {
  submit(data) {
    return axiosClient.post('/contacts/submit', data);
  },
  getContacts(paramString) {
    return axiosClient.get(`/contacts?${paramString}`);
  },
  getById(id) {
    return axiosClient.get(`/contacts/${id}`);
  },
  response(id, data) {
    return axiosClient.patch(`/contacts/response/${id}`, data);
  },
  update(id, data) {
    return axiosClient.patch(`/contacts/${id}`, data);
  },
  delete(id) {
    return axiosClient.delete(`/contacts/${id}`);
  },
};

export default contactApi;
