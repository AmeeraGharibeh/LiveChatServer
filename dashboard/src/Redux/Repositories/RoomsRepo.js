import { getRoomsStart, getRoomsSuccess, getRoomsFailure,
   deleteRoomStart, deleteRoomSuccess, deleteRoomFailure,
   addRoomsStart, addRoomsSuccess, addRoomsFailure,
  updateRoomsStart, updateRoomsSuccess, updateRoomsFailure } from "../RoomsRedux";
import { publicRequest, userRequest } from "../../apiRequest";


export const getRooms = async (page, limit, dispatch) => {
  dispatch(getRoomsStart());
    await publicRequest.get(`rooms/?page=${page}&limit=${limit}`).then(val => {
    console.log(val.data);
    dispatch(getRoomsSuccess(val.data));      
    }).catch(err => {
    dispatch(getRoomsFailure(err.response.data));
    });
};

export const getRoomsByID = async (id, dispatch) => {
  dispatch(getRoomsStart());
    await publicRequest.get(`rooms/${id}`).then(val => {
    console.log(val.data);
    dispatch(getRoomsSuccess(val.data));        
      }).catch(err => {
    dispatch(getRoomsFailure(err.response.data));
      });
};

export const deleteRooms = async (id, dispatch) => {
  dispatch(deleteRoomStart());
    await userRequest.delete(`rooms/${id}`).then(val => {
    console.log(val.data);
    dispatch(deleteRoomSuccess(id));      
    }).catch(err => {
    dispatch(deleteRoomFailure(err.response.data));
    });
};

export const addRoom = async (room, dispatch) => {
  dispatch(addRoomsStart());
    await userRequest.post(`rooms/`, room).then(val => {
    console.log(val.data);
    dispatch(addRoomsSuccess(val.data));      
    }).catch(err => {
     dispatch(addRoomsFailure(err.response.data));
    });
};

export const updateRooms = async (id, Rooms, dispatch) => {
  dispatch(updateRoomsStart());
    await userRequest.put(`rooms/${id}`, Rooms).then(val => {
    console.log(val.data);
    dispatch(updateRoomsSuccess(val.data));
    }).catch(err => {
    dispatch(updateRoomsFailure(err.response.data));
    });
};