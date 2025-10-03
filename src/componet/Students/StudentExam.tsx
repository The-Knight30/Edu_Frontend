"use client"

import React, { useState, useContext, useEffect } from "react"  // import React كامل عشان يحل TS error 2686
import { ThemeContext } from "../Context/ThemeContext"
import sendRequestGet from "../Shared/sendRequestGet"
import sendRequest from "../Shared/sendRequest.ts"
import { BASEURL } from "../API/API"
import { toast } from "react-toastify"
import SpinnerModal from "../Shared/SpinnerModal"
import TakeExam from "./TakeExam"
import Cookies from "cookie-universal"

interface ExamInfo {
  examId: number
  name: string
  description: string
  startDate: string
  time: number
  courseId: number
  courseName: string
}

const StudentExams = () => {
  const { isDarkMode } = useContext(ThemeContext)
  const [isLoading, setIsLoading] = useState(false)
  const [exams, setExams] = useState<ExamInfo[]>([])
  const [selectedExam, setSelectedExam] = useState<number | null>(null)
  const cookies = Cookies()

  useEffect(() => {
    fetchAvailableExams()
  }, [])

  const fetchAvailableExams = async () => {
    setIsLoading(true)
    const studentId = cookies.get("id")

    try {
      const response = await sendRequestGet(`${BASEURL}/Student/AvailableExams?studentId=${studentId}`)
      console.log("API Response:", response)  // Log للـ debugging
      if (response.status === 200) {
        setExams(response.data)
      } else {
        toast.error("حدث خطأ في تحميل الامتحانات: " + (response.data?.message || ""))
      }
    } catch (error: any) {
      console.error("Error fetching exams:", error.message || error)
      toast.error("حدث خطأ في الاتصال")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (selectedExam) {
    return <TakeExam examId={selectedExam} />
  }

  return (
    <>
      <SpinnerModal isLoading={isLoading} />
      <div className={`min-h-screen p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className={`text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>الامتحانات المتاحة</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {exams.length === 0 ? (
            <div className={`text-center p-12 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}>
              <div className="text-6xl mb-4">📚</div>
              <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                لا توجد امتحانات متاحة حالياً
              </h2>
              <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                سيتم إشعارك عند توفر امتحانات جديدة
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <div
                  key={exam.examId}
                  className={`rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                    }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{exam.name}</h3>
                    <div className="px-3 py-1 bg-gradient-to-r from-blue-400 to-purple-500 text-white text-sm rounded-full">
                      {exam.time} دقيقة
                    </div>
                  </div>

                  <div className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    <p className="mb-2">
                      <span className="font-semibold">الكورس:</span> {exam.courseName}
                    </p>
                    <p className="mb-2">
                      <span className="font-semibold">الوصف:</span> {exam.description}
                    </p>
                    <p>
                      <span className="font-semibold">تاريخ البداية:</span> {formatDate(exam.startDate)}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => setSelectedExam(exam.examId)}
                      className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      بدء الامتحان
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default StudentExams