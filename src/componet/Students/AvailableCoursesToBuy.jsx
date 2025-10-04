import { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "./../Context/ThemeContext";
import { BASEURL } from "../API/API";
import DefaultComponet from './../Shared/DefaultComponet';
import sendRequestGet from "../Shared/sendRequestGet";
import SpinnerModal from "../Shared/SpinnerModal";
import { toast } from "react-toastify";
import Cookies from "cookie-universal";

const AvailableCoursesToBuy = () => {
    const [data, setData] = useState([]);
    const { isDarkMode } = useContext(ThemeContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const cookies = Cookies();

    useEffect(() => {
        document.title = "الكورسات المتاحة للشراء";
        return () => {
            document.title = "Default Title";
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await sendRequestGet(`${BASEURL}/Courses/GetAllCourses`);
                setData(response.data || []);
            } catch (error) {
                console.error("Error fetching courses:", error);
                toast.error("حدث خطأ في تحميل الكورسات");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePayNow = (course) => {
        const userRole = cookies.get("role");
        const userId = cookies.get("id");

        if (!userRole || !userId) {
            toast.error("يجب تسجيل الدخول أولاً");
            navigate("/login");
            return;
        }

        // التوجه لصفحة الدفع مع بيانات الكورس
        navigate(`/paymob-payment/${course.courseId}/${course.coursePrice}/${encodeURIComponent(course.courseName)}`);
    };

    // تفاصيل الكورس غير مدعومة حالياً، سيتم الإبقاء على الشراء فقط

    return (
        <>
            <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                            الكورسات المتاحة للشراء
                        </h1>
                        <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            اختر الكورس المناسب لك وابدأ رحلة التعلم
                        </p>
                    </div>

                    <SpinnerModal isLoading={loading} />

                    {data.length === 0 && !loading ? (
                        <DefaultComponet text="لا توجد كورسات متاحة حالياً" />
                    ) : (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {data.map((course) => (
                                <div
                                    key={course.courseId}
                                    className={`rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                                        }`}
                                >
                                    {/* صورة الكورس */}
                                    <div className="relative">
                                        <img
                                            className="w-full h-48 object-cover"
                                            src={course.profileUrl || "/default-course-image.jpg"}
                                            alt={course.courseName}
                                            onError={(e) => {
                                                e.target.src = "/default-course-image.jpg";
                                            }}
                                        />
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                {course.coursePrice} جنيه
                                            </span>
                                        </div>
                                    </div>

                                    {/* محتوى الكورس */}
                                    <div className="p-6">
                                        <h3 className={`text-xl font-bold mb-3 text-right ${isDarkMode ? "text-white" : "text-gray-800"
                                            }`}>
                                            {course.courseName}
                                        </h3>

                                        <p className={`text-right mb-4 line-clamp-3 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                                            }`}>
                                            {course.courseDescription}
                                        </p>

                                        {/* معلومات إضافية */}
                                        <div className={`flex justify-between items-center mb-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                                            }`}>
                                            <span>⏱️ {course.totoalHoure} ساعة</span>
                                            <span>📚 المرحلة {course.coursStage + 1}</span>
                                        </div>

                                        {/* أزرار العمل */}
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => handlePayNow(course)}
                                                className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                            >
                                                🛒 اشترك الآن
                                            </button>

                                            {/* زر التفاصيل مُزال مؤقتاً لعدم توفر صفحة التفاصيل */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AvailableCoursesToBuy;
