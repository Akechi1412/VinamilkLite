import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const UserCacheContext = createContext({
  userCache: {},
  setUserCache: () => {},
});

export const UserCacheProvider = ({ children }) => {
  const [userCache, setUserCache] = useState({});

  const value = {
    userCache,
    setUserCache,
  };

  return <UserCacheContext.Provider value={value}>{children}</UserCacheContext.Provider>;
};

UserCacheProvider.propTypes = {
  children: PropTypes.node,
};

export default UserCacheContext;
