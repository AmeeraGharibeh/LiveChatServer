import { createSlice } from "@reduxjs/toolkit";

export const RoomsSlice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
    sales_room: null,
    page: 0,
    limit: 0,
    totalRows: 0,
    isFetching: false,
    error: null,
    isSuccess: false,
  },
  reducers: {
    getRoomsStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    getRoomsSuccess: (state, action) => {
      state.isFetching = false;
      state.rooms = action.payload["Rooms"];
      state.page = action.payload["current_page"];
      state.limit = action.payload["per_page"];
      state.totalRows = action.payload["total"];
      state.error = null;
    },
    getRoomsFailure: (state, action) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.error = action.payload.msg;
    },

    getSalesRoomsStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    getSalesRoomsSuccess: (state, action) => {
      state.isFetching = false;
      state.sales_room = action.payload;
      state.error = null;
    },
    getSalesRoomsFailure: (state, action) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.error = action.payload.msg;
    },

    addRoomsStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    addRoomsSuccess: (state, action) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.rooms.push(action.payload);
      state.error = null;
    },
    addRoomsFailure: (state, action) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.error = action.payload.msg;
    },
    addSalesRoomsStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    addSalesRoomsSuccess: (state, action) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.sales_room.push(action.payload);
      state.error = null;
    },
    addSalesRoomsFailure: (state, action) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.error = action.payload.msg;
    },

    updateRoomsStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    updateRoomsSuccess: (state, action) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.error = null;
      state.rooms[
        state.rooms.findIndex((item) => item._id === action.payload.id)
      ] = action.payload.data;
    },
    updateRoomsFailure: (state, action) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.error = action.payload.msg;
    },
    resetRoomSuccess: (state, action) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.error = null;
      state.rooms[
        state.rooms.findIndex((item) => item._id === action.payload.id)
      ] = action.payload.data;
    },
    deleteRoomStart: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    deleteRoomSuccess: (state, action) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.error = null;
      state.rooms.splice(
        state.rooms.findIndex((item) => item._id === action.payload),
        1
      );
    },
    deleteRoomFailure: (state, action) => {
      state.isFetching = false;
      state.isSuccess = false;
      state.error = action.payload.msg;
    },
    resetRoomState: (state) => {
      state.isFetching = false;
      state.error = null;
      state.isSuccess = false;
    },
  },
});
export const {
  getRoomsStart,
  getRoomsSuccess,
  getRoomsFailure,
  getSalesRoomsStart,
  getSalesRoomsSuccess,
  getSalesRoomsFailure,
  addRoomsStart,
  addRoomsSuccess,
  addRoomsFailure,
  addSalesRoomsStart,
  addSalesRoomsSuccess,
  addSalesRoomsFailure,
  updateRoomsStart,
  updateRoomsSuccess,
  updateRoomsFailure,
  deleteRoomStart,
  deleteRoomSuccess,
  deleteRoomFailure,
  resetRoomState,
} = RoomsSlice.actions;
export default RoomsSlice.reducer;
