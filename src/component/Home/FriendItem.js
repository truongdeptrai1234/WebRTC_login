import React, { useState } from "react";

const FriendItem = ({friend}) => {
  const [dummy, setDummy] = useState(() => {
    console.log(friend);
    return null;
  });
  return (
    <div>
      <h1>
        <span>{friend.toUser.fullName}</span>
      </h1>
    </div>
  );
};

FriendItem.defaultProps = {
  friend: { toUser: { fullName: "example" } },
};

export default FriendItem;
