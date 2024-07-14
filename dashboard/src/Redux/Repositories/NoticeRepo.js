import { initializeUserRequest } from "../../apiRequest";
import {
  getNoticeReportsStart,
  getNoticeReportsSuccess,
  getNoticeReportsFailure,
  deleteNoticeReportsStart,
  deleteNoticeReportsSuccess,
  deleteNoticeReportsFailure,
} from "../NoticeRedux";

export const getNoticeReports = async (page, limit, dispatch) => {
  dispatch(getNoticeReportsStart());
  initializeUserRequest()
    .then(async (Request) => {
      const val = await Request.get(`notice/?page=${page}&limit=${limit}`);
      dispatch(getNoticeReportsSuccess(val.data));
    })
    .catch((err) => {
      dispatch(getNoticeReportsFailure(err.response));
    });
};

export const deleteReports = async (id, dispatch) => {
  dispatch(deleteNoticeReportsStart());
  initializeUserRequest()
    .then(async (Request) => {
      await Request.delete(`notice/${id}`);
      dispatch(deleteNoticeReportsSuccess(id));
    })
    .catch((err) => {
      console.log(err.response.data.msg);
      dispatch(deleteNoticeReportsFailure(err.response.data.msg));
    });
};
