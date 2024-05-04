import axiosClient from './axiosClient';

const newsApi = {
  getNews(paramString = '') {
    return axiosClient.get(`/news?${paramString}`);
  },
  create(data) {
    return axiosClient.post('/news', data);
  },
  update(id, data) {
    return axiosClient.patch(`/news/${id}`, data);
  },
  delete(id) {
    return axiosClient.delete(`/news/${id}`);
  },
};

export default newsApi;
