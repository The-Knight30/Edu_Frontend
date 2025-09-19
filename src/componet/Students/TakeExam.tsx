"use client"

import { useState, useContext, useEffect } from "react"
import { ThemeContext } from "../Context/ThemeContext"
import sendRequest from "../Shared/sendRequest.ts";
import sendRequestGet from "../Shared/sendRequestGet.ts";
import { BASEURL } from "../API/API"
import { toast } from "react-toastify"
import SpinnerModal from "../Shared/SpinnerModal"
import Cookies from "cookie-universal"

interface Question {
  questionId: number
  questionText: string
  option1: string
  option2: string
  option3: string
  option4: string
  degree: number
  type: number
}

interface ExamData {
  examId: number
  name: string
  description: string
  time: number
  questions: Question[]
}

interface Answer {
  questionId: number
  answerText: string
}

const TakeExam = ({ examId }: { examId: number }) => {
  const { isDarkMode } = useContext(ThemeContext)
  const [isLoading, setIsLoading] = useState(false)
  const [examData, setExamData] = useState<ExamData | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [examStarted, setExamStarted] = useState(false)
  const cookies = Cookies()

  useEffect(() => {
    fetchExamData()
  }, [examId])

  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (examStarted && timeLeft === 0) {
      handleSubmitExam()
    }
  }, [timeLeft, examStarted])

  const fetchExamData = async () => {
    setIsLoading(true)
    try {
      const response = await sendRequestGet(`${BASEURL}/Exams/get-exam/${examId}`)
      if (response.status === 200) {
        setExamData(response.data)
        setTimeLeft(response.data.time * 60) // Convert minutes to seconds
      } else {
        toast.error("حدث خطأ في تحميل الامتحان")
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (questionId: number, answerText: string) => {
    setAnswers((prev) => {
      const existingIndex = prev.findIndex((a) => a.questionId === questionId)
      if (existingIndex >= 0) {
        const newAnswers = [...prev]
        newAnswers[existingIndex] = { questionId, answerText }
        return newAnswers
      } else {
        return [...prev, { questionId, answerText }]
      }
    })
  }

  const handleSubmitExam = async () => {
    setIsLoading(true)
    const studentId = Number.parseInt(cookies.get("id"))

    try {
      const submitData = {
        examId: examData?.examId,
        studentId,
        answers,
      }

      const response = await sendRequest(BASEURL, "/Exams/submit-exam", "POST", submitData)

      if (response.status === 200 || response.status === 201) {
        toast.success("تم تسليم الامتحان بنجاح")
        setExamStarted(false)
      } else {
        toast.error("حدث خطأ في تسليم الامتحان")
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال")
    } finally {
      setIsLoading(false)
    }
  }

  const startExam = () => {
    setExamStarted(true)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (!examData) {
    return <SpinnerModal isLoading={true} />
  }

  return (
    <>
      <SpinnerModal isLoading={isLoading} />
      <div className={`min-h-screen p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="max-w-4xl mx-auto">
          {!examStarted ? (
            <div className={`rounded-xl shadow-lg p-8 text-center ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {examData.name}
              </h1>
              <p className={`text-lg mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{examData.description}</p>
              <div className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-6`}>
                <p className="text-xl font-bold">مدة الامتحان: {examData.time} دقيقة</p>
                <p className="text-lg">عدد الأسئلة: {examData.questions.length}</p>
              </div>
              <button
                onClick={startExam}
                className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                بدء الامتحان
              </button>
            </div>
          ) : (
            <div className={`rounded-xl shadow-lg p-8 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex justify-between items-center mb-8">
                <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{examData.name}</h1>
                <div
                  className={`px-6 py-3 rounded-lg font-bold text-xl ${
                    timeLeft < 300 ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                  }`}
                >
                  {formatTime(timeLeft)}
                </div>
              </div>

              <div className="space-y-8">
                {examData.questions.map((question, index) => (
                  <div
                    key={question.questionId}
                    className={`p-6 rounded-lg border-2 ${
                      isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      السؤال {index + 1}: {question.questionText}
                      <span className="text-sm text-blue-500 mr-2">({question.degree} درجة)</span>
                    </h3>

                    <div className="space-y-3">
                      {[question.option1, question.option2, question.option3, question.option4].map(
                        (option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-opacity-50 transition-all ${
                              isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${question.questionId}`}
                              value={option}
                              onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
                              className="mr-3 w-4 h-4 text-blue-600"
                            />
                            <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>{option}</span>
                          </label>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={handleSubmitExam}
                  className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  تسليم الامتحان
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default TakeExam
