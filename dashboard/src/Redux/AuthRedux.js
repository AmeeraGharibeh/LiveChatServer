import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: null,
    isFetching: false,
    error: null,
    admins: [],
    isAuth : false,
  },

  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
      state.error = null;
      state.isAuth = true;
    },
    loginFailure: (state, action) => {
      state.isFetching = false;
      state.error = action.payload.msg
    },
    logout: (state) => {
     state.isFetching = false;
      state.isAuth = false;
      state.currentUser = null;
      state.error = null;
    },
    getAdminsStart: (state) => {
      state.isFetching = true
      state.error = null
    },
    getAdminsSuccess: (state, action) =>{
      state.isFetching = false
      state.admins = action.payload.admins
   },
    
    getAdminsFailure: (state, action)=> {
      state.isFetching = false
      state.success = false
      state.error = action.payload.msg
        },
    signupStart: (state) => {
      state.isFetching = true;
    },
    signupSuccess: (state, action) => {
      state.isFetching = false;
      state.admins.push(action.payload)
    },
    signupFailure: (state, action) => {
      state.isFetching = false;
      state.error = action.payload.msg
    },
    updateAdminStart: (state)=> {
      state.isFetching = true
      state.error = null
    },
    updateAdminSuccess: (state, action) =>{
      state.isFetching = false
      state.success = true
      state.error = null
      state.admins[state.admins.findIndex((item)=> item._id === action.payload.id)] = action.payload.data
    },
    updateAdminFailure: (state, action)=> {
      state.isFetching = false
      state.success = false
      state.error = action.payload.msg
        },   
      resetAuthState: (state)=> {
      state.isFetching = false
      state.error = null
      state.success = false
        } 
  },
});

export const { loginStart, loginSuccess, loginFailure, logout,
              getAdminsStart, getAdminsSuccess, getAdminsFailure,
              signupStart, signupSuccess, signupFailure,
              updateAdminStart, updateAdminSuccess, updateAdminFailure, resetAuthState } = AuthSlice.actions;
export default AuthSlice.reducer; 