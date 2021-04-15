import logo from "./logo.svg";
import Header from "./component/Login/Header";
import LoginPage from "./component/Login/LoginPage";
import Banner from "./component/Login/Banner";
import ModalSignin from "./component/Login/ModalSignin";
import ModalSignup from "./component/Login/ModalSignup";
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
      <Banner />
      <ModalSignin />
      <ModalSignup />
      <div>
        <Switch>
          <Route exact path="/login">
            <LoginPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
