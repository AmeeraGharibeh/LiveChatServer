import "./NoticeList.css";
import { DeleteOutline } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReports, getNoticeReports } from "../../Redux/Repositories/NoticeRepo";
import { toast, ToastContainer } from 'react-toastify';
import DataTable from '../../Components/DataTable/DataTable'
import { resetNoticeReportsState } from "../../Redux/NoticeRedux";




export default function NoticeList() {
  const dispatch = useDispatch();
  const noticeReports = useSelector((state) => state.notice.reports);
  const totalRows = useSelector((state) => state.notice.total);
  const success = useSelector((state) => state.notice.success);
  const error = useSelector((state) => state.notice.error);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(resetNoticeReportsState());
  }, []);

  useEffect(() => {
    getNoticeReports(currentPage, 10, dispatch);
    console.log(noticeReports.length)
  }, [dispatch, currentPage]);

  function showAlert(id) {
    const result = window.confirm('هل أنت متأكد من حذف التبليغ؟');
    if (result) {
     deleteReports(id, dispatch) ;
    }
  }


  const columns = [
    { accessor: '_id', Header: 'ID', width: 120 },
    {
      accessor: 'noticed_username',
      Header: 'Username',
      width: 250,
      Cell: ({cell}) => {
        return (
          <div className="noticeListNotice">
            {cell.row.original.noticed_username}
          </div>
        );
      },
    },
   
    { accessor: 'noticed_device', Header: 'Device' },
    { accessor: 'noticed_ip', Header: 'IP ' },
        { accessor: 'report_date', Header: 'Date ' },

    {
      accessor: 'action',
      Header: 'Action',
      width: 200,
      Cell: ({cell}) => {
        return (
          <>
                  <DeleteOutline
                    className="noticeListDelete"
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
          data={noticeReports}
          onNext={handleNextPage}
          onPrev={handlePreviousPage}
          totalRows={totalRows}
          current={currentPage}
        />
      </div>
    </>
  );
}
