import React from 'react'
import './Navbar.css'
import { useDispatch } from 'react-redux'
import {ExitToApp, NotificationsNone, Settings} from '@material-ui/icons';
import { logoutUser } from '../../Redux/Repositories/AuthRepo';



export default function Navbar() {
    const dispatch = useDispatch();
    const handleLogout = (e)=> {
      e.preventDefault();
      logoutUser(dispatch);
    };
  return (
    <div className='navbar'>
        <div className="navbarWrapper">
            <div className="navbar-left">
                <span className='logo'>Live Chat</span>
            </div>
            <div className="navbar-right">
                    <div className="username" onClick={handleLogout}>
                      <div className="iconsWrapper">
                    <ExitToApp/>
                  </div>                   
                  <span>Logout</span>
                 </div>
                     
                  </div>
                </div>
                </div>
  )
}
