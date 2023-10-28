import { useTable, usePagination } from "react-table";
import "./DataTable.css";
import { useEffect } from "react";

const DataTable = ({ columns, data, onNext, onPrev, totalRows, current }) => {
  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: 10 },
      },
      usePagination
    );
  useEffect(() => {
    console.log("current from data table page " + current);
  }, [current]);
  return (
    <div>
      <table {...getTableProps()} className="data-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination-wrapper">
        <span>{`page ${current} of ${Math.ceil(totalRows / 10)}`}</span>
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => onPrev(current)}
            disabled={current - 1 === 0}
          >
            Previous
          </button>
          <button
            className="pagination-btn"
            onClick={() => onNext(current)}
            disabled={current >= totalRows / 10}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
export default DataTable;
