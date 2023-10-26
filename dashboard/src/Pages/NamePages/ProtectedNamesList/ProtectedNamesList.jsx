import "./ProtectedNamesList.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from '../../../Components/DataTable/DataTable';
import { getUserByType } from "../../../Redux/Repositories/UsersRepo";

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
    width: '50'
  },
  {
    Header: 'Name',
    accessor: 'username',
  },
  {
    Header: 'type',
    accessor: 'name_type',
  },
];


 const handleEdit = (id) => {
    navigate(`/edituser/protected/${id}`);
  };

  const handleDelete = (id) => {
  };

  return (
    <div className='rootsList'>
       <div className="addButtonContainer">
          <Link to="/newUser/protected">
          <button className="rootAddButton">اضافة اسم محمي</button>
        </Link>
      </div>
    <div>
      <DataTable columns={columns} data={users} 
      onEdit={handleEdit} 
      onDelete={handleDelete} 
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
