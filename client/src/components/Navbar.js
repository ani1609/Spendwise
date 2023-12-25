import { useState, useEffect } from "react";
import "../styles/Navbar.css";
import "../index.css";
import Login from "./Login";
import Signup from "./Signup";
import { ReactComponent as UserProfile } from "../icons/profile.svg";
import { ReactComponent as Moon } from "../icons/moon.svg";
import { ReactComponent as Sun } from "../icons/sun.svg";
import { SiMoneygram } from "react-icons/si";
import { Link } from "react-router-dom";

function Navbar (props) {
  const userJWTToken = JSON.parse(localStorage.getItem("expenseTrackerUserJWTToken"));
  const userFirebaseRefId = JSON.parse(localStorage.getItem("expenseTrackerUserFirebaseRefId"));
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
