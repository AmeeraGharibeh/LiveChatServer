import "./CountriesList.css";
import { DeleteOutline } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux'
import {deleteCountry, getCountries} from '../../../Redux/Repositories/CountriesRepo'
import { toast, ToastContainer } from 'react-toastify';
import { resetCountryState } from "../../../Redux/CountriesRedux";
import DataTable from '../../../Components/DataTable/DataTable';


export default function CountriesList() {
  const dispatch = useDispatch();
  const countries = useSelector((state)=> state.country.countries);
  const totalRows = useSelector(state => state.country.totalRows);
  const limit = useSelector((state)=> state.country.Limit);
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
    deleteCountry(id, dispatch);
  }
}
  const columns = [
    { accessor: "_id", Header: "ID", width: 100 },
  
    {
      accessor: "name_ar",
      Header: "Country",
      width: 150,
  
         Cell: ({ cell }) => { // Destructure the cell object
      return (
         <div className="countryListItem">
            <img className="countryListImg" src={cell.row.original.img_url} alt="img" />
            {cell.row.original.name_ar}
          </div>
      );
      },
    },
    { accessor: "rooms_count", Header: "Rooms", width: 150 },
    { accessor: "users_count", Header: "Users", width: 150 },
 
    {
      accessor: "action",
      Header: "Action",
      width: 150,
      Cell: ({cell}) => {
        return (
          <>
            <Link to={"/country/" + cell.row.original._id}>
              <button className="countryListEdit">Edit</button>
            </Link>
            <DeleteOutline 
              className="countryListDelete"
              onClick={() => showAlert(cell.row.original._id)}
           />

          </>
        );
      },
    },
  ];

  return (   
    <>
       <ToastContainer />
      <div className="countryList">
       <div className="addButtonContainer">
         <Link to="/newcountry">
          <button className="roomAddButton">اضافة دولة</button>
        </Link> 
       </div>
       {/* <DataTable data = {countries} itemsPerPage={10} /> */}
          <div>
      <DataTable
      columns={columns} 
      data={countries} 
      totalRows= {totalRows}
      current={currentPage}
      onNext={() => {
          setCurrentPage(currentPage + 1) }} 
      onPrev={() => {
          setCurrentPage(currentPage - 1)}}/>
    </div>
  {/* <DataGrid style={{padding: '0px 10px'}}
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
      />  */}
    </div>
    </>  
  
  );
}