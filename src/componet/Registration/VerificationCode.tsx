"use client"
import React, { useContext, useState } from "react"

import { useNavigate } from "react-router-dom"
import sendRequest from "../Shared/sendRequest"
import { BASEURL, VERIVICATION_ENDPOINT } from "../API/API"
import { toast } from "react-toastify"
import Cookies from "cookie-universal"
import { AuthContext } from "../Context/AuthContext"

export default function VerificationCode() {
  const { login, setAuth } = useContext(AuthContext)
  const cookies = Cookies()
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const email = cookies.get("email") || ""
      if (!email) {
        setIsLoading(false)
        setError("البريد الإلكتروني غير متوفر. الرجاء العودة وإعادة المحاولة.")
        toast.error("لا يوجد بريد إلكتروني محفوظ. سنعيدك لتسجيل الدخول")
        navigate("/login")
        return
      }
      const endpoint = `${VERIVICATION_ENDPOINT}?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}&isForResetPassword=false`
      const response = await sendRequest(BASEURL, endpoint, "POST", undefined as any, {}, false)

      if (response.status === 200) {
        const { role, id } = response.data || {}
        if (role && id) {
          cookies.set("role", role)
          cookies.set("id", id)
          setAuth({ role })
          login(email, id)
          toast.success("تم التحقق والدخول بنجاح")
          if (role === "Admin") {
            navigate("/dashboard")
          } else {
            navigate(`/dashboardstu/${id}`)
          }
        } else {
          toast.success("تم التحقق بنجاح")
          navigate("/login")
        }
      } else {
        setError(response.data?.message || "رمز التحقق غير صحيح")
      }
    } catch (error: any) {
      setError("حدث خطأ في التحقق من الرمز")
      toast.error("خطأ في التحقق، تحقق من الرمز المدخل")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">تحقق من البريد الإلكتروني</h2>
          <p className="text-gray-600">أدخل رمز التحقق المرسل إلى بريدك الإلكتروني</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">رمز التحقق</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border rounded px-3 py-2 text-center text-lg tracking-widest"
              placeholder="أدخل رمز التحقق"
              maxLength={16}
              required
            />
          </div>
          <button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded" disabled={isLoading}>
            {isLoading ? "جاري التحقق..." : "تحقق"}
          </button>
        </form>
      </div>
    </div>
  )
}
