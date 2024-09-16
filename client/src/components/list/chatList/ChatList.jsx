import React, { useEffect, useState } from "react";
import "./chatList.css";
import plus from "../../../assets/plus.png";
import minus from "../../../assets/minus.png";
import search from "../../../assets/search.png";
import avatar from "../../../assets/avatar.png";
import AddUser from "./addUser/addUser";
import { useSelector } from "react-redux";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../libs/firebase";

const ChatList = () => {
  const { currentUser } = useSelector((state) => state.auth);

  const [addTrigger, setAddTrigger] = useState(false);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "userChats", currentUser.id),
      async (res) => {
        console.log("Current data: ", res.data());
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();

          return { ...item, user };
        });
        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a,b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unsub();
    };
  }, [currentUser.id]);
  console.log(chats);
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
      {chats.map((chat) => (
        <div className="item" key={chat.chatId}>
          <img src={chat?.user?.avatar || avatar} alt="" />
          <div className="texts">
            <span>{chat?.user?.username}</span>
            <p>{chat?.chatMessage}</p>
          </div>
        </div>
      ))}

      {addTrigger && <AddUser />}
    </div>
  );
};

export default ChatList;
