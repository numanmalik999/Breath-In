import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;