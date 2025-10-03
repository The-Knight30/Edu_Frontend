"use client"

import React from "react"

import { useState, useContext } from "react"
import { ThemeContext } from "../Context/ThemeContext"
import sendRequest from "../Shared/sendRequest.ts";
import { BASEURL, GET_EXAMS_LIST_ENDPOINT } from "../API/API"
import { toast } from "react-toastify"
import SpinnerModal from "../Shared/SpinnerModal"

interface QuestionData {
  questionText: string
  option1: string
  option2: string
  option3: string
  option4: string
  correctOption: string
  degree: number
  type: number
  examId: number
}

const AddQuestion = () => {
  const { isDarkMode } = useContext(ThemeContext)
  const [isLoading, setIsLoading] = useState(false)
  const [exams, setExams] = useState<{ id: number; name: string }[]>([])
  const [questionData, setQuestionData] = useState<QuestionData>({
    questionText: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctOption: "",
    degree: 0,
    type: 0,
    examId: 0,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setQuestionData((prev) => ({
      ...prev,
      [name]: name === "degree" || name === "type" || name === "examId" ? Number.parseInt(value) || 0 : value,
    }))
  }

  // Fetch exams for dropdown
  React.useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch(`${BASEURL}/${GET_EXAMS_LIST_ENDPOINT}`, {
          credentials: "include",
          headers: { "Accept": "application/json" },
        })
        if (!res.ok) throw new Error(`Failed to load exams: ${res.status}`)
        const data = await res.json()
        const list = Array.isArray(data)
          ? data.map((e: any) => ({ id: e.id, name: e.name }))
          : []
        setExams(list)
        if (list.length && !questionData.examId) {
          setQuestionData(prev => ({ ...prev, examId: list[0].id }))
        }
      } catch (err) {
        console.error(err)
        toast.error("تعذر تحميل قائمة الامتحانات")
      }
    }
    fetchExams()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await sendRequest(BASEURL, "Exams/question", "POST", questionData)

      if (response.status === 200 || response.status === 201) {
        toast.success("تم إضافة السؤال بنجاح")
        setQuestionData({
          questionText: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          correctOption: "",
          degree: 0,
          type: 0,
          examId: questionData.examId, // Keep the same exam ID
        })
      } else {
        toast.error("حدث خطأ في إضافة السؤال")
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال")
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
              <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>إضافة سؤال جديد</h1>
              <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mt-4 rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    اختر الامتحان
                  </label>
                  <select
                    name="examId"
                    value={questionData.examId || ""}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  >
                    {Array.isArray(exams) && exams.length > 0 ? (
                      exams.map((ex) => (
                        <option key={ex.id} value={ex.id}>{ex.name} (#{ex.id})</option>
                      ))
                    ) : (
                      <option value="">لا توجد امتحانات متاحة</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    درجة السؤال
                  </label>
                  <input
                    type="number"
                    name="degree"
                    value={questionData.degree || ""}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all ${isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                    placeholder="درجة السؤال"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  نص السؤال
                </label>
                <textarea
                  name="questionText"
                  value={questionData.questionText}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all resize-none ${isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  placeholder="أدخل نص السؤال"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    الخيار الأول
                  </label>
                  <input
                    type="text"
                    name="option1"
                    value={questionData.option1}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all ${isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                    placeholder="الخيار الأول"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    الخيار الثاني
                  </label>
                  <input
                    type="text"
                    name="option2"
                    value={questionData.option2}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all ${isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                    placeholder="الخيار الثاني"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    الخيار الثالث
                  </label>
                  <input
                    type="text"
                    name="option3"
                    value={questionData.option3}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all ${isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                    placeholder="الخيار الثالث"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    الخيار الرابع
                  </label>
                  <input
                    type="text"
                    name="option4"
                    value={questionData.option4}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all ${isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      }`}
                    placeholder="الخيار الرابع"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    الإجابة الصحيحة
                  </label>
                  <select
                    name="correctOption"
                    value={questionData.correctOption}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                      }`}
                  >
                    <option value="">اختر الإجابة الصحيحة</option>
                    <option value={questionData.option1}>الخيار الأول</option>
                    <option value={questionData.option2}>الخيار الثاني</option>
                    <option value={questionData.option3}>الخيار الثالث</option>
                    <option value={questionData.option4}>الخيار الرابع</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    نوع السؤال
                  </label>
                  <select
                    name="type"
                    value={questionData.type}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                      }`}
                  >
                    <option value={0}>اختيار من متعدد</option>
                    <option value={1}>صح أم خطأ</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "جاري الإضافة..." : "إضافة السؤال"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddQuestion
