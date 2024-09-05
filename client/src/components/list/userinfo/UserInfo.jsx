import React from "react";
import "./userInfo.css";
import avatar from "../../../assets/avatar.png";
import more from "../../../assets/more.png";
import video from "../../../assets/video.png";
import edit from "../../../assets/edit.png";

const UserInfo = () => {
  return (
    <div className="userInfo">
      <div className="user">
        <img src={avatar} alt="" />
        <h2>Andre</h2>
      </div>
      <div className="icons">
        <img src={more} alt="" />
        <img src={video} alt="" />
        <img src={edit} alt="" />
      </div>
    </div>
  );
};

export default UserInfo;
