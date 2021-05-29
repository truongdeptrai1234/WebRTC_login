import React from 'react'
import Header from "./component/Login/Header";
import About from "./component/Login/About";
import ModalSignin from "./component/Login/ModalSignin";
import Logout from "./component/Login/Logout";
import ModalSignup from "./component/Login/ModalSignup";
import { VideoCall } from './component/Home/VideoCall'
import Home from "./component/Home/Home";
import "./App.css";
import FriendList from "./component/Home/FriendList";

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Header />
            <Home />
          </Route>
          <Route exact path="/about">
            <Header />
            <About />
          </Route>
          <Route exact path="/signup">
            <Header />
            <ModalSignup />
          </Route>
          <Route exact path="/login">
            <Header />
            <ModalSignin />
          </Route>
          <Route exact path="/logout">
            <Header />
            <Logout />
          </Route>
          <Route exact path="/videocall">
            <Header />
            <VideoCall />
          </Route>
          <Route exact path="/friends">
            <Header />
            <FriendList />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

