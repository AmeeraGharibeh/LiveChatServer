import './Logs.css'
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux'
import { deleteLogs, getLogs } from '../../Redux/Repositories/LogsRepo'
import { toast, ToastContainer } from 'react-toastify';
import { resetLogsState } from '../../Redux/LogsRedux';
export default function LogsPage() {

  const dispatch = useDispatch();
  const {logs, limit, totalRows} = useSelector((state)=> state.log);
  const rooms = useSelector((state)=> state.room.rooms)
  const [currentPage, setCurrentPage] = useState(1);
  const success = useSelector((state)=> state.log.isSuccess);
  useEffect(()=> {
    dispatch(resetLogsState());
  }, []);
  
  useEffect(()=> {
    getLogs(dispatch, currentPage);

  }, [dispatch, currentPage])


    function showAlert() {
  const result = window.confirm('هل انت متأكد من أنك تريد حذف جميع السجلات؟');
  if (result) {
    deleteLogs(dispatch);
  }
}

const getRoom = ((id)=> {
      const room = rooms.find(c => c._id === id);
        return room.room_name
      })
  const columns = [
    { field: "_id", headerName: "ID", width: 120 },
    {
      field: "username",
      headerName: "Username",
      width: 150,
    },
         {
      field: "ip",
      headerName: "Device ID",
      width: 150,
    },
    { field: "room_id", headerName: "Room", width: 150,
    renderCell: (params) => {
        return (
          <div >
              <span>{getRoom(params.row.room_id)}</span>
          </div>
        );
      },    
},
      {
      field: "time_in",
      headerName: "Time In",
      width: 170,
         renderCell: (params) => {
        return (
          <div >
              <span style={{'color': 'green'}}>{params.row.time_in}</span>
          </div>
        );
      }, 
    },

    {
      field: "time_out",
      headerName: "Time Out",
     width: 170,
    renderCell: (params) => {
        return (
          <div >
              <span style={{'color': 'red'}}>{params.row.time_out}</span>
          </div>
        );
      },     },
  ];

  return (     
  <>
    <div className="logsList">
    <div className="addButtonContainer">
        <button className='deleteButton' 
        onClick={() => showAlert()}>حذف جميع السجلات</button>
      </div>
        <DataGrid style={{padding: '0px 10px'}}
        rows={logs}
        columns={columns}
        getRowId= {(row) => row._id}
        //pageSizeOptions={[10]}
        pageSize={8}
        rowCount={totalRows}
        pagination= {true}
        page = {currentPage - 1}
        
        onPageChange={(params) => {
          setCurrentPage(params + 1)
        }}
    
      />
    </div>
       {success && toast.success('تم الحذف بنجاح')}
       <ToastContainer />
  </>
  );
}
