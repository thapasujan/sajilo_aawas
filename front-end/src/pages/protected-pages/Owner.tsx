import { useSelector } from "react-redux";
import { user } from "../../state-management/local/auth";
import { Navigate, Outlet } from "react-router-dom";

export const OwnerPage = () => {
  const userInfo = useSelector(user);

  return userInfo?.role === "owner" ? <Outlet /> : <Navigate to="/" replace />;
};
