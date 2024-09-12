import "./login.css";
import { toast } from "react-toastify";
import Notification from "../../notifications/Notification";
import { Link } from "react-router-dom";
import Chat from "../../chat/Chat";
import Detail from "../../detail/Detail";
import List from "../../list/List";
const Login = () => {
  const user = false;
  const handleLogin = (e) => {
    e.preventDefault();
    toast.success("Successfully Loged In!", {
      position: "top-center",
      autoClose: 3000,
    });
  };
  return (
    <>
      {user ? (
        <>
          <List />
          <Chat />
          <Detail />
        </>
      ) : (
        <div className="login">
          <div className="item">
            <div className="titleInfo">
              Waz<span>zup!</span>
            </div>
            <h2>Welcome Back,</h2>
            <Notification />
            <form onSubmit={handleLogin}>
              <input type="email" name="email" placeholder="Email" />
              <input type="password" name="password" placeholder="Password" />
              <button type="submit">Sign In</button>
            </form>
            <p>
              Don't have one ? create
              <Link to={"/register"}>
                <span>here</span>
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
