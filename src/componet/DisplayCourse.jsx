import { useContext } from "react";
import FooterApp from "./FooterApp";
import CommonNavbar from "./Shared/CommonNavbar";
import { ThemeContext } from "./Context/ThemeContext";
import MediaHub from "./MediaHub";

const DisplayCourse = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div>
      <CommonNavbar />
      <div
        className={`${
          isDarkMode ? "bg-black" : "bg-gradient-to-t from-amber-400 to-white "
        }`}
      >
        <MediaHub />
      </div>
      <FooterApp />
    </div>
  );
};

export default DisplayCourse;
