import { useEffect } from "react";
import { useContext, useState } from "react";
import { ThemeContext } from "./../Context/ThemeContext";
import { GETSTUDENTINFORMATION } from "../API/API";
import sendRequestGet from "../Shared/sendRequestGet";
import Cookies from "cookie-universal";
import SpinnerModal from "../Shared/SpinnerModal";
function StuProfile() {
  const cookies = Cookies();
  const { isDarkMode } = useContext(ThemeContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetechStudentData = async () => {
    try {
      setLoading(true);
      const response = await sendRequestGet(
        `${GETSTUDENTINFORMATION}${cookies.get("id")}`
      );
      setData(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  const stages = ["الصف الأول", "الصف الثاني", "الصف الثالث"];

  useEffect(() => {
    document.title = "حساب الطالب";
    fetechStudentData();
    return () => {
      document.title = "مستر أحمد جابر";
    };
  }, []);

  return (
    <>
      {loading ? (
        <SpinnerModal isLoading={loading} />
      ) : (
        <div
          className={`rounded-[25px] m-4 md:m-0 p-4 pb-12 ${
            isDarkMode ? " bg-neutral-800" : "bg-white"
          }`}
        >
          <div className="flex justify-center">
            <div className="relative flex w-20 h-20 overflow-hidden rounded-full">
              {/* Render the selected image if available */}
              <div
                className={` relative flex items-center justify-center w-full h-full ${
                  isDarkMode ? "" : ""
                } `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`w-12 h-12 ${isDarkMode?'text-white':'text-black'}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>

              {/* Input for selecting image */}
            </div>
          </div>
          <div className="flex justify-center">
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-0  2xl:w-3/4`}
            >
              <div className="grid col-span-6 gap-4 my-1 lg:col-span-2 ">
                <div className="flex flex-col gap-4">
                  <label
                    htmlFor="courseName1"
                    className={`flex justify-end my-1 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    البريد الألكتروني
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={`w-6 h-6 ml-1 ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"
                      />
                    </svg>
                  </label>
                  <input
                    type="text"
                    value={data.email}
                    className={`shadow text-right py-2 px-5 rounded-xl border-2 ${
                      isDarkMode
                        ? "border-amber-400 bg-transparent text-white"
                        : "border-slate-700 bg-white text-black"
                    }`}
                    readOnly
                  />
                </div>
              </div>
              <div className="grid col-span-6 gap-4 my-1 lg:col-span-2">
                <div className="flex flex-col gap-4">
                  <label
                    htmlFor="courseName1"
                    className={`flex justify-end my-1 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    اسم الطالب
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
                  </label>
                  <input
                    type="text"
                    value={`${data.firstName} ${data.lastName}`}
                    className={`shadow text-right py-2 px-5 rounded-xl border-2 ${
                      isDarkMode
                        ? "border-amber-400 bg-transparent text-white"
                        : "border-slate-700 bg-white text-black"
                    }`}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid col-span-6 gap-4 my-1 lg:col-span-2">
                <label
                  htmlFor="courseName1"
                  className={`flex justify-end my-1 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  رقم ولي الأمر
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-5 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>
                </label>
                <input
                  type="text"
                  value={data.dadPhone}
                  className={`shadow text-right py-2 px-5 rounded-xl border-2 ${
                    isDarkMode
                      ? "border-amber-400 bg-transparent text-white"
                      : "border-slate-700 bg-white text-black"
                  }`}
                  readOnly
                />
              </div>
              <div className="grid col-span-6 gap-4 my-1 lg:col-span-2">
                <label
                  htmlFor="courseName1"
                  className={`flex justify-end my-1 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  رقم الهاتف
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-5 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>
                </label>
                <input
                  type="text"
                  value={data.phoneNumber}
                  className={`shadow text-right py-2 pr-5 rounded-xl border-2 ${
                    isDarkMode
                      ? "border-amber-400 bg-transparent text-white"
                      : "border-slate-700 bg-white text-black"
                  }`}
                  readOnly
                />
              </div>
              <div className="grid col-span-6 gap-4 my-1 lg:col-span-2">
                <label
                  htmlFor="courseName1"
                  className={`flex justify-end my-1 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  الصف الدراسي
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-6 ml-1 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
                    />
                  </svg>
                </label>
                <input
                  type="text"
                  value={stages[data.stages]}
                  className={`shadow text-right py-2 pr-5 rounded-xl border-2 ${
                    isDarkMode
                      ? "border-amber-400 bg-transparent text-white"
                      : "border-slate-700 bg-white text-black"
                  }`}
                  readOnly
                />
              </div>
              <div className="grid col-span-6 gap-4 my-1 lg:col-span-2">
                <label
                  htmlFor="courseName1"
                  className={`flex justify-end my-1 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  المحافظة
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-6 ml-1 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
                    />
                  </svg>
                </label>
                <input
                  type="text"
                  value={data.city}
                  className={`shadow text-right py-2 pr-5 rounded-xl border-2 ${
                    isDarkMode
                      ? "border-amber-400 bg-transparent text-white"
                      : "border-slate-700 bg-white text-black"
                  }`}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StuProfile;
