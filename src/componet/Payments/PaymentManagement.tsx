"use client"
import { useContext, useState } from "react"
import type React from "react"
import { ThemeContext } from "../Context/ThemeContext"
import { ADDSTUDENTTOCOURSE, REMOVESTUDENFROMCOURSE, BASEURL } from "../API/API"
import sendRequest from "../Shared/sendRequest.ts"
import SpinnerModal from "../Shared/SpinnerModal"
import { toast } from "react-toastify"
import { UserPlus, UserMinus, CreditCard, Users } from "lucide-react"

function PaymentManagement() {
  const { isDarkMode } = useContext(ThemeContext)
  const [addStudentData, setAddStudentData] = useState({ email: "", courseId: "" })
  const [removeStudentData, setRemoveStudentData] = useState({ email: "", courseId: "" })
  const [isLoading, setIsLoading] = useState(false)

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const body = {
        email: addStudentData.email,
        courseId: Number.parseInt(addStudentData.courseId),
      }

      const res = await sendRequest(BASEURL, ADDSTUDENTTOCOURSE, "POST", JSON.stringify(body))

      if (res.status === 200) {
        toast.success("تم إضافة الطالب للكورس بنجاح")
        setAddStudentData({ email: "", courseId: "" })
      } else {
        toast.error("فشل في إضافة الطالب - تأكد من البيانات")
      }
    } catch (error) {
      console.error("Error adding student to course:", error)
      toast.error("حدث خطأ أثناء إضافة الطالب")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const body = {
        email: removeStudentData.email,
        courseId: Number.parseInt(removeStudentData.courseId),
      }

      const res = await sendRequest(BASEURL, REMOVESTUDENFROMCOURSE, "POST", JSON.stringify(body))

      if (res.status === 200) {
        toast.success("تم حذف الطالب من الكورس بنجاح")
        setRemoveStudentData({ email: "", courseId: "" })
      } else {
        toast.error("فشل في حذف الطالب - تأكد من البيانات")
      }
    } catch (error) {
      console.error("Error removing student from course:", error)
      toast.error("حدث خطأ أثناء حذف الطالب")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <SpinnerModal isLoading={isLoading} />
      <div className={`min-h-screen p-6 ${isDarkMode ? "bg-gray-950" : "bg-amber-50"}`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CreditCard className={`w-8 h-8 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
              <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                إدارة المدفوعات والاشتراكات
              </h1>
            </div>
            <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              إضافة وحذف الطلاب من الكورسات عبر نظام Paymob
            </p>
          </div>

          {/* Main Content */}
          <div className="w-full">
            <div className={`flex justify-center mb-8 ${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-1 shadow-lg`}>
              <button
                onClick={() => { }}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex-1 ${isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-800"
                  }`}
                style={{ backgroundColor: "transparent" }}
              >
                إضافة طالب للكورس
              </button>
              <button
                onClick={() => { }}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex-1 ${isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-800"
                  }`}
                style={{ backgroundColor: "transparent" }}
              >
                حذف طالب من الكورس
              </button>
            </div>

            {/* Add Student Tab */}
            <div className={`${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"} p-6 rounded-lg shadow-lg`}>
              <div className="mb-4">
                <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  <UserPlus className="w-5 h-5 text-green-500" />
                  إضافة طالب جديد للكورس
                </h2>
                <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  أدخل بريد الطالب الإلكتروني ورقم الكورس لإضافته للاشتراك
                </p>
              </div>
              <form onSubmit={handleAddStudent} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="add-email" className={isDarkMode ? "text-white" : "text-gray-900"}>
                    البريد الإلكتروني للطالب
                  </label>
                  <input
                    id="add-email"
                    type="email"
                    placeholder="student@example.com"
                    value={addStudentData.email}
                    onChange={(e) => setAddStudentData((prev) => ({ ...prev, email: e.target.value }))}
                    className={`w-full p-2 border rounded-lg text-right ${isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="add-course-id" className={isDarkMode ? "text-white" : "text-gray-900"}>
                    رقم الكورس
                  </label>
                  <input
                    id="add-course-id"
                    type="number"
                    placeholder="123"
                    value={addStudentData.courseId}
                    onChange={(e) => setAddStudentData((prev) => ({ ...prev, courseId: e.target.value }))}
                    className={`w-full p-2 border rounded-lg text-right ${isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-2 rounded-lg text-white ${isDarkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"}`}
                  disabled={isLoading}
                >
                  <UserPlus className="w-4 h-4 mr-2 inline" />
                  إضافة الطالب للكورس
                </button>
              </form>
            </div>

            {/* Remove Student Tab */}
            <div className={`${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"} p-6 rounded-lg shadow-lg mt-6`}>
              <div className="mb-4">
                <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  <UserMinus className="w-5 h-5 text-red-500" />
                  حذف طالب من الكورس
                </h2>
                <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  أدخل بريد الطالب الإلكتروني ورقم الكورس لحذفه من الاشتراك
                </p>
              </div>
              <form onSubmit={handleRemoveStudent} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="remove-email" className={isDarkMode ? "text-white" : "text-gray-900"}>
                    البريد الإلكتروني للطالب
                  </label>
                  <input
                    id="remove-email"
                    type="email"
                    placeholder="student@example.com"
                    value={removeStudentData.email}
                    onChange={(e) => setRemoveStudentData((prev) => ({ ...prev, email: e.target.value }))}
                    className={`w-full p-2 border rounded-lg text-right ${isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="remove-course-id" className={isDarkMode ? "text-white" : "text-gray-900"}>
                    رقم الكورس
                  </label>
                  <input
                    id="remove-course-id"
                    type="number"
                    placeholder="123"
                    value={removeStudentData.courseId}
                    onChange={(e) => setRemoveStudentData((prev) => ({ ...prev, courseId: e.target.value }))}
                    className={`w-full p-2 border rounded-lg text-right ${isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-2 rounded-lg text-white ${isDarkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-600 hover:bg-red-700"}`}
                  disabled={isLoading}
                >
                  <UserMinus className="w-4 h-4 mr-2 inline" />
                  حذف الطالب من الكورس
                </button>
              </form>
            </div>

            {/* Info Section */}
            <div className={`mt-8 p-6 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-blue-50 border-blue-200"}`}>
              <div className="mb-4">
                <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-blue-900"}`}>
                  <Users className="w-5 h-5 text-blue-500" />
                  معلومات مهمة
                </h2>
              </div>
              <div className={`space-y-3 ${isDarkMode ? "text-gray-300" : "text-blue-800"}`}>
                <p>• يتم التعامل مع نظام Paymob للمدفوعات الإلكترونية</p>
                <p>• تأكد من صحة البريد الإلكتروني ورقم الكورس قبل الإرسال</p>
                <p>• سيتم إرسال إشعار للطالب عند إضافته أو حذفه من الكورس</p>
                <p>• في حالة وجود مشكلة، تواصل مع الدعم الفني</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentManagement