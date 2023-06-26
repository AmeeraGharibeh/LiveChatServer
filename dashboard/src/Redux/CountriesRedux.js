import { createSlice } from '@reduxjs/toolkit'

export const CountriesSlice = createSlice({
    name: 'countries',
    initialState : {
        countries: [],
        isFetching: false,
        error: null,
        isSuccess: false,
        page : 0,
        limit : 0,
        totalRows : 0,
    },
    reducers: {
        getCountryStart: (state)=> {
            state.isFetching = true
            state.error = null
        },
        getCountrySuccess: (state, action) =>{
            state.isFetching = false
            state.error = null
            state.countries = action.payload.countries;
            state.page = action.payload['current_page']
            state.limit = action.payload['per_page']
            state.totalRows = action.payload['total']
        },
          getCountryFailure: (state, action)=> {
            state.isFetching = false
            state.error = action.payload.msg
        },

         deleteCountryStart: (state)=> {
            state.isFetching = true
            state.error = null
        },
        deleteCountrySuccess: (state, action) =>{
            state.isFetching = false
            state.isSuccess = true
            state.error = null
            state.countries.splice(
                state.countries.findIndex((item)=> item._id === action.payload), 1
            )
        },
          deleteCountryFailure: (state, action)=> {
            state.isFetching = false
            state.isSuccess = false
            state.error = action.payload.msg
        },

         addCountryStart: (state)=> {
            state.isFetching = true
            state.error = null
        },
        addCountrySuccess: (state, action) =>{
            state.isFetching = false
            state.error = null
            state.countries.push(action.payload)
            state.isSuccess = true
        },
          addCountryFailure: (state, action)=> {
            state.isFetching = false
            state.isSuccess = false
            state.error = action.payload.msg
        },

         updateCountryStart: (state)=> {
            state.isFetching = true
            state.error = false
        },
        updateCountrySuccess: (state, action) =>{
            state.isFetching = false
            state.error = null
            state.isSuccess = true
            state.countries[state.countries.findIndex((item)=> item._id === action.payload._id)] = action.payload
        },
          updateCountryFailure: (state, action)=> {
            state.isFetching = false
            state.isSuccess = false
            state.error = action.payload.msg
        },
        resetCountryState : (state) => {
            state.isFetching = false
            state.error = null
            state.isSuccess = false            
        }
    }
});
export const { getCountryStart, getCountrySuccess, getCountryFailure, 
               deleteCountryStart, deleteCountrySuccess, deleteCountryFailure,
               addCountryStart, addCountrySuccess, addCountryFailure,
               updateCountryStart, updateCountrySuccess, updateCountryFailure, resetCountryState} = CountriesSlice.actions;
export default CountriesSlice.reducer;