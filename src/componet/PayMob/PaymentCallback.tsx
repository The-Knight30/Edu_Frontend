// امسح "use client" لو مش Next.js كامل
import { useEffect, useState, useContext } from "react"
import { ThemeContext } from "../Context/ThemeContext"  // تأكد من الـ path
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"  // غير لـ React Router
import sendRequest from "../Shared/sendRequest.ts"
import { BASEURL, PAYMOB_PAYMENT_CALLBACK_ENDPOINT } from "../API/API"
import { toast } from "react-toastify" // اختياري، لو مثبت

export default function PaymentCallback() {
  const { isDarkMode } = useContext(ThemeContext)!
  const navigate = useNavigate()  // بدل useRouter للـ navigation
  const location = useLocation()  // بدل useSearchParams للـ query params
  const [status, setStatus] = useState<"loading" | "success" | "failed" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const processCallback = async () => {
      try {
        // اقرأ query params من location.search (مثل ?success=true&order_id=123)
        const searchParams = new URLSearchParams(location.search)
        const callbackData: Record<string, string> = {}
        searchParams.forEach((value, key) => {
          callbackData[key] = value
        })

        const response = await sendRequest(BASEURL, PAYMOB_PAYMENT_CALLBACK_ENDPOINT, "POST", callbackData)

        console.log("PayMob callback response:", response);
        console.log("Callback data:", callbackData);

        if (response.status === 200 || response.status === 201) {
          setStatus("success")
          setMessage(response.data?.message || "تم الدفع بنجاح وتم إضافتك للكورس")
          toast.success("تم الدفع بنجاح!")
        } else {
          setStatus("failed")
          setMessage(response.data?.message || `فشل في التحقق من عملية الدفع: ${response.status}`)
          toast.error(response.data?.message || "فشل في التحقق")
        }
      } catch (error: any) {
        setStatus("error")
        setMessage(error.message || "حدث خطأ أثناء معالجة نتيجة الدفع")
        toast.error(error.message || "حدث خطأ!")
      }
    }

    processCallback()
  }, [location.search])  // اعتمد على location.search

  const handleGoToCourses = () => {
    navigate("/student/courses")  // استخدم navigate بدل router.push
  }

  const handleGoHome = () => {
    navigate("/")  // نفس الشيء
  }

  // باقي الـ JSX نفسه (الـ return statement) بدون تغيير
  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`w-full max-w-md rounded-xl shadow-lg p-6 transition-all duration-300 ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
        }`}>
        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>نتيجة عملية الدفع</h2>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>معالجة نتيجة الدفع عبر PayMob</p>
        </div>

        <div className="space-y-4">
          {status === "loading" && (
            <div className="text-center py-8">
              <Loader2 className={`h-8 w-8 animate-spin mx-auto mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`} />
              <p className={`${isDarkMode ? "text-white" : "text-gray-800"}`}>جاري التحقق من عملية الدفع...</p>
            </div>
          )}

          {status === "success" && (
            <>
              <div className={`p-4 rounded-lg border-2 text-center ${isDarkMode ? "border-green-600 bg-green-900/20" : "border-green-200 bg-green-50"
                }`}>
                <CheckCircle className={`h-6 w-6 mx-auto mb-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`} />
                <p className={`${isDarkMode ? "text-green-300" : "text-green-800"}`}>{message}</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleGoToCourses}
                  className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  انتقل إلى كورساتي
                </button>
                <button
                  onClick={handleGoHome}
                  className="w-full py-3 border-2 border-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                >
                  العودة للرئيسية
                </button>
              </div>
            </>
          )}

          {(status === "failed" || status === "error") && (
            <>
              <div className={`p-4 rounded-lg border-2 text-center ${isDarkMode ? "border-red-600 bg-red-900/20" : "border-red-200 bg-red-50"
                }`}>
                <XCircle className={`h-6 w-6 mx-auto mb-2 ${isDarkMode ? "text-red-400" : "text-red-600"}`} />
                <p className={`${isDarkMode ? "text-red-300" : "text-red-800"}`}>{message}</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleGoHome}
                  className="w-full py-3 bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold rounded-lg hover:from-blue-500 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  العودة للرئيسية
                </button>
                <button
                  onClick={() => navigate(-1)}  // router.back() → navigate(-1)
                  className="w-full py-3 border-2 border-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                >
                  المحاولة مرة أخرى
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}