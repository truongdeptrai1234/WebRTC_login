import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router";

 class ModalSignin extends Component {
  state = {
    fields: {
      email: "",
      password: "",
    },
    errors: {},
  };

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
    // alert(this.state.fields[field]);
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const user = {
      email: this.state.fields["email"],
      password: this.state.fields["password"],
    };

    axios
      .post("https://webrtc-api.ddns.net/auth/login", user)
      .then((res) => {
        console.log(res);
        console.log(res.data);
        if (res.status < 300 && res.status > 199) {
          this.props.history.push("/videocall");

          // alert("Login successful!");
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
  };

  render() {
    return (
      <div
        id="exampleModal1"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
      >
        <div className="modal-dialog" style={{ width: 350 }} role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title text-left font-weight-bold"
                id="exampleModalLabel"
              >
                <span style={{ color: "#007791" }}>V</span>icon welcome back
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
              <form onSubmit={this.handleSubmit} className="form-group pt-1">
                <label htmlFor="inputEmailSignup">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="inputEmailSignup"
                  placeholder="Email"
                  onChange={this.handleChange.bind(this, "email")}
                  required
                />
                <label htmlFor="inputPassSignup">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="inputPassSignup"
                  placeholder="Password"
                  onChange={this.handleChange.bind(this, "password")}
                  required
                />
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-success"
                    id="btnsecond"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ModalSignin);