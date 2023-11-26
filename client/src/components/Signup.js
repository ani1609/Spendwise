import { useState, useEffect } from "react";
import '../index.css';
import '../styles/Signup.css';
import axios from "axios";

function Signup()
{
    const [userExists, setUserExists] = useState(false);
    const [passwordUnmatched, setPasswordUnmatched] = useState(false);
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSignup = async (e) =>
    {
        e.preventDefault();
        console.log(signupData);
        try
        {
            if(signupData.password !== signupData.confirmPassword)
            {
                setPasswordUnmatched(true);
                console.error('Passwords do not match');
                return;
            }
            const response = await axios.post('https://spendwise-server.vercel.app/api/users/signup', {
                name: signupData.name+" ",
                email: signupData.email,
                password: signupData.password,
            });
            localStorage.setItem('expenseTrackerUserToken', JSON.stringify(response.data.token));
            setUserExists(false);
            setPasswordUnmatched(false);
            setSignupData({
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
            window.location.reload();
        }
        catch(error)
        {
            // if (error.response.status === 409)
            // {
            //     setUserExists(true);
            //     console.error(error.response.data.message);
            //     return;
            // }
            // console.error(error.response.data.message);
            console.log(error);
        }
    }



    return(
        <div className="signup_form_container">
            <h1>Create Your Account</h1>
            <form onSubmit={handleSignup}>
                <input 
                    type='text'
                    placeholder='Name'
                    value={signupData.name}
                    onChange={(e)=>setSignupData({...signupData, name: e.target.value})}
                    required
                />
                <input
                    type='email'
                    placeholder='Email'
                    value={signupData.email}
                    onChange={(e)=>setSignupData({...signupData, email: e.target.value})}
                    required
                />
                <input 
                    type='password'
                    placeholder='Password'
                    value={signupData.password}
                    onChange={(e)=>setSignupData({...signupData, password: e.target.value})}
                    required
                />
                <input
                    type='password'
                    placeholder='Confirm Password'
                    value={signupData.confirmPassword}
                    onChange={(e)=>setSignupData({...signupData, confirmPassword: e.target.value})}
                    required
                />
                <button type='submit' className='p-2 bg-violet-500'>Sign up</button>
            </form>
        </div>
    );
}

export default Signup;
