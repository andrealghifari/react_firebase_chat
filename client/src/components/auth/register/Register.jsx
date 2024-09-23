import React, { useState } from "react";
import avatarImg from "../../../assets/avatar.png";
import "./register.css";
import Notification from "../../notifications/Notification";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../libs/firebase";
import upload from "../../../libs/upload";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [avatar, setAvatar] = useState({ file: null, url: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleAvatar = (e) => {
    // console.log(e);
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    //VALIDATION RULES
    if (!username || !email || !password) {
      setLoading(false);
      return toast.warn("Please input all fields", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
    if (!avatar.file) {
      setLoading(false);

      return toast.warn("Avatar is needed", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(`hasil: `, response);

      const imgURL = await upload(avatar.file);

      await setDoc(doc(db, "users", response.user.uid), {
        username,
        email,
        avatar: imgURL,
        id: response.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userChats", response.user.uid), {
        chats: [],
      });

      navigate("/", {
        state: { messageRegister: "Registration has successful!" },
      });
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          toast.error("Invalid email format", {
            position: "bottom-right",
            autoClose: 3000,
          });
          break;

        default:
          toast.error(error.message, {
            autoClose: 3000,
            position: "top-center",
          });
          break;
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="register">
      <div className="item">
        <div className="titleInfo">
          Waz<span>zup!</span>
        </div>
        <h2>Create an Account</h2>
        <Notification />
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || avatarImg} alt="" />
            <h5>Upload an Image</h5>
          </label>
          <span>*This will be your avatar</span>
          <input type="text" name="username" placeholder="Username" />
          <input
            type="file"
            id="file"
            onChange={handleAvatar}
            style={{ display: "none" }}
          />
          <input type="email" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
