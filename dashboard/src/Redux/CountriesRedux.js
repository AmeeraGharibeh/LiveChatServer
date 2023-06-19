import { createSlice } from '@reduxjs/toolkit'

export const CountriesSlice = createSlice({
    name: 'countries',
    initialState : {
        countries: [],
        isFetching: false,
        error: false,
        isSuccess: false,
        msg: null,
        page : 0,
        limit : 0,
        totalRows : 0,
    },
    reducers: {
        getCountryStart: (state)=> {
            state.isFetching = true
            state.error = false
        },
        getCountrySuccess: (state, action) =>{
            state.isFetching = false
            state.countries = action.payload.countries;
            state.page = action.payload['current_page']
            state.limit = action.payload['per_page']
            state.totalRows = action.payload['total']
        },
          getCountryFailure: (state)=> {
            state.isFetching = false
            state.error = true
        },

         deleteCountryStart: (state)=> {
            state.isFetching = true
            state.error = false
        },
        deleteCountrySuccess: (state, action) =>{
            state.isFetching = false
            state.isSuccess = true
            state.countries.splice(
                state.countries.findIndex((item)=> item._id === action.payload), 1
            )
        },
          deleteCountryFailure: (state, action)=> {
            state.isFetching = false
            state.error = true
            state.isSuccess = false
            state.msg = action.payload.msg
        },

         addCountryStart: (state)=> {
            state.isFetching = true
            state.error = false
        },
        addCountrySuccess: (state, action) =>{
            state.isFetching = false
            state.countries.push(action.payload)
            state.isSuccess = true
        },
          addCountryFailure: (state, action)=> {
            state.isFetching = false
            state.error = true
            state.isSuccess = false
            state.msg = action.payload.msg
        },

         updateCountryStart: (state)=> {
            state.isFetching = true
            state.error = false
        },
        updateCountrySuccess: (state, action) =>{
            state.isFetching = false
            state.isSuccess = true
            state.countries[state.countries.findIndex((item)=> item._id === action.payload._id)] = action.payload
        },
          updateCountryFailure: (state, action)=> {
            state.isFetching = false
            state.error = true
            state.isSuccess = false
            state.msg = action.payload.msg
        },
        resetCountryState : (state) => {
            state.isFetching = false
            state.error = false
            state.isSuccess = false            
        }
    }
});
export const { getCountryStart, getCountrySuccess, getCountryFailure, 
               deleteCountryStart, deleteCountrySuccess, deleteCountryFailure,
               addCountryStart, addCountrySuccess, addCountryFailure,
               updateCountryStart, updateCountrySuccess, updateCountryFailure, resetCountryState} = CountriesSlice.actions;
export default CountriesSlice.reducer;