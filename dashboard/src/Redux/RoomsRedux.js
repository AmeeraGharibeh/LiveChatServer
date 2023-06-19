import { createSlice } from '@reduxjs/toolkit'

export const RoomsSlice = createSlice({
    name: 'rooms',
    initialState : {
        rooms : [],
        page : 0,
        limit : 0,
        totalRows : 0,
        isFetching :  false,
        error : false,
        isSuccess: false,
        msg : null
    },
    reducers: { 
        getRoomsStart: (state )=> {
            state.isFetching = true
            state.error = false
        },
        getRoomsSuccess: (state, action) =>{
            state.isFetching = false
            state.rooms = action.payload['Rooms'];
            state.page = action.payload['current_page']
            state.limit = action.payload['per_page']
            state.totalRows = action.payload['total']
        },
    
          getRoomsFailure: (state, action)=> {
            state.isFetching = false
            state.error = true
            state.isSuccess = false
            state.msg = action.payload.msg
        },

         addRoomsStart: (state)=> {
            state.isFetching = true
            state.error = false
        },
        addRoomsSuccess: (state, action) =>{
            state.isFetching = false
            state.isSuccess = true
            state.rooms.push(action.payload)

        },
          addRoomsFailure: (state, action)=> {
            state.isFetching = false
            state.error = true
            state.isSuccess = false
            state.msg = action.payload.msg
        },

          updateRoomsStart: (state)=> {
            state.isFetching = true
            state.error = false
        },
        updateRoomsSuccess: (state, action) =>{
            state.isFetching = false
            state.isSuccess = true
            state.rooms[state.rooms.findIndex((item)=> item._id === action.payload.id)] = action.payload.data
        },
          updateRoomsFailure: (state, action)=> {
            state.isFetching = false
            state.error = true
            state.isSuccess = false
            state.msg = action.payload.msg
        },

         deleteRoomStart: (state)=> {
            state.isFetching = true
            state.error = false
        },
        deleteRoomSuccess: (state, action) =>{
            state.isFetching = false
            state.isSuccess = true
            state.rooms.splice(
                state.rooms.findIndex((item)=> item._id === action.payload), 1
            )
        },
          deleteRoomFailure: (state, action)=> {
            state.isFetching = false
            state.error = true
            state.isSuccess = false
            state.msg = action.payload.msg
        },
        resetRoomState: (state) => {
            state.isFetching = false
            state.error = false
            state.isSuccess = false           
        }
    }
});
export const { getRoomsStart, getRoomsSuccess, getRoomsFailure, 
               addRoomsStart, addRoomsSuccess, addRoomsFailure,
               updateRoomsStart, updateRoomsSuccess, updateRoomsFailure,
               deleteRoomStart, deleteRoomSuccess, deleteRoomFailure, resetRoomState} = RoomsSlice.actions;
export default RoomsSlice.reducer;