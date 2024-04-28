import "./UserList.css";
import { DeleteOutline } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteNameUser, deleteUser, getUsers } from "../../../Redux/Repositories/UsersRepo";
import { toast, ToastContainer } from 'react-toastify';
import { resetUserState } from "../../../Redux/UsersRedux";
import DataTable from '../../../Components/DataTable/DataTable'




export default function UserList() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const totalRows = useSelector((state) => state.user.total);
  const success = useSelector((state) => state.user.success);
  const error = useSelector((state) => state.user.error);
  const rooms = useSelector((state) => state.room.rooms);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(resetUserState());
  }, []);

  useEffect(() => {
    getUsers(currentPage, 10, dispatch);
    console.log(users.length)
  }, [dispatch, currentPage]);

  function showAlert(id, type) {
    const result = window.confirm('هل أنت متأكد من حذف هذا العضو؟');
    if (result) {
     type === '-' ? deleteUser(id, dispatch) : deleteNameUser(id, dispatch);
    }
  }


  const columns = [
    { accessor: '_id', Header: 'ID', width: 120 },
    {
      accessor: 'username',
      Header: 'User',
      width: 250,
      Cell: ({cell}) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={cell.row.original.pic} alt="" />
            {cell.row.original.username}
          </div>
        );
      },
    },
   
    { accessor: 'user_type', Header: 'User Type' },
    { accessor: 'name_type', Header: 'Name Type' },
    {
      accessor: 'action',
      Header: 'Action',
      width: 200,
      Cell: ({cell}) => {
        return (
          <>
                  <DeleteOutline
                    className="userListDelete"
                    onClick={() => showAlert(cell.row.original._id, cell.row.original.name_type)}
                  />  
          </>
        );
      },
    },
  ];

  const handleNextPage = (currentPage) => {
    if (currentPage < totalRows / 10) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = (currentPage) => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="userList">
        <DataTable
          columns={columns}
          data={users}
          onNext={handleNextPage}
          onPrev={handlePreviousPage}
          totalRows={totalRows}
          current={currentPage}
        />
      </div>
    </>
  );
}
