import "./ProtectedNamesList.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from '../../../Components/DataTable/DataTable';
import { deleteNameUser, getUserByType } from "../../../Redux/Repositories/UsersRepo";
import { DeleteOutline } from "@mui/icons-material";

export default function RootsList() {

  const users = useSelector((state)=> state.user.usersByType);
  const totalRows = useSelector(state => state.user.total);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(()=> {
    
    getUserByType( "protected", currentPage, 10, dispatch);
  }, [dispatch, currentPage])

  const columns = [
  {
    Header: 'ID',
    accessor: '_id',
  },
  {
    Header: 'Name',
    accessor: 'username',
     Cell: ({cell}) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={cell.row.original.pic} alt="" />
            {cell.row.original.username}
          </div>
        );
      },
  },
  {
    Header: 'type',
    accessor: 'name_type',
  },
   {
      accessor: 'action',
      Header: 'Action',
      width: 200,
      Cell: ({cell}) => {
        return (
          <>
                <span
                    className="userListEdit"
                    onClick={() => handleEdit(cell.row.original._id)}
                  >
                    Edit
                  </span>
                  <DeleteOutline
                    className="userListDelete"
                    onClick={() => showAlert(cell.row.original._id)}
                  />  
          </>
        );
      },
    },
];


 const handleEdit = (id) => {
    navigate(`/edituser/protected/${id}`);
  };

  function showAlert(id) {
  const result = window.confirm('هل أنت متأكد من حذف هذا العضو؟');
  if (result) {
    deleteNameUser(id, dispatch);
  } 
}


  return (
    <div className='rootsList'>
       <div className="addButtonContainer">
          <Link to="/newUser/protected">
          <button className="rootAddButton">اضافة اسم محمي</button>
        </Link>
      </div>
    <div>
      <DataTable 
      columns={columns} 
      data={users} 
      totalRows= {totalRows}
      current={currentPage}
      onNext={() => {
          setCurrentPage(currentPage + 1) }} 
      onPrev={() => {
          setCurrentPage(currentPage - 1)}}/>
    </div>
      </div>
  )
}
