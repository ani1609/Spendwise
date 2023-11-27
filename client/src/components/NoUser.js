import "../styles/NoUser.css";
import "../index.css";
import Default from "../images/default.png";


function NoUser(props) {
    return (
        <div className="noUser_container flex flex-col gap-4">
            <img src={Default} alt="No User" />
            <button onClick={()=>props.setShowSignupForm(true)} className="bg-black border-2 transition-all duration-700 text-white rounded-lg p-2 px-40 hover:bg-white hover:text-black transition duration-300 ease-in-out">Get Started</button>
        </div>
    );
}


export default NoUser;