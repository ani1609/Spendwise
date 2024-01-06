import { useState } from "react";
import "../index.css";
import "../styles/Signup.css";
import { ReactComponent as Close } from "../icons/close.svg";
import { createUserWithEmailAndPassword, sendEmailVerification, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { addDoc, getDocs, query, where } from "firebase/firestore";
import { usersCollection } from "../firebaseConfig";

function Signup ({ setShowSignupForm }) {
  const [invalidEmailFOrmat, setInvalidEmailFormat] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [passwordUnmatched, setPasswordUnmatched] = useState(false);
  const [invalidName, setInvalidName] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e) => {
    const isValidName = /^[a-zA-Z\s]*$/.test(e.target.value);

    if (isValidName || e.target.value === "") {
      setSignupData({ ...signupData, name: e.target.value });
      setInvalidName(false);
    } else {
      setInvalidName(true);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (signupData.password !== signupData.confirmPassword) {
      setUserExists(false);
      setInvalidEmailFormat(false);
      setInvalidPassword(false);
      setInvalidName(false);
      setEmailVerificationSent(false);
      setPasswordUnmatched(true);
      setLoading(false);
      return;
    }

    if (signupData.password.length < 8) {
      setUserExists(false);
      setPasswordUnmatched(false);
      setInvalidEmailFormat(false);
      setInvalidName(false);
      setEmailVerificationSent(false);
      setInvalidPassword(true);
      setLoading(false);
      return;
    } else {
      setInvalidPassword(false);
    }
    try {
      const auth = getAuth();
      const response = await createUserWithEmailAndPassword(auth, signupData.email, signupData.password);
      // Send email verification
      await sendEmailVerification(response.user);
      setEmailVerificationSent(true);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setPasswordUnmatched(false);
        setInvalidEmailFormat(false);
        setInvalidPassword(false);
        setInvalidName(false);
        setEmailVerificationSent(false);
        setUserExists(true);
      } else if (error.code === "auth/invalid-email") {
        setUserExists(false);
        setPasswordUnmatched(false);
        setInvalidPassword(false);
        setInvalidName(false);
        setEmailVerificationSent(false);
        setInvalidEmailFormat(true);
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
        localStorage.setItem("expenseTrackerUserFirebaseRefId", JSON.stringify(addedUser.id));
        window.location.reload();
      } else {
        existingUserSnapshot.forEach((doc) => {
          localStorage.setItem("expenseTrackerUserFirebaseRefId", JSON.stringify(doc.id));
          window.location.reload();
        });
      }
    } catch (error) {
      console.log("Some error occurred", error);
    }
  };

  return (
    <div className="signup_form_container" onClick={(e) => e.stopPropagation()}>
      <h1>Create Your Account</h1>
      <div className='close-icon' onClick={() => { setShowSignupForm(false); }}>
        <Close fill="white" className='w-6 h-6 cursor-pointer' />
      </div>
      <form onSubmit={handleSignup}>
        <input
          type='text'
          placeholder='Name'
          value={signupData.name}
          onChange={handleNameChange}
          required
        />
        <input
          type='email'
          placeholder='Email'
          value={signupData.email}
          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
          required
        />
        <input
          type='password'
          placeholder='Password(minimimum 8 characters)'
          value={signupData.password}
          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
          required
        />
        <input
          type='password'
          placeholder='Confirm Password'
          value={signupData.confirmPassword}
          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
          required
        />
        {passwordUnmatched && <p className="error_message">Passwords do not match</p>}
        {userExists && <p className="error_message">User already exists</p>}
        {invalidEmailFOrmat && <p className="error_message">Invalid email format</p>}
        {invalidName && <p className="error_message">Invalid name format</p>}
        {invalidPassword && <p className="error_message">Invalid Password format</p>}
        {emailVerificationSent && <p className="error_message" style={{ color: "white" }}>Email verification sent. Please verify.</p>}
        <button type='submit' style={{ marginTop: "10px", width: "100%", cursor: loading ? "not-allowed" : "pointer" }} disabled={loading} className="signupBtn">
          {loading
            ? (
              <div className="loading-spinner"></div>
              )
            : (
                "Sign up"
              )}
        </button>
        <div className="signupSeparator flex justify-center items-center" style={{ width: "100%" }}><hr style={{ width: "100%" }}></hr> &nbsp;&nbsp;or&nbsp;&nbsp; <hr style={{ width: "100%" }}></hr></div>
      </form>
      <button className="googleSignup p-2 border flex justify-center gap-2 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150" onClick={handleGoogleSignIn}>
        <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
        <span>Continue with Google</span>
      </button>
    </div>
  );
}

export default Signup;
