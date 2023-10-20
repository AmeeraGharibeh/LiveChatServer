import {
  getRoomsStart,
  getRoomsSuccess,
  getRoomsFailure,
  deleteRoomStart,
  deleteRoomSuccess,
  deleteRoomFailure,
  addRoomsStart,
  addRoomsSuccess,
  addRoomsFailure,
  updateRoomsStart,
  updateRoomsSuccess,
  updateRoomsFailure,
} from "../RoomsRedux";
import { publicRequest, initializeUserRequest } from "../../apiRequest";

export const getRooms = async (page, limit, dispatch) => {
  dispatch(getRoomsStart());
  await publicRequest
    .get(`rooms/?page=${page}&limit=${limit}`)
    .then((val) => {
      console.log(val.data);
      dispatch(getRoomsSuccess(val.data));
    })
    .catch((err) => {
      dispatch(getRoomsFailure(err.response.data));
    });
};

export const getRoomsByID = async (id, dispatch) => {
  dispatch(getRoomsStart());
  await publicRequest
    .get(`rooms/${id}`)
    .then((val) => {
      console.log(val.data);
      dispatch(getRoomsSuccess(val.data));
    })
    .catch((err) => {
      dispatch(getRoomsFailure(err.response.data));
    });
};

export const deleteRooms = async (id, dispatch) => {
  dispatch(deleteRoomStart());
  initializeUserRequest()
    .then(async (Request) => {
      const val = await Request.delete(`rooms/${id}`);
      console.log(val.data);
      dispatch(deleteRoomSuccess(id));
    })
    .catch((err) => {
      console.log(err.response.data);
      dispatch(deleteRoomFailure(err.response.data));
    });
};

export const addRoom = async (room, dispatch) => {
  dispatch(addRoomsStart());
  initializeUserRequest()
    .then(async (Request) => {
      const val = await Request.post(`rooms/`, room);
      dispatch(addRoomsSuccess(val.data));
    })
    .catch((err) => {
      console.log(err.response.data);
      dispatch(addRoomsFailure(err.response.data));
    });
};

export const updateRooms = async (id, Rooms, dispatch) => {
  dispatch(updateRoomsStart());
  initializeUserRequest()
    .then(async (Request) => {
      const val = await Request.put(`rooms/${id}`, Rooms);
      dispatch(updateRoomsSuccess(val.data));
    })
    .catch((err) => {
      console.log(err.response.data);
      dispatch(updateRoomsFailure(err.response.data));
    });
};
