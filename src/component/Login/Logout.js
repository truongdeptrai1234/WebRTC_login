import React, { useEffect } from "react";
import { withRouter, useHistory } from "react-router";
import axios from "axios";
import env from "react-dotenv";
import { environment } from '../../environment/index'

const Logout = () => {
  const history = useHistory();
  useEffect(() => {
    if (localStorage.getItem("user") === null) {
      history.push("/login");
    } else {
      const user = JSON.parse(localStorage.getItem("user"));
      axios
        .put(
          environment.baseApiURL + "/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          console.log(res.data);
          if (res.status < 300 && res.status > 199) {
            localStorage.removeItem("user");
            history.push("/login");
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
    }
  });
  return <div></div>;
};

export default withRouter(Logout);
