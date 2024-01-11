import {
  loginFailure,
  loginStart,
  loginSuccess,
  logout,
  getAdminsStart,
  getAdminsSuccess,
  getAdminsFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  updateAdminStart,
  updateAdminSuccess,
  updateAdminFailure,
} from "../AuthRedux";
import { publicRequest, initializeUserRequest } from "../../apiRequest";
import jwtDecode from "jwt-decode";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  await publicRequest
    .post("/auth/login", user)
    .then((val) => {
      console.log(val.data);
      const expirationTime = Date.now() + 3600000; // 1 hour
      localStorage.setItem("tokenExpiration", expirationTime.toString());
      localStorage.setItem("persist:root", JSON.stringify(val.data));

      dispatch(loginSuccess(val.data));
    })
    .catch((err) => {
      dispatch(loginFailure(err.response.data));
    });
};
const isTokenExpired = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    if (!decodedToken || !decodedToken.exp) {
      return true;
    }
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    return true;
  }
};
export const logoutUser = (dispatch) => {
  localStorage.removeItem("tokenExpiration");
  dispatch(logout());
};

export const checkAuthState = (token) => (dispatch) => {
  if (isTokenExpired(token)) {
    dispatch(logout());
  }
};

export const getAllAdmins = async (dispatch) => {
  dispatch(getAdminsStart());
  await publicRequest
    .get("/auth/getadmins")
    .then((val) => {
      console.log(val.data);
      dispatch(getAdminsSuccess(val.data));
    })
    .catch((err) => {
      dispatch(getAdminsFailure(err.response.data));
    });
};

export const addAdmin = async (user, dispatch) => {
  dispatch(signupStart());
  initializeUserRequest()
    .then(async (request) => {
      const val = await request.post(`auth/signup`, user);
      console.log(val.data);
      dispatch(signupSuccess(val.data));
    })
    .catch((err) => {
      dispatch(signupFailure(err.response.data));
    });
};

export const updateAdmin = async (id, user, dispatch) => {
  dispatch(updateAdminStart());
  initializeUserRequest()
    .then(async (request) => {
      console.log("admin is " + JSON.stringify(user));
      const val = await request.put(`auth/updateadmin/${id}`, user);
      console.log(val.data);
      dispatch(updateAdminSuccess(val.data));
    })
    .catch((err) => {
      console.log(err.response.data);
      dispatch(updateAdminFailure(err.response.data));
    });
};
