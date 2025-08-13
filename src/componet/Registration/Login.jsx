import { useState, useEffect, useContext } from "react";
import NavbarApp from "./../HomePage/NavbarApp";
import boyImg from "../../assets/boy.jpg";
import FooterApp from "../FooterApp";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { ThemeContext } from "../Context/ThemeContext";
import {
  BASEURL,
  LOGIN_ENDPOINT,
  REFRESHENDPOINT,
  SENDCODE_ENDPOINT,
} from "../API/API";
import sendRequest from "../Shared/sendRequest";
import { AuthContext } from "../Context/AuthContext";
import SpinnerModal from "../Shared/SpinnerModal";
import Cookies from "cookie-universal";
import { toast } from "react-toastify";
import axios from "axios";

export const refreshAccessToken = async () => {
  const cookies = Cookies();
  const email = cookies.get("email");

  try {
    const response = await axios.post(
      BASEURL+`/${REFRESHENDPOINT}${email}`/*,undefined,withCredentials:true*/
    );
    return response;
  } catch (error) {
    if (error.response.status === 401) {
      // Navigate("/login");

      cookies.removeAll();
      location.pathname="/";
    }
  }
};
function Login() {
  const cookies = Cookies();
  const { isDarkMode } = useContext(ThemeContext);
  const { login, auth, setAuth, studentId } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const reset = true;
  const navigate = useNavigate();

  async function handleFormSubmit(e) {
    e.preventDefault();
    setErrors(true);
    if (password.length < 8) {
      return;
    }
    try {
      const body = JSON.stringify({
        email,
        password,
      });
      setIsLoading(true);
      let res = await sendRequest(BASEURL, LOGIN_ENDPOINT, "POST", body);
      if (res.status === 200) {
        if(!res.data){

          const userRole = cookies.get("role");
          const studentId = cookies.get("id");
          setAuth({ role: userRole });
          login(email, studentId);
          if (userRole === "Admin") {
            navigate("/dashboard");
          } else if (userRole === "Student") {
            navigate(`/dashboardstu/${studentId}`);
          }
          toast.success("تم تسجيل الدخول بنجاح");
        }
        else if(res.data.emailConfirmed==false){
          const date=new Date()
          date.setDate(date.getDate()+1)
          cookies.set("email",email,{expires:date})
          const sendCodeBody = JSON.stringify({
            email:email,
            reset:false,
          });
          const sendCodeRes = await sendRequest(
            BASEURL,
            SENDCODE_ENDPOINT,
            "POST",
            sendCodeBody
          );
          if (sendCodeRes.status === 200) {
            toast.success("تم ارسال الكود بنجاح يرجي ادخال الكود " );
            navigate("/verificationCode");
          }
        }
      }
      else{
        toast.error("البريد الالكتروني او كلمة السر خطأ")
      }
    } catch (error) {
  

      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();
    cookies.set("email",email)
    const sendCodeBody = JSON.stringify({
      email,
      reset,
    });
    const sendCodeRes = await sendRequest(
      BASEURL,
      SENDCODE_ENDPOINT,
      "POST",
      sendCodeBody
    );
    if (sendCodeRes.status === 200) {
      navigate("/forget-password");
      toast.success("تم ارسال الكود بنجاح");
    }
  };

  useEffect(() => {
    document.title = "تسجيل الدخول";

    return () => {
      document.title = "مستر أحمد جابر";
    };
  }, []);

  return (
    <>
      <NavbarApp />
      <SpinnerModal isLoading={isLoading} />
      <div
        className={`grid grid-cols-1  lg:grid-cols-10 gap-4 mt-0 lg:pt-4 ${
          isDarkMode ? "bg-neutral-900" : ""
        }`}
      >
        <div className="col-span-5 col-start-3 pt-4 ">
          <div
            className={`text-right  text-[20px] font-medium leading-normal mb-5 md:mb-3 ${
              isDarkMode ? " text-sky-400" : "text-amber-400"
            }`}
          >
            : تسجيل الدخول
          </div>
          <p
            className={`mb-14 text-right text-base md:text-xl font-normal  leading-normal ${
              isDarkMode ? "text-white" : " text-gray-800"
            }`}
          >
            ادخل إلى الحساب الخاص بك من خلال إدخال البريد الإلكتروني و كلمة السر
          </p>
          <form action="" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-1">
              <div>
                <label
                  htmlFor="Email"
                  className={`my-1  flex justify-end ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  البريد الإلكتروني
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
                      d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"
                    />
                  </svg>
                </label>
                <input
                  type="email"
                  id="studentEmail"
                  placeholder="البريد الإلكتروني الخاص بك لتسجيل الدخول"
                  className={`rounded-lg p-2 border-none w-full text-right ${
                    isDarkMode ? "bg-white" : "bg-stone-300"
                  }`}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="text-right ">
                <label
                  htmlFor="password"
                  className={`my-1 flex justify-end ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  كلمة السر{" "}
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
                  type="password"
                  id="studentPassword"
                  placeholder="ادخل كلمة السر لتسجيل الدخول"
                  className={`rounded-lg p-2 border-none w-full text-right ${
                    isDarkMode ? "bg-white" : "bg-stone-300"
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password.length < 8 && errors && (
                  <p className="my-1 text-red-700 ">
                    كلمة السر لابد ان تتكون من 8 رموز
                  </p>
                )}
              </div>

              {/*  */}

              <div className="grid grid-cols-1 gap-4 mt-3 mb-40 md:mb-0 ">
                <div className="text-right ">
                  <button
                    className={` rounded-[9px] shadow-xl px-4 lg:px-20 py-2 text-white  transition duration-700 ${
                      isDarkMode
                        ? "bg-sky-400 hover:bg-sky-500"
                        : "bg-gray-800 hover:bg-gray-900"
                    }`}
                  >
                    تسجيل الدخول
                  </button>

                  <h2 className="my-4 text-xl font-normal leading-normal ext-center text-stone-400">
                    {" "}
                    لا يوجد لديك حساب؟
                    <Link
                      className={`text-center   text-xl font-normal leading-normal ${
                        isDarkMode
                          ? "text-sky-400 hover:text-amber-400"
                          : "text-amber-400 hover:text-amber-950"
                      }`}
                      to="/signup"
                    >
                      {" "}
                      انشئ حسابك الآن
                    </Link>
                  </h2>
                  <button
                    className={` text-xl font-normal leading-normal ${
                      isDarkMode
                        ? "text-sky-400 hover:text-amber-400"
                        : " text-amber-400 hover:text-amber-950"
                    }`}
                    onClick={async (e)=>await handleResetPassword(e)}
                  >
                    هل نسيت كلمة السر ؟
                  </button>
                </div>
                <div></div>
              </div>
            </div>
          </form>
        </div>

        <div className="order-first col-span-10 lg:col-span-3 lg:order-last">
          <img
            src={boyImg}
            className=" opacity-60 lg:h-[100vh] boyImg"
            alt=" login image"
            loading="lazy"
          />
        </div>
      </div>
      <FooterApp />
    </>
  );
}

export default Login;
