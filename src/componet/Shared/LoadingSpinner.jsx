import { useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext";

const LoadingSpinner = () => {
    const { isDarkMode } = useContext(ThemeContext);

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-4  ${isDarkMode ? "border-amber-400" :"border-gray-900"}`}></div>
        </div>
    );
};

export default LoadingSpinner;
