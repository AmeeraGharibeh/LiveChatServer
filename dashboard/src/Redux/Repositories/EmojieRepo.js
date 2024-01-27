import {
  getEmojieStart,
  getEmojieSuccess,
  getEmojieFailure,
  addEmojieStart,
  addEmojieSuccess,
  addEmojieFailure,
  deleteEmojieStart,
  deleteEmojieSuccess,
  deleteEmojieFailure,
} from "../EmojieRedux";
import { publicRequest, initializeUserRequest } from "../../apiRequest";

export const getEmojies = async (dispatch) => {
  dispatch(getEmojieStart());
  await publicRequest
    .get(`emojies/`)
    .then((val) => {
      dispatch(getEmojieSuccess(val["data"]));
    })
    .catch((err) => {
      dispatch(getEmojieFailure(err.response["data"]));
    });
};

export const addEmojie = async (Emojie, dispatch) => {
  dispatch(addEmojieStart());
  console.log(Emojie);
  initializeUserRequest()
    .then(async (request) => {
      const val = await request.post(`emojies/`, Emojie);
      dispatch(addEmojieSuccess(val["data"]));
    })
    .catch((err) => {
      dispatch(addEmojieFailure(err.response["data"]));
    });
};

export const deleteEmojie = async (id, dispatch) => {
  dispatch(deleteEmojieStart());
  initializeUserRequest()
    .then(async (request) => {
      const val = await request.delete(`emojies/${id}`);
      console.log(val["data"]);
      dispatch(deleteEmojieSuccess(id));
    })
    .catch((err) => {
      dispatch(deleteEmojieFailure(err.response["data"]));
    });
};
