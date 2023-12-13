import { useState, useEffect } from "react";
import "../styles/Navbar.css";
import "../index.css";
import Login from './Login';
import Signup from './Signup';
import axios from "axios";
import {ReactComponent as Logout} from '../icons/logout.svg';
import { SiMoneygram } from "react-icons/si";
import {firebaseApp} from '../firebaseConfig';
import { getAuth, onAuthStateChanged} from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import {usersCollection} from '../firebaseConfig';
const auth = getAuth(firebaseApp);


function Navbar(props) 
{
    const userJWTToken = JSON.parse(localStorage.getItem('expenseTrackerUserJWTToken'));
    const userFirebaseRefId = JSON.parse(localStorage.getItem('expenseTrackerUserFirebaseRefId'));
    const [showLoginForm, setShowLoginForm] = useState(false);
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
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/user`, config);
            setUser(response.data.user);
            // console.log(response.data.user);
        }
        catch (error)
        {
            console.error("Error fetching data:", error);
        }
    };

    const fetchUserFromFirebase = async (docrefId) => 
    {
        try 
        {
            const userDocRef = doc(usersCollection, docrefId);
            const userDocSnapshot = await getDoc(userDocRef);
        
            if (userDocSnapshot.exists()) 
            {
                const userData = userDocSnapshot.data();
                console.log("Document data:", userData);
                setUser(userData);
            } else {
                console.log("No such document!");
                return null;
            }
        } 
        catch (error) 
        {
            console.error("Error fetching user from Firestore:", error);
            return null;
        }
    };

    useEffect(() =>
    {
        if (userJWTToken)
        {
            fetchDataFromProtectedAPI(userJWTToken);
        }
        if (userFirebaseRefId)
        {
            console.log(userFirebaseRefId);
            fetchUserFromFirebase(userFirebaseRefId);
        }
    }, [userJWTToken, userFirebaseRefId]);


    const handleLogout = () =>
    {
        localStorage.removeItem('expenseTrackerUserJWTToken');
        localStorage.removeItem('expenseTrackerUserFirebaseRefId');
        window.location.reload();
    }


    return (
        <div className="navbar_parent z-10 absolute top-0 text-white">
            <h1 className="flex gap-2 items-center"><SiMoneygram />SPENDWISE</h1>
            {userJWTToken || userFirebaseRefId?
                <div className="profile_container">
                    <h4>{user?.name?.split(' ')[0]}</h4>
                    <Logout className="logout_icon" onClick={handleLogout}/>
                </div>
                :
                <div className="login_signup_container">
                    <button onClick={()=>{setShowLoginForm(true); props.setShowSignupForm(false)}}>Login</button>
                    <button onClick={()=>{props.setShowSignupForm(true); setShowLoginForm(false)}}>Signup</button>
                </div>
            }

            {showLoginForm &&
                <div className="login_parent"  onClick={()=> setShowLoginForm(false)}><Login/></div>
            }

            {props.showSignupForm &&
                <div className="signup_parent"  onClick={()=> props.setShowSignupForm(false)}><Signup/></div>
            }
        </div>
    );
}

export default Navbar;
