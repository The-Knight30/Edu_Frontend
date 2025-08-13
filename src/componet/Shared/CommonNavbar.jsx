import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import image1 from "../../../src/assets/logoforplatform.png";
import { ThemeContext } from "../Context/ThemeContext";
import Cookies from "cookie-universal";
import { handleSignOut } from "../HomePage/NavbarApp";
const CommonNavbar = () => {
  const cookies = Cookies();
  const studentId = cookies.get("id");
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
      to: `/`,
      text: "الصفحة الرئيسة",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      ),
    },

    // Add more menu items as needed
  ];
  const [isAsideOpen, setAsideOpen] = useState(false);
  const toggleSidebar = () => {
    setAsideOpen(!isAsideOpen);
  };
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const auth = { role: cookies.get("role") };
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const handleToggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const firstName = cookies.get("firstName");
  const lastName = cookies.get("lastName");
  const email = cookies.get("email");
  return (
    <>
      <aside
        id="logo-sidebar"
        className={`fixed top-0 right-0 z-40 w-64 h-[95vh] mr-0 md:mr-8 pt-28 transition-transform ${
          isAsideOpen ? "translate-x-0" : "translate-x-full"
        } md:translate-x-0 block md:hidden`}
        aria-label="Sidebar"
      >
        <div
          className={`h-full px-3 pb-4 overflow-y-auto border rounded-xl shadow-md border-amber-400 ${
            isDarkMode ? "bg-neutral-800" : "bg-white"
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
                <Link
                  onClick={toggleSidebar}
                  to={item.to}
                  className={linkStyle}
                >
                  <span
                    className={`mr-2 text-2xl font-normal ms-3 whitespace-nowrap  hover:text-gray-700 ${
                      isDarkMode ? "text-white" : "text-amber-600"
                    }`}
                  >
                    {item.text}
                  </span>
                  <span
                    className={` group-hover:text-gray-900 ${
                      isDarkMode
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
                  className={`text-2xl font-normal text-red-600 hover:text-red-900 ${
                    isDarkMode ? "" : ""
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
      <nav
        className={` sticky top-0 z-40 md:z-50 w-full ${
          isDarkMode ? "bg-gray-950 shadow" : "bg-white"
        } shadow border-b-0 md:border-b-[7px] border-amber-400`}
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto ">
          {/* Logo  */}
          <div className=" flex space-x-0">
            <Link to="/" className="flex ms-2 md:me-24">
              <img
                src={image1}
                className="w-24 h-20 me-3"
                alt="Kinght english"
                loading="lazy"
              />
              <div className="hidden mt-5 ml-10 xl:block">
                <h2
                  className={` md:text-4xl font-freehand ${
                    isDarkMode ? "text-white" : ""
                  }  `}
                >
                  The <span className="text-amber-400 text-[40px]">Knight</span>
                </h2>
              </div>
            </Link>
            <button
              className={`px-4 py-2  font-medium  ${
                isDarkMode ? "text-white" : "text-black"
              } ${isDarkMode ? "" : "dark:text-gray-800"}`}
              onClick={toggleDarkMode}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isDarkMode ? "white" : "black"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={isDarkMode ? "white" : "black"}
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
            </button>
          </div>

          {/* svg icons */}
          <ul
            className={`font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-4  rtl:space-x-reverse md:mt-0 `}
          ></ul>
          {auth.role ? (
            <button
              onClick={toggleSidebar}
              type="button"
              className="inline-flex items-center  p-2 w-10 h-10 justify-center text-sm text-amber-400  rounded-lg md:hidden focus:outline-none focus:ring-2 "
              aria-controls="navbar-default"
              aria-expanded={isOpen ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.o  rg/2000/svg"
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
          ) : (
            <></>
          )}

          <div
            className={`w-full md:flex md:space-x-4  mb-5 md:w-auto ${
              isOpen ? "block" : "hidden"
            }`}
            id="navbar-default"
          >
            {auth.role ? (
              ""
            ) : (
              <>
                <div className="mb-2 md:mb-0 md:mt-4">
                  <Link
                    className={`${
                      isDarkMode
                        ? " bg-sky-400 text-white  "
                        : " bg-amber-400 text-white md:hover:bg-amber-400 md:bg-white md:text-amber-400"
                    } w-full  rounded-lg shadow-lg hover:bg-amber-400 hover:text-white px-4 py-2  md:text-xl font-medium  transition duration-700  font-Mukta flex items-center justify-center`}
                    to="/login"
                  >
                    تسجيل الدخول
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 ml-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                      />
                    </svg>
                  </Link>
                </div>
                <div className=" md:mt-4 ">
                  <Link
                    className={`${
                      isDarkMode
                        ? " bg-amber-400 text-black"
                        : "text-white hover:text-black hover:border-amber-400 bg-gray-800"
                    } w-full rounded-lg hover:bg-white px-4 py-2 md:text-xl font-medium transition duration-700  font-Mukta flex items-center justify-center`}
                    to="/signup"
                  >
                    انشئ حسابك الان{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 ml-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                      />
                    </svg>
                  </Link>
                </div>
              </>
            )}
          </div>
          {auth.role ? (
            <div className=" mr-12 md:mr-0 hidden md:flex justify-center  cursor-pointer ">
              <div>
                <svg
                  onClick={handleToggleProfile}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-8 h-8 text-amber-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>
              <div className="relative flex justify-end mr-10 ">
                {isProfileOpen && (
                  <div
                    className="absolute top-10 right-1 z-50  text-base list-none bg-white border divide-y divide-gray-100 rounded-lg shadow  xl:mr-8 border-amber-400 "
                    id="user-dropdown"
                  >
                    <div className="px-4 py-3 text-right">
                      <span className="block text-sm text-gray-900">
                        {firstName} {lastName}
                      </span>
                      <span className="block text-sm text-gray-500 truncate ">
                        {email}
                      </span>
                    </div>
                    <ul
                      className="py-2 text-right"
                      aria-labelledby="user-menu-button"
                    >
                      <li>
                        <button
                          onClick={handleSignOut}
                          className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-10 "
                        >
                          تسجيل الخروج
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </nav>

      {/* handle profile menu */}
    </>
  );
};

export default CommonNavbar;
