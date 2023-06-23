import { getCountryStart, getCountrySuccess, getCountryFailure,
   addCountryStart, addCountrySuccess, addCountryFailure,
  updateCountryStart, updateCountrySuccess, updateCountryFailure,
deleteCountryStart, deleteCountrySuccess, deleteCountryFailure } from "../CountriesRedux";
import { publicRequest, userRequest } from "../../apiRequest";


export const getCountries = async (dispatch, page, limit) => {
  dispatch(getCountryStart());
      await publicRequest.get(`country/?page=${page}&limit=${10}`).then(val => {
            dispatch(getCountrySuccess(val['data']));
      }).catch(err => {
            dispatch(getCountryFailure(err.response['data']));
      });
};


export const addCountry = async (country, dispatch) => {
  dispatch(addCountryStart());
      await userRequest.post(`country/`, country ).then(val => {
        console.log('res is ' + val['data']);
        dispatch(addCountrySuccess(val['data']));
      }).catch(err => {
        dispatch(addCountryFailure(err.response['data']));
      });
};

export const updateCountry = async (id, Country, dispatch) => {
  dispatch(updateCountryStart());
      await userRequest.put(`country/${id}`, Country).then(val =>{
      console.log(val['data']);
    dispatch(updateCountrySuccess(val['data']));
      }).catch(err=> {
      dispatch(updateCountryFailure(err.response['data']));
      });
};

export const deleteCountry = async (id, dispatch) => {
  dispatch(deleteCountryStart());
      await userRequest.delete(`country/${id}`).then(val => {
          console.log(val['data']);
    dispatch(deleteCountrySuccess(id));  
      }).catch( err => {
       dispatch(deleteCountryFailure(err.response['data']));
      });
};