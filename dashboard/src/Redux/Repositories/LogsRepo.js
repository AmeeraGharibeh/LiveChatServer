import { getLogsStart, getLogsSuccess, getLogsFailure,
deleteLogsStart, deleteLogsSuccess, deleteLogsFailure } from "../LogsRedux";
import { publicRequest, userRequest } from "../../apiRequest";


export const getLogs = async (dispatch, page) => {

  dispatch(getLogsStart());
  console.log(page + ' page')
      await userRequest.get(`logs/?page=${page}&limit=${10}`).then(val => {
            console.log(val.data)
            dispatch(getLogsSuccess(val.data));
      }).catch(err => {
            dispatch(getLogsFailure(err.response['data']));
      });
};
export const deleteLogs = async (dispatch) => {

  dispatch(deleteLogsStart());
      await userRequest.delete(`logs/`).then(val => {
            console.log(val.data)
            dispatch(deleteLogsSuccess(val.data));
      }).catch(err => {
            dispatch(deleteLogsFailure(err.response['data']));
      });
};