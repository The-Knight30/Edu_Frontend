"use client"
import type React from "react"
import { useState, useContext } from "react"
import { ThemeContext } from "../Context/ThemeContext"
import { Loader2, CreditCard, CheckCircle, XCircle } from "lucide-react"
import sendRequest from "../Shared/sendRequest.ts"
import { BASEURL, PAYMOB_START_PAYMENT_ENDPOINT } from "../API/API"
import { toast } from "react-toastify" // اختياري، زي StudentExams

interface PayMobPaymentProps {
  courseId: number
  courseName: string
  coursePrice: number
  onPaymentSuccess?: () => void
  onPaymentError?: (error: string) => void
}

export default function PayMobPayment({
  courseId,
  courseName,
  coursePrice,
  onPaymentSuccess,
  onPaymentError,
}: PayMobPaymentProps) {
  const { isDarkMode } = useContext(ThemeContext)!
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleStartPayment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error("يرجى إدخال البريد الإلكتروني")
      return
    }

    setIsLoading(true)
    setPaymentStatus("processing")
    setErrorMessage("")

    try {
      const paymentData = {
        email: email.trim(),
        courseId: courseId,
      }

      const response = await sendRequest(BASEURL, `/${PAYMOB_START_PAYMENT_ENDPOINT}`, "POST", paymentData)

      if (response.success) {
        if (response.data?.paymentUrl) {
          window.location.href = response.data.paymentUrl
        } else {
          setPaymentStatus("success")
          onPaymentSuccess?.()
          toast.success("تم بدء عملية الدفع بنجاح!")
        }
      } else {
        throw new Error(response.message || "فشل في بدء عملية الدفع")
      }
    } catch (error: any) {
      setPaymentStatus("error")
      const errorMsg = error.message || "حدث خطأ أثناء معالجة الدفع"
      setErrorMessage(errorMsg)
      onPaymentError?.(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`w-full max-w-md rounded-xl shadow-lg p-6 transition-all duration-300 ${
        isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
      }`}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CreditCard className={`h-6 w-6 ${isDarkMode ? "text-white" : "text-gray-800"}`} />
            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>الدفع عبر PayMob</h2>
          </div>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
            ادفع للكورس: {courseName}
          </p>
        </div>

        {/* السعر */}
        <div className={`text-center p-4 rounded-lg mb-6 ${
          isDarkMode ? "bg-gray-700" : "bg-gray-100"
        }`}>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>المبلغ المطلوب</p>
          <p className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-primary"}`}>{coursePrice} جنيه</p>
        </div>

        {/* Form */}
        {(paymentStatus === "idle" || paymentStatus === "processing") && (
          <form onSubmit={handleStartPayment} className="space-y-4">
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>البريد الإلكتروني</label>
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                    : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                } disabled:opacity-50`}
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-bold transition-all duration-200 shadow-lg transform ${
                isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 hover:scale-105"
              } ${isDarkMode ? "text-white" : "text-white"}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  جاري المعالجة...
                </>
              ) : (
                "ابدأ عملية الدفع"
              )}
            </button>
          </form>
        )}

        {/* Success */}
        {paymentStatus === "success" && (
          <div className={`p-4 rounded-lg border-2 ${
            isDarkMode ? "border-green-600 bg-green-900/20" : "border-green-200 bg-green-50"
          } text-center`}>
            <CheckCircle className={`h-6 w-6 mx-auto mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`} />
            <p className={`${isDarkMode ? "text-green-300" : "text-green-800"}`}>تم بدء عملية الدفع بنجاح! سيتم تحويلك لإتمام الدفع.</p>
          </div>
        )}

        {/* Error */}
        {paymentStatus === "error" && errorMessage && (
          <div className={`p-4 rounded-lg border-2 ${
            isDarkMode ? "border-red-600 bg-red-900/20" : "border-red-200 bg-red-50"
          } text-center`}>
            <XCircle className={`h-6 w-6 mx-auto mb-2 ${isDarkMode ? "text-red-400" : "text-red-600"}`} />
            <p className={`${isDarkMode ? "text-red-300" : "text-red-800"}`}>{errorMessage}</p>
          </div>
        )}

        {/* Footer */}
        <div className={`text-xs text-center space-y-1 mt-6 ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}>
          <p>الدفع آمن ومحمي عبر PayMob</p>
          <p>سيتم إضافتك للكورس تلقائياً بعد إتمام الدفع</p>
        </div>
      </div>
    </div>
  )
}