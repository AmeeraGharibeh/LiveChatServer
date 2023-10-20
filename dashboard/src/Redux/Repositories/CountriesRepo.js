import {
  getCountryStart,
  getCountrySuccess,
  getCountryFailure,
  addCountryStart,
  addCountrySuccess,
  addCountryFailure,
  updateCountryStart,
  updateCountrySuccess,
  updateCountryFailure,
  deleteCountryStart,
  deleteCountrySuccess,
  deleteCountryFailure,
} from "../CountriesRedux";
import { publicRequest, initializeUserRequest } from "../../apiRequest";

export const getCountries = async (dispatch, page, limit) => {
  dispatch(getCountryStart());
  await publicRequest
    .get(`country/?page=${page}&limit=${10}`)
    .then((val) => {
      dispatch(getCountrySuccess(val["data"]));
    })
    .catch((err) => {
      dispatch(getCountryFailure(err.response["data"]));
    });
};

export const addCountry = async (country, dispatch) => {
  dispatch(addCountryStart());
  console.log(country);
  initializeUserRequest()
    .then(async (request) => {
      const val = await request.post(`country/`, country);
      dispatch(addCountrySuccess(val["data"]));
    })
    .catch((err) => {
      dispatch(addCountryFailure(err.response["data"]));
    });
};

export const updateCountry = async (id, Country, dispatch) => {
  dispatch(updateCountryStart());
  initializeUserRequest()
    .then(async (request) => {
      const val = await request.put(`country/${id}`, Country);
      dispatch(updateCountrySuccess(val["data"]));
    })
    .catch((err) => {
      dispatch(updateCountryFailure(err.response["data"]));
    });
};

export const deleteCountry = async (id, dispatch) => {
  dispatch(deleteCountryStart());
  initializeUserRequest()
    .then(async (request) => {
      const val = await request.delete(`country/${id}`);
      console.log(val["data"]);
      dispatch(deleteCountrySuccess(id));
    })
    .catch((err) => {
      dispatch(deleteCountryFailure(err.response["data"]));
    });
};
