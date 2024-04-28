import {
  getUsersStart,
  getUsersSuccess,
  getUsersByTypeSuccess,
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
import { publicRequest, initializeUserRequest } from "../../apiRequest";

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
export const getUserByType = async (type, page, limit, dispatch) => {
  dispatch(getUsersStart());
  const res = await publicRequest.get(
    `users/type/?type=${type}&page=${page}&limit=${limit}`
  );
  try {
    console.log(res.data);
    dispatch(getUsersByTypeSuccess(res.data));
  } catch (err) {
    dispatch(getUsersFailure(res.data));
  }
};
export const deleteUser = async (id, dispatch) => {
  dispatch(deleteUserStart());
  initializeUserRequest()
    .then(async (Request) => {
      await Request.delete(`users/${id}`);
      dispatch(deleteUserSuccess(id));
    })
    .catch((err) => {
      console.log(err.response.data.msg);
      dispatch(deleteUserFailure(err.response.data.msg));
    });
};

export const deleteNameUser = async (id, dispatch) => {
  dispatch(deleteUserStart());
  initializeUserRequest()
    .then(async (Request) => {
      await Request.delete(`users/name/${id}`);
      dispatch(deleteUserSuccess(id));
    })
    .catch((err) => {
      console.log(err.response.data.msg);
      dispatch(deleteUserFailure(err.response.data.msg));
    });
};
export const addUser = async (user, dispatch) => {
  dispatch(addUserStart());
  try {
    initializeUserRequest().then(async (Request) => {
      const val = await Request.post(`users/name/`, user);
      console.log(val.data.user);
      dispatch(addUserSuccess(val.data.user));
    });
  } catch (err) {
    dispatch(addUserFailure({ msg: "فشلت اضافة المستخدم" }));
  }
};

export const updateUser = async (id, user, dispatch) => {
  dispatch(updateUserStart());
  initializeUserRequest()
    .then(async (Request) => {
      const val = await Request.put(`users/name/${id}`, user);
      dispatch(updateUserSuccess(val.data.msg));
    })
    .catch((err) => {
      dispatch(updateUserFailure(err.response.data));
    });
};
