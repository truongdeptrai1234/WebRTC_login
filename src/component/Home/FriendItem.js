import React from "react";

const FriendItem = ({ friend }) => {
  return (
    <div>
      <h1>
        <span>{friend.fname}</span>
        <span>{friend.lname}</span>
        <span>{friend.email}</span>
      </h1>
    </div>
  );
};

FriendItem.defaultProps = {
  friend: { fname: "First", lname:"Last", email: "example@mail.com"}
};

export default FriendItem;
