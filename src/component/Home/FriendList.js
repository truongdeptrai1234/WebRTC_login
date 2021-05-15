import React from "react";
import Friend from "./FriendItem";
import { useState } from "react";

const FriendList = ({ skip, limit }) => {
  const [friends] = useState([
    { lname: "bob", fname: "mr", email: "bob@mail.com" },
    { lname: "bib", fname: "mrs", email: "bib@mail.com" },
    { lname: "bub", fname: "ms", email: "bub@mail.com" },
    
  ]);
  return (
    <div>
      {friends.map((friend, index) => (
        <Friend key={index} friend={friend} />
      ))}
    </div>
  );
};

FriendList.defaultProps = {
  skip: 0,
  limit: 50,
};

export default FriendList;
