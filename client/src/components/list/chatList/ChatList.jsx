import React, { useState } from "react";
import "./chatList.css";
import plus from "../../../assets/plus.png";
import minus from "../../../assets/minus.png";
import search from "../../../assets/search.png";
import avatar from "../../../assets/avatar.png";
const ChatList = () => {
  const [addTrigger, setAddTrigger] = useState(false);
  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src={search} alt="" />
          <input type="text" name="" id="" placeholder="Search" />
        </div>
        <img
          className="add"
          src={addTrigger ? minus : plus}
          alt=""
          onClick={() => setAddTrigger((prevState) => !prevState)}
        />
      </div>

      <div className="item">
        <img src={avatar} alt="" />
        <div className="texts">
          <span>Jane Doe</span>
          <p>Hello</p>
        </div>
      </div>
      <div className="item">
        <img src={avatar} alt="" />
        <div className="texts">
          <span>Jane Doe</span>
          <p>Hello</p>
        </div>
      </div>
      <div className="item">
        <img src={avatar} alt="" />
        <div className="texts">
          <span>Jane Doe</span>
          <p>Hello</p>
        </div>
      </div>
      <div className="item">
        <img src={avatar} alt="" />
        <div className="texts">
          <span>Jane Doe</span>
          <p>Hello</p>
        </div>
      </div>
      <div className="item">
        <img src={avatar} alt="" />
        <div className="texts">
          <span>Jane Doe</span>
          <p>Hello</p>
        </div>
      </div>
      <div className="item">
        <img src={avatar} alt="" />
        <div className="texts">
          <span>Jane Doe</span>
          <p>Hello</p>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
