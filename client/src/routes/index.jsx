import { Navigate, Route, Routes } from "react-router-dom";
import Register from "../components/auth/register/Register";
import Login from "../components/auth/login/Login";
import { useSelector } from "react-redux";

const AppRoutes = () => {
  const { currentUser } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route
        path="/register"
        element={!!currentUser ? <Navigate to={"/"} /> : <Register />}
      ></Route>
    </Routes>
  );
};

export default AppRoutes;
