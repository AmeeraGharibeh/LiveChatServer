import './Sidebar.css';
import { Link } from "react-router-dom";

import {LineStyle,  PersonOutline, PublicOutlined, ForumOutlined, Star, Block, Help, Flag} from '@mui/icons-material'
import { useState } from 'react';

export default function Sidebar() {
  const [index, setIndex] = useState(1);
  return (
    <div className='sidebar'>
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h5 className="saidbarTitle">Main panel</h5>
          <ul className="sidebarList">
            <Link to="/" className="link">
            <li className="sidebarListItem" onClick={() => {setIndex(1)}}>
              <LineStyle/>
            <div className='label'>لوحة التحكم
            {index === 1 && <div className="active"></div>}
            </div>
            </li></Link>
                <Link to="/user" className="link">
            <li className="sidebarListItem" onClick={() => {setIndex(2)}}><PersonOutline/>
            <div className='label'>
            إدارة المستخدمين
            {index === 2 && <div className="active"></div>}
            </div></li></Link>
               <Link to="/countries" className="link">
            <li className="sidebarListItem" onClick={() => {setIndex(3)}}><PublicOutlined/>
            <div className='label'>
            إدارة الشبكات
           {index === 3 && <div className="active"></div>}
            </div></li></Link>
            <Link to="/rooms" className="link">
            <li className="sidebarListItem" onClick={() => {setIndex(4)}}><ForumOutlined/>
            <div className='label'>
            إدارة الغرف
           {index === 4 && <div className="active"></div>}
            </div></li></Link>
     {      /*  <Link to="/roots" className="link">
            <li className="sidebarListItem" onClick={() => {setIndex(5)}}><Star/>
            <div className='label'>
            اسماء الروت
           {index === 5 && <div className="active"></div>}
            </div></li></Link>
            <Link to="/names" className="link">
            <li className="sidebarListItem" onClick={() => {setIndex(6)}}><Star/>
            <div className='label'>
            الأسماء المسجلة
           {index === 6 && <div className="active"></div>}
  </div></li></Link>*/}
             <Link to="/blocked" className="link">
            <li className="sidebarListItem" onClick={() => {setIndex(5)}}><Block/>
            <div className='label'>
           الأعضاء المحضورين
           {index === 5 && <div className="active"></div>}
            </div></li></Link>
             <Link to="/support" className="link">
            <li className="sidebarListItem" onClick={() => {setIndex(6)}}><Help/>
            <div className='label'>
            الدعم الفني
           {index === 6 && <div className="active"></div>}
            </div></li></Link>
             <Link to="/reports" className="link">
            <li className="sidebarListItem" onClick={() => {setIndex(7)}}><Flag/>
            <div className='label'>
            التبليغات
           {index === 7 && <div className="active"></div>}
            </div></li></Link>
          </ul>
        
        </div>
      </div>
    
    </div>
  )
}
