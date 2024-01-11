import './Backgrounds.css'
import ListBox from '../../../Components/ListBox/ListBox'

export default function Backgrounds() {
    function handleAddBackground (){}
    return(
        <div className='backgrounds-layout'>
           { //<ListBox items={items}/>
           }
           <div className='backgrounds-container'>
            <hr1>خلفيات الملكي</hr1>
            <button onClick={handleAddBackground()}>اضافة خلفية</button>
           </div>

            <div className='vip-backgrounds-container'>
                 <hr1>خلفيات الملكي VIP</hr1>
            <button onClick={handleAddBackground()}>اضافة خلفية</button>
            </div>

        </div>
    )
}