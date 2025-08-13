import { useState, useEffect, useContext } from "react";
import NavbarApp from "./../HomePage/NavbarApp";
import boyImg from "../../assets/boy.jpg";
import FooterApp from "./../FooterApp";

import { ThemeContext } from "../Context/ThemeContext";
import { AuthContext } from "../Context/AuthContext";
import sendRequest from "../Shared/sendRequest";
import { BASEURL, VALIDATERESETPASSWORD_ENDPOINT, VERIVICATION_ENDPOINT } from "../API/API";
import { useNavigate } from "react-router-dom";
import SpinnerModal from "../Shared/SpinnerModal";
import { toast } from "react-toastify";
import Cookies from 'cookie-universal';
function ForgetPassword() {
  const cookies = Cookies();
  const { isDarkMode } = useContext(ThemeContext);
  const { Email } = useContext(AuthContext);
  const [code, setCode] = useState();
  const [isLoading, setIsLoading] = useState()

  const navigate = useNavigate();
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const body = JSON.stringify({ "email":cookies.get("email"), "code":code });

      console.log(code,cookies.get("email"))
      const res = await sendRequest(
        BASEURL,
        VALIDATERESETPASSWORD_ENDPOINT,
        "POST",
        body
      );
      if (res.status === 200) {
        toast.success("تم ادخال الكود بنجاح")
        navigate("/reset");
      }
    } catch (err) {
      toast.error("خطأ في الكود ")
    }
    finally {
      // Hide the spinner
      setIsLoading(false);
    }
  };
  useEffect(() => {
    document.title = "إعادة تاعيين كلمة المرور";

    return () => {
      document.title = "مستر أحمد جابر"; // Reset the title when the component unmounts
    };
  }, []);
  return (
    <>
      <NavbarApp />
      <SpinnerModal isLoading={isLoading} />
      <div
        className={`grid grid-cols-7 lg:grid-cols-10 gap-4  lg:mb-0 mt-0 lg:pt-4 min-h-screen  ${isDarkMode ? "bg-neutral-900" : ""
          }`}
      >
        <div className="col-span-5 col-start-3 pt-6 ">
          <div
            className={` text-right  text-[20px] font-medium leading-normal mb-14 ${isDarkMode ? "text-sky-400" : "text-amber-400"
              }`}
          >
            إعادة تاعيين كلمة السر
          </div>
          <form action="" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-1 ">
              <div className="text-right">
                <label
                  htmlFor="Email"
                  className={`my-1 flex justify-end ${isDarkMode ? "text-white" : "text-black"
                    }`}
                >
                  الكود{" "}
                </label>
                <input
                  type="number"
                  id="code"
                  placeholder="ادخل الكود "
                  className={`rounded-lg p-2 border-none w-full text-right ${isDarkMode ? "bg-white" : "bg-stone-300"
                    }`}
                  required
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-3 md:mb-0 ">
              <div className="mt-5 text-right ">
                <button
                  className={` rounded-[9px] shadow-xl px-4 lg:px-20 py-2 mb-52  text-white   transition duration-700   ${isDarkMode ? "bg-sky-400 hover:bg-sky-500" : "bg-gray-800 hover:bg-gray-900"
                    }`}
                >
                  ! إرسال الكود
                </button>
              </div>
              <div></div>
            </div>

            {/*  */}
          </form>
        </div>

        {/*  */}
        <div className="order-first col-span-10 lg:col-span-3 lg:order-last">
          <img src={boyImg} className=" opacity-60   lg:h-[100vh]   " alt="" />
        </div>
      </div>

      <FooterApp />
    </>
  );
}

export default ForgetPassword;