import axiosClient from './axiosClient';

const optionApi = {
  getOptions() {
    return axiosClient.get('/options');
  },
  getByKey(key) {
    return axiosClient.get(`/options/${key}`);
  },
  update(key, data) {
    return axiosClient.patch(`/options/${key}`, data);
  },
};

export default optionApi;
