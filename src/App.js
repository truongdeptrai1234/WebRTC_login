import logo from "./logo.svg";
import Header from "./component/Login/Header";
import LoginPage from "./component/Login/LoginPage";
import Banner from "./component/Login/Banner";
import ModalSignin from "./component/Login/ModalSignin";
import ModalSignup from "./component/Login/ModalSignup";
import VideoCall from "./component/Home/VideoCall";
import "./App.css";
import FriendList from "./component/Home/FriendList";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  PrivateRoute,
  ProtectedPage,
  Link,
  useParams,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Header />
            <Banner />
          </Route>
          <Route exact path="/login">
            <Header />
            <ModalSignin />
          </Route>
          <Route exact path="/signup">
            <Header />
            <ModalSignup />
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
