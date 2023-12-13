import {useState} from 'react';
import '../index.css';
import '../styles/Login.css';
import axios from "axios";
import {firebaseApp} from '../firebaseConfig';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { addDoc, query, where, onSnapshot, orderBy, updateDoc, getDocs, deleteDoc} from 'firebase/firestore';
import {usersCollection} from '../firebaseConfig';
const auth = getAuth(firebaseApp);


function Login()
{
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);



    const handleLogin = async (e) =>
    {
        e.preventDefault();
        setLoading(true);
        try
        {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/users/login`, loginData);
            localStorage.removeItem('expenseTrackerUserFirebaseUid');
            localStorage.setItem('expenseTrackerUserJWTToken', JSON.stringify(response.data.token));
            setInvalidEmail(false);
            setLoginData({
                email: '',
                password: ''
            });
            window.location.reload();
        }
        catch(error)
        {
            setLoading(false);
            if (error.response.status === 401)
            {
                setInvalidEmail(true);
                return;
            }
            console.error(error);
        }
        finally
        {
            setLoading(false);
        }
    }

    const handleGoogleSignIn = async () => 
    {
        try
        {
            const provider = new GoogleAuthProvider();
            const response = await signInWithPopup(auth, provider);
            const userObject = {
                name: response.user.displayName,
                email: response.user.email,
                profilePicture: response.user.photoURL
            };
            console.log(response.user);
            const existingUserQuery = query(usersCollection, where('email', '==', userObject.email));
            const existingUserSnapshot = await getDocs(existingUserQuery);

            if (existingUserSnapshot.size === 0) 
            {
                // If the user does not exist, add them to the Firestore collection
                const addedUserRef = await addDoc(usersCollection, userObject);
                console.log("New user added to Firestore with ID:", addedUserRef.id);

                // Perform any additional actions as needed
                localStorage.setItem('expenseTrackerUserFirebaseRefId', JSON.stringify(addedUserRef.id));
                window.location.reload();
            } 
            else 
            {
                // If the user already exists, log a message and perform any necessary actions
                existingUserSnapshot.forEach((doc) => {
                    console.log("User already exists in Firestore with ID:", doc.id);
                    localStorage.setItem('expenseTrackerUserFirebaseRefId', JSON.stringify(doc.id));
                    window.location.reload();
                });
            }
        }
        catch(error)
        {
            console.log(error);
        }
    };




    return(
        <div className="login_form_container" onClick={(e)=> e.stopPropagation()}>
            <h1>Welcome Back</h1>
            <form onSubmit={handleLogin}>
                <input
                    type='email'
                    placeholder='Email'
                    value={loginData.email}
                    onChange={(e)=>setLoginData({...loginData, email: e.target.value})}
                    required
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={loginData.password}
                    onChange={(e)=>setLoginData({...loginData, password: e.target.value})}
                    required
                />
                {invalidEmail && <p className="error_message">Invalid email or password</p>}
                <button type='submit' style={{ width: '100%' }}>
                    {loading ? (
                        <div className="loading-spinner"></div>
                    ) : (
                        'Log in' // Note: 'Log in' should be a string
                    )}
                </button>
            </form>
            <button className="p-2 border flex justify-center gap-2 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150" style={{ width: '100%', backgroundColor:"white", color:"black", animationDelay:"1.5s", marginTop: "0"}} onClick={handleGoogleSignIn}>
                    <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                    <span>Continue with Google</span>
            </button>
        </div>
    );
}

export default Login;