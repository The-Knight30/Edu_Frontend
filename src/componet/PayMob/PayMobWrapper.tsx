"use client"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import PayMobPayment from "./PayMobPayment"
import sendRequestGet from "../Shared/sendRequestGet"
import { BASEURL } from "../API/API"
import { toast } from "react-toastify"
import SpinnerModal from "../Shared/SpinnerModal"

interface Course {
    courseId: number
    courseName: string
    coursePrice: number
    courseDescription: string
}

export default function PayMobWrapper() {
    const { courseId, coursePrice, courseName } = useParams()
    const navigate = useNavigate()
    const [course, setCourse] = useState<Course | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                if (courseId && coursePrice && courseName) {
                    // إذا كانت البيانات موجودة في الـ URL، استخدمها مباشرة
                    setCourse({
                        courseId: parseInt(courseId),
                        courseName: decodeURIComponent(courseName),
                        coursePrice: parseFloat(coursePrice),
                        courseDescription: ""
                    })
                } else if (courseId) {
                    // إذا كان فقط courseId موجود، اجلب البيانات من الـ API
                    const response = await sendRequestGet(`${BASEURL}/Courses/GetCourseById/${courseId}`)
                    if (response.status === 200) {
                        setCourse(response.data)
                    } else {
                        toast.error("لم يتم العثور على الكورس")
                        navigate("/all-courses")
                    }
                } else {
                    toast.error("بيانات الكورس غير صحيحة")
                    navigate("/all-courses")
                }
            } catch (error) {
                console.error("Error fetching course:", error)
                toast.error("حدث خطأ في تحميل بيانات الكورس")
                navigate("/all-courses")
            } finally {
                setIsLoading(false)
            }
        }

        fetchCourseData()
    }, [courseId, coursePrice, courseName, navigate])

    const handlePaymentSuccess = () => {
        toast.success("تم الدفع بنجاح! سيتم إضافتك للكورس")
        navigate("/dashboardstu")
    }

    const handlePaymentError = (error: string) => {
        toast.error(`فشل في الدفع: ${error}`)
    }

    if (isLoading) {
        return <SpinnerModal isLoading={true} />
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">خطأ في تحميل بيانات الكورس</h2>
                    <button
                        onClick={() => navigate("/all-courses")}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        العودة للكورسات
                    </button>
                </div>
            </div>
        )
    }

    return (
        <PayMobPayment
            courseId={course.courseId}
            courseName={course.courseName}
            coursePrice={course.coursePrice}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
        />
    )
}
