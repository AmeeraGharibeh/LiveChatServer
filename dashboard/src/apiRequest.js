import axios from "axios";
const BASE_URL = "https://audio-video-chat-backend.onrender.com/";

// Define a function to retrieve the token from local storage.
const getTokenFromLocalStorage = () => {
  const storedValue = localStorage.getItem("persist:root");
  let Token = "";

  if (storedValue) {
    const parsedValue = JSON.parse(storedValue);
    const currentUser = JSON.parse(parsedValue.auth);

    if (currentUser.currentUser !== null) {
      Token = currentUser.currentUser["accessToken"];
    }
  }

  return Token;
};

export const initializeUserRequest = async () => {
  const Token = getTokenFromLocalStorage();

  const userRequest = axios.create({
    baseURL: BASE_URL,
    headers: { authorization: `Bearer ${Token}` },
  });

  return userRequest;
};

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
});
