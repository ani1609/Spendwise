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
import { LogOut } from "lucide-react";

function Navbar(props) {
  const userJWTToken = JSON.parse(
    localStorage.getItem("expenseTrackerUserJWTToken")
  );
  const userFirebaseRefId = JSON.parse(
    localStorage.getItem("expenseTrackerUserFirebaseRefId")
  );
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

  const handleLogOut = () => {
    localStorage.removeItem("expenseTrackerUserFirebaseRefId");
    window.location.href = "/";
  };

  return (
    <div className="navbar_parent h-[5rem] z-10 absolute px-10 top-0 text-white w-full flex justify-between items-center max-md:px-[30px] max-sm:px-[10px]">
      <a
        href="https://spendwise-two.vercel.app/"
        className="flex justify-center gap-2 items-center"
      >
        <SiMoneygram className="w-9 h-9 max-md:w-8 max-md:h-8 max-sm:w-7 max-sm:h-7" />
        <span>SPENDWISE</span>
      </a>
      <div className="flex gap-x-4 max-sm:gap-x-2 justify-center items-center">
        {userFirebaseRefId ? (
          <div className="p-2 cursor-pointer" onClick={toggle}>
            {theme === "dark" ? (
              <>
                <Moon
                  fill="white"
                  className="w-8 h-8 max-md:w-7 max-md:h-7 max-sm:w-6 max-sm:h-6"
                />
              </>
            ) : (
              <>
                <Sun
                  fill="white"
                  className="w-8 h-8 max-md:w-7 max-md:h-7 max-sm:w-6 max-sm:h-6"
                />
              </>
            )}
          </div>
        ) : null}
        {userFirebaseRefId && (
          <div className="p-2 cursor-pointer" onClick={handleLogOut}>
            <LogOut className="w-8 h-8 max-md:w-7 max-md:h-7 max-sm:w-6 max-sm:h-6" />
          </div>
        )}
        {userFirebaseRefId ? (
          <div className="profile_container">
            {/* <Link to="/profile" className="items-center flex flex-col text-xs"> */}
            {/* Link to the /profile route */}
            <div className="p-2">
              <img
                src={user.profilePicture}
                alt="profile"
                className="rounded-full w-8 h-8 max-md:w-7 max-md:h-7 max-sm:w-6 max-sm:h-6 select-none"
              />
            </div>
            {/* </Link> */}
          </div>
        ) : (
          <div className="login_signup_container">
            <button
              onClick={() => {
                setShowLoginForm(true);
                props.setShowSignupForm(false);
              }}
            >
              Login
            </button>
            <button
              onClick={() => {
                props.setShowSignupForm(true);
                setShowLoginForm(false);
              }}
            >
              Signup
            </button>
          </div>
        )}
      </div>

      {showLoginForm && (
        <div className="login_parent">
          <Login setShowLoginForm={setShowLoginForm} />
        </div>
      )}

      {props.showSignupForm && (
        <div className="signup_parent">
          <Signup setShowSignupForm={props.setShowSignupForm} />
        </div>
      )}
    </div>
  );
}

export default Navbar;
