import { useState, useEffect, useContext } from "react";
import "../styles/Navbar.css";
import "../index.css";
import Login from "./Login";
import Signup from "./Signup";
import { usersCollection } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { ReactComponent as Moon } from "../icons/moon.svg";
import { ReactComponent as Sun } from "../icons/sun.svg";
import { SiMoneygram } from "react-icons/si";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

function Navbar (props) {
  const userJWTToken = JSON.parse(localStorage.getItem("expenseTrackerUserJWTToken"));
  const userFirebaseRefId = JSON.parse(localStorage.getItem("expenseTrackerUserFirebaseRefId"));
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [user, setUser] = useState({});
  const { toggle, theme } = useContext(ThemeContext);

  const fetchUserFromFirebase = async (docrefId) => {
    try {
      const userDocRef = doc(usersCollection, docrefId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        console.log("User data from Firestore:", userData);
        setUser(userData);
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user from Firestore:", error);
      return null;
    }
  };

  useEffect(() => {
    if (userFirebaseRefId) {
      fetchUserFromFirebase(userFirebaseRefId);
    }
  }, [userJWTToken]);
  return (
        <div className="navbar_parent z-10 absolute top-0 text-white">
            <h1 className="flex flex-1 gap-2 items-center"><div className="moneygram-icon"><SiMoneygram/></div>SPENDWISE</h1>
            <div className="flex gap-x-4">
              {userJWTToken || userFirebaseRefId
                ? <div
                  className="dark-mode-toggle text-xs flex flex-col items-center hover:cursor-pointer"
                  onClick={toggle}
                  >
                    {(theme === "dark")
                      ? (<>
                            <Moon fill="white" className="w-10 h-10 p-1.5 box-border"/>
                        </>)
                      : (
                        <>
                            <Sun fill="white" className="w-10 h-10 p-1.5 box-border"/>
                        </>)}
                  </div>
                : null}
                {userJWTToken || userFirebaseRefId
                  ? <div className="profile_container">
                        <Link to="/profile" className="items-center flex flex-col text-xs"> {/* Link to the /profile route */}
                            <img src={user.profilePicture} alt="profile" className="rounded-full w-10 h-10 p-1 box-border" />
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
