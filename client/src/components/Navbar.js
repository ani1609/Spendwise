import { useState, useEffect } from "react";
import "../styles/Navbar.css";
import "../index.css";
import Login from './Login';
import Signup from './Signup';
import axios from "axios";
import {ReactComponent as Logout} from '../icons/logout.svg';
import { SiMoneygram } from "react-icons/si";


function Navbar() 
{
    const userToken = JSON.parse(localStorage.getItem('expenseTrackerUserToken'));
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showSignupForm, setShowSignupForm] = useState(false);
    const [user, setUser] = useState({});

    const fetchDataFromProtectedAPI = async (userToken) => 
    {
        try 
        {
            const config = {
                headers: {
                Authorization: `Bearer ${userToken}`,
                },
            };
            const response = await axios.get("https://spendwise-server.vercel.app/api/user", config);
            setUser(response.data.user);
            // console.log(response.data.user);
        }
        catch (error)
        {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() =>
    {
        if (userToken)
        {
            fetchDataFromProtectedAPI(userToken);
        }
    }
    , [userToken]);


    const handleLogout = () =>
    {
        localStorage.removeItem('expenseTrackerUserToken');
        window.location.reload();
    }


    return (
        <div className="navbar_parent z-10 absolute top-0 text-white">
            <h1 className="flex gap-2 items-center"><SiMoneygram />SPENDWISE</h1>
            {userToken?
                <div className="profile_container">
                    <h4>{user?.name?.split(' ')[0]}</h4>
                    <Logout className="logout_icon" onClick={handleLogout}/>
                </div>
                :
                <div className="login_signup_container">
                    <button onClick={()=>{setShowLoginForm(true); setShowSignupForm(false)}}>Login</button>
                    <button onClick={()=>{setShowSignupForm(true); setShowLoginForm(false)}}>Signup</button>
                </div>
            }

            {showLoginForm &&
                <div className="login_parent"  onClick={()=> setShowLoginForm(false)}><Login/></div>
            }

            {showSignupForm &&
                <div className="signup_parent"  onClick={()=> setShowSignupForm(false)}><Signup/></div>
            }
        </div>
    );
}

export default Navbar;
