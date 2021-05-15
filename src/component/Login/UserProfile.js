import React from "react";

var UserProfile = () => {
  var userInfo = "";

  var getUser = () => {
    return sessionStorage.getItem("user");
  };
  var setUser = (info) => {
    userInfo = info;
    sessionStorage.setItem("user", info);
  };

  return {
    getUser: getUser,
    setUser,
  };
};

export default UserProfile;
