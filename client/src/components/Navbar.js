import { useState, useEffect } from "react";
import "../styles/Navbar.css";
import "../index.css";
import Login from "./Login";
import Signup from "./Signup";
import axios from "axios";
import { ReactComponent as UserProfile } from "../icons/profile.svg";
import { ReactComponent as Moon } from "../icons/moon.svg";
import { ReactComponent as Sun } from "../icons/sun.svg";
import { SiMoneygram } from "react-icons/si";
import { Link, redirect } from "react-router-dom";
import Profile from "./profile/Profile";
import { doc, getDoc } from "firebase/firestore";
import { usersCollection } from "../firebaseConfig";

function Navbar (props) {
  const userToken = JSON.parse(localStorage.getItem("expenseTrackerUserToken"));
  const userJWTToken = JSON.parse(localStorage.getItem("expenseTrackerUserJWTToken"));
  const userFirebaseRefId = JSON.parse(localStorage.getItem("expenseTrackerUserFirebaseRefId"));
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [user, setUser] = useState({});

  const [isDarkMode, setIsDarkMode] = useState(false);

  const fetchUserFromFirebase = async (docrefId) => {
    try {
      const userDocRef = doc(usersCollection, docrefId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        console.log("Document data:", userData);
        setUser(userData);
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user from Firestore:", error);
      return null;
    }
  };
  const fetchDataFromProtectedAPI = async (userToken) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      };
      // const response = await axios.get(`${process.env.REACT_APP_SERVER_PORT}/api/user`, config);
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/user`, config);
      setUser(response.data.user);
      // console.log(response.data.user);
    } catch (error) {
      console.error("Error fetching data:", error);
      localStorage.clear();
      window.location.reload();
    }
  };

  useEffect(() => {
    if (userToken) {
      if (userJWTToken) {
        fetchDataFromProtectedAPI(userToken);
      }
      if (userFirebaseRefId) {
        fetchDataFromProtectedAPI(userToken);
        console.log(userFirebaseRefId);
        fetchUserFromFirebase(userFirebaseRefId);
      }
    }
  }, [userJWTToken, userFirebaseRefId]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
        <div className="navbar_parent z-10 absolute top-0 text-white">
            <h1 className="flex flex-1 gap-2 items-center"><SiMoneygram />SPENDWISE</h1>
            <div className="flex gap-x-4">
                <div
                className="dark-mode-toggle text-xs flex flex-col items-center hover:cursor-pointer"
                onClick={toggleDarkMode}
                >
                    {!isDarkMode
                      ? (<>
                            <Moon fill="white" className="w-5 h-5"/>
                            <p>Dark Mode</p>
                        </>)
                      : (
                        <>
                            <Sun fill="white" className="tew-5 h-5"/>
                            <p>Light Mode</p>
                        </>)}
                </div>
                {userJWTToken || userFirebaseRefId
                  ? <div className="profile_container">
                        <Link to="/profile" className="items-center flex flex-col text-xs"> {/* Link to the /profile route */}
                            <UserProfile fill="white" className="w-5 h-5 "/>
                            <p>Profile</p>
                        </Link>
                    </div>
                  : <div className="login_signup_container">
                        <button onClick={() => { setShowLoginForm(true); props.setShowSignupForm(false); }}>Login</button>
                        <button onClick={() => { props.setShowSignupForm(true); setShowLoginForm(false); }}>Signup</button>
                    </div>
                }
            </div>

            {showLoginForm &&
                <div className="login_parent"><Login setShowLoginForm= {setShowLoginForm}/></div>
            }

            {props.showSignupForm &&
                <div className="signup_parent"><Signup setShowSignupForm= {props.setShowSignupForm}/></div>
            }
        </div>
  );
}

export default Navbar;
