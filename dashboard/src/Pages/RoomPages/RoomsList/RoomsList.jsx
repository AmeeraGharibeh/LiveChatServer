import "./RoomsList.css";
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutline } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux'
import { deleteRooms, getRooms} from '../../../Redux/Repositories/RoomsRepo'
import { resetRoomState } from "../../../Redux/RoomsRedux";
import { toast, ToastContainer } from 'react-toastify';
import DataTable from '../../../Components/DataTable/DataTable';

export default function RoomsList() {
  const dispatch = useDispatch();
  const rooms = useSelector((state)=> state.room.rooms)
  const countries = useSelector((state)=> state.country.countries)
  const [currentPage, setCurrentPage] = useState(1);
  const {isSuccess , error} = useSelector((state)=> state.room);

  useEffect(()=> {
    dispatch(resetRoomState());
  }, []);


  useEffect(()=> {
    getRooms(currentPage, 10, dispatch);

  }, [dispatch, currentPage])

    const getCountry = ((id)=> {
      const country = countries.find(c => c._id === id);
        return country.name_ar
      })

  function showAlert(id) {
  const result = window.confirm('هل انت متأكد من أنك تريد حذف هذه الغرفة؟');
  if (result) {
    deleteRooms(id, dispatch);
  }
}

  const columns = [
    { accessor: "_id", Header: "ID", width: 150 },

    {
      accessor: 'room_name',
      Header: 'Name',
      width: 250,
      Cell: ({cell}) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={cell.row.original.room_img} alt="" />
            {cell.row.original.room_name}
          </div>
        );
      },
    },
    {
      accessor: "room_country",
      Header: "Country",
      width: 120,
      Cell: ({cell}) => {
        return (
          <div >
              <span>{getCountry(cell.row.original.room_country)}</span>
          </div>
        );
      },
    },
     {
      accessor: "room_type",
      Header: "type",
      width: 120,
    },
     {
      accessor: "room_owner",
      Header: "Owner",
      width: 120,
    },
      {
      accessor: "email",
      Header: "Owner Email",
      width: 120,
    },

    {
      accessor: "action",
      Header: "Action",
      width: 150,
      Cell: ({cell}) => {
        return (
          <>
        { <Link to={"/room/" + cell.row.original._id}>
              <button className="roomsListEdit">Edit</button>
        </Link>}
            <DeleteOutline
              className="roomsListDelete"
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
    <div className="roomsList">
    <div className="addButtonContainer">
        <Link to="/newRoom">
          <button className="roomAddButton">اضافة غرفة</button>
        </Link>
      </div>
      <DataTable
      columns={columns} 
      data={rooms} 
      totalRows= {rooms.length}
      current={currentPage}
      onNext={() => {
          setCurrentPage(currentPage + 1) }} 
      onPrev={() => {
          setCurrentPage(currentPage - 1)}}/>
  
        {/* <DataGrid style={{padding: '0px 10px'}}
        rows={rooms}
        columns={columns}
        getRowId= {(row) => row._id}
        pageSize={8}
        onPageChange={(params) => {
          setCurrentPage(params + 1)
        }}
      /> */}
    </div>
  
  </>
  );
}