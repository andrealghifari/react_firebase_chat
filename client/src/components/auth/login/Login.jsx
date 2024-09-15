import "./login.css";
import { toast } from "react-toastify";
import Notification from "../../notifications/Notification";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import Chat from "../../chat/Chat";
import Detail from "../../detail/Detail";
import List from "../../list/List";
import { auth } from "../../../libs/firebase";
import { fetchUserInfo, logoutUser } from "../../../libs/state/userStore";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser, isLoading } = useSelector((state) => state.auth);

  const messageRegistered = location?.state?.message;
  const logout = location?.state?.logout;
  const [loading, setLoading] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      //dispatch action to fetch user info from firestore using UID
      dispatch(fetchUserInfo(user.uid));
      setLoading(false);
      navigate("/");
    } catch (error) {
      toast.error(error.message, { position: "bottom-right", autoClose: 4000 });
      setLoading(false);
    }
  };

  // USE EFFECT LIST

  //listening to authentication state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(fetchUserInfo(user?.uid));
      }
      setIsAuthChecked(true);
    });

    return () => {
      unsub(); //cleanup unmount
    };
  }, [dispatch]);
  //toast effect after registeration (redirected back to login)
  useEffect(() => {
    if (messageRegistered) {
      toast.success(messageRegistered, {
        position: "bottom-right",
        autoClose: 4000,
      });
    }
    navigate(location.pathname, { replace: true });
  }, [messageRegistered, location.pathname, navigate]);

  if (!isAuthChecked || isLoading)
    return <div className="loading">Loading...</div>;

  console.log(currentUser);

  return (
    <>
      {currentUser ? (
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
              <input type="email" name="email" placeholder="Email" required />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Sign In"}
              </button>
            </form>
            <p>
              Don't have one ? create{" "}
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
