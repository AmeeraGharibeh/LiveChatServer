import "./CountriesList.css";
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutline } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux'
import {deleteCountry, getCountries} from '../../../Redux/Repositories/CountriesRepo'
import { toast, ToastContainer } from 'react-toastify';
import { resetCountryState } from "../../../Redux/CountriesRedux";


export default function CountriesList() {
  const dispatch = useDispatch();
  const countries = useSelector((state)=> state.country.countries);
  const totalRows = useSelector(state => state.country.totalRows);
  const limit = useSelector((state)=> state.country.Limit);
  const success = useSelector((state)=> state.country.isSuccess);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(()=> {
    dispatch(resetCountryState());
  }, []);

  useEffect(()=> {
    getCountries(dispatch, currentPage, limit);
  }, [dispatch, currentPage])

  function showAlert(id) {
  const result = window.confirm('تنبيه: حذف الدولة سيؤدي الى حذف جميع الغرف التابعة لها والمستخدمين داخل هذه الغرف..');
  if (result) {
    // User clicked 'OK' button
    deleteCountry(id, dispatch);
  }
}
  const columns = [
    { field: "_id", headerName: "ID", width: 100 },
    {
      field: "img_url",
      headerName: "Picture",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="countryListItem">
            <img className="countryListImg" src={params.row.img_url} alt="img" />
          </div>
        );
      },
    },
    {
      field: "name_ar",
      headerName: "Country",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="countryListItem">
            {params.row.name_ar}
          </div>
        );
      },
    },
    { field: "rooms_count", headerName: "Rooms", width: 150 },
    { field: "users_count", headerName: "Users", width: 150 },
 
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/country/" + params.row._id}>
              <button className="countryListEdit">Edit</button>
            </Link>
            <DeleteOutline 
              className="countryListDelete"
              onClick={() => showAlert(params.row._id)}
           />

          </>
        );
      },
    },
  ];

  return (   
    <>
    
      <div className="countryList">
       <div className="addButtonContainer">
         <Link to="/newcountry">
          <button className="roomAddButton">اضافة دولة</button>
        </Link> 
       </div>
       {/* <DataTable data = {countries} itemsPerPage={10} /> */}
  <DataGrid style={{padding: '0px 10px'}}
        rows={countries}
        disableSelectionOnClic
        columns={columns}
        getRowId= {(row) => row._id}
        pageSize={10}
        pagination
        rowCount={totalRows}
        page = {currentPage - 1}
        onPageChange={(params) => {
          console.log(countries)
          setCurrentPage(params + 1)
        }}
      /> 
    </div>
       {success && toast.success('تم حذف الدولة بنجاح')}
       <ToastContainer />
    </>  
  
  );
}