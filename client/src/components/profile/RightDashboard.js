import { useState, useEffect } from "react";
import cameraIcon from "../../icons/camera.svg";

const RightDashboard = () => {
  const [triangleCount, setTriangleCount] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const dynamicWidth = "calc(100% - 240px)";

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  // for calculating no of triangles on two rows according to viewport width
  useEffect(() => {
    const calculateTriangles = () => {
      const containerWidth =
        document.getElementById("triangle-row")?.offsetWidth || 0;
      const triangleWidth = 82;
      const trianglesPerRow = Math.floor(containerWidth / triangleWidth);
      const totalTriangles = trianglesPerRow * 2;
      setTriangleCount(totalTriangles);
    };
    // Initial calculation
    calculateTriangles();
    // Recalculate on window resize
    window.addEventListener("resize", calculateTriangles);
    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", calculateTriangles);
    };
  }, []);

  return (
    <>
      <div className='relative sm:left-60 -left-0 -z-10 sm:w-[calc(100%-240px)] w-[100%]' >
        {/* Profile Heading */}
        <div
          className='profile-heading-container sm:w-[calc(100%-240px)] w-[100%] flex sm:justify-start justify-center'
        >
          <h1 className='font-[Inter] text-[#024164] text-[19px] font-semibold pl-2 transition duration-500 dark:text-[#97cbe7]'>
            Profile
          </h1>
        </div>
        {/* Background Containing Triangles on two rows */}
        <div className='relative w-[100%]'>
          <div className='triangle-row-container bg-[#B6CEFC]'>
            <div
              id='triangle-row'
              className='traingle-row w-[90%] mx-auto flex flex-wrap'
            >
              {[...Array(triangleCount)].map((_, index) => (
                <div
                  key={index}
                  style={{ clipPath: "polygon(100% 50%, 0 0, 0 100%)" }}
                  className='bg-[#C2D7FF] w-[82px] h-[71px]'
                ></div>
              ))}
            </div>
            <div className='change-cover absolute top-1 right-[10%]'>
              <div className='flex gap-2 bg-[#7A98D2] p-2 border border-slate-50 cursor-pointer'>
                <img src={cameraIcon} alt='' />
                <span className='text-[15px] font-medium font-[Inter] text-white'>
                  Change Cover
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Container - includes info and settings */}
        <div className='profile-container w-[90%] ml-[5%] flex gap-5 justify-center flex-wrap absolute top-32'>
          <div className='profile-picture border border-slate-950/20 rounded-[5px] bg-white transition duration-500 dark:bg-[#011019] w-max px-10 py-7'>
            <div>
              <img
                src='https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                alt=''
                className='w-[124px] h-[124px] rounded-full object-cover'
              />
            </div>
            <div className='relative'>
              <div className='w-[36px] h-[36px] rounded-full bg-blue-500 flex justify-center items-center cursor-pointer absolute bottom-1 right-1'>
                <img src={cameraIcon} alt='' />
              </div>
            </div>
            <div>
              <p className='font-[Inter] text-[#024164] transition duration-500 dark:text-[#97cbe7] font-bold text-[17px] text-center mt-4'>
                Your Name
              </p>
            </div>
          </div>

          {/* Profile Settings */}
          <div className='profile-settings border border-slate-950/20 rounded-[5px] bg-white w-full md:w-[31rem] transition duration-500 dark:bg-[#011019]'>
            <h2 className='font-[Inter] font-semibold text-[19px] text-[#024164] transition duration-500 dark:text-[#B6CEFC] bg-[#EAF0FB] dark:bg-[#335467] border border-slate-950/20 px-2 py-4'>
              Account Settings
            </h2>
            <form className='p-4'>
              <div className='mb-2'>
                <label
                  htmlFor='first-name'
                  className='block font-[Inter] text-[19px] text-[#514949] transition duration-500 dark:text-[#B6CEFC]'
                >
                  First Name
                </label>
                <input
                  type='text'
                  id='first-name'
                  className='bg-[#f2f2f2] dark:bg-[#335467] border border-slate-900/20 w-full md:w-[29rem] h-[2.8rem] text-[#555] transition duration-500 dark:text-[#B6CEFC] text-xl px-2'
                  onChange={handleFirstNameChange}
                  value={firstName}
                />
              </div>
              <div>
                <label
                  htmlFor='last-name'
                  className='block font-[Inter] text-[19px] text-[#514949] transition duration-500 dark:text-[#B6CEFC]'
                >
                  Last Name
                </label>
                <input
                  type='text'
                  id='last-name'
                  className='bg-[#f2f2f2] transition duration-500 dark:bg-[#335467] dark:text-[#B6CEFC] border border-slate-900/20 w-full md:w-[29rem] h-[2.8rem] text-[#555] text-xl px-2'
                  onChange={handleLastNameChange}
                  value={lastName}
                />
              </div>
              <div className='flex justify-center'>
                <button className='bg-[#7A98D2] text-[15px] font-medium font-[Inter] text-white px-4 py-2 border border-slate-50 cursor-pointer rounded-3xl mt-2'>
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightDashboard;
