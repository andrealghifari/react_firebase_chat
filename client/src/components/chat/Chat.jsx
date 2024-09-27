import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import fileImg from "../../assets/file.png";
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
import download from "../../libs/download";
import { format } from "date-fns";
const Chat = () => {
  const [openEmoji, setOpenEmoji] = useState(false);
  const { chatId, isCurrentUserBlocked, isReceiverBlocked } = useSelector(
    (state) => state.chat
  );
  const { currentUser } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.chat);

  const [value, setValue] = useState("");
  const [chat, setChat] = useState();
  const [uploadFile, setUploadFile] = useState({
    file: null,
    url: ``,
    isImage: false,
  });

  const endRef = useRef(null);
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleFileUpload = (e) => {
    const fileData = e.target.files[0];
    if (fileData) {
      setUploadFile({
        file: fileData,
        url: URL.createObjectURL(fileData),
        isImage: fileData.type.startsWith("image"),
      });
    }
  };
  const handleFileDownload = async (fileURL) => {
    if (fileURL) {
      try {
        const response = await download(fileURL);
      } catch (error) {
        console.log(error);
      }
      y;
    }
  };
  const handleEmoji = (e) => {
    setValue((prevState) => prevState + e.emoji);
  };
  const handleSendMessage = async () => {
    let fileURL = null;
    if (!value) return;

    try {
      if (uploadFile.file) {
        fileURL = await upload(uploadFile.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text: value,
          createdAt: new Date(),
          ...(fileURL && { file: fileURL }),
          ...(uploadFile.isImage && { isImage: uploadFile.isImage }),
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

    setUploadFile({
      file: null,
      url: "",
      isImage: false,
    });
    setValue("");
  };
  const displayMessageDate = (createdAt) => {
    const newDate = new Date(createdAt.seconds * 1000);
    return format(newDate, "MMM d yyyy, h:mm a");
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

  console.log(`Data chat on Chat.jsx`, chat);
  console.log(`dat user :`, user);
  console.log(`file uploaded`, uploadFile);
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
                {message.file ? (
                  <div>
                    {message.isImage ? (
                      <img
                        className="chatSendImg"
                        src={message.file}
                        alt="Uploaded Image"
                      />
                    ) : (
                      <a
                        className="fileDownloadLink"
                        onClick={() => handleFileDownload(message.file)}
                      >
                        <img src={fileImg} alt="" />
                        {decodeURIComponent(
                          message.file
                            .split("%2F")
                            .pop()
                            .split("_")
                            .pop()
                            .split("?")[0]
                        )}
                      </a>
                    )}
                  </div>
                ) : (
                  <></>
                )}

                <p>{message.text}</p>
                <span className="sentTime">
                  {displayMessageDate(message.createdAt)}
                </span>
              </div>
            </div>
          ))}

        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="imgFile">
            {uploadFile.file && (
              <img className="uploadedImg" src={uploadFile.url} alt="" />
            )}
            <img src={img} alt="" />
          </label>
          <input
            type="file"
            id="imgFile"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
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
        <button
          className="sendChat"
          onClick={handleSendMessage}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
