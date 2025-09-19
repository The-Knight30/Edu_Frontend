"use client"
import { useState, useEffect, useContext } from "react"
import type React from "react"

import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../Context/ThemeContext.jsx"
import sendRequest from "../Shared/sendRequest.ts"
import { BASEURL, VALIDATERESETPASSWORD_ENDPOINT } from "../API/API.jsx"
import SpinnerModal from "../Shared/SpinnerModal.jsx"
import { toast } from "react-toastify"
import Cookies from "cookie-universal"

function ForgetPassword() {
  const cookies = Cookies()
  const { isDarkMode } = useContext(ThemeContext)
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const email = cookies.get("email")
      const endpoint = `${VALIDATERESETPASSWORD_ENDPOINT}?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}&isForResetPassword=true`
      const res = await sendRequest(BASEURL, endpoint, "POST", undefined as any, {}, false)

      if (res.status === 200) {
        toast.success("تم ادخال الكود بنجاح")
        navigate("/reset")
      }
    } catch (err) {
      toast.error("خطأ في الكود")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    document.title = "إعادة تاعيين كلمة المرور"
    return () => {
      document.title = "مستر أحمد جابر"
    }
  }, [])

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-neutral-900" : ""}`}>
      <SpinnerModal isLoading={isLoading} />
      <div className="grid grid-cols-7 lg:grid-cols-10 gap-4 lg:mb-0 mt-0 lg:pt-4 min-h-screen">
        <div className="col-span-5 col-start-3 pt-6">
          <div
            className={`text-right text-[20px] font-medium leading-normal mb-14 ${isDarkMode ? "text-sky-400" : "text-amber-400"}`}
          >
            إعادة تاعيين كلمة السر
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-1">
              <div className="text-right">
                <label htmlFor="code" className={`my-1 flex justify-end ${isDarkMode ? "text-white" : "text-black"}`}>
                  الكود
                </label>
                <input
                  type="number"
                  id="code"
                  placeholder="ادخل الكود"
                  className={`rounded-lg p-2 border-none w-full text-right ${isDarkMode ? "bg-white" : "bg-stone-300"}`}
                  required
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-3 md:mb-0">
              <div className="mt-5 text-right">
                <button
                  className={`rounded-[9px] shadow-xl px-4 lg:px-20 py-2 mb-52 text-white transition duration-700 ${isDarkMode ? "bg-sky-400 hover:bg-sky-500" : "bg-gray-800 hover:bg-gray-900"}`}
                >
                  إرسال الكود
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword
