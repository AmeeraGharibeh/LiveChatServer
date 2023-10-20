import {
  getLogsStart,
  getLogsSuccess,
  getLogsFailure,
  deleteLogsStart,
  deleteLogsSuccess,
  deleteLogsFailure,
} from "../LogsRedux";
import { initializeUserRequest } from "../../apiRequest";

export const getLogs = async (dispatch, page) => {
  dispatch(getLogsStart());
  console.log(page + " page");
  initializeUserRequest()
    .then(async (Request) => {
      const val = await Request.get(`logs/?page=${page}&limit=${10}`);
      dispatch(getLogsSuccess(val.data));
    })
    .catch((err) => {
      dispatch(getLogsFailure(err.response["data"]));
    });
};

export const deleteLogs = async (dispatch) => {
  dispatch(deleteLogsStart());
  initializeUserRequest()
    .then(async (Request) => {
      const val = await Request.delete(`logs/`);
      dispatch(deleteLogsSuccess(val.data));
    })
    .catch((err) => {
      dispatch(deleteLogsFailure(err.response["data"]));
    });
};
