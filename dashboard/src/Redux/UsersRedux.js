import { createSlice } from "@reduxjs/toolkit";

export const UsersSlice = createSlice({
  name: "Users",
  initialState: {
    users: [],
    usersByType: [],
    isFetching: false,
    total: 0,
    limit: 0,
    success: null,
    error: null,
  },
  reducers: {
    getUsersStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    getUsersSuccess: (state, action) => {
      state.isFetching = false;
      state.error = null;
      state.users = action.payload.users;
      state.total = action.payload.total;
      state.limit = action.payload.per_page;
    },
    getUsersByTypeSuccess: (state, action) => {
      state.isFetching = false;
      state.error = null;
      state.usersByType = action.payload.users;
      state.total = action.payload.total;
      state.limit = action.payload.per_page;
    },
    getUsersFailure: (state, action) => {
      state.isFetching = false;
      state.success = false;
      state.error = action.payload.msg;
    },

    addUserStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    addUserSuccess: (state, action) => {
      state.isFetching = false;
      state.error = null;
      state.success = true;
      state.users.push(action.payload);
    },
    addUserFailure: (state, action) => {
      state.isFetching = false;
      state.success = false;
      state.error = action.payload.msg;
    },
    updateUserStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      state.isFetching = false;
      state.success = true;
      state.error = null;
      state.users[
        state.users.findIndex((item) => item._id === action.payload.id)
      ] = action.payload.data;
    },
    updateUserFailure: (state, action) => {
      state.isFetching = false;
      state.success = false;
      state.error = action.payload.msg;
    },

    deleteUserStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    deleteUserSuccess: (state, action) => {
      state.isFetching = false;
      state.error = null;
      state.success = true;
      state.users.splice(
        state.users.findIndex((item) => item._id === action.payload),
        1
      );
    },
    deleteUserFailure: (state, action) => {
      state.isFetching = false;
      state.success = false;
      state.null = action.payload.msg;
    },
    resetUserState: (state) => {
      state.isFetching = false;
      state.error = null;
      state.success = null;
    },
  },
});
export const {
  getUsersStart,
  getUsersSuccess,
  getUsersByTypeSuccess,
  getUsersFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  addUserStart,
  addUserSuccess,
  addUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  resetUserState,
} = UsersSlice.actions;
export default UsersSlice.reducer;
