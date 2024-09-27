import React, { useEffect, useState } from "react";
import "./chatList.css";
import plus from "../../../assets/plus.png";
import minus from "../../../assets/minus.png";
import search from "../../../assets/search.png";
import avatar from "../../../assets/avatar.png";
import AddUser from "./addUser/addUser";
import { useDispatch, useSelector } from "react-redux";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../libs/firebase";
import { changeChat } from "../../../libs/state/chatStore";

const ChatList = () => {
  const { currentUser } = useSelector((state) => state.auth);

  const [addTrigger, setAddTrigger] = useState(false);
  const [chats, setChats] = useState([]);
  const [filterChats, setFilterChats] = useState("");
  const dispatch = useDispatch();

  const handleSelectChat = async (chat) => {
    //pisahkan data current User dengan sender
    console.log("selected chat data: ", chat);
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    //cari index dalam chats yang cocok dengan chatId dari chat yg di select
    const chatIndex = userChats.findIndex((item) => {
      return item.chatId === chat.chatId;
    });

    //update lagi userChats isSeen menjadi true
    userChats[chatIndex].isSeen = true;

    console.log(`userChatsnya:`, userChats[chatIndex]);
    try {
      await updateDoc(doc(db, "userChats", currentUser.id), {
        chats: userChats,
      });

      //update the state in state management, so it can be accessed in chat element
      dispatch(
        changeChat({
          chatId: chat.chatId,
          user: chat.user,
          currentUser,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  const filteredChats = chats.filter((chat) =>
    chat.user.username.toLowerCase().includes(filterChats.toLowerCase())
  );

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

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unsub();
    };
  }, [currentUser.id]);
  console.log("Chat in chatlist:", chats);
  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src={search} alt="" />
          <input
            type="text"
            name=""
            id=""
            placeholder="Search"
            onChange={(e) => setFilterChats(e.target.value)}
          />
        </div>
        <img
          className="add"
          src={addTrigger ? minus : plus}
          alt=""
          onClick={() => setAddTrigger((prevState) => !prevState)}
        />
      </div>
      {filteredChats.map((chat) => (
        <div
          className="item"
          key={chat.chatId}
          onClick={() => handleSelectChat(chat)}
          style={{ backgroundColor: chat?.isSeen ? "transparent" : "#5183fe" }}
        >
          <img
            src={chat?.user?.blocked.includes(currentUser.id) ? avatar : chat?.user?.avatar}
            alt=""
          />
          <div className="texts">
            <span>{chat?.user?.username}</span>
            <p style={{ fontWeight: chat?.isSeen ? "400" : "700" }}>
              {chat?.lastMessage}
            </p>
          </div>
        </div>
      ))}

      {addTrigger && <AddUser />}
    </div>
  );
};

export default ChatList;
