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
import { LogOut, Menu, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger,
} from "./ui/drawer";

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
        <SiMoneygram className="w-9 h-9 max-md:w-8 max-md:h-8 max-sm:w-7 max-sm:h-7 max-[400px]:w-6 max-[400px]:h-6" />
        <span>SPENDWISE</span>
      </a>
      <div className="flex gap-x-4 justify-center items-center max-md:hidden">
        {userFirebaseRefId && (
          <a
            className="p-2  cursor-pointer"
            href="https://github.com/ani1609/Spendwise"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-github"
              className="w-6 h-6 "
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
        )}
        {userFirebaseRefId && (
          <div className="p-2 cursor-pointer" onClick={toggle}>
            {theme === "dark" ? (
              <>
                <Moon fill="white" className="w-6 h-6" />
              </>
            ) : (
              <>
                <Sun fill="white" className="w-6 h-6" />
              </>
            )}
          </div>
        )}
        {userFirebaseRefId && (
          <div className="p-2 cursor-pointer" onClick={handleLogOut}>
            <LogOut className="w-6 h-6" />
          </div>
        )}
        {userFirebaseRefId ? (
          <div className="profile_container">
            {/* <Link to="/profile" className="items-center flex flex-col text-xs"> */}
            {/* Link to the /profile route */}
            <div className="p-1">
              <img
                src={user.profilePicture}
                alt="profile"
                className="rounded-full w-8 h-8 select-none"
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

      <Drawer>
        <DrawerTrigger className="md:hidden p-1">
          <Menu className="w-7 h-7" />
        </DrawerTrigger>
        <DrawerContent className="fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[4px] bg-primary-bg text-white">
          <DrawerHeader className="flex justify-start items-center gap-2 px-4 py-2">
            <SiMoneygram className="w-6 h-6" />
            <span className="text-xl">SPENDWISE</span>
            <DrawerClose className="ml-auto p-2">
              <X className="w-6 h-6" />
            </DrawerClose>
          </DrawerHeader>
          <DrawerDescription className="flex flex-col items-center justify-center gap-4 p-4">
            <a
              href="https://github.com/ani1609/Spendwise"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-github"
                className="w-6 h-6 "
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            {!userFirebaseRefId && (
              <DrawerClose>
                <div className="login_signup_container">
                  <button
                    onClick={() => {
                      setShowLoginForm(true);
                      props.setShowSignupForm(false);
                    }}
                  >
                    Login
                  </button>
                </div>
              </DrawerClose>
            )}
            {!userFirebaseRefId && (
              <DrawerClose>
                <div className="login_signup_container">
                  <button
                    onClick={() => {
                      props.setShowSignupForm(true);
                      setShowLoginForm(false);
                    }}
                  >
                    Signup
                  </button>
                </div>
              </DrawerClose>
            )}
            {userFirebaseRefId && (
              <>
                <div className="cursor-pointer p-2" onClick={toggle}>
                  {theme === "dark" ? (
                    <>
                      <Moon fill="white" className="w-6 h-6" />
                    </>
                  ) : (
                    <>
                      <Sun fill="white" className="w-6 h-6" />
                    </>
                  )}
                </div>
                <div className="cursor-pointer p-2" onClick={handleLogOut}>
                  <LogOut className="w-6 h-6" />
                </div>
              </>
            )}
            {userFirebaseRefId && (
              <div className="p-1">
                <img
                  src={user.profilePicture}
                  alt="profile"
                  className="rounded-full w-8 h-8 select-none"
                />
              </div>
            )}
          </DrawerDescription>
        </DrawerContent>
      </Drawer>

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
