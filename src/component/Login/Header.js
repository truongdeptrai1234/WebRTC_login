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
                <a className="nav-link about">
                  About
                </a>
              </li>
              <li className="nav-item button px-2">
                <a
                  className="btn-signin nav-link"
                  id="signincheck"
                  href="/login"
                >
                  Sign in
                </a>
              </li>
              <li className="nav-item button">
                <a
                  className="btn-signup nav-link signupcheck"
                  href="/signup"
                >
                  SIGN UP
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}
