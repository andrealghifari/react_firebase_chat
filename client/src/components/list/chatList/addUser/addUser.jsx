import React from "react";
import "./addUser.css";
import search from "../../../../assets/search.png";
import avatar from "../../../../assets/avatar.png";
const AddUser = () => {
  return (
    <div className="addUser">
      <form >
        <div className="searchBar">
          <img src={search} alt="" />
          <input type="text" placeholder="Username" name="username" />
          <button>Search</button>

        </div>
      </form>
      <div className="user">
        <div className="detail">
          <img src={avatar} alt="" />
          <span>Jane Doe</span>
        </div>
        <button>Add User</button>
      </div>
    </div>
  );
};

export default AddUser;
