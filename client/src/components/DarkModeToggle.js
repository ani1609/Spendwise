import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    applyDarkModeStyles();
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const applyDarkModeStyles = () => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  };

  return (
    <button onClick={toggleDarkMode}>
      {isDarkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default DarkModeToggle;
