import React, { useEffect, useState } from "react";
import "./detail.css";
import avatar from "../../assets/avatar.png";
import arrowUp from "../../assets/arrowUp.png";
import arrowDown from "../../assets/arrowDown.png";
import downloadImg from "../../assets/download.png";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../../libs/firebase";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../libs/state/userStore";
import { changeBlock, cleanUpChat } from "../../libs/state/chatStore";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import download from "../../libs/download";

const Detail = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const { user, chatId, isReceiverBlocked, isCurrentUserBlocked } = useSelector(
    (state) => state.chat
  );
  const [dropdown, setDropdown] = useState(false);
  const [chat, setChat] = useState();

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
        dispatch(cleanUpChat());
        navigate("/");
      })
      .catch((error) => console.error(error));
  };
  const handleBlockUser = async () => {
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", currentUser.id);
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      // changeBlock();
      dispatch(changeBlock({ isReceiverBlocked: !isReceiverBlocked }));
    } catch (error) {
      console.log(error);
    }
  };
  const handleDownload = async (fileURL) => {
    if (fileURL) {
      try {
        const response = await download(fileURL);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const chatRealtimeData = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      chatRealtimeData();
    };
  }, [chatId]);

  console.log(`User state:`, user);
  console.log(`chatId state:`, chatId);
  console.log(`realtimeChat:`, chat);
  console.log(`isReceiverBlocked`, isReceiverBlocked);

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar ? user?.avatar : avatar} alt="" />
        <h2>{user?.username}</h2>
        <p>{user?.username ? "Lorem ipsum dolor sit amet." : ""}</p>
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
              {chat &&
                chat.messages.map((message, index) => {
                  if (message.image) {
                    const imageURLParts = message.image.split("/");
                    const imageName = decodeURIComponent(
                      imageURLParts[imageURLParts.length - 1].split("?")[0]
                    );
                    console.log(`imagename: `, imageName);
                    return (
                      <div className="photoItem" key={index}>
                        <div className="photoDetail">
                          <img src={message.image} alt="" />
                          <span>{imageName.split("_").pop()}</span>
                        </div>
                        <img
                          src={downloadImg}
                          alt=""
                          onClick={() => handleDownload(message.image)}
                        />
                      </div>
                    );
                  }
                })}
            </div>
          )}
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src={arrowDown} alt="" />
          </div>
        </div>
        <button
          className="btnBlock"
          onClick={handleBlockUser}
          style={{ cursor: isCurrentUserBlocked ? "not-allowed" : "pointer" }}
        >
          {isCurrentUserBlocked
            ? "You are blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"}
        </button>
        <button className="btnLogout" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Detail;
