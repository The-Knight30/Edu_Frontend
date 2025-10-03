import { useState, useContext } from "react";
import { Link, Outlet, Routes, Route } from "react-router-dom";
import CommonNavbar from "../Shared/CommonNavbar";
import { ThemeContext } from "../Context/ThemeContext";
import DefaultComponet from "../Shared/DefaultComponet";
import { handleSignOut } from "../HomePage/NavbarApp";

const SideBarAdmin = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isAsideOpen, setAsideOpen] = useState(false);
  const toggleSidebar = () => {
    setAsideOpen(!isAsideOpen);
  };
  const linkStyle = "flex items-center p-2 text-gray-900 rounded-lg group";

  // تحديث مصفوفة menuItems بإضافة خيارات الامتحانات
  const menuItems = [
    {
      to: "/dashboard/users",
      text: "الطلاب",
      svg: (
        <svg
          className="flex-shrink-0 w-5 h-5 text-2xl font-normal"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 18"
        >
          <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
        </svg>
      ),
    },
    {
      to: "/dashboard/addcourse",
      text: "إضافة وحدة",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      ),
    },
    {
      to: "/dashboard/availablecourses",
      text: "الكورسات",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          />
        </svg>
      ),
    },
    {
      to: "/dashboard/exam-result",
      text: "نتائج الامتحانات",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
    },
    {
      to: "/dashboard/exam-results",
      text: "📊 إدارة نتائج الامتحانات",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
          />
        </svg>
      ),
    },
    {
      to: "/dashboard/blacklist",
      text: "القائمة السوداء",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      ),
    },
    {
      to: "/dashboard/create-exam",
      text: "إنشاء امتحان",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      to: "/dashboard/add-question",
      text: "إضافة أسئلة",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6v12m6-6H6"
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
          className="absolute z-50 inline-flex items-center justify-center w-10 h-10 p-2 text-sm rounded-lg top-5 right-1 md:hidden text-amber-400"
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
        className={`${isDarkMode
          ? "bg-neutral-900"
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
            style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
          >
            <ul className="space-y-2 font-medium">
              {/* Render menu items using map */}
              {menuItems.map((item, index) => (
                <li key={index} className="flex items-center justify-center">
                  <Link to={item.to} onClick={toggleSidebar} className={linkStyle}>
                    <span
                      className={`mr-2 text-2xl font-normal ms-3 whitespace-nowrap hover:text-gray-700 ${isDarkMode ? "text-white" : "text-amber-600"
                        }`}
                    >
                      {item.text}
                    </span>
                    <span
                      className={`group-hover:text-gray-900 ${isDarkMode
                        ? "text-white"
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
                <button onClick={handleSignOut} className="flex items-center cursor-pointer">
                  <div className={`text-2xl font-normal text-red-600 hover:text-red-900 ${isDarkMode ? "" : ""}`}>
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

        <div className="min-h-screen sm:mr-72 sm:ml-20">
          <div className="pt-8 mx-1 md:mx-0 md:mr-12">
            <Outlet />
            <Routes>
              <Route path="/" element={<DefaultComponet text="لا توجد بيانات" />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBarAdmin;