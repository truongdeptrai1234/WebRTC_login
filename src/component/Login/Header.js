import React, { Component } from "react";

export default class Header extends Component {
  render() {
    let navbar;
    if (localStorage.getItem("user") === null) {
      navbar = (
        <ul className="navbar-nav">
          <li className="nav-item active px-3">
            <a className="nav-link about" href="/about">
              About
            </a>
          </li>
          <li className="nav-item button px-2">
            <a className="btn-signin nav-link" id="signincheck" href="/login">
              Sign in
            </a>
          </li>
          <li className="nav-item button">
            <a className="btn-signup nav-link signupcheck" href="/signup">
              SIGN UP
            </a>
          </li>
        </ul>
      );
    } else {
      navbar = (
        <ul className="navbar-nav">
          <li className="nav-item button px-2">
            <button
              className="btn-signin nav-link"
              id="signincheck"
              href="#"
              data-toggle="modal"
              data-target="#exampleModal1"
            >
              <i className="fa fa-user-circle" style={{ fontSize: 25 }} />
            </button>
          </li>
          <li className="nav-item button btn-group">
            <button
              type="button"
              className="btn btn-light dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            />
            <div className="dropdown-menu dropdown-menu-right">
              <button className="dropdown-item" type="button">
                Account setting
              </button>
              <a className="dropdown-item" href="/logout">
                Log out
              </a>
              <button className="dropdown-item" type="button"></button>
              <button className="dropdown-item" type="button">
                Something else here
              </button>
            </div>
          </li>
        </ul>
      );
    }
    return (
      <header className="tophead">
        <nav className="d-flex container navbar navbar-expand-lg navbar-light">
          <div className="homeicon">
            <a className="flex-grow-1 navbar-brand" href="/">
              <span>V</span>icon
            </a>
          </div>
          <div
            className="d-flex justify-content-end collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            {navbar}
          </div>
        </nav>
      </header>
    );
  }
}
