import React, { useState } from "react";
import avatarImg from "../../../assets/avatar.png";
import "./register.css";
import Notification from "../../notifications/Notification";
import { toast } from "react-toastify";

const Register = () => {
  const [avatar, setAvatar] = useState({ file: null, url: "" });

  const handleAvatar = (e) => {
    console.log(e);
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  const handleRegister = (e) => {
    e.preventDefault();
    toast.success("Successfully Registered, welcome!", {
      position: "top-center",
      autoClose: 3000,
    });
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
          <input type="text" name="userame" placeholder="Username" />
          <input
            type="file"
            id="file"
            onChange={handleAvatar}
            style={{ display: "none" }}
          />
          <input type="email" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
