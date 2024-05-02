import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { Loading } from '../../components/common';

function AccountPage() {
  const { profile, refresh } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      setLoading(false);
    }

    (async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading fullScreen />;

  return profile ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}

export default AccountPage;
