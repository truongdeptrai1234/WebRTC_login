import React, { Component } from "react";

export default class ModalSignup extends Component {
  
  render() {
    return (
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" style={{ width: 350 }} role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title text-left font-weight-bold"
                id="exampleModalLabel"
              >
                <span style={{ color: "#007791" }}>V</span>icon new <br />
                member
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form id="formname">
                <div className="form-row">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="First name"
                      required
                      id="fn"
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last name"
                      required
                      id="ln"
                    />
                  </div>
                </div>
              </form>
              <div className="form-group pt-1">
                <label htmlFor="inputEmail">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="inputEmail"
                  placeholder="Email"
                  pattern=".@gmail.com" required
                />
              </div>
              <div className="form-group">
                <label htmlFor="inputPass">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="inputPass"
                  placeholder="Password"
                  required
                />
              </div>
              <div className="form-group" id="confirmpass">
                <label htmlFor="inputPassAgain">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="inputPassAgain"
                  placeholder="Confirm Password"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-success" id="btnfirst">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
