import { createSlice } from '@reduxjs/toolkit'

export const UsersSlice = createSlice({
    name: 'Users',
    initialState : {
        users: [],
        msg : null,
        isFetching :  false,
        total: 0,
        limit: 0,
        success : null,
        error: false,
    },
    reducers: { 
        getUsersStart: (state )=> {
            state.isFetching = true
            state.error = false
        },
        getUsersSuccess: (state, action) =>{

            state.isFetching = false
            state.users = action.payload.users
            state.total = action.payload.total
            state.limit = action.payload.per_page
        },
    
          getUsersFailure: (state, action)=> {
            state.isFetching = false
            state.error = true
            state.success = false
            state.msg = action.payload.msg
        },

         addUserStart: (state)=> {
            state.isFetching = true
            state.error = false
        },
        addUserSuccess: (state, action) =>{
            state.isFetching = false
            state.error = false
            state.success = true
            state.users.push(action.payload)

        },
          addUserFailure: (state, action)=> {
            state.isFetching = false
            state.error = true
            state.success = false
            state.msg = action.payload.msg
        },
          updateUserStart: (state)=> {
            state.isFetching = true
            state.error = false
        },
        updateUserSuccess: (state, action) =>{
            state.isFetching = false
            state.success = true
            state.error = false
            state.users[state.users.findIndex((item)=> item._id === action.payload.id)] = action.payload.data
        },
          updateUserFailure: (state, action)=> {
            state.isFetching = false
            state.error = true
            state.success = false
            state.msg = action.payload.msg
        },

         deleteUserStart: (state)=> {
            state.isFetching = true
            state.error = false
        },
        deleteUserSuccess: (state, action) =>{
            state.isFetching = false
            state.error = false
            state.success = true
            state.users.splice(
            state.users.findIndex((item)=> item._id === action.payload), 1
            )
        },
          deleteUserFailure: (state, action)=> {
            state.isFetching = false
            state.error = true
            state.success = false
            state.msg = action.payload.msg
        },
        resetUserState: (state)=> {
            state.isFetching = false
            state.error = false
            state.success = null
            state.msg = null
        }
    }
});
export const { getUsersStart, getUsersSuccess, getUsersFailure,
   deleteUserStart, deleteUserSuccess, deleteUserFailure,
   addUserStart, addUserSuccess, addUserFailure,
  updateUserStart, updateUserSuccess, updateUserFailure, resetUserState} = UsersSlice.actions;
export default UsersSlice.reducer;