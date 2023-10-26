import './RoyalNamesList.css'
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
    
    getUserByType( "royal", currentPage, 10, dispatch);
  }, [dispatch, currentPage])

  const columns = [
  {
    Header: 'ID',
    accessor: '_id',
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
    navigate(`/edituser/royal/${id}`);
  };

  const handleDelete = (id) => {
    // Implement delete functionality here
  };

  return (
    <div className='rootsList'>
       <div className="addButtonContainer">
          <Link to="/newUser/royal">
          <button className="rootAddButton">اضافة اسم ملكي</button>
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

