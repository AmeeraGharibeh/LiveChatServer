import { createSlice } from "@reduxjs/toolkit";

export const NoticeReportsSlice = createSlice({
  name: "Notice",
  initialState: {
    reports: [],
    isFetching: false,
    total: 0,
    limit: 0,
    success: null,
    error: null,
  },
  reducers: {
    getNoticeReportsStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    getNoticeReportsSuccess: (state, action) => {
      state.isFetching = false;
      state.error = null;
      state.reports = action.payload.reports;
      state.total = action.payload.total;
      state.limit = action.payload.per_page;
    },
    getNoticeReportsFailure: (state, action) => {
      state.isFetching = false;
      state.success = false;
      state.error = action.payload.msg;
    },

    deleteNoticeReportsStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    deleteNoticeReportsSuccess: (state, action) => {
      state.isFetching = false;
      state.error = null;
      state.success = true;
      state.reports.splice(
        state.reports.findIndex((item) => item._id === action.payload),
        1
      );
    },
    deleteNoticeReportsFailure: (state, action) => {
      state.isFetching = false;
      state.success = false;
      state.null = action.payload.msg;
    },
    resetNoticeReportsState: (state) => {
      state.isFetching = false;
      state.error = null;
      state.success = null;
    },
  },
});
export const {
  getNoticeReportsStart,
  getNoticeReportsSuccess,
  getNoticeReportsFailure,
  deleteNoticeReportsStart,
  deleteNoticeReportsSuccess,
  deleteNoticeReportsFailure,
  resetNoticeReportsState,
} = NoticeReportsSlice.actions;
export default NoticeReportsSlice.reducer;
