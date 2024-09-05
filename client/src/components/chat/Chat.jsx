import React, { useState } from "react";
import "./chat.css";
import avatar from "../../assets/avatar.png";
import phone from "../../assets/phone.png";
import video from "../../assets/video.png";
import info from "../../assets/info.png";
import emoji from "../../assets/emoji.png";
import img from "../../assets/img.png";
import camera from "../../assets/camera.png";
import mic from "../../assets/mic.png";
import EmojiPicker from "emoji-picker-react";

const Chat = () => {
  const [openEmoji, setOpenEmoji] = useState(false);
  const [value, setValue] = useState("");
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleEmoji = (e) => {
    setValue((prevState) => prevState + e.emoji);
  };
  console.log(value);

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={avatar} alt="" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Lorem, ipsum dolor sit amet</p>
          </div>
        </div>
        <div className="icons">
          <img src={phone} alt="" />
          <img src={video} alt="" />
          <img src={info} alt="" />
        </div>
      </div>
      <div className="middle">
        <div className="message own">
          <div className="texts">
            <p>lorem ipsum dolomet</p> <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
          <img src={avatar} alt="" />
          <div className="texts">
            <p>lorem ipsum dolomet</p> <span>1 min ago</span>
          </div>
        </div>
        <div className="message own">
          <div className="texts">
            <p>lorem ipsum dolomet</p> <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
          <img src={avatar} alt="" />
          <div className="texts">
            <p>lorem ipsum dolomet</p> <span>1 min ago</span>
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="icons">
          <img src={img} alt="" />
          <img src={camera} alt="" />
          <img src={mic} alt="" />
        </div>
        <input
          value={value}
          type="text"
          placeholder="Type a text..."
          onChange={handleChange}
        />
        <div className="emoji">
          <img
            src={emoji}
            alt=""
            onClick={() => setOpenEmoji((prevState) => !prevState)}
          />
          <div className="picker">
            <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="sendChat">Send</button>
      </div>
    </div>
  );
};

export default Chat;
