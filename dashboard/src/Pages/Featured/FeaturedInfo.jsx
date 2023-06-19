import './FeaturedInfo.css'
import {ArrowDownward, ArrowUpward} from '@material-ui/icons'
import { useEffect, useState } from 'react';
import { publicRequest, userRequest } from '../../apiRequest';

export default function FeaturedInfo(props) {
    const [income, setIncome] = useState([]);
  const [perc, setPerc] = useState(0);

  return (
    <div className='featured'>
        <div className="featuredItem">
            <span className="featuredTitle">المستخدمين</span>
            <div className="featuredMonyContainer">
                <span className='featuredMoney'>{props.users}</span>
            </div>

        </div>
          <div className="featuredItem">
            <span className="featuredTitle">الغرف</span>
            <div className="featuredMonyContainer">
                <span className='featuredMoney'>{props.rooms}</span>
            </div>
        </div>
          <div className="featuredItem">
            <span className="featuredTitle">الدول</span>
            <div className="featuredMonyContainer">
                <span className='featuredMoney'>{props.countries}</span>
            </div>
        </div>
    </div>
  )
}
