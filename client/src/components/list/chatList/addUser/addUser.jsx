import React, { useState } from "react";
import "./addUser.css";
import search from "../../../../assets/search.png";
import avatar from "../../../../assets/avatar.png";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../../libs/firebase";
import { useSelector } from "react-redux";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useSelector((state) => state.auth);

  const handleAddUser = async () => {
    const chatRef = collection(db, "chats");
    console.log("🚀 ~ handleAddUser ~ chatRef:", chatRef);
    const userChatsRef = collection(db, "userChats");
    console.log("🚀 ~ handleAddUser ~ userChatsRef:", userChatsRef);

    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAd: serverTimestamp(),
        messages: [],
      });

      //this below is gonna update the user chats of the search-referenced id
      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id, //this is the logedIn user
          updatedAt: Date.now(),
        }),
      });

      //this below is gonna update the user chats of the loged in user id
      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id, //this is the searched User
          updatedAt: Date.now(),
        }),
      });

      // console.log(newChatRef.id);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearchUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const querie = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(querie);
      // console.log("query: ", querie);
      // console.log("🚀 ~ handleSearchUser ~ querySnapshot:", querySnapshot)
      // console.log("querysnapshot.docs[0]", querySnapshot.docs[0])
      console.log("querysnapshot.docs[0].data", querySnapshot.docs[0].data());
      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="addUser">
      <div className="titleBar">
        Search a User
      </div>
      <form onSubmit={handleSearchUser}>
        <div className="searchBar">
          <img src={search} alt="" />
          <input type="text" placeholder="Username" name="username" />
          <button>Search</button>
        </div>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user ? user.avatar : avatar} alt="" />
            <span>{user?.username}</span>
          </div>
          <button onClick={handleAddUser}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
