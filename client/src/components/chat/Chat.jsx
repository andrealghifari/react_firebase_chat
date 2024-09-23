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
import upload from "../../libs/upload";
const Chat = () => {
  const [openEmoji, setOpenEmoji] = useState(false);
  const { chatId, isCurrentUserBlocked, isReceiverBlocked} = useSelector((state) => state.chat);
  const { currentUser } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.chat);

  const [value, setValue] = useState("");
  const [chat, setChat] = useState();
  const [image, setImage] = useState({ file: null, url: `` });

  const endRef = useRef(null);
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleImageUpload = (e) => {
    console.log(e.target.files[0]);
    if (e.target.files[0]) {
      setImage({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  const handleEmoji = (e) => {
    setValue((prevState) => prevState + e.emoji);
  };
  const handleSendMessage = async () => {
    let imgUrl = null;
    if (!value) return;

    try {
      if (image.file) {
        imgUrl = await upload(image.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text: value,
          createdAt: new Date(),
          ...(imgUrl && { image: imgUrl }),
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

    setImage({
      file: null,
      url: "",
    });
    setValue("");
  };

  //USE EFFECT LIST
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

  console.log( `Data chata on Chat.jsx`,chat);
  console.log(`dat user :`, user);

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || avatar} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>{user?.username ? "Lorem, ipsum dolor sit amet" : ""}</p>
          </div>
        </div>
        <div className="icons">
          <img id="phoneImg" src={phone} alt="" />
          <img id="videoImg" src={video} alt="" />
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
                {message.image && (
                  <img className="chatSendImg" src={message.image} alt="" />
                )}
                <p>{message.text}</p>
                <span>1 min ago</span>
              </div>
            </div>
          ))}

        {image.url && (
          <div className="message own">
            <div className="texts">
              <img className="chatSendImg" src={image.url} alt="" />
            </div>
          </div>
        )}

        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="imgFile">
            {image.file && (
              <img className="uploadedImg" src={image.url} alt="" />
            )}
            <img src={img} alt="" />
          </label>
          <input
            type="file"
            id="imgFile"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            disabled={isCurrentUserBlocked|| isReceiverBlocked}
          />
          <img src={camera} alt="" />
          <img src={mic} alt="" />
        </div>
        <input
          value={value}
          type="text"
          placeholder="Type a text..."
          onChange={handleChange}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
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
        <button className="sendChat" onClick={handleSendMessage} disabled={isCurrentUserBlocked || isReceiverBlocked}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
