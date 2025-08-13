import { useState, useEffect, useContext } from "react";
import NavbarApp from "./../HomePage/NavbarApp";
import boyImg from "../../assets/boy.jpg";
import FooterApp from "./../FooterApp";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "./../Context/ThemeContext";
import { BASEURL, SENDCODE_ENDPOINT, SIGNUP_ENDPOINT } from "../API/API";
import sendRequest from "../Shared/sendRequest";
import { AuthContext } from "../Context/AuthContext";
import SpinnerModal from "../Shared/SpinnerModal";
import { toast } from "react-toastify";
import Cookies from "cookie-universal"
function SignUp() {
  const { isDarkMode } = useContext(ThemeContext);
  const cookies = Cookies()
  const { login } = useContext(AuthContext);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [dadPhone, setdadPhone] = useState("");
  const [phone, setphone] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [city, setcity] = useState("");
  const [email, setEmail] = useState("");
  const [comparePassword, setcomparePassword] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(false);
  const [reset, setRest] = useState(false);
  const [isLoading, setIsLoading] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "انشاء حساب";

    return () => {
      document.title = "مستر أحمد جابر";
    };
  }, []);
  // contain the names of goverments
  const egyptianGovernorates = [
    "القاهرة",
    "الإسكندرية",
    "الجيزة",
    "الأقصر",
    "أسوان",
    "بورسعيد",
    "السويس",
    "أسيوط",
    "الإسماعيلية",
    "البحر الأحمر",
    "دمياط",
    "قنا",
    "الشرقية",
    "الفيوم",
    "المنيا",
    "بني سويف",
    "سوهاج",
    "البحيرة",
    "الغربية",
    "كفر الشيخ",
    "مطروح",
    "الوادي الجديد",
    "شمال سيناء",
    "جنوب سيناء",
    "الدقهلية",
    "المنوفية",
  ];
  // contain the names of Students Levels
  const StudentsLevels = [
    "الصف الدراسي الأول",
    "الصف الدراسي الثاني",
    "الصف الدراسي الثالث",
  ];

  async function handleFormSubmit(e) {
    let flag = true;
    e.preventDefault();
    setErrors(true);
    if (
      password.length < 8 ||
      comparePassword !== password ||
      phone.length <= 10 ||
      dadPhone === phone
    ) {
      flag = false;
    } else flag = true;

    if (flag) {
      try {
        const body = JSON.stringify({
          firstName,
          lastName,
          phone,
          dadPhone,
          city,
          email,
          password,
          comparePassword,
        });
        setIsLoading(true);

        const res = await sendRequest(BASEURL, SIGNUP_ENDPOINT, "POST", body);

        if (res.status === 200) {
          login(email);
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
          const date = new Date()
          date.setDate(date.getDate() + 1)
          cookies.set("email", email, { expires: date })
          if (sendCodeRes.status === 200) {
            toast.success("تم ارسال الكود بنجاح يرجي ادخال الكود ");
            navigate("/verificationCode");
          }
        } else {
          toast.error("البريد الالكتروني غير صالح او مسجل لدينا بالفعل");
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <>
      <NavbarApp />
      <SpinnerModal isLoading={isLoading} />
      <div
        className={` grid grid-cols-6 lg:grid-cols-10 gap-4 mt-0   ${isDarkMode ? "bg-neutral-900" : ""
          }`}
      >
        <div className="col-span-6 col-start-2 pt-8 ">
          <div className=" text-right text-amber-400 text-[20px] font-medium leading-normal mb-2">
            أنشئ حسابك الآن
          </div>
          <form action="" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 gap-4 my-1 lg:grid-cols-2 ">
              <div className="order-2 text-right lg:order-none ">
                <label
                  htmlFor="lastStudentName"
                  className={`my-1 flex justify-end ${isDarkMode ? "text-white" : "text-black"
                    }`}
                >
                  الاسم الأخير{" "}
                  <svg
                    xmlns=" http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-6 ${isDarkMode ? "text-white" : "text-black"
                      }`}
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
                  id="lastStudentName"
                  placeholder="رجاء ادخال الاسم"
                  className={` rounded-lg p-2 border-none w-full text-right  ${isDarkMode ? "bg-white" : "bg-stone-300"
                    }`}
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="firstStudentName"
                  className={`my-1 flex justify-end ${isDarkMode ? "text-white" : "text-black"
                    }`}
                >
                  الاسم الأول
                  <svg
                    xmlns=" http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-6 ${isDarkMode ? "text-white" : "text-black"
                      }`}
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
                  id="firstStudentName"
                  placeholder="رجاء ادخال الاسم"
                  className={` rounded-lg p-2 border-none w-full text-right  ${isDarkMode ? "bg-white" : "bg-stone-300"
                    }`}
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>

            {/*  */}
            <div className="grid grid-cols-1 gap-4 my-1 lg:grid-cols-2">
              <div>
                <label
                  htmlFor="FatherNumber"
                  className={`my-1 flex justify-end ${isDarkMode ? "text-white" : "text-black"
                    }`}
                >
                  رقم هاتف ولي الأمر{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-5 ${isDarkMode ? "text-white" : "text-black"
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
                  type="number"
                  id="FatherNumber"
                  placeholder="قم بإدخال رقم الهاتف الخاص بولي الأمر"
                  className={` rounded-lg p-2 border-none w-full text-right  ${isDarkMode ? "bg-white" : "bg-stone-300"
                    }`}
                  value={dadPhone}
                  onChange={(e) => setdadPhone(e.target.value)}
                  required
                />
                {dadPhone == phone && errors && (
                  <p className="my-1 text-right text-red-700">
                    يرجي إدخال رقم مختلف{" "}
                  </p>
                )}
              </div>
              <div className="text-right ">
                <label
                  htmlFor="username"
                  className={`my-1 flex justify-end ${isDarkMode ? "text-white" : "text-black"
                    }`}
                >
                  رقم الهاتف{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-5 ${isDarkMode ? "text-white" : "text-black"
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
                  type="number"
                  id="username"
                  placeholder="قم بإدخال رقم الهاتف الخاص بك"
                  className={` rounded-lg p-2 border-none w-full text-right  ${isDarkMode ? "bg-white" : "bg-stone-300"
                    }`}
                  value={phone}
                  onChange={(e) => setphone(e.target.value)}
                  required
                />
                {phone.length <= 10 && errors && (
                  <p className="my-1 text-right text-red-700">ادخل رقم صحيح</p>
                )}
              </div>
            </div>

            {/*  */}
            <div className="grid grid-cols-1 gap-4 my-1 lg:grid-cols-2">
              <div className="">
                <label
                  htmlFor="studentLevel"
                  className={`my-0.5 flex justify-end ${isDarkMode ? "text-white" : "text-black"
                    }`}
                >
                  الصف الدراسي
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-6 ${isDarkMode ? "text-white" : "text-black"
                      }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
                    />
                  </svg>
                </label>
                <select
                  id="studentLevel"
                  className={` rounded-lg p-2 border-none w-full text-right  ${isDarkMode ? "bg-white" : "bg-stone-300"
                    }`}
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  required
                >
                  <option value="">رجاء اختيار الصف الدراسي</option>
                  {StudentsLevels.map((level, index) => (
                    <option key={index} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="governorate"
                  className={`my-0.5 flex justify-end ${isDarkMode ? "text-white" : "text-black"
                    }`}
                >
                  المحافظة
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-6 ${isDarkMode ? "text-white" : "text-black"
                      }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
                    />
                  </svg>
                </label>
                <div className="">
                  <select
                    id="governorate"
                    className={` rounded-lg p-2 border-none w-full text-right  ${isDarkMode ? "bg-white" : "bg-stone-300"
                      }`}
                    value={city}
                    onChange={(e) => setcity(e.target.value)}
                    required
                  >
                    <option value="">رجاء اختيار المحافظة</option>
                    {egyptianGovernorates.map((governorate, index) => (
                      <option key={index} value={governorate}>
                        {governorate}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/*  */}
            <div className="grid grid-cols-1 gap-4 my-1">
              <div>
                <label
                  htmlFor="studentEmail"
                  className={`my-1 flex justify-end ${isDarkMode ? "text-white" : "text-black"
                    }`}
                >
                  البريد الإلكتروني
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-6 ${isDarkMode ? "text-white" : "text-black"
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
                  className={` rounded-lg p-2 border-none w-full text-right  ${isDarkMode ? "bg-white" : "bg-stone-300"
                    }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {/* {errors && emailError === 401 && <p className="my-1 text-red-700 ">هذا الايميل موجود</p>} */}
              </div>
            </div>

            {/*  */}
            <div className="grid grid-cols-1 gap-4 my-1 lg:grid-cols-2">
              <div className="order-2 text-right lg:order-none ">
                <label
                  htmlFor="confirmStudentPassword"
                  className={`my-1 flex justify-end ${isDarkMode ? "text-white" : "text-black"
                    }`}
                >
                  تأكيد كلمة السر{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-6 ${isDarkMode ? "text-white" : "text-black"
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
                  id="confirmStudentPassword"
                  placeholder="أعد كتابة كلمة السر للتأكيد"
                  className={` rounded-lg p-2 border-none w-full text-right  ${isDarkMode ? "bg-white" : "bg-stone-300"
                    }`}
                  value={comparePassword}
                  onChange={(e) => setcomparePassword(e.target.value)}
                  required
                />
                {comparePassword !== password && errors && (
                  <p className="my-1 text-red-700">كلمة السر ليست متطابقة</p>
                )}
              </div>
              <div className="text-right ">
                <label
                  htmlFor="studentPassword"
                  className={`my-1 flex justify-end ${isDarkMode ? "text-white" : "text-black"
                    }`}
                >
                  كلمة السر
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-6 ${isDarkMode ? "text-white" : "text-black"
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
                  placeholder="ادخل كلمة السر التي تريدها"
                  className={` rounded-lg p-2 border-none w-full text-right  ${isDarkMode ? "bg-white" : "bg-stone-300"
                    }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {password.length < 8 && errors && (
                  <p className="my-1 text-red-700 ">
                    كلمة السر لابد ان تتكون من 8 رموز
                  </p>
                )}
              </div>
            </div>
            {/*  */}
            <div className="grid grid-cols-1 gap-4 my-3 ">
              <div className="text-right ">
                <button
                  className={`rounded-[9px] text-white shadow px-4 lg:px-20 py-3 my-2 transition duration-700 ${isDarkMode
                      ? "bg-amber-400 hover:bg-amber-500 "
                      : "bg-gray-800 hover:bg-gray-900 "
                    }`}
                >
                  !انشئ الحساب
                </button>

                <h2 className="mt-2 text-base font-normal leading-normal ext-center text-stone-400">
                  يوجد حساب بالفعل؟
                  <Link
                    className={`text-center text-base font-normal leading-normal ${isDarkMode ? "text-sky-400" : "text-amber-400"
                      }`}
                    to="/login"
                  >
                    ادخل إلى حسابك الآن
                  </Link>
                </h2>
              </div>

              <div></div>
            </div>
          </form>

          {/*  */}
        </div>
        <div className="order-first col-span-10 lg:col-span-3 lg:order-last">
          <img
            src={boyImg}

            className={`opacity-60 lg:h-[100vh] boyImg`}
            alt="sign up image"
          />
        </div>
      </div>

      <FooterApp />
    </>
  );
}

export default SignUp;
