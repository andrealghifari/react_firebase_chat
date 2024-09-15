import React, { useState } from "react";
import "./detail.css";
import avatar from "../../assets/avatar.png";
import arrowUp from "../../assets/arrowUp.png";
import arrowDown from "../../assets/arrowDown.png";
import download from "../../assets/download.png";
import sharedPhoto from "../../assets/Zcommerce.png";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../libs/firebase";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../libs/state/userStore";

const Detail = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleDropdownPhotos = () => {
    setDropdown((prevState) => !prevState);
  };
  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        dispatch(logoutUser()); // dispatching logout state to the redux
        navigate("/")
      })
      .catch((error) => console.error(error));
  };
  return (
    <div className="detail">
      <div className="user">
        <img src={currentUser?.avatar} alt="" />
        <h2>{currentUser?.username}</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src={arrowDown} alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src={arrowDown} alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img
              src={dropdown ? arrowUp : arrowDown}
              alt=""
              onClick={handleDropdownPhotos}
            />
          </div>
          {dropdown && (
            <div className="photos">
              <div className="photoItem">
                <div className="photoDetail">
                  <img src={sharedPhoto} alt="" />
                  <span>photo_2024</span>
                </div>
                <img src={download} alt="" />
              </div>
              <div className="photoItem">
                <div className="photoDetail">
                  <img src={sharedPhoto} alt="" />
                  <span>photo_2024</span>
                </div>
                <img src={download} alt="" />
              </div>
              <div className="photoItem">
                <div className="photoDetail">
                  <img src={sharedPhoto} alt="" />
                  <span>photo_2024</span>
                </div>
                <img src={download} alt="" />
              </div>
              <div className="photoItem">
                <div className="photoDetail">
                  <img src={sharedPhoto} alt="" />
                  <span>photo_2024</span>
                </div>
                <img src={download} alt="" />
              </div>
            </div>
          )}
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src={arrowDown} alt="" />
          </div>
        </div>
        <button className="btnBlock">Block User</button>
        <button className="btnLogout" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Detail;
