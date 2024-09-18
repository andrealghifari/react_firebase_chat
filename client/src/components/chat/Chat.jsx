import React, { useEffect, useRef, useState } from "react";
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
import { useSelector } from "react-redux";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../libs/firebase";

const Chat = () => {
  const [openEmoji, setOpenEmoji] = useState(false);
  const { chatId } = useSelector((state) => state.chat);
  const { currentUser } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.chat);
  const [value, setValue] = useState("");
  const [chat, setChat] = useState();
  const endRef = useRef(null);
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleEmoji = (e) => {
    setValue((prevState) => prevState + e.emoji);
  };
  const handleSendMessage = async () => {
    if (!value) return;

    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text: value,
          createdAt: new Date(),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userChats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex(
            (i) => i.chatId === chatId
          );
          userChatsData.chats[chatIndex].lastMessage = value;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  console.log(chat);

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
        {/* NOTES: untuk currentUser kasih class message own, receiver kasih class message */}
        {chat &&
          chat.messages.map((message) => (
            <div
              className={
                message.senderId === currentUser.id ? "message own" : "message"
              }
              key={message.createdAt}
            >
              <div className="texts">
                {message.img && <img src="" alt="" />}
                <p>{message.text}</p> <span>1 min ago</span>
              </div>
            </div>
          ))}

        <div ref={endRef}></div>
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
        <button className="sendChat" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
