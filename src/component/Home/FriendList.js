import React from "react";
import FriendItem from "./FriendItem";
import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import env from "react-dotenv";
import { environment } from '../../environment/index'

const FriendList = ({ skip, limit }) => {
  const history = useHistory();
  const [user, setUser] = useState(() => {
    if (localStorage.getItem("user") === null) {
      history.push("/login");
    } else {
      let data = JSON.parse(localStorage.getItem("user"));
      console.log(data);
      return data;
    }
  });
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const update = async () => {
      let data = [];
      await axios
        .get(environment.baseApiURL + "/user-friend/friends", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          console.log(res);
          console.log(res.data);
          if (res.status < 300 && res.status > 199) {
            data = res.data.slice();
            console.log(data);
          }
        })
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            alert(error.response.data.message);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
      setFriends(data);
    };
    update();
    console.log(friends);
  }, []);

  return (
    <div>
      {friends.length === 0 ? (
        <h1>You have no friend :(</h1>
      ) : (
        friends.map((friend, index) => (
          <FriendItem key={index} friend={friend} />
        ))
      )}
    </div>
  );
};

FriendList.defaultProps = {
  skip: 0,
  limit: 50,
};

export default FriendList;
