import { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "./../Context/ThemeContext";
import { BASEURL, GET_ALL_EXAMS_ENDPOINT } from "../API/API";
import DefaultComponet from './../Shared/DefaultComponet';
import sendRequestGet from "../Shared/sendRequestGet";
import SpinnerModal from "../Shared/SpinnerModal";
import { toast } from "react-toastify";

const ExamResultsManagement = () => {
    const [exams, setExams] = useState([]);
    const { isDarkMode } = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "إدارة نتائج الامتحانات";
        return () => {
            document.title = "Default Title";
        };
    }, []);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                setLoading(true);
                const response = await sendRequestGet(`${BASEURL}/${GET_ALL_EXAMS_ENDPOINT}`);
                if (response.status === 200 && response.data) {
                    const examsData = Array.isArray(response.data) ? response.data : [];
                    setExams(examsData);
                } else {
                    setExams([]);
                }
            } catch (error) {
                console.error("Error fetching exams:", error);
                toast.error("حدث خطأ في تحميل الامتحانات");
                setExams([]);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    const handleViewResults = (exam) => {
        navigate(`/dashboard/exam-results/${exam.id}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateTotalMarks = (questions) => {
        if (!questions || !Array.isArray(questions)) return 0;
        return questions.reduce((total, question) => total + (question.degree || 0), 0);
    };

    return (
        <>
            <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                            إدارة نتائج الامتحانات
                        </h1>
                        <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            عرض وإدارة نتائج جميع الامتحانات
                        </p>
                    </div>

                    <SpinnerModal isLoading={loading} />

                    {(!Array.isArray(exams) || exams.length === 0) && !loading ? (
                        <DefaultComponet text="لا توجد امتحانات متاحة" />
                    ) : (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                            {Array.isArray(exams) && exams.map((exam) => {
                                const totalMarks = calculateTotalMarks(exam.questions);
                                const questionsCount = exam.questions ? exam.questions.length : 0;

                                return (
                                    <div
                                        key={exam.id}
                                        className={`rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                                            }`}
                                    >
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                                            <h3 className="text-xl font-bold text-white mb-2">{exam.name}</h3>
                                            <div className="flex justify-between items-center text-white text-sm">
                                                <span>📅 {formatDate(exam.startDate)}</span>
                                                <span>⏱️ {exam.time} دقيقة</span>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                                                }`}>
                                                {exam.description}
                                            </p>

                                            <div className="space-y-3">
                                                <button
                                                    onClick={() => handleViewResults(exam)}
                                                    className="w-full py-3 bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold rounded-lg hover:from-blue-500 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                                >
                                                    📊 عرض النتائج والدرجات
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

export default ExamResultsManagement;
