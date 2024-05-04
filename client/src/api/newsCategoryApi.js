import axiosClient from './axiosClient';

const newsCategoryApi = {
  getCategories(paramString = '') {
    return axiosClient.get(`/news-categories?${paramString}`);
  },
  create(data) {
    return axiosClient.post('/news-categories', data);
  },
  update(id, data) {
    return axiosClient.patch(`/news-categories/${id}`, data);
  },
  delete(id) {
    return axiosClient.delete(`/news-categories/${id}`);
  },
};

export default newsCategoryApi;
