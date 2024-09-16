import React from "react";
import "./userInfo.css";
import avatar from "../../../assets/avatar.png";
import more from "../../../assets/more.png";
import video from "../../../assets/video.png";
import edit from "../../../assets/edit.png";
import { useSelector } from "react-redux";

const UserInfo = () => {
  const { currentUser } = useSelector((state) => state.auth);
  return (
    <div className="info">
      <div className="titleInfo">
        Waz<span>zup!</span>
      </div>
      <div className="userInfo">
        <div className="user">
          <img src={currentUser ? currentUser.avatar : avatar} alt="" />
          <h2>{currentUser ? currentUser.username : "Anynymous"}</h2>
        </div>
        <div className="icons">
          <img src={more} alt="" />
          <img src={video} alt="" />
          <img src={edit} alt="" />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
