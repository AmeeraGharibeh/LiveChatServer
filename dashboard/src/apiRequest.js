import axios from "axios";

const BASE_URL = "https://syriachatserver.onrender.com/";

const storedValue = localStorage.getItem("persist:root");
let Token = "";

if (storedValue) {
  const parsedValue = JSON.parse(storedValue);

  const currentUser = JSON.parse(parsedValue.auth);
      console.log(currentUser)

  if (currentUser !== null) {
    Token = currentUser.currentUser['accessToken'];
  } 
}

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});
export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { authorization: `Bearer ${Token}` },
});
