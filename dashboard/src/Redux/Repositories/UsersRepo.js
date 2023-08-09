import {
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  addUserStart,
  addUserSuccess,
  addUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../UsersRedux";
import { publicRequest, userRequest } from "../../apiRequest";

export const getUsers = async (page, limit, dispatch) => {
  dispatch(getUsersStart());
  try {
    const res = await publicRequest.get(`users/?page=${page}&limit=${limit}`);
    console.log(res.data);
    dispatch(getUsersSuccess(res.data));
  } catch (err) {
    console.log(err.response);
    dispatch(getUsersFailure(err.response));
  }
};

export const getUserByID = async (id, dispatch) => {
  dispatch(getUsersStart());
  const res = await publicRequest.get(`users/${id}`);
  try {
    console.log(res.data);
    dispatch(getUsersSuccess(res.data));
  } catch (err) {
    dispatch(getUsersFailure(res.data));
  }
};
export const deleteUser = async (id, dispatch) => {
  dispatch(deleteUserStart());
  await userRequest
    .delete(`users/${id}`)
    .then((val) => {
      console.log(val.data);
      dispatch(deleteUserSuccess(id));
    })
    .catch((err) => {
      console.log(err.response.data);
      dispatch(deleteUserFailure(err.response.data));
    });
};

export const addUser = async (user, dispatch) => {
  dispatch(addUserStart());
  try {
    const val = await userRequest.post(`users/name/`, user);
    dispatch(addUserSuccess(val.data));
  } catch (err) {
    dispatch(addUserFailure({ msg: "فشلت اضافة المستخدم" }));
  }
};

export const updateUser = async (id, user, dispatch) => {
  dispatch(updateUserStart());
  await userRequest
    .put(`users/${id}`, user)
    .then((val) => {
      console.log(val.data);
      dispatch(updateUserSuccess(val.data));
    })
    .catch((err) => {
      dispatch(updateUserFailure(err.response.data));
    });
};
