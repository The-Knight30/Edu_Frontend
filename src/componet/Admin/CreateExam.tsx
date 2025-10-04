"use client"

import React, { useState, useContext, useEffect } from "react"  // import React كامل عشان يحل TS error 2686
import { ThemeContext } from "../Context/ThemeContext"
import sendRequest from "../Shared/sendRequest.ts"
import sendRequestGet from "../Shared/sendRequestGet.ts"
import { BASEURL } from "../API/API"
import { toast } from "react-toastify"
import SpinnerModal from "../Shared/SpinnerModal"

interface ExamData {
  name: string
  description: string
  startDate: string
  time: number
  courseId: number
}

const CreateExam = () => {
  const { isDarkMode } = useContext(ThemeContext)
  const [isLoading, setIsLoading] = useState(false)
  const [examData, setExamData] = useState<ExamData>({
    name: "",
    description: "",
    startDate: "",
    time: 0,
    courseId: 0,
  })

  // Courses list for dropdown
  const [courses, setCourses] = useState<{ courseId: number; courseName: string }[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await sendRequestGet(`${BASEURL}/Courses/GetAllCourses`)
        const list = Array.isArray(res?.data)
          ? res.data.map((c: any) => ({ courseId: c.courseId, courseName: c.courseName }))
          : []
        setCourses(list)
        if (list.length && !examData.courseId) {
          setExamData(prev => ({ ...prev, courseId: list[0].courseId }))
        }
      } catch (e) {
        console.error("Failed to load courses", e)
      }
    }
    fetchCourses()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setExamData((prev) => ({
      ...prev,
      [name]: name === "time" || name === "courseId" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // تحقق إضافي لو الـ data valid (مثل time >0، courseId >0)
    if (examData.time <= 0 || examData.courseId <= 0 || !examData.startDate) {
      toast.error("يرجى ملء جميع الحقول بشكل صحيح")
      return
    }

    setIsLoading(true)

    try {
      // حوّل startDate لـ ISO format عشان backend يقبله (زي في curl)
      const formattedData = {
        ...examData,
        startDate: new Date(examData.startDate).toISOString(),
      }

      const response = await sendRequest(BASEURL, "Exams", "POST", formattedData)

      if (response.status === 200 || response.status === 201) {
        toast.success("تم إنشاء الامتحان بنجاح")
        setExamData({
          name: "",
          description: "",
          startDate: "",
          time: 0,
          courseId: 0,
        })
      } else {
        // Log الـ response كامل لو error
        console.error("API Response Error:", response.data || response)
        toast.error("حدث خطأ في إنشاء الامتحان: " + (response.data?.message || "خطأ غير معروف"))
      }
    } catch (error: any) {
      console.error("Error creating exam:", error.message || error)
      toast.error("حدث خطأ في الاتصال: " + (error.message || "خطأ غير معروف"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <SpinnerModal isLoading={isLoading} />
      <div className={`min-h-screen p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-xl shadow-lg p-8 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="text-center mb-8">
              <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>إنشاء امتحان جديد</h1>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto mt-4 rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    اسم الامتحان
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={examData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all ${isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                    placeholder="أدخل اسم الامتحان"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    اختر الكورس
                  </label>
                  <select
                    name="courseId"
                    value={examData.courseId || ""}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  >
                    {Array.isArray(courses) && courses.length > 0 ? (
                      courses.map((c) => (
                        <option key={c.courseId} value={c.courseId}>{c.courseName} (#{c.courseId})</option>
                      ))
                    ) : (
                      <option value="">لا توجد كورسات متاحة</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  وصف الامتحان
                </label>
                <textarea
                  name="description"
                  value={examData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all resize-none ${isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  placeholder="أدخل وصف الامتحان"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    تاريخ بداية الامتحان
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={examData.startDate}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                      }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    مدة الامتحان (بالدقائق)
                  </label>
                  <input
                    type="number"
                    name="time"
                    value={examData.time || ""}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all ${isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                    placeholder="مدة الامتحان"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-bold rounded-lg hover:from-amber-500 hover:to-yellow-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "جاري الإنشاء..." : "إنشاء الامتحان"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateExam