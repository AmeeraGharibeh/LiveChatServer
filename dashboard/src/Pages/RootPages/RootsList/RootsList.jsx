import './RootsList.css'
import { Link, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from '../../../Components/DataTable/DataTable';
import { getUserByType, deleteUser } from "../../../Redux/Repositories/UsersRepo";

export default function RootsList() {

  const users = useSelector((state)=> state.user.usersByType);
  const totalRows = useSelector(state => state.user.total);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(()=> {
    
    getUserByType( "root", currentPage, 10, dispatch);
    console.log('current from roots page ' + currentPage)
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
    navigate(`/edituser/root/${id}`);
  };


    function showAlert(id) {
  const result = window.confirm('هل أنت متأكد من حذف هذا العضو؟');
  if (result) {
    deleteUser(id, dispatch);
  }
}

  return (
    <div className='rootsList'>
       <div className="addButtonContainer">
          <Link to="/newUser/root">
          <button className="rootAddButton">اضافة روت</button>
        </Link>
      </div>
    <div>
      <DataTable columns={columns} data={users} 
      onEdit={handleEdit} 
      onDelete={showAlert} 
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
