import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { User } from "./model/user";

function ProtectedRoute({ children }) {
  const user = useSelector((store: { user: User }) => store.user);
  if (user === null) {
    return <Navigate to={"/login"} />;
  } else if (user?.verify === false) {
    return <Navigate to={"/verify"} />;
  }

  return children;
}

export default ProtectedRoute;
