"use client"

import { useState, useContext, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ThemeContext } from "../Context/ThemeContext"
import sendRequest from "../Shared/sendRequest.ts";
import sendRequestGet from "../Shared/sendRequestGet.ts";
import { BASEURL } from "../API/API"
import { toast } from "react-toastify"
import SpinnerModal from "../Shared/SpinnerModal"
import Cookies from "cookie-universal"

interface Question {
  questionId?: number
  id?: number
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
  answerText: string | string[]
}

const TakeExam = () => {
  const { examId } = useParams()
  const navigate = useNavigate()
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

  // Load saved answers from localStorage when exam loads
  useEffect(() => {
    if (!examId) return
    try {
      const saved = localStorage.getItem(`exam-answers-${examId}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setAnswers(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [examId])

  // Persist answers to localStorage
  useEffect(() => {
    if (!examId) return
    try {
      localStorage.setItem(`exam-answers-${examId}`, JSON.stringify(answers))
    } catch {
      // ignore
    }
  }, [answers, examId])

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
      const response = await sendRequestGet(`${BASEURL}/Exams/${examId}`)
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

  const handleAnswerChange = (questionId: number, answerText: string | string[]) => {
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

  const getAnswerForQuestion = (questionId: number): string | string[] | undefined => {
    const found = answers.find((a) => a.questionId === questionId)
    return found?.answerText
  }

  const handleCheckboxToggle = (questionId: number, option: string) => {
    const current = getAnswerForQuestion(questionId)
    const currentArray = Array.isArray(current) ? current : (current ? [current] : [])
    const exists = currentArray.includes(option)
    const next = exists ? currentArray.filter((o) => o !== option) : [...currentArray, option]
    handleAnswerChange(questionId, next)
  }

  const handleSubmitExam = async () => {
    setIsLoading(true)

    try {
      const parsedExamId = Number(examData?.examId ?? examId)
      const parsedStudentId = Number(cookies.get("id"))

      if (!parsedExamId || Number.isNaN(parsedExamId)) {
        toast.error("Invalid examId")
        setIsLoading(false)
        return
      }
      if (!parsedStudentId || Number.isNaN(parsedStudentId)) {
        toast.error("Invalid studentId")
        setIsLoading(false)
        return
      }

      // Validate that all answer questionIds exist in exam questions
      const questions = examData?.questions || []
      const validIds = new Set(questions.map(q => (q.questionId ?? q.id) as number))
      const invalidIds = answers
        .map(a => Number(a.questionId))
        .filter(qid => !validIds.has(qid))
      if (invalidIds.length > 0) {
        toast.error(`Some answers reference invalid question IDs: ${invalidIds.join(", ")}`)
        setIsLoading(false)
        return
      }

      // Ensure all questions are answered
      const unanswered = questions
        .map((q, i) => ({ qid: (q.questionId ?? q.id) as number, idx: i + 1 }))
        .filter(({ qid }) => {
          const a = answers.find(x => Number(x.questionId) === Number(qid))?.answerText
          return a == null || (Array.isArray(a) ? a.length === 0 : String(a).trim() === "")
        })
      if (unanswered.length > 0) {
        toast.error(`Please answer all questions. Missing: ${unanswered.map(u => u.idx).join(", ")}`)
        setIsLoading(false)
        return
      }

      // Prepare answers: arrays -> comma-separated string with a space after comma to match backend samples
      const preparedAnswers = answers.map(a => ({
        questionId: Number(a.questionId),
        answerText: Array.isArray(a.answerText)
          ? a.answerText.map(v => String(v).trim()).filter(Boolean).join(", ")
          : String(a.answerText).trim()
      }))

      const submitData = {
        examId: parsedExamId,
        studentId: parsedStudentId,
        answers: preparedAnswers,
      }

      console.log("Submitting payload:", submitData)

      const response = await sendRequest(BASEURL, "Exams/submit", "POST", submitData)

      if (response.status === 200 || response.status === 201) {
        toast.success("تم تسليم الامتحان بنجاح")
        setExamStarted(false)
        navigate("/available-exams")
      } else if (response.status === 400 || response.status === 404) {
        const data = response.data || {}
        const msg = data.message || "Validation error"
        const ids = data.invalidQuestionIds || data.InvalidQuestionIds
        console.error("Submit error 4xx:", data)
        if (Array.isArray(ids) && ids.length) {
          toast.error(`${msg}: ${ids.join(", ")}`)
        } else {
          toast.error(msg)
        }
      } else if (response.status >= 500) {
        console.error("Submit error 5xx:", response.data)
        toast.error("Internal server error")
      } else {
        console.error("Unexpected submit response:", response)
        toast.error(`Unexpected error: ${response.status}`)
      }
    } catch (error: any) {
      console.error("Submit error (exception):", error?.response?.data || error)
      const status = error?.response?.status
      if (status === 400 || status === 404) {
        const data = error?.response?.data || {}
        const msg = data.message || "Validation error"
        const ids = data.invalidQuestionIds || data.InvalidQuestionIds
        if (Array.isArray(ids) && ids.length) {
          toast.error(`${msg}: ${ids.join(", ")}`)
        } else {
          toast.error(msg)
        }
      } else if (status >= 500) {
        toast.error("Internal server error")
      } else {
        toast.error(`حدث خطأ في الاتصال: ${status || "Unknown"}`)
      }
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
                className="px-8 py-4 bg-gradient-to-r from-green-400 to blue-500 text-white font-bold rounded-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                بدء الامتحان
              </button>
            </div>
          ) : (
            <div className={`rounded-xl shadow-lg p-8 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="flex justify-between items-center mb-8">
                <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{examData.name}</h1>
                <div
                  className={`px-6 py-3 rounded-lg font-bold text-xl ${timeLeft < 300 ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                    }`}
                >
                  {formatTime(timeLeft)}
                </div>
              </div>

              <div className="space-y-8">
                {examData.questions.map((question, index) => {
                  const qid = (question as any).questionId ?? (question as any).id
                  return (
                    <div
                      key={qid}
                      className={`p-6 rounded-lg border-2 ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                        }`}
                    >
                      <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        Question {index + 1}: {question.questionText}
                        <span className="text-sm text-blue-500 mr-2">(Degree: {question.degree})</span>
                      </h3>

                      {(() => {
                        const selected = getAnswerForQuestion(qid)
                        const options = [question.option1, question.option2, question.option3, question.option4].filter(Boolean)
                        // type: 0 = MCQ, 1 = True/False, 2 = Multi-select (checkbox)
                        if (question.type === 1) {
                          const tfOptions = ["True", "False"]
                          return (
                            <div className="space-y-3">
                              {tfOptions.map((opt) => {
                                const isChecked = typeof selected === "string" && selected === opt
                                return (
                                  <label
                                    key={opt}
                                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${isChecked
                                      ? isDarkMode
                                        ? "bg-green-900/30 border border-green-600"
                                        : "bg-green-50 border border-green-300"
                                      : isDarkMode
                                        ? "hover:bg-gray-600"
                                        : "hover:bg-gray-200"
                                      }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`question-${qid}`}
                                      value={opt}
                                      checked={isChecked}
                                      onChange={(e) => handleAnswerChange(qid, e.target.value)}
                                      className="mr-3 w-4 h-4 text-blue-600"
                                    />
                                    <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>{opt}</span>
                                  </label>
                                )
                              })}
                            </div>
                          )
                        }

                        if (question.type === 2) {
                          const selectedArray = Array.isArray(selected) ? selected : (selected ? [selected] : [])
                          return (
                            <div className="space-y-3">
                              {options.map((option, optionIndex) => {
                                const isChecked = selectedArray.includes(option)
                                return (
                                  <label
                                    key={optionIndex}
                                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${isChecked
                                      ? isDarkMode
                                        ? "bg-blue-900/30 border border-blue-600"
                                        : "bg-blue-50 border border-blue-300"
                                      : isDarkMode
                                        ? "hover:bg-gray-600"
                                        : "hover:bg-gray-200"
                                      }`}
                                  >
                                    <input
                                      type="checkbox"
                                      name={`question-${qid}-${optionIndex}`}
                                      value={option}
                                      checked={isChecked}
                                      onChange={() => handleCheckboxToggle(qid, option)}
                                      className="mr-3 w-4 h-4 text-blue-600"
                                    />
                                    <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>{option}</span>
                                  </label>
                                )
                              })}
                            </div>
                          )
                        }

                        return (
                          <div className="space-y-3">
                            {options.map((option, optionIndex) => {
                              const isChecked = typeof selected === "string" && selected === option
                              return (
                                <label
                                  key={optionIndex}
                                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${isChecked
                                    ? isDarkMode
                                      ? "bg-blue-900/30 border border-blue-600"
                                      : "bg-blue-50 border border-blue-300"
                                    : isDarkMode
                                      ? "hover:bg-gray-600"
                                      : "hover:bg-gray-200"
                                    }`}
                                >
                                  <input
                                    type="radio"
                                    name={`question-${qid}`}
                                    value={option}
                                    checked={isChecked}
                                    onChange={(e) => handleAnswerChange(qid, e.target.value)}
                                    className="mr-3 w-4 h-4 text-blue-600"
                                  />
                                  <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>{option}</span>
                                </label>
                              )
                            })}
                          </div>
                        )
                      })()}
                    </div>
                  )
                })}
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
