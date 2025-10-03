"use client"
import React, { useState, useEffect, useContext } from "react"

import { Link, useNavigate } from "react-router-dom"
import { ThemeContext } from "../Context/ThemeContext"
import { BASEURL, LOGIN_ENDPOINT, SENDCODE_ENDPOINT } from "../API/API"
import sendRequest from "../Shared/sendRequest"
import { AuthContext } from "../Context/AuthContext"
import SpinnerModal from "../Shared/SpinnerModal"
import { toast } from "react-toastify"
import Cookies from "cookie-universal"

function Login() {
  const { isDarkMode } = useContext(ThemeContext)
  const { login, setAuth } = useContext(AuthContext)
  const cookies = Cookies()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const reset = true
  const navigate = useNavigate()

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors(true)
    if (password.length < 8) {
      return
    }
    try {
      const body = JSON.stringify({
        email,
        password,
      })
      setIsLoading(true)
      const res = await sendRequest(
        BASEURL,
        LOGIN_ENDPOINT,
        "POST",
        body,
        { Accept: "*/*", "Content-Type": "application/json-patch+json" },
        true,
      )
      if (res.status === 200) {
        if (!res.data) {
          const userRole = cookies.get("role") || localStorage.getItem("role")
          const studentId = cookies.get("id") || localStorage.getItem("id")
          if (userRole) {
            setAuth({ role: userRole })
            login(email, studentId || "")
            if (userRole === "Admin") {
              navigate("/dashboard")
            } else if (userRole === "Student") {
              navigate(`/dashboardstu/${studentId}`)
            }
            toast.success("تم تسجيل الدخول بنجاح")
          }
        } else if (res.data.emailConfirmed == false) {
          const date = new Date()
          date.setDate(date.getDate() + 1)
          cookies.set("email", email, { expires: date, secure: true, sameSite: "none" })
          const sendCodeRes = await sendRequest(
            BASEURL,
            `${SENDCODE_ENDPOINT}?email=${encodeURIComponent(email)}&isForResetPassword=false`,
            "POST",
            undefined as any,
            {},
            false,
          )
          if (sendCodeRes.status === 200) {
            toast.success("تم ارسال الكود بنجاح يرجي ادخال الكود ")
            navigate("/verificationCode")
          } else {
            toast.error("تعذر إرسال الكود")
          }
        } else if (res.data.emailConfirmed == true) {
          // Save tokens and identity from response
          const { jwt, refreshToken, role, id } = res.data || {}
          if (jwt) cookies.set("accessToken", jwt, { secure: true, sameSite: "none" })
          if (refreshToken) cookies.set("refreshToken", refreshToken, { secure: true, sameSite: "none" })
          cookies.set("email", email, { secure: true, sameSite: "none" })
          if (role) cookies.set("role", role, { secure: true, sameSite: "none" })
          if (id) cookies.set("id", id, { secure: true, sameSite: "none" })

          setAuth({ role: role || "" })
          login(email, id || "")
          if (role === "Admin") {
            navigate("/dashboard")
          } else if (role === "Student") {
            navigate(`/dashboardstu/${id}`)
          } else {
            navigate("/")
          }
          toast.success("تم تسجيل الدخول بنجاح")
        }
      } else {
        toast.error("البريد الالكتروني او كلمة السر خطأ")
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("email", email)
    const sendCodeRes = await sendRequest(
      BASEURL,
      `${SENDCODE_ENDPOINT}?email=${encodeURIComponent(email)}&isForResetPassword=${reset}`,
      "POST",
      undefined as any,
      {},
      false,
    )
    if (sendCodeRes.status === 200) {
      navigate("/forget-password")
      toast.success("تم ارسال الكود بنجاح")
    }
  }

  useEffect(() => {
    document.title = "تسجيل الدخول"
    return () => {
      document.title = "مستر أحمد جابر"
    }
  }, [])

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-neutral-900" : ""}`}>
      <SpinnerModal isLoading={isLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 mt-0 lg:pt-4">
        <div className="col-span-5 col-start-3 pt-4">
          <div
            className={`text-right text-[20px] font-medium leading-normal mb-5 md:mb-3 ${isDarkMode ? " text-sky-400" : "text-amber-400"
            }`}
          >
            : تسجيل الدخول
          </div>
          <p
            className={`mb-14 text-right text-base md:text-xl font-normal leading-normal ${isDarkMode ? "text-white" : " text-gray-800"
            }`}
          >
            ادخل إلى الحساب الخاص بك من خلال إدخال البريد الإلكتروني و كلمة السر
          </p>
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-1">
              <div>
                <label htmlFor="Email" className={`my-1 flex justify-end ${isDarkMode ? "text-white" : "text-black"}`}>
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  id="studentEmail"
                  placeholder="البريد الإلكتروني الخاص بك لتسجيل الدخول"
                  className={`rounded-lg p-2 border-none w-full text-right ${isDarkMode ? "bg-white" : "bg-stone-300"}`}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="text-right ">
                <label
                  htmlFor="password"
                  className={`my-1 flex justify-end ${isDarkMode ? "text-white" : "text-black"}`}
                >
                  كلمة السر
                </label>
                <input
                  type="password"
                  id="studentPassword"
                  placeholder="ادخل كلمة السر لتسجيل الدخول"
                  className={`rounded-lg p-2 border-none w-full text-right ${isDarkMode ? "bg-white" : "bg-stone-300"}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password.length < 8 && errors && (
                  <p className="my-1 text-red-700 ">كلمة السر لابد ان تتكون من 8 رموز</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 mt-3 mb-40 md:mb-0 ">
                <div className="text-right ">
                  <button
                    className={`rounded-[9px] shadow-xl px-4 lg:px-20 py-2 text-white transition duration-700 ${isDarkMode ? "bg-sky-400 hover:bg-sky-500" : "bg-gray-800 hover:bg-gray-900"
                    }`}
                  >
                    تسجيل الدخول
                  </button>

                  <h2 className="my-4 text-xl font-normal leading-normal ext-center text-stone-400">
                    لا يوجد لديك حساب؟
                    <Link
                      className={`text-center text-xl font-normal leading-normal ${isDarkMode ? "text-sky-400 hover:text-amber-400" : "text-amber-400 hover:text-amber-950"
                      }`}
                      to="/signup"
                    >
                      انشئ حسابك الآن
                    </Link>
                  </h2>
                  <button
                    className={`text-xl font-normal leading-normal ${isDarkMode ? "text-sky-400 hover:text-amber-400" : " text-amber-400 hover:text-amber-950"
                    }`}
                    onClick={async (e) => await handleResetPassword(e)}
                  >
                    هل نسيت كلمة السر ؟
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;