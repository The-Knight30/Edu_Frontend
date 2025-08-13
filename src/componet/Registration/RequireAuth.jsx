/* eslint-disable react/prop-types */
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "cookie-universal"
const RequireAuth = ({ allowedroles }) => {
  const cookies=Cookies()
  // const { auth } = useContext(AuthContext);
  const auth=cookies.get("role")
  // console.log(auth);
  const location = useLocation();
  return /*auth.role === allowedroles ?*/auth==allowedroles?(
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
