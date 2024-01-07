import { useState } from "react";
import "../index.css";
import "../styles/Login.css";
import { ReactComponent as Close } from "../icons/close.svg";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, getDocs, query, where } from "firebase/firestore";
import { usersCollection } from "../firebaseConfig";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// import search from "../icons/search.svg";

function Login ({ setShowLoginForm }) {
  const [invalidEmailPassword, setInvalidEmailPassword] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const passwordShowToggle = () => {
    setPasswordShow(!passwordShow);
  };

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const auth = getAuth();
      const response = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      console.log("User logged in: ", response);
      if (!response.user.emailVerified) {
        setLoading(false);
        setInvalidEmailPassword(false);
        setEmailNotVerified(true);
      } else {
        const userObject = {
          email: response.user.email,
          password: loginData.password
        };
        const existingUserQuery = query(usersCollection, where("email", "==", userObject.email));
        const existingUserSnapshot = await getDocs(existingUserQuery);
        if (existingUserSnapshot.size === 0) {
          const addedUser = await addDoc(usersCollection, userObject);
          console.log("New User added");
          localStorage.setItem("expenseTrackerUserFirebaseRefId", JSON.stringify(addedUser.id));
          window.location.reload();
        } else {
          existingUserSnapshot.forEach((doc) => {
            console.log("User already exists: ", doc.id);
            localStorage.setItem("expenseTrackerUserFirebaseRefId", JSON.stringify(doc.id));
            window.location.reload();
          });
        }
      }
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/invalid-credential") {
        setEmailNotVerified(false);
        setInvalidEmailPassword(true);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      const response = await signInWithPopup(auth, provider);
      const userObject = {
        name: response.user.displayName,
        email: response.user.email,
        profilePicture: response.user.photoURL
      };
      const existingUserQuery = query(usersCollection, where("email", "==", userObject.email));
      const existingUserSnapshot = await getDocs(existingUserQuery);
      if (existingUserSnapshot.size === 0) {
        const addedUser = await addDoc(usersCollection, userObject);
        console.log("New User added");
        localStorage.setItem("expenseTrackerUserFirebaseRefId", JSON.stringify(addedUser.id));
        window.location.reload();
      } else {
        existingUserSnapshot.forEach((doc) => {
          console.log("User already exists: ", doc.id);
          localStorage.setItem("expenseTrackerUserFirebaseRefId", JSON.stringify(doc.id));
          window.location.reload();
        });
      }
    } catch (error) {
      console.log("Some error occurred", error);
    }
  };

  return (
    <div className="login_form_container" onClick={(e) => e.stopPropagation()}>
      <h1>Welcome Back</h1>
      <div className='close-icon' onClick={() => { setShowLoginForm(false); }}>
        <Close fill="white" className='w-6 h-6 cursor-pointer' />
      </div>
      <form onSubmit={handleLogin}>
        <input
          type='email'
          placeholder='Email'
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          required
        />
        {/* <input
          type='password'
          placeholder='Password'
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          required
        /> */}
        <div className="input_div p-0 flex flex-nowrap items-center pe-2">
          <input
            className="p-0 m-0 border"
            type={passwordShow ? "text" : "password"}
            placeholder='Password'
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            required
          />
          { !passwordShow
            ? <FaEyeSlash onClick={passwordShowToggle} className="h-7 w-7 cursor-pointer"/>
            : <FaEye onClick={passwordShowToggle} className="h-6 cursor-pointer w-6"/> }
        </div>
        {invalidEmailPassword && <p className="error_message">Invalid email or password</p>}
        {emailNotVerified && <p className="error_message">Email not verified</p>}

        <button type='submit' style={{ marginTop: "10px", width: "100%", cursor: loading ? "not-allowed" : "pointer" }} disabled={loading} className='loginBtn'>
          {loading
            ? (<div className="loading-spinner"></div>)
            : ("Log in" // Note: 'Log in' should be a string
              )
          }
        </button>
        <div className="loginSeparator flex justify-center items-center" style={{ width: "100%" }}><hr style={{ width: "100%" }}></hr> &nbsp;&nbsp;or&nbsp;&nbsp; <hr style={{ width: "100%" }}></hr></div>
      </form>
      <button className="googleLogin p-2 border flex justify-center gap-2 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150" onClick={handleGoogleSignIn}>
        <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
        <span>Continue with Google</span>
      </button>
    </div>
  );
}

export default Login;
