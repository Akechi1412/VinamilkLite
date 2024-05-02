import { useContext } from 'react';
import { AuthContext } from '../contexts';
import { authApi } from '../api';

const useAuth = () => {
  const { profile, setProfile } = useContext(AuthContext);

  const login = async ({ email, password }) => {
    const { data } = await authApi.login({ email, password });
    setProfile(data.profile);
  };

  const logout = async () => {
    await authApi.logout();
    setProfile(null);
  };

  const refresh = async () => {
    const { data } = await authApi.refresh();
    setProfile(data.profile);
  };

  const updateProfile = async (data) => {
    const { data: profileData } = await authApi.updateProfile(data);
    setProfile(profileData);
  };

  const changePassword = async (data) => {
    await authApi.changePassword(data);
  };

  return { profile, login, logout, refresh, updateProfile, changePassword };
};

export default useAuth;
