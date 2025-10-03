import { useState, useContext } from "react";
import { Link, Outlet } from "react-router-dom";

import CommonNavbar from "../Shared/CommonNavbar";
import { ThemeContext } from "../Context/ThemeContext";
import DefaultComponet from "../Shared/DefaultComponet";
import { AuthContext } from "../Context/AuthContext";
import { handleSignOut } from "../HomePage/NavbarApp";
import StuCourses from "./StuCourses"

const SideBarStudent = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isAsideOpen, setAsideOpen] = useState(false);
  const { studentId } = useContext(AuthContext);
  const toggleSidebar = () => {
    setAsideOpen(!isAsideOpen);
  };
  const linkStyle = "flex items-center p-2 text-gray-900 rounded-lg group";
  const menuItems = [
    {
      to: `/dashboardstu/${studentId}/profile`,
      text: "حساب الطالب",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      ),
    },

    {
      to: `/dashboardstu/${studentId}/stuavailablecourses`,
      text: " الكورسات",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          />
        </svg>
      ),
    },
    {
      to: `/dashboardstu/${studentId}/stuexamresult`,
      text: " نتائج الامتحانات",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
    },
    {
      to: `/buy-courses`,
      text: "🛒 شراء كورسات جديدة",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a .75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
      ),
    },
    {
      to: `/available-exams`,
      text: "📝 الامتحانات المتاحة",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h4.125m0-15.75c0-1.036.84-1.875 1.875-1.875h5.25c1.035 0 1.875.84 1.875 1.875v15.75c0 1.035-.84 1.875-1.875 1.875h-5.25A1.875 1.875 0 0 1 8.25 22.5V8.25Z"
          />
        </svg>
      ),
    },

  ];
  return (
    <>
      <div className="relative">
        {/* Toggle button for small screens */}
        <button
          onClick={toggleSidebar}
          type="button"
          className="absolute z-50 inline-flex items-center justify-center w-10 h-10 p-2 text-sm rounded-lg top-5 right-1 md:hidden text-amber-400 "
          aria-controls="logo-sidebar"
        >
          <span className="sr-only">Toggle sidebar</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <CommonNavbar />
      </div>
      <div
        className={`  pb-5 min-h-screen ${isDarkMode
          ? "bg-neutral-900 "
          : "bg-gradient-to-b from-amber-400 to-white"
          }`}
      >
        <aside
          id="logo-sidebar"
          className={`fixed top-0 right-0 z-40 w-64 h-[95vh] mr-0 md:mr-8 pt-28 transition-transform ${isAsideOpen ? "translate-x-0" : "translate-x-full"
            } md:translate-x-0`}
          aria-label="Sidebar"
        >
          <div
            className={`h-full px-3 pb-4 overflow-y-auto border rounded-xl shadow-md border-amber-400 ${isDarkMode ? "bg-neutral-800" : "bg-white"
              }`}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <ul className="space-y-2 font-medium">
              {/* Render menu items using map */}
              {menuItems.map((item, index) => (
                <li key={index} className="flex items-center justify-center">
                  <Link onClick={toggleSidebar} to={item.to} className={linkStyle}>
                    <span
                      className={`mr-2 text-2xl font-normal ms-3 whitespace-nowrap  hover:text-gray-700 ${isDarkMode ? "text-white" : "text-amber-600"
                        }`}
                    >
                      {item.text}
                    </span>
                    <span
                      className={` group-hover:text-gray-900 ${isDarkMode
                        ? "text-white "
                        : "text-amber-600 group-hover:text-gray-900"
                        }`}
                    >
                      {item.svg}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div>
              <div className="flex justify-center">
                <button
                  onClick={handleSignOut}
                  className="flex items-center cursor-pointer"
                >
                  <div
                    className={`text-2xl font-normal text-red-600 hover:text-red-900 ${isDarkMode ? "" : ""
                      }`}
                  >
                    تسجيل الخروج
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 ml-1 text-red-600 hover:text-red-900"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </aside>
        {/*  */}
        <div className="min-h-screen sm:mr-72 sm:ml-20">
          <div className="pt-8 mx-1 md:mx-0 md:mr-12 ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBarStudent;
