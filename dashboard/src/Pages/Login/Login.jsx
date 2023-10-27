import { useState } from 'react';
import './Login.css'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../Redux/Repositories/AuthRepo'

export default function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.isFetching);
  const error = useSelector((state) => state.auth.error);

    const handleLogin = (e)=> {
      e.preventDefault();
      login(dispatch, { email: username, dashboard_password: password });
    };

  return (
    <div className='Login'>
        <div className="loginWrapper">
            <span>Email:</span>
            <input name='username' className= "input" type='text' placeholder="Enter your Email" onChange={(e)=> setUsername(e.target.value)}/>
            <span>password:</span>
            <input name='password' className= "input" type='password' placeholder="Enter your Password" onChange={(e)=> setPassword(e.target.value)}/>
            <button className="login-btn" onClick={handleLogin} disabled={loading}>{ !loading ? 'Login' : 'Logging in...'}</button>
            {error ? <div className='error'>{error}</div> : <div></div>}
        </div>
    </div>
  )
}
