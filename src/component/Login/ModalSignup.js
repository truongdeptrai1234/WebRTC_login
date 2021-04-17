import React, { Component } from "react";
import axios from "axios";

export default class ModalSignup extends Component {
  state = {
    fields: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmpass: "",
    },
    errors: {},
  };

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
    // alert(this.state.fields[field]);
  }

  handleValidation() {
    let fields = this.state.fields;
    let errors = this.state.errors;
    let formIsValid = true;

    //Name
    // if (!fields["name"]) {
    //   formIsValid = false;
    //   errors["name"] = "Cannot be empty";
    // }

    // if (typeof fields["name"] !== "undefined") {
    //   if (!fields["name"].match(/^[a-zA-Z]+$/)) {
    //     formIsValid = false;
    //     errors["name"] = "Only letters";
    //   }
    // }

    if (!(fields["password"] === fields["confirmpass"])) {
      errors["confirmpass"] = "Password doesn't match";
      formIsValid = false;
    }
    this.setState({ errors });
    return formIsValid;
  }

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.handleValidation()) {
      const user = {
        email: this.state.fields["email"],
        firstName: this.state.fields["firstName"],
        lastName: this.state.fields["lastName"],
        password: this.state.fields["password"],
      };

      axios
        .post("https://webrtc-api.ddns.net/auth/signup", user)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          if (res.status < 300 && res.status > 199) {
            alert("Account created! Please login.");
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
    } else {
      alert(Object.values(this.state.errors));
    }
  };

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
              <form id="formname" onSubmit={this.handleSubmit}>
                <div className="form-row">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="First name"
                      id="fn"
                      onChange={this.handleChange.bind(this, "firstName")}
                      required
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last name"
                      id="ln"
                      onChange={this.handleChange.bind(this, "lastName")}
                      required
                    />
                  </div>
                </div>
                <div className="form-group pt-1">
                  <label htmlFor="inputEmail">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="inputEmail"
                    placeholder="Email"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    onChange={this.handleChange.bind(this, "email")}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="inputPass">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="inputPass"
                    placeholder="Password"
                    onChange={this.handleChange.bind(this, "password")}
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
                    onChange={this.handleChange.bind(this, "confirmpass")}
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-success"
                    id="btnfirst"
                  >
                    Sign up
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
