import "./RoomsList.css";
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutline } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux'
import { deleteRooms, getRooms} from '../../../Redux/Repositories/RoomsRepo'
import { resetRoomState } from "../../../Redux/RoomsRedux";

export default function RoomsList() {
  const dispatch = useDispatch();
  const rooms = useSelector((state)=> state.room.rooms)
  const countries = useSelector((state)=> state.country.countries)
  const [currentPage, setCurrentPage] = useState(1);
 
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
    { field: "_id", headerName: "ID", width: 120 },

    { field: "room_name", headerName: "Name", width: 200 },
    {
      field: "room_country",
      headerName: "Country",
      width: 150,
      renderCell: (params) => {
        return (
          <div >
              <span>{getCountry(params.row.room_country)}</span>
          </div>
        );
      },
    },
     {
      field: "room_owner",
      headerName: "Owner",
      width: 160,
    },
      {
      field: "email",
      headerName: "Owner Email",
      width: 160,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/room/" + params.row._id}>
              <button className="roomsListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="roomsListDelete"
              onClick={() => showAlert(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (     
    <div className="roomsList">
    <div className="addButtonContainer">
        <Link to="/newRoom">
          <button className="roomAddButton">اضافة غرفة</button>
        </Link>
      </div>
        <DataGrid style={{padding: '0px 10px'}}
        rows={rooms}
        columns={columns}
        getRowId= {(row) => row._id}
        pageSize={8}
        onPageChange={(params) => {
          setCurrentPage(params + 1)
        }}
      />
    </div>
  );
}