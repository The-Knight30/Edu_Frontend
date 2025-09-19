"use client"
import React, { useState, useEffect, useContext } from "react"

import { Link, useNavigate } from "react-router-dom"
import { ThemeContext } from "../Context/ThemeContext"
import { BASEURL, SENDCODE_ENDPOINT, SIGNUP_ENDPOINT } from "../API/API"
import sendRequest from "../Shared/sendRequest" // Updated import to use the shared sendRequest from correct folder
import { AuthContext } from "../Context/AuthContext"
import SpinnerModal from "../Shared/SpinnerModal"
import { toast } from "react-toastify"
import Cookies from "cookie-universal"

function SignUp() {
  const { isDarkMode } = useContext(ThemeContext)
  const cookies = Cookies()
  const { login } = useContext(AuthContext)
  const [lastName, setLastName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [dadPhone, setDadPhone] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [city, setCity] = useState("")
  const [email, setEmail] = useState("")
  const [comparePassword, setComparePassword] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState(false)
  const [reset, setReset] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  useEffect(() => {
    document.title = "انشاء حساب"
    return () => {
      document.title = "مستر أحمد جابر"
    }
  }, [])

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
  ]

  // contain the names of Students Levels
  const StudentsLevels = ["الصف الدراسي الأول", "الصف الدراسي الثاني", "الصف الدراسي الثالث"]

  async function handleFormSubmit(e: React.FormEvent) {
    let flag = true
    e.preventDefault()
    setErrors(true)
    if (password.length < 8 || comparePassword !== password || phone.length <= 10 || dadPhone === phone) {
      flag = false
    } else flag = true

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
        })
        setIsLoading(true)

        const res = await sendRequest(BASEURL, SIGNUP_ENDPOINT, "POST", body)

        if (res.status === 200) {
          login(email)
          const sendCodeRes = await sendRequest(
            BASEURL,
            `${SENDCODE_ENDPOINT}?email=${encodeURIComponent(email)}&isForResetPassword=${reset}`,
            "POST",
            undefined as any,
            {},
            false,
          )
          const date = new Date()
          date.setDate(date.getDate() + 1)
          cookies.set("email", email, { expires: date, secure: true, sameSite: "none" })
          if (sendCodeRes.status === 200) {
            toast.success("تم ارسال الكود بنجاح يرجي ادخال الكود ")
            navigate("/verificationCode")
          }
        } else {
          toast.error("البريد الالكتروني غير صالح او مسجل لدينا بالفعل")
        }
      } catch (err) {
        toast.error("حدث خطأ")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-neutral-900" : ""}`}>
      <SpinnerModal isLoading={isLoading} />
      <div className="grid grid-cols-6 lg:grid-cols-10 gap-4 mt-0">
        <div className="col-span-6 col-start-2 pt-8">
          <div className="text-right text-amber-400 text-[20px] font-medium leading-normal mb-2">أنشئ حسابك الآن</div>
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 gap-4 my-1 lg:grid-cols-2">
              <div className="order-2 text-right lg:order-none">
                <label
                  htmlFor="lastStudentName"
                  className={`my-1 flex justify-end ${isDarkMode ? "text-white" : "text-black"}`}
                >
                  الاسم الأخير
                </label>
                <input
                  type="text"
                  id="lastStudentName"
                  placeholder="رجاء ادخال الاسم"
                  className={`rounded-lg p-2 border-none w-full text-right ${isDarkMode ? "bg-white" : "bg-stone-300"}`}
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="firstStudentName"
                  className={`my-1 flex justify-end ${isDarkMode ? "text-white" : "text-black"}`}
                >
                  الاسم الأول
                </label>
                <input
                  type="text"
                  id="firstStudentName"
                  placeholder="رجاء ادخال الاسم"
                  className={`rounded-lg p-2 border-none w-full text-right ${isDarkMode ? "bg-white" : "bg-stone-300"}`}
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 my-1 lg:grid-cols-2">
              <div>
                <label
                  htmlFor="FatherNumber"
                  className={`my-1 flex justify-end ${isDarkMode ? "text-white" : "text-black"}`}
                >
                  رقم هاتف ولي الأمر
                </label>
                <input
                  type="number"
                  id="FatherNumber"
                  placeholder="قم بإدخال رقم الهاتف الخاص بولي الأمر"
                  className={`rounded-lg p-2 border-none w-full text-right ${isDarkMode ? "bg-white" : "bg-stone-300"}`}
                  value={dadPhone}
                  onChange={(e) => setDadPhone(e.target.value)}
                  required
                />
                {dadPhone == phone && errors && <p className="my-1 text-right text-red-700">يرجي إدخال رقم مختلف </p>}
              </div>
              <div className="text-right">
                <label
                  htmlFor="username"
                  className={`my-1 flex justify-end ${isDarkMode ? "text-white" : "text-black"}`}
                >
                  رقم الهاتف
                </label>
                <input
                  type="number"
                  id="username"
                  placeholder="قم بإدخال رقم الهاتف الخاص بك"
                  className={`rounded-lg p-2 border-none w-full text-right ${isDarkMode ? "bg-white" : "bg-stone-300"}`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                {phone.length <= 10 && errors && <p className="my-1 text-right text-red-700">ادخل رقم صحيح</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 my-1 lg:grid-cols-2">
              <div>
                <label
                  htmlFor="studentLevel"
                  className={`my-0.5 flex justify-end ${isDarkMode ? "text-white" : "text-black"}`}
                >
                  الصف الدراسي
                </label>
                <select
                  id="studentLevel"
                  className={`rounded-lg p-2 border-none w-full text-right ${isDarkMode ? "bg-white" : "bg-stone-300"}`}
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
                  className={`my-0.5 flex justify-end ${isDarkMode ? "text-white" : "text-black"}`}
                >
                  المحافظة
                </label>
                <select
                  id="governorate"
                  className={`rounded-lg p-2 border-none w-full text-right ${isDarkMode ? "bg-white" : "bg-stone-300"}`}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
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

            <div className="grid grid-cols-1 gap-4 my-1">
              <div>
                <label
                  htmlFor="studentEmail"
                  className={`my-1 flex justify-end ${isDarkMode ? "text-white" : "text-black"}`}
                >
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  id="studentEmail"
                  placeholder="البريد الإلكتروني الخاص بك لتسجيل الدخول"
                  className={`rounded-lg p-2 border-none w-full text-right ${isDarkMode ? "bg-white" : "bg-stone-300"}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 my-1 lg:grid-cols-2">
              <div className="order-2 text-right lg:order-none">
                <label
                  htmlFor="confirmStudentPassword"
                  className={`my-1 flex justify-end ${isDarkMode ? "text-white" : "text-black"}`}
                >
                  تأكيد كلمة السر
                </label>
                <input
                  type="password"
                  id="confirmStudentPassword"
                  placeholder="أعد كتابة كلمة السر للتأكيد"
                  className={`rounded-lg p-2 border-none w-full text-right ${isDarkMode ? "bg-white" : "bg-stone-300"}`}
                  value={comparePassword}
                  onChange={(e) => setComparePassword(e.target.value)}
                  required
                />
                {comparePassword !== password && errors && <p className="my-1 text-red-700">كلمة السر ليست متطابقة</p>}
              </div>
              <div className="text-right">
                <label
                  htmlFor="studentPassword"
                  className={`my-1 flex justify-end ${isDarkMode ? "text-white" : "text-black"}`}
                >
                  كلمة السر
                </label>
                <input
                  type="password"
                  id="studentPassword"
                  placeholder="ادخل كلمة السر التي تريدها"
                  className={`rounded-lg p-2 border-none w-full text-right ${isDarkMode ? "bg-white" : "bg-stone-300"}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {password.length < 8 && errors && (
                  <p className="my-1 text-red-700">كلمة السر لابد ان تتكون من 8 رموز</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 my-3">
              <div className="text-right">
                <button
                  className={`rounded-[9px] text-white shadow px-4 lg:px-20 py-3 my-2 transition duration-700 ${isDarkMode ? "bg-amber-400 hover:bg-amber-500" : "bg-gray-800 hover:bg-gray-900"
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
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp
