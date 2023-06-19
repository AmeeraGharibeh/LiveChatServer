import "./NamesList.css";
import { Link } from "react-router-dom";

export default function NamesList() {
  return (
    <div className='namesList'> <div className="addButtonContainer">
        <Link to="/newname">
          <button className="nameAddButton">اضافة اسم</button>
        </Link>
      </div></div>
  )
}
