import Navbar from "./Components/Navbar/Navbar.jsx";
import Sidebar from "./Components/Sidebar/Sidebar.jsx";
import './App.css'
import Home from "./Pages/Home/Home.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserList from "./Pages/UserPages/UsersList/UserList.jsx";
import User from "./Pages/UserPages/User/User.jsx";
import NewUser from "./Pages/UserPages/NewUser/NewUser.jsx";
import RoomsList from "./Pages/RoomPages/RoomsList/RoomsList.jsx";
import Room from "./Pages/RoomPages/Room/Room.jsx";
import NewRoom from "./Pages/RoomPages/NewRoom/NewRoom.jsx";
import Login from "./Pages/Login/Login.jsx";
import React from "react";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import CountriesList from "./Pages/CountryPages/CountriesList/CountriesList.jsx";
import NewCountry from "./Pages/CountryPages/NewCountry/NewCountry.jsx";
import Country from "./Pages/CountryPages/Country/Country.jsx";
import NamesList from "./Pages/NamePages/NamesList/NamesList.jsx";
import RootsList from "./Pages/RootPages/RootsList/RootsList.jsx";
import NewName from "./Pages/NamePages/NewName/NewName.jsx";
import NewRoot from "./Pages/RootPages/NewRoot/NewRoot.jsx";
import SupportPage from "./Pages/SupportPages/SupportPage/SupportPage.jsx"
import BlockedPage from "./Pages/BlockedPages/BlockedList/BlockedList.jsx"
import ReportPage from "./Pages/SupportPages/ReportPage/ReportPage.jsx"
import { checkAuthState } from "./Redux/Repositories/AuthRepo.js";



function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
const navigate = useNavigate();
useEffect(() => {
    const checkUser = async()=> {
      try {
        if (currentUser ){
          navigate('/');
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    }
    checkUser();
  }, [currentUser]);

useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  return (
        <>
      <Routes>
      <Route exact path="/login" element={<Login />} />
       </Routes>
        {currentUser && (
          <>
      <Navbar/>
    <div className="container">
    <Sidebar/>
    <Routes>
              <Route exact path="/" element={<Home />} />

              <Route exact path="/user" element={<UserList />} />
              <Route exact path="/user/:userId" element={  <User />} />
              <Route exact path="/newUser" element={  <NewUser />} />

              <Route exact path="/rooms" element={  <RoomsList />} />
              <Route exact path="/room/:roomId" element={  <Room />} />
              <Route exact path="/newroom" element={  <NewRoom />} />
              
              <Route exact path="/countries" element={  <CountriesList />} />
              <Route exact path="/newcountry" element={  <NewCountry />} />
              <Route exact path="/country/:countryId" element={  <Country />} />

              <Route exact path="/roots" element={  <RootsList />} />
              <Route exact path="/newroot" element={  <NewRoot />} />

              <Route exact path="/names" element={  <NamesList />} />
              <Route exact path="/newname" element={  <NewName />} />

              <Route exact path="/support" element={  <SupportPage />} />
              <Route exact path="/reports" element={  <ReportPage />} />
              <Route exact path="/blocked" element={  <BlockedPage />} />


        </Routes>
 </div>
</>
        )}  
        </>
  );
}

export default App;
