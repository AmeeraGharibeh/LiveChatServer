import "./UserList.css";
import { DataGrid } from '@mui/x-data-grid'
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getUsers } from "../../../Redux/Repositories/UsersRepo";
import { toast, ToastContainer } from 'react-toastify';
import { resetUserState } from "../../../Redux/UsersRedux";

export default function UserList() {
  const dispatch = useDispatch();
  const users = useSelector((state)=> state.user.users);
  const totalRows = useSelector(state => state.user.total);
  const success = useSelector((state)=> state.user.success);
  const error = useSelector((state)=> state.user.error);
  const rooms = useSelector((state)=> state.room.rooms);
  const msg = useSelector((state) => state.user.msg);
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(()=> {
    dispatch(resetUserState());
  }, []);

  useEffect(()=> {
    console.log('data' + totalRows)
    getUsers(currentPage, 10, dispatch);
  }, [dispatch, currentPage])


  function showAlert(id) {
  const result = window.confirm('هل أنت متأكد من حذف هذا العضو؟');
  if (result) {
    deleteUser(id, dispatch);
  }
}
  const getRoom = ((id)=> {
  const room = rooms.find(c => c._id === id);
    return room.room_name
  });

  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    {
      field: "username",
      headerName: "User",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.pic} alt="" />
            {params.row.username}
          </div>
        );
      },
    },
    {
      field: "room_id",
      headerName: "Room",
      width: 150,
      renderCell: (params) => {
        return (
          <div >
              <span>{getRoom(params.row.room_id)}</span>
          </div>
        );
      },
    },
    { field: "user_type", headerName: "User Type", width: 120 },
    { field: "name_type", headerName: "Name Type", width: 120 },

    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/user/" + params.row._id}>
              <button className="userListEdit">تعديل</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => showAlert(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="userList">
      <div className="addButtonContainer">
        <Link to="/newUser">
          <button className="userAddButton">اضافة مستخدم</button>
        </Link>
      </div>
      <DataGrid style={{padding: '0px 10px'}}
        rows={users}
        disableSelectionOnClic
        columns={columns}
        getRowId= {(row) => row._id}
        pageSize={8}
        rowCount={10}
        page = {currentPage - 1}
        onPageChange={(params) => {
          setCurrentPage(params + 1)
        }}
      />
      {  error &&  toast.error(msg)}
      {success && toast.success('تم حذف المستخدم بنجاح')}
              <ToastContainer />
    </div>
  );
}