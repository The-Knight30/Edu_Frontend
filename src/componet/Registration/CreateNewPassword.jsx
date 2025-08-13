import { useState, useEffect, useContext } from "react";
import NavbarApp from "./../HomePage/NavbarApp";
import boyImg from "../../assets/boy.jpg";
import FooterApp from "./../FooterApp";

import { ThemeContext } from "../Context/ThemeContext";
import { AuthContext } from "../Context/AuthContext";
import sendRequest from "../Shared/sendRequest";
import { BASEURL, RESETPASSWORD_ENDPOINT } from "../API/API";
import { useNavigate } from "react-router-dom";
import SpinnerModal from "../Shared/SpinnerModal";
import { toast } from "react-toastify";
import Cookies from 'cookie-universal';

function CreateNewPassword() {
  const cookies = Cookies();

  const { isDarkMode } = useContext(ThemeContext);
  const { Email } = useContext(AuthContext);
  const [newPassword, setnewPassword] = useState("");
  const [isLoading, setIsLoading] = useState()

  const navigate = useNavigate();
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const body = JSON.stringify({ "email": cookies.get("email"), "newPassword": newPassword }); // Include email and code in the request body
      const res = await sendRequest(
        BASEURL,
        RESETPASSWORD_ENDPOINT,
        "POST",
        body
      );
      if (res.status === 200) {
        toast.success("تم تغيير كلمة السر بنجاح")
        navigate("/login");
        cookies.remove("email")
      }
      else if (res.status==400){
        toast.error("فشل التحقق")

      }
    } catch (err) {
      
    }
    finally {
      // Hide the spinner
      setIsLoading(false);
    }
  };
  useEffect(() => {
    document.title = "إعادة تاعيين كلمة المرور"; // Set the desired title for this page

    return () => {
      document.title = "مستر أحمد جابر"; // Reset the title when the component unmounts
    };
  }, []);
  return (
    <>
      <NavbarApp />
      <SpinnerModal isLoading={isLoading} />
      <div
        className={`grid grid-cols-7 lg:grid-cols-10 gap-4  lg:mb-0 mt-0 lg:pt-4 min-h-screen ${
          isDarkMode ? "bg-neutral-900" : ""
        }`}
      >
        <div className="col-span-5 col-start-3 pt-6">
          <div
            className={ `  font-medium  mb-14 text-right  text-[20px] leading-normal  ${
              isDarkMode ? "text-sky-400" : "text-amber-400"
            }`}
          >
            إعادة تاعيين كلمة السر
          </div>
          <form action="" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-1 ">
              <div className="text-right">
                <label
                  htmlFor="newPassword"
                  className={`my-1 flex justify-end ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  كلمة السر الجديده{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-6 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </label>
                <input
                  type="newPassword"
                  id="newPassword"
                  placeholder="كلمة السر الجديده"
                  className={`rounded-lg p-2 border-none w-full text-right ${
                    isDarkMode ? "bg-white" : "bg-stone-300"
                  }`}
                  required
                  value={newPassword}
                  onChange={(e) => setnewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-3 md:mb-0 ">
              <div className="mt-5 text-right ">
                <button
                  className={` rounded-[9px] shadow-xl px-4 lg:px-20 py-2 mb-52  text-white transition duration-200  transform  hover:text-black ${
                    isDarkMode ? "bg-sky-400 hover:bg-sky-500" : "bg-gray-800 hover:bg-gray-900"
                  }`}
                >
                  تأكيد كلمة السر
                </button>
              </div>
              <div></div>
            </div>

            {/*  */}
          </form>
        </div>

        {/*  */}
        <div className="order-first col-span-10 lg:col-span-3 lg:order-last">
          <img src={boyImg} className=" opacity-60   lg:h-[100vh]  " alt="" />
        </div>
      </div>
      <FooterApp />
    </>
  );
}

export default CreateNewPassword;
