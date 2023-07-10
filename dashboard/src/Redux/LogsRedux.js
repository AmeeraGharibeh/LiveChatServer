import { createSlice } from '@reduxjs/toolkit'

export const LogsSlice = createSlice({
    name: 'logs',
    initialState : {
        logs: [],
        isFetching: false,
        error: null,
        isSuccess: false,
        page : 0,
        limit : 0,
        totalRows : 0,
    },
    reducers: {
        getLogsStart: (state)=> {
            state.isFetching = true
            state.error = null
        },
        getLogsSuccess: (state, action) =>{
            state.isFetching = false
            state.error = null
            state.logs = action.payload['Logs'];
            state.page = action.payload['current_page']
            state.limit = action.payload['per_page']
            state.totalRows = action.payload['total']
        },
          getLogsFailure: (state, action)=> {
            state.isFetching = false
            state.error = action.payload.msg
        },

         deleteLogsStart: (state)=> {
            state.isFetching = true
            state.error = null
        },
        deleteLogsSuccess: (state, action) =>{
            state.isFetching = false
            state.isSuccess = true
            state.error = null
            state.logs.splice(
                state.logs.findIndex((item)=> item._id === action.payload), 1
            )
        },
          deleteLogsFailure: (state, action)=> {
            state.isFetching = false
            state.isSuccess = false
            state.error = action.payload.msg
        },

        resetLogsState : (state) => {
            state.isFetching = false
            state.error = null
            state.isSuccess = false            
        }
    }
});
export const { getLogsStart, getLogsSuccess, getLogsFailure, 
               deleteLogsStart, deleteLogsSuccess, deleteLogsFailure, resetLogsState} = LogsSlice.actions;
export default LogsSlice.reducer;