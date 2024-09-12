import { Route, Routes } from "react-router-dom";
import Register from "../components/auth/register/Register";
import Login from "../components/auth/login/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
    </Routes>
  );
};

export default AppRoutes;
