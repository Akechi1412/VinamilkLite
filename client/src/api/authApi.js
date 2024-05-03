import axiosClient from './axiosClient';

const authApi = {
  register(data) {
    return axiosClient.post('/auth/register', data);
  },
  resendOtp() {
    return axiosClient.post('/auth/resend-otp');
  },
  verifyOtp(data) {
    return axiosClient.post('/auth/verify-otp', data);
  },
  login(data) {
    return axiosClient.post('/auth/login', data);
  },
  logout() {
    return axiosClient.post('/auth/logout');
  },
  refresh() {
    return axiosClient.post('/auth/refresh');
  },
  updateProfile(data) {
    return axiosClient.patch('/auth/profile', data);
  },
  changePassword(data) {
    return axiosClient.patch('/auth/password', data);
  },
  resetPassword(data) {
    return axiosClient.post('/auth/reset-password', data);
  },
};

export default authApi;
