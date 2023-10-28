import './Logs.css'
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux'
import { deleteLogs, getLogs } from '../../Redux/Repositories/LogsRepo'
import { toast, ToastContainer } from 'react-toastify';
import { resetLogsState } from '../../Redux/LogsRedux';
import DataTable from '../../Components/DataTable/DataTable';

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
        if(room){
          return room.room_name
        } 
        return '-'
      })
  const columns = [
    { accessor: "_id", Header: "ID", width: 120 },
    {
      accessor: "username",
      Header: "Username",
      width: 150,
    },
         {
      accessor: "ip",
      Header: "Device ID",
      width: 150,
    },
    { accessor: "room_id", Header: "Room", width: 150,
    Cell: ({cell}) => {
        return (
          <div >
              <span>{getRoom(cell.row.original.room_id)}</span>
          </div>
        );
      },    
},
      {
      accessor: "time_in",
      Header: "Time In",
      width: 170,
         Cell: ({cell}) => {
        return (
          <div >
              <span style={{'color': 'green'}}>{cell.row.original.time_in}</span>
          </div>
        );
      }, 
    },

    {
      accessor: "time_out",
      Header: "Time Out",
     width: 170,
    Cell: ({cell}) => {
        return (
          <div >
              <span style={{'color': 'red'}}>{cell.row.original.time_out}</span>
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
      <DataTable
       columns={columns}
       data={logs} 
      totalRows= {totalRows}
      current={currentPage} 
      onNext={() => {
          setCurrentPage(currentPage + 1) }} 
      onPrev={() => {
          setCurrentPage(currentPage - 1)}}/>
    </div>
       {success && toast.success('تم الحذف بنجاح')}
       <ToastContainer />
  </>
  );
}
