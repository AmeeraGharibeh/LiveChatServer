import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: null,
    isFetching: false,
    error: false,
    msg: null,
    admins: [],
    success : null,
  },

  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
    },
    loginFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.msg = action.payload.msg
    },
    logout: (state) => {
      state.currentUser = null;
    },
    getAdminsStart: (state) => {
      state.isFetching = true
      state.error = false
    },
    getAdminsSuccess: (state, action) =>{
      state.isFetching = false
      state.admins = action.payload.admins
   },
    
    getAdminsFailure: (state, action)=> {
      state.isFetching = false
      state.error = true
      state.success = false
      state.msg = action.payload.msg
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
      state.error = true;
      state.msg = action.payload.msg
    },
    updateAdminStart: (state)=> {
      state.isFetching = true
      state.error = false
    },
    updateAdminSuccess: (state, action) =>{
      state.isFetching = false
      state.success = true
      state.error = false
      state.admins[state.admins.findIndex((item)=> item._id === action.payload.id)] = action.payload.data
    },
    updateAdminFailure: (state, action)=> {
      state.isFetching = false
      state.error = true
      state.success = false
      state.msg = action.payload.msg
        },   
      resetAuthState: (state)=> {
      state.isFetching = false
      state.error = false
      state.success = false
      state.msg = null
        } 
  },
});

export const { loginStart, loginSuccess, loginFailure, logout,
              getAdminsStart, getAdminsSuccess, getAdminsFailure,
              signupStart, signupSuccess, signupFailure,
              updateAdminStart, updateAdminSuccess, updateAdminFailure, resetAuthState } = AuthSlice.actions;
export default AuthSlice.reducer; 