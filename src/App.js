import logo from "./logo.svg";
import Header from "./component/Login/Header";
import LoginPage from "./component/Login/LoginPage";
import Banner from "./component/Login/Banner";
import ModalSignin from "./component/Login/ModalSignin";
import ModalSignup from "./component/Login/ModalSignup";
import VideoCall from "./component/Home/VideoCall";
import "./App.css";

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
      <Header />
      <div>
        <Switch>
          <Route exact path="/">
            <Banner />
          </Route>
          <Route exact path="/login">
            <ModalSignin />
          </Route>
          <Route exact path="/signup">
            <ModalSignup />
          </Route>
          <Route exact path="/videocall">
            <VideoCall />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
