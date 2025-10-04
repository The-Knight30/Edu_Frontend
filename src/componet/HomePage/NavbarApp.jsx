import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import image1 from "../../../src/assets/logoforplatform.png";
import { ThemeContext } from "../Context/ThemeContext";
import { AuthContext } from "../Context/AuthContext";
import { BASEURL, SIGNOUT } from "../API/API";
import Cookies from "cookie-universal";
import sendRequest from "../Shared/sendRequest";
import { useNavigate } from "react-router-dom";
export const handleSignOut = async () => {
  const cookies = Cookies();

  try {
    const res = await sendRequest(BASEURL, `${SIGNOUT}`, "DELETE");

    cookies.removeAll();

    window.location.pathname = "/";
  } catch (error) {
    console.error("try to make signout", error);
    return false;
  }
};
function NavbarApp() {
  const navigate = useNavigate();
  const cookies = Cookies();

  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const auth = { role: cookies.get("role") };
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const handleToggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const firstName = cookies.get("firstName");
  const lastName = cookies.get("lastName");
  const email = cookies.get("email");

  const rawStudentId = cookies.get("id");
  const studentID = parseInt(rawStudentId, 10);

  const isAdmin = auth.role === "Admin";

  return (
    <>
      <nav
        className={`sticky top-0 z-40 md:z-50 w-full ${isDarkMode ? "bg-gray-950 shadow" : "bg-white"
          } shadow border-b-0 md:border-b-[7px] border-amber-400`}
      >
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl mx-auto ">
          <div className="flex ">
            {/* logo */}
            <Link className="" to="/">
              <img
                src={image1}
                className="w-24 h-[82px] lg:h-[87px]"
                alt="Kinght english"
              />
            </Link>

            {/* dark mode */}
            <button
              className={`px-4 py-2  font-medium  ${isDarkMode ? "text-white" : "text-black"
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
            {auth.role ? (
              <div className=" mt-0.5 flex items-center  cursor-pointer ">
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
              </div>
            ) : (
              " "
            )}
          </div>

          {/* barg toggle */}
          <button
            onClick={handleToggle}
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm rounded-lg text-amber-400 md:hidden focus:outline-none focus:ring-2 "
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
          <div
            className={`w-full md:block md:w-auto ${isOpen ? "block" : "hidden"
              }`}
            id="navbar-default"
          >
            <ul
              className={`font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-4  rtl:space-x-reverse md:mt-0    `}
            >
              {auth.role ? (
                <>
                  <li className="mt-5 md:mt-0">
                    <Link
                      className={`${isDarkMode
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                        } w-full rounded-lg shadow-lg px-4 py-2 md:text-xl font-medium transition duration-700 font-Mukta flex items-center justify-center`}
                      to="/buy-courses"
                    >
                      🛒 شراء الكورسات
                    </Link>
                  </li>
                  <li className="mt-5 md:mt-0">
                    <Link
                      className={`${isDarkMode
                        ? "bg-purple-500 text-white hover:bg-purple-600"
                        : "bg-purple-500 text-white hover:bg-purple-600"
                        } w-full rounded-lg shadow-lg px-4 py-2 md:text-xl font-medium transition duration-700 font-Mukta flex items-center justify-center`}
                      to="/available-exams"
                    >
                      📝 الامتحانات
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="">
                    <Link
                      className={`${isDarkMode
                        ? " bg-sky-400 text-white hover:bg-sky-500  "
                        : " bg-amber-400 text-white hover:bg-amber-500 "
                        } w-full  rounded-lg shadow-lg px-4 py-2 md:text-xl font-medium  transition duration-700  font-Mukta flex items-center justify-center`}
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
                  </li>

                  <li className="mt-5 md:mt-0">
                    <Link
                      className={`${isDarkMode
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                        } w-full rounded-lg shadow-lg px-4 py-2 md:text-xl font-medium transition duration-700 font-Mukta flex items-center justify-center`}
                      to="/buy-courses"
                    >
                      🛒 تصفح الكورسات
                    </Link>
                  </li>

                  <li className="mt-5 md:mt-0">
                    <Link
                      className={`${isDarkMode
                        ? "bg-purple-500 text-white hover:bg-purple-600"
                        : "bg-purple-500 text-white hover:bg-purple-600"
                        } w-full rounded-lg shadow-lg px-4 py-2 md:text-xl font-medium transition duration-700 font-Mukta flex items-center justify-center`}
                      to="/available-exams"
                    >
                      📝 الامتحانات
                    </Link>
                  </li>

                  <li className="mt-5 md:mt-0">
                    <Link
                      className={`${isDarkMode
                        ? " bg-amber-400 text-black hover:bg-amber-500"
                        : "text-white bg-gray-800 hover:bg-gray-900"
                        } w-full rounded-lg  px-4 py-2  md:text-xl font-medium transition duration-700   font-Mukta flex items-center justify-center`}
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
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="relative flex justify-end mr-10 ">
        {isProfileOpen && (
          <div
            className="absolute z-50 text-base list-none bg-white border divide-y divide-gray-100 rounded-lg shadow left-10 xl:mr-8 border-amber-400 "
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
            <ul className="py-2 text-right" aria-labelledby="user-menu-button">
              {!isAdmin && (
                <li>
                  <Link
                    to={`dashboardstu/:${studentID}`}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-10"
                  >
                    صفحة الطالب
                  </Link>
                </li>
              )}
              {isAdmin && (
                <li>
                  <Link
                    to={`/dashboard`}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-10"
                  >
                    صفحة المدير
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-10"
                >
                  تسجيل الخروج
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default NavbarApp;
