import { createSlice } from "@reduxjs/toolkit";

export const EmojiesSlice = createSlice({
  name: "emojies",
  initialState: {
    emojies: [],
    isFetching: false,
    error: null,
    isSuccess: false,
  },
  reducers: {
    getEmojieStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    getEmojieSuccess: (state, action) => {
      state.isFetching = false;
      state.error = null;
      state.emojies = action.payload.emojies;
    },
    getEmojieFailure: (state, action) => {
      state.isFetching = false;
      state.error = action.payload.msg;
    },

    deleteEmojieStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    deleteEmojieSuccess: (state, action) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.error = null;
      state.emojies.splice(
        state.emojies.findIndex((item) => item._id === action.payload),
        1
      );
    },
    deleteEmojieFailure: (state, action) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.error = action.payload.msg;
    },

    addEmojieStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    addEmojieSuccess: (state, action) => {
      state.isFetching = false;
      state.error = null;
      state.emojies.push(action.payload);
      state.isSuccess = true;
    },
    addEmojieFailure: (state, action) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.error = action.payload.msg;
    },

    resetEmojieState: (state) => {
      state.isFetching = false;
      state.error = null;
      state.isSuccess = false;
    },
  },
});
export const {
  getEmojieStart,
  getEmojieSuccess,
  getEmojieFailure,
  deleteEmojieStart,
  deleteEmojieSuccess,
  deleteEmojieFailure,
  addEmojieStart,
  addEmojieSuccess,
  addEmojieFailure,
  resetEmojieState,
} = EmojiesSlice.actions;
export default EmojiesSlice.reducer;
