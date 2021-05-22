import React, { Component } from "react";

export default class About extends Component {
  render() {
    return (
      <section className="d-flex align-items-center justify-content-around banner">
        <div className="left_side">
          <h2>Connect with no limit</h2>
          <h3>Call video online.</h3>
          <button
            className="btn-join font-weight-bold mt-3 signupcheck"
            data-toggle="modal"
            data-target="#exampleModal"
          >
            Join us
          </button>
          <p className="mt-3" style={{ color: "gray" }}>
            or sign up with:
            <a className="linkac pl-2" style={{ cursor: "pointer" }} href="#">
              <i className="fab fa-google" />
            </a>
          </p>
        </div>
        <div className="right_side">
          <img src="./img/banner_login.png" alt="bn" />
        </div>
      </section>
    );
  }
}
