import React, {  useState } from "react";
import { withRouter, useHistory } from "react-router";

const Home = () => {
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

  return (
    <div className="interact p-3 d-flex">
      <div className="menu" style={{ width: "30%" }}>
        <h5
          className="p-2"
          style={{ color: "rgba(7, 7, 114, 0.575)", textAlign: "center" }}
        >
          Home
        </h5>
        <a className="item item1" href="/friends">
          <i className="fa fa-address-book" />
          <div className="appear">
            <h4>Friend</h4>
          </div>
        </a>
        <div className="item item2">
          <i className="fa fa-plus" />
          <div className="appear">
            <h4>Create Room</h4>
          </div>
        </div>
        <div className="item item3">
          <i className="fa fa-users" />
          <div className="appear">
            <h4>Join Room</h4>
          </div>
        </div>
        <div className="item item4">
          <i className="fa fa-video" />
          <div className="appear">
            <h4>Make Call</h4>
          </div>
        </div>
      </div>
      <div className="info p-3 mx-3" style={{ width: "70%" }}>
        <div className="back_ground">
          <div className="admin d-flex">
            <i
              className="fa fa-user-circle"
              style={{
                fontSize: "3.5rem",
                borderRadius: "50%",
                color: "white",
              }}
            />
            <span>{user ? user.user.fullName : ""}</span>
          </div>
        </div>
        <section className="infor_detail my-5 pt-2">
          <div className="infor_item">
            <h4>Meeting ID</h4>
            <span>111</span>
            <button>Edit</button>
          </div>
          <div className="infor_item">
            <h4>Email</h4>
            <span>{user ? user.user.email : ""}</span>
            <button>Edit</button>
          </div>
          <div className="infor_item" />
          <div className="infor_item" />
        </section>
      </div>
    </div>
  );
};

export default withRouter(Home);
