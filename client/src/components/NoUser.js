import "../styles/NoUser.css";
import "../index.css";
import Default from "../images/default.webp";

function NoUser (props) {
  return (
        <div className="noUser_container">
            <img src={Default} alt="No User" />
            <button
                onClick={() => props.setShowSignupForm(true)}
                className="bg-black border-2 transition-all duration-500 text-white rounded-lg p-2 px-8 md:px-40 hover:bg-white hover:text-black ease-in-out text-sm md:text-base lg:text-lg max-w-full"
            >
            Get Started
            </button>
        </div>
  );
}

export default NoUser;
