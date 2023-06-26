import { loginFailure, loginStart, loginSuccess , logout,
        getAdminsStart, getAdminsSuccess, getAdminsFailure,
        signupStart, signupSuccess, signupFailure,
        updateAdminStart, updateAdminSuccess, updateAdminFailure} from "../AuthRedux";
import { publicRequest, userRequest } from "../../apiRequest";


export const login = async (dispatch, user) => {
  dispatch(loginStart());
    await publicRequest.post("/auth/login", user).then(val => {
    console.log(val.data);
     const expirationTime = Date.now() + 3600000; // 1 hour
    localStorage.setItem('tokenExpiration', expirationTime.toString());
    dispatch(loginSuccess(val.data));      
    }).catch(err => {
    dispatch(loginFailure(err.response.data));
    });

};
export const checkTokenExpiration = (token) => {
  const expirationTime = localStorage.getItem('tokenExpiration');
  if (!expirationTime || Date.now() > parseInt(expirationTime)) {
    throw new Error('Token expired');
  }
};
export const logoutUser = (dispatch) => {
    localStorage.removeItem('tokenExpiration');
  dispatch(logout());
};

export const checkAuthState = () => (dispatch) => {
  try {
    checkTokenExpiration();
  } catch (error) {
    dispatch(logout());
  }
}; 

export const getAllAdmins = async (dispatch) => {
  dispatch(getAdminsStart());
    await publicRequest.get("/auth/getadmins").then(val => {
    console.log(val.data);
    dispatch(getAdminsSuccess(val.data));      
    }).catch(err => {
    dispatch(getAdminsFailure(err.response.data));
    });
};

export const addAdmin = async (user, dispatch) => {
  dispatch(signupStart());
    await userRequest.post(`auth/signup`, user).then(val => {
    console.log(val.data);
    dispatch(signupSuccess(val.data));
    }).catch(err=> {
    dispatch(signupFailure(err.response.data));
    });
};

export const updateAdmin = async (id, user, dispatch) => {
  dispatch(updateAdminStart());
  await userRequest.put(`auth/updateadmin/${id}`, user).then(val => {
        console.log(val.data);
    dispatch(updateAdminSuccess(val.data));
  }).catch(err=> {
    console.log(err.response.data)
        dispatch(updateAdminFailure(err.response.data));
  });
};