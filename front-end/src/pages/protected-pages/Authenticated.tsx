import { useSelector } from "react-redux";
import { user } from "../../state-management/local/auth";
import { Navigate, Outlet } from "react-router-dom";

export const AuthenticatedRoutes = () => {
  const userInfo = useSelector(user);
// const isSuperAdmin=userInfo.role=='superadmin';

  return userInfo ? <Outlet /> : <Navigate to="/" replace />;
};
