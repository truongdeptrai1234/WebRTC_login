import User from "./Newuser";
import { newUser } from "./callapi";

const getEle = (id) => document.getElementById(id);

getEle("btnfirst").addEventListener("click",()=> {
  const firstName = getEle("fn").value;
  const lastName = getEle("ln").value;
  const email = getEle("inputEmail").value;
  const pass = getEle("inputPass").value;
  const confirmPass = getEle("inputPassAgain").value;
  const user = new User("", firstName, lastName, email, pass, confirmPass);
  // console.log(user);
  newUser(user)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
});
