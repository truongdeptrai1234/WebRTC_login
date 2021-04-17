import axios from "axios";

const newUser = (user) => {
  return axios.post("https://webrtc-api.ddns.net/auth/signup", user);
};

export { newUser };
