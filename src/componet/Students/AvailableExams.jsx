import { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "./../Context/ThemeContext";
import { BASEURL, GET_ALL_EXAMS_ENDPOINT } from "../API/API";
import DefaultComponet from './../Shared/DefaultComponet';
import sendRequestGet from "../Shared/sendRequestGet";
import SpinnerModal from "../Shared/SpinnerModal";
import { toast } from "react-toastify";
import Cookies from "cookie-universal";

const AvailableExams = () => {
    const [exams, setExams] = useState([]);
    const { isDarkMode } = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const cookies = Cookies();

    console.log("Current exams state:", exams);
    console.log("Is exams array?", Array.isArray(exams));

    useEffect(() => {
        document.title = "الامتحانات المتاحة";
        return () => {
            document.title = "Default Title";
        };
    }, []);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                setLoading(true);

                // جلب جميع الامتحانات مع الأسئلة
                const response = await sendRequestGet(`${BASEURL}/${GET_ALL_EXAMS_ENDPOINT}`);

                console.log("Exams API Response:", response);
                console.log("Response data:", response.data);
                console.log("Is data array?", Array.isArray(response.data));

                if (response.status === 200 && response.data) {
                    // التأكد من أن البيانات array
                    const examsData = Array.isArray(response.data) ? response.data : [];

                    // تحويل البيانات للشكل المطلوب
                    const formattedExams = examsData.map(exam => ({
                        id: exam.id,
                        name: exam.name,
                        description: exam.description,
                        startDate: exam.startDate,
                        time: exam.time,
                        questionsCount: exam.questions ? exam.questions.length : 0,
                        totalMarks: exam.questions ? exam.questions.reduce((total, q) => total + (q.degree || 0), 0) : 0,
                        courseId: exam.courseId,
                        courseName: exam.courseName || `كورس ${exam.courseId}`,
                        questions: exam.questions || []
                    }));

                    console.log("Formatted exams:", formattedExams);
                    setExams(formattedExams);
                } else {
                    console.warn("No exams data received or invalid response");
                    setExams([]);
                }
            } catch (error) {
                console.error("Error fetching exams:", error);
                toast.error("حدث خطأ في تحميل الامتحانات");

                // Mock data للتجربة في حالة الخطأ
                setExams([
                    {
                        id: 1,
                        name: "امتحان الرياضيات - الوحدة الأولى",
                        description: "امتحان شامل على الوحدة الأولى في الرياضيات",
                        startDate: "2025-10-05T10:00:00",
                        time: 60,
                        questionsCount: 20,
                        totalMarks: 100,
                        courseId: 1,
                        courseName: "الرياضيات - الصف الأول الثانوي",
                        questions: []
                    },
                    {
                        id: 2,
                        name: "امتحان الفيزياء - الفصل الثاني",
                        description: "امتحان على الحركة والقوى",
                        startDate: "2025-10-07T14:00:00",
                        time: 45,
                        questionsCount: 15,
                        totalMarks: 75,
                        courseId: 2,
                        courseName: "الفيزياء - الصف الثاني الثانوي",
                        questions: []
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    const handleStartExam = (exam) => {
        const userRole = cookies.get("role");
        const userId = cookies.get("id");

        if (!userRole || !userId) {
            toast.error("يجب تسجيل الدخول أولاً");
            navigate("/login");
            return;
        }

        if (userRole !== "Student") {
            toast.error("هذه الصفحة مخصصة للطلاب فقط");
            return;
        }

        // التحقق من وقت الامتحان
        const examStartTime = new Date(exam.startDate);
        const currentTime = new Date();

        if (currentTime < examStartTime) {
            toast.warning(`الامتحان سيبدأ في ${examStartTime.toLocaleString('ar-EG')}`);
            return;
        }

        // التوجه لصفحة الامتحان
        navigate(`/take-exam/${exam.id}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getExamStatus = (startDate) => {
        const examTime = new Date(startDate);
        const currentTime = new Date();

        if (currentTime < examTime) {
            return { status: "upcoming", text: "قادم", color: "blue" };
        } else {
            return { status: "available", text: "متاح الآن", color: "green" };
        }
    };

    return (
        <>
            <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                            الامتحانات المتاحة
                        </h1>
                        <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            اختر الامتحان الذي تريد أداءه
                        </p>
                        <div className="mt-4">
                            <button
                                onClick={() => navigate("/")}
                                className={`inline-flex items-center gap-2 px-4 py-2 font-bold rounded-lg ${isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
                            >
                                ⬅️ العودة للرئيسية
                            </button>
                        </div>
                    </div>

                    <SpinnerModal isLoading={loading} />

                    {(!Array.isArray(exams) || exams.length === 0) && !loading ? (
                        <DefaultComponet text="لا توجد امتحانات متاحة حالياً" />
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {Array.isArray(exams) && exams.map((exam) => {
                                const examStatus = getExamStatus(exam.startDate);

                                return (
                                    <div
                                        key={exam.id}
                                        className={`rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                                            }`}
                                    >
                                        {/* Header */}
                                        <div className={`p-4 ${examStatus.color === 'green' ? 'bg-green-500' : 'bg-blue-500'}`}>
                                            <div className="flex justify-between items-center">
                                                <span className="text-white font-bold text-sm px-3 py-1 bg-black bg-opacity-20 rounded-full">
                                                    {examStatus.text}
                                                </span>
                                                <span className="text-white text-sm">
                                                    ⏱️ {exam.time} دقيقة
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className={`text-xl font-bold mb-3 text-right ${isDarkMode ? "text-white" : "text-gray-800"
                                                }`}>
                                                {exam.name}
                                            </h3>

                                            <p className={`text-right mb-4 line-clamp-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                                                }`}>
                                                {exam.description}
                                            </p>

                                            {/* معلومات الامتحان */}
                                            <div className={`space-y-2 mb-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                                                }`}>
                                                <div className="flex justify-between">
                                                    <span>📅 تاريخ الامتحان:</span>
                                                    <span>{formatDate(exam.startDate)}</span>
                                                </div>

                                                {exam.questionsCount && (
                                                    <div className="flex justify-between">
                                                        <span>❓ عدد الأسئلة:</span>
                                                        <span>{exam.questionsCount} سؤال</span>
                                                    </div>
                                                )}

                                                {exam.totalMarks && (
                                                    <div className="flex justify-between">
                                                        <span>📊 الدرجة الكلية:</span>
                                                        <span>{exam.totalMarks} درجة</span>
                                                    </div>
                                                )}

                                                {exam.courseName && (
                                                    <div className="flex justify-between">
                                                        <span>📚 الكورس:</span>
                                                        <span className="text-right">{exam.courseName}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* أزرار العمل */}
                                            <div className="space-y-3">
                                                <button
                                                    onClick={() => handleStartExam(exam)}
                                                    disabled={examStatus.status === "upcoming"}
                                                    className={`w-full py-3 font-bold rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg ${examStatus.status === "upcoming"
                                                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                                                        : "bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600"
                                                        }`}
                                                >
                                                    {examStatus.status === "upcoming" ? "⏳ لم يحن وقت الامتحان" : "🚀 ابدأ الامتحان"}
                                                </button>

                                                <button
                                                    onClick={() => navigate(`/exam-details/${exam.id}`)}
                                                    className={`w-full py-3 border-2 font-bold rounded-lg transform hover:scale-105 transition-all duration-200 ${isDarkMode
                                                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    📋 تفاصيل الامتحان
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AvailableExams;
