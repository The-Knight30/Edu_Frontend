"use client"

import { useState, useContext, useEffect } from "react"
import { ThemeContext } from "../Context/ThemeContext"
import { BASEURL } from "../API/API"
import sendRequestGet from "../Shared/sendRequestGet.ts"
import SpinnerModal from "../Shared/SpinnerModal"
import { Link } from "react-router-dom";


interface Exam {
  examId: number
  name: string
  description: string
  startDate: string
  time: number
  courseId: number
  courseName: string
  isCompleted: boolean
  score?: number
  totalScore?: number
}

const StudentExamsList = () => {
  const { isDarkMode } = useContext(ThemeContext)
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredExams = exams.filter(
    (exam) =>
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.courseName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true)
        // This would fetch available exams for the student
        const response = await sendRequestGet(`${BASEURL}/Student/AvailableExams`)
        setExams(response.data || [])
      } catch (error) {
        console.error("Error fetching exams:", error)
        // Mock data for demonstration
        setExams([
          {
            examId: 1,
            name: "امتحان الوحدة الأولى",
            description: "امتحان شامل على الوحدة الأولى من المنهج",
            startDate: "2025-01-20T09:00:00",
            time: 60,
            courseId: 1,
            courseName: "اللغة الإنجليزية - الصف الأول الثانوي",
            isCompleted: false,
          },
          {
            examId: 2,
            name: "امتحان الوحدة الثانية",
            description: "امتحان على الوحدة الثانية",
            startDate: "2025-01-18T10:00:00",
            time: 45,
            courseId: 1,
            courseName: "اللغة الإنجليزية - الصف الأول الثانوي",
            isCompleted: true,
            score: 85,
            totalScore: 100,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchExams()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isExamAvailable = (startDate: string) => {
    return new Date(startDate) <= new Date()
  }

  return (
    <>
      <SpinnerModal isLoading={loading} />
      <div className={`min-h-screen p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className={`text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>الامتحانات المتاحة</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="البحث في الامتحانات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full max-w-md mx-auto block px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {filteredExams.length === 0 ? (
            <div className={`text-center py-12 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-xl">لا توجد امتحانات متاحة حالياً</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredExams.map((exam) => (
                <div
                  key={exam.examId}
                  className={`rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div
                    className={`p-6 ${exam.isCompleted ? "bg-green-500" : isExamAvailable(exam.startDate) ? "bg-blue-500" : "bg-gray-500"} text-white`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold mb-2">{exam.name}</h3>
                      <div className="text-right">
                        {exam.isCompleted && (
                          <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1 text-sm">
                            {exam.score}/{exam.totalScore}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm opacity-90">{exam.courseName}</p>
                  </div>

                  <div className="p-6">
                    <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {exam.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      <div className={`flex justify-between text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        <span>تاريخ البداية:</span>
                        <span>{formatDate(exam.startDate)}</span>
                      </div>
                      <div className={`flex justify-between text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        <span>المدة:</span>
                        <span>{exam.time} دقيقة</span>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      {exam.isCompleted ? (
                        <div className="text-center">
                          <div className="text-green-600 font-bold mb-2">تم الانتهاء</div>
                          <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            النتيجة: {exam.score}/{exam.totalScore} (
                            {Math.round((exam.score! / exam.totalScore!) * 100)}%)
                          </div>
                        </div>
                      ) : isExamAvailable(exam.startDate) ? (
                        <Link
                          to={`/take-exam/${exam.examId}`}
                          className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                          بدء الامتحان
                        </Link>
                      ) : (
                        <div className="text-center">
                          <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            الامتحان غير متاح بعد
                          </div>
                        </div>
                      )}
                    </div>
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

export default StudentExamsList
