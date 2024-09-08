import React, { useState } from "react";
import "./detail.css";
import avatar from "../../assets/avatar.png";
import arrowUp from "../../assets/arrowUp.png";
import arrowDown from "../../assets/arrowDown.png";
import download from "../../assets/download.png";
import sharedPhoto from "../../assets/Zcommerce.png";
const Detail = () => {
  const [dropdown, setDropdown] = useState(false);
  const handleDropdownPhotos = () => {
    setDropdown((prevState) => !prevState);
  }
  return (
    <div className="detail">
      <div className="user">
        <img src={avatar} alt="" />
        <h2>Jane Doe</h2>
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
        <button>Block User</button>
      </div>
    </div>
  );
};

export default Detail;
