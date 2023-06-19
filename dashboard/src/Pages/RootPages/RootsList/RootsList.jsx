import './RootsList.css'
import { Link } from "react-router-dom";

export default function RootsList() {
  return (
    <div className='rootsList'> <div className="addButtonContainer">
        <Link to="/newroot">
          <button className="rootAddButton">اضافة روت</button>
        </Link>
      </div></div>
  )
}
