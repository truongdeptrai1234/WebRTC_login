import React, { Component } from "react";

export default class ModalSignin extends Component {
  render() {
    return (
      <div
        className="modal fade"
        id="exampleModal1"
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
                <span style={{ color: "#007791" }}>V</span>icon welcome <br />
                back
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
              <div className="form-group pt-1">
                <label htmlFor="inputEmailSignup">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="inputEmailSignup"
                  placeholder="Email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="inputPassSignup">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="inputPassSignup"
                  placeholder="Password"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-success" id="btnsecond">
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
