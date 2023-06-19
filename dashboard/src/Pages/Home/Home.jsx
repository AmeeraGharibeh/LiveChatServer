import Chart from '../../Components/Chart/Chart'
import FeaturedInfo from '../Featured/FeaturedInfo'
import './Home.css'
import SmallWidget from "../../Components/SmallWidget/SmallWidget";
import LargeWidget from "../../Components/LargeWidget/LargeWidget";
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from "../../Redux/Repositories/UsersRepo";
import { getCountries } from "../../Redux/Repositories/CountriesRepo";
import { getRooms } from "../../Redux/Repositories/RoomsRepo";


export default function Home() {
    const [userStats, setUserStats] = useState([]);
    const dispatch = useDispatch();
  const users = useSelector((state)=> state.user.total);
  const rooms = useSelector((state)=> state.room.totalRows);
  const countries = useSelector((state)=> state.country.totalRows);


useEffect(()=> {

 getCountries(dispatch, 1, 10);
 getRooms(1, 10, dispatch);
 getUsers(1, 10, dispatch);

}, [dispatch])

  return (
       <div className='home'>
        <FeaturedInfo rooms = {rooms} countries = {countries} users = {users}/>
        <Chart data= {userStats} title= 'Users Analytics' grid dataKey ='Active User' />
        <div className="homWidgets">
          <SmallWidget/>
          <LargeWidget/>
        </div>
    </div>   
  )
}
