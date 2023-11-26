import {useState, useEffect} from 'react';
import '../index.css';
import '../styles/Login.css';
import axios from "axios";

function Login()
{
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });



    const handleLogin = async (e) =>
    {
        e.preventDefault();
        try
        {
            const response = await axios.post('https://spendwise-server.vercel.app/api/users/login', loginData);
            localStorage.setItem('expenseTrackerUserToken', JSON.stringify(response.data.token));
            setInvalidEmail(false);
            setLoginData({
                email: '',
                password: ''
            });
            window.location.reload();
        }
        catch(error)
        {
            if (error.response.status === 401)
            {
                setInvalidEmail(true);
                console.error(error.response.data.message);
                return;
            }
            console.error(error.response.data.message);
        }
    }




    return(
        <div className="login_form_container" onClick={(e)=> e.stopPropagation()}>
            <h1>Welcome Back</h1>
            <form onSubmit={handleLogin}>
                <input
                    type='email'
                    placeholder='Email'
                    value={loginData.email}
                    onChange={(e)=>setLoginData({...loginData, email: e.target.value})}
                    required
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={loginData.password}
                    onChange={(e)=>setLoginData({...loginData, password: e.target.value})}
                    required
                />
                {invalidEmail && <p className="error_message">Invalid email or password</p>}
                <button type='submit'>Log in</button>
            </form>
        </div>
    );
}

export default Login;