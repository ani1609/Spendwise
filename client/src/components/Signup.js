import axios from "axios";
import { useState } from "react";
import "../index.css";
import "../styles/Signup.css";
import { ReactComponent as Close } from "../icons/close.svg";

function Signup ({ setShowSignupForm }) {
  const [userExists, setUserExists] = useState(false);
  const [passwordUnmatched, setPasswordUnmatched] = useState(false);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (signupData.password !== signupData.confirmPassword) {
      setUserExists(false);
      setPasswordUnmatched(true);
      console.error("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      // const response = await axios.post(${process.env.REACT_APP_SERVER_PORT}/api/users/signup, signupData);
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/users/signup`, signupData);
      localStorage.setItem("expenseTrackerUserToken", JSON.stringify(response.data.token));
      setUserExists(false);
      setPasswordUnmatched(false);
      setSignupData({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      window.location.reload();
    } catch (error) {
      setLoading(false);
      if (error.response.status === 409) {
        setPasswordUnmatched(false);
        setUserExists(true);
        return;
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="signup_form_container" onClick={(e) => e.stopPropagation()}>
            <h1>Create Your Account</h1>
            <div className='close-icon' onClick={ () => { setShowSignupForm(false); } }>
                <Close fill="white" className='w-6 h-6 cursor-pointer'/>
            </div>
            <form onSubmit={handleSignup}>
                <input
                    type='text'
                    placeholder='Name'
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
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
                    placeholder='Password'
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
                {passwordUnmatched && <p>Passwords do not match</p>}
                {userExists && <p>User already exists</p>}
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
                <button className="googleSignup p-2 border flex justify-center gap-2 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150" style={{ backgroundColor: "white", color: "black", animationDelay: "1.7s" }}>
                    <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                    <span>Continue with Google</span>
                </button>
            </form>
        </div>
  );
}

export default Signup;
