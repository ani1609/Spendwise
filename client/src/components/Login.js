import {useState} from 'react';
import '../index.css';
import '../styles/Login.css';
import axios from "axios";


import search from '../icons/search.svg';

function Login()
{
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);



    const handleLogin = async (e) =>
    {
        e.preventDefault();
        setLoading(true);
        console.log('button press')
        try
        {
            // const response = await axios.post(${process.env.REACT_APP_SERVER_PORT}/api/users/login, loginData);
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/users/login`, loginData);
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
            setLoading(false);
            if (error.response.status === 401)
            {
                setInvalidEmail(true);
                return;
            }
            console.error(error);
        }
        finally
        {
            setLoading(false);
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

                
                <button type='submit' style={{ width: '100%', cursor: loading ? 'not-allowed' : 'pointer' }} disabled={loading}>
                    {loading ? (
                        <div className="loading-spinner"></div> 
                    ) : (
                        'Log in' // Note: 'Log in' should be a string
                    )}
                </button>
                <h4>OR</h4>
                <button type='submit' style={{ width: '100%' }} id = "button2"> <img src={search}/>Continue with Google</button>


                

            </form>
        </div>
    );
}

export default Login;


