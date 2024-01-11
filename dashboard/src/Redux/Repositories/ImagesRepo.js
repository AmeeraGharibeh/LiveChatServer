import {
  getImageStart,
  getImageSuccess,
  getImageFailure,
  deleteImageStart,
  deleteImageSuccess,
  deleteImageFailure,
} from "../ImagesRedux";
import { initializeUserRequest, publicRequest } from "../../apiRequest";

export const getImages = async (dispatch, directory) => {
  dispatch(getImageStart());
  await publicRequest
    .get(`images/?${directory}`)
    .then((val) => {
      dispatch(getImageSuccess(val["data"]));
    })
    .catch((err) => {
      dispatch(getImageFailure(err.response["data"]));
    });
};

export const deleteImage = async (id, dispatch) => {
  dispatch(deleteImageStart());
  initializeUserRequest()
    .then(async (request) => {
      const val = await request.delete(`images/${id}`);
      console.log(val["data"]);
      dispatch(deleteImageSuccess(val["data"]));
    })
    .catch((err) => {
      dispatch(deleteImageFailure(err.response));
    });
};
