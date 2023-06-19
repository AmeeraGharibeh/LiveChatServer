import axios from "axios";

const BASE_URL = "http://live-chat-server-three.vercel.app/";

const storedValue = localStorage.getItem("persist:root");
let Token = "";

if (storedValue) {
  const parsedValue = JSON.parse(storedValue);

  const currentUser = JSON.parse(parsedValue.auth);
      console.log(currentUser)

  if (currentUser) {
    Token = currentUser.currentUser.accessToken;
    console.log(Token)
  }
}

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});
export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { authorization: `Bearer ${Token}` },
});
