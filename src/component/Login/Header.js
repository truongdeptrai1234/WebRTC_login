import React, { Component } from "react";

export default class Header extends Component {
  render() {
    return (
      <header className="tophead">
        <nav className="d-flex container navbar navbar-expand-lg navbar-light">
          <div className="homeicon">
            <a className="flex-grow-1 navbar-brand" href="#">
              <span>V</span>icon
            </a>
          </div>
          <div
            className="d-flex justify-content-end collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav">
              <li className="nav-item active px-3">
                <a className="nav-link about" href="#">
                  About
                </a>
              </li>
              <li className="nav-item button px-2">
                <button
                  className="btn-signin nav-link"
                  id="signincheck"
                  href="/login"
                  data-toggle="modal"
                  data-target="#exampleModal1"
                >
                  Sign in
                </button>
              </li>
              <li className="nav-item button">
                <button
                  className="btn-signup nav-link signupcheck"
                  href="#"
                  data-toggle="modal"
                  data-target="#exampleModal"
                >
                  SIGN UP
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}
