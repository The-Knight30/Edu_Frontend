import { useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext";

function DefaultComponet({ text }) {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={` flex justify-center items-center  h-[75vh] rounded-[25px]   text-2xl font-black ${isDarkMode ? " bg-neutral-800 text-white" : "bg-white text-black border border-amber-400"
        }`}
    >
      {text}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className={`w-8 h-68  ${isDarkMode ? "text-stone-400" : "text-red-600"
          }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    </div>
  );
}

export default DefaultComponet;