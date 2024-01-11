import { createSlice } from "@reduxjs/toolkit";

export const ImagesSlice = createSlice({
  name: "images",
  initialState: {
    images: [],
    isFetching: false,
    error: null,
    isSuccess: false,
  },
  reducers: {
    getImageStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    getImageSuccess: (state, action) => {
      state.isFetching = false;
      state.error = null;
      state.images = action.payload.images;
    },
    getImageFailure: (state, action) => {
      state.isFetching = false;
      state.error = action.payload.msg;
    },

    deleteImageStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    deleteImageSuccess: (state, action) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.error = null;
      state.msg = action.payload.msg;
      state.images.splice(
        state.images.findIndex((item) => item._id === action.payload.id),
        1
      );
    },
    deleteImageFailure: (state, action) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.error = action.payload.msg;
    },

    resetImageState: (state) => {
      state.isFetching = false;
      state.error = null;
      state.isSuccess = false;
    },
  },
});
export const {
  getImageStart,
  getImageSuccess,
  getImageFailure,
  deleteImageStart,
  deleteImageSuccess,
  deleteImageFailure,
  resetImageState,
} = ImagesSlice.actions;
export default ImagesSlice.reducer;
