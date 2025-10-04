import { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeContext } from "./../Context/ThemeContext";
import { BASEURL } from "../API/API";
import sendRequestGet from "../Shared/sendRequestGet";
import SpinnerModal from "../Shared/SpinnerModal";
import { toast } from "react-toastify";
import Cookies from "cookie-universal";

const ExamDetails = () => {
    const { examId } = useParams();
    const [exam, setExam] = useState(null);
    const { isDarkMode } = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const cookies = Cookies();

    useEffect(() => {
        document.title = "تفاصيل الامتحان";
        return () => {
            document.title = "Default Title";
        };
    }, []);

    useEffect(() => {
        const fetchExamDetails = async () => {
            try {
                setLoading(true);

                // جلب تفاصيل الامتحان باستخدام ID
                const response = await sendRequestGet(`${BASEURL}/Exams/${examId}`);

                console.log("Exam Details Response:", response);

                if (response.status === 200 && response.data) {
                    setExam(response.data);
                } else {
                    toast.error("لم يتم العثور على الامتحان");
                    navigate("/available-exams");
                }
            } catch (error) {
                console.error("Error fetching exam details:", error);
                toast.error("حدث خطأ في تحميل تفاصيل الامتحان");
                navigate("/available-exams");
            } finally {
                setLoading(false);
            }
        };

        if (examId) {
            fetchExamDetails();
        }
    }, [examId, navigate]);

    const handleStartExam = () => {
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
        if (exam && exam.startDate) {
            const examStartTime = new Date(exam.startDate);
            const currentTime = new Date();

            if (currentTime < examStartTime) {
                toast.warning(`الامتحان سيبدأ في ${examStartTime.toLocaleString('ar-EG')}`);
                return;
            }
        }

        // التوجه لصفحة الامتحان
        navigate(`/take-exam/${examId}`);
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

    const calculateTotalMarks = (questions) => {
        if (!questions || !Array.isArray(questions)) return 0;
        return questions.reduce((total, question) => total + (question.degree || 0), 0);
    };

    if (loading) {
        return <SpinnerModal isLoading={true} />;
    }

    if (!exam) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                <div className="text-center">
                    <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        لم يتم العثور على الامتحان
                    </h2>
                    <button
                        onClick={() => navigate("/available-exams")}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        العودة للامتحانات
                    </button>
                </div>
            </div>
        );
    }

    const examStatus = getExamStatus(exam.startDate);
    const totalMarks = calculateTotalMarks(exam.questions);
    const questionsCount = exam.questions ? exam.questions.length : 0;

    return (
        <>
            <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                <div className="container mx-auto px-4 py-8">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/available-exams")}
                        className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isDarkMode
                                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        ← العودة للامتحانات
                    </button>

                    {/* Main Content */}
                    <div className={`rounded-2xl shadow-xl overflow-hidden ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                        }`}>

                        {/* Header */}
                        <div className={`p-6 ${examStatus.color === 'green' ? 'bg-green-500' : 'bg-blue-500'}`}>
                            <div className="flex justify-between items-center flex-wrap gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">{exam.name}</h1>
                                    <span className="text-white font-bold text-sm px-4 py-2 bg-black bg-opacity-20 rounded-full">
                                        {examStatus.text}
                                    </span>
                                </div>
                                <div className="text-white text-right">
                                    <div className="text-lg font-bold">⏱️ {exam.time} دقيقة</div>
                                    <div className="text-sm opacity-90">مدة الامتحان</div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Description */}
                            <div className="mb-6">
                                <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                    وصف الامتحان
                                </h3>
                                <p className={`text-lg leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                    {exam.description || "لا يوجد وصف متاح للامتحان"}
                                </p>
                            </div>

                            {/* Exam Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                    <div className="text-center">
                                        <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                            {questionsCount}
                                        </div>
                                        <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                            عدد الأسئلة
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                    <div className="text-center">
                                        <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                            {totalMarks}
                                        </div>
                                        <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                            الدرجة الكلية
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                    <div className="text-center">
                                        <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                            {exam.time}
                                        </div>
                                        <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                            دقيقة
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                    <div className="text-center">
                                        <div className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                            {formatDate(exam.startDate).split(' ')[1]}
                                        </div>
                                        <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                            وقت البداية
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Date and Time */}
                            <div className="mb-6">
                                <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                    معلومات التوقيت
                                </h3>
                                <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                    <div className="flex justify-between items-center">
                                        <span className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            📅 تاريخ ووقت الامتحان:
                                        </span>
                                        <span className={`font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                            {formatDate(exam.startDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Questions Preview */}
                            {exam.questions && exam.questions.length > 0 && (
                                <div className="mb-6">
                                    <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                        معاينة الأسئلة
                                    </h3>
                                    <div className="space-y-3">
                                        {exam.questions.slice(0, 3).map((question, index) => (
                                            <div key={question.id} className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                                                }`}>
                                                <div className="flex justify-between items-start">
                                                    <span className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                                        السؤال {index + 1}: {question.questionText}
                                                    </span>
                                                    <span className={`text-sm px-2 py-1 rounded ${isDarkMode ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
                                                        }`}>
                                                        {question.degree} درجة
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {exam.questions.length > 3 && (
                                            <div className={`text-center p-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                                ... و {exam.questions.length - 3} سؤال آخر
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={handleStartExam}
                                    disabled={examStatus.status === "upcoming"}
                                    className={`px-8 py-4 font-bold rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg ${examStatus.status === "upcoming"
                                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                                            : "bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600"
                                        }`}
                                >
                                    {examStatus.status === "upcoming" ? "⏳ لم يحن وقت الامتحان" : "🚀 ابدأ الامتحان"}
                                </button>

                                <button
                                    onClick={() => navigate("/available-exams")}
                                    className={`px-8 py-4 border-2 font-bold rounded-lg transform hover:scale-105 transition-all duration-200 ${isDarkMode
                                            ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    📋 العودة للامتحانات
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExamDetails;
