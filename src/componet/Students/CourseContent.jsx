import FooterApp from "../FooterApp";
import CourseInformation from "./CourseInformation";
import CommonNavbar from "../Shared/CommonNavbar";
import { ThemeContext } from "../Context/ThemeContext";
import { useContext, useEffect } from "react";
const CourseContent = () => {

  useEffect(() => {
    document.title = " محتوي الكورس";

    return () => {
      document.title = "مستر أحمد جابر";
    };
  }, []);
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div>
      <CommonNavbar />
      <div
        className={`${
          isDarkMode ? "bg-black" : "bg-gradient-to-t from-amber-400 to-white "
        }`}
      >
        <CourseInformation />
      </div>
      <FooterApp />
    </div>
  );
};

export default CourseContent;
