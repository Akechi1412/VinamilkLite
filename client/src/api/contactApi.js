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
  response(id) {
    return axiosClient.patch(`/contacts/${id}`);
  },
};

export default contactApi;
