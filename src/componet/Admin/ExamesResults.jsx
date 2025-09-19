"use client";
import { useState, useContext, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { ThemeContext } from "./../Context/ThemeContext";
import { ADDGRADETOSTUDENT, BASEURL, GETASSIGNMENTS } from "../API/API";
import { toast } from "react-toastify";
import sendRequest from "../Shared/sendRequest";
import sendRequestGet from "../Shared/sendRequestGet";
import SpinnerModal from "../Shared/SpinnerModal";

const ExamesResults = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const itemsPerPage = 8;
  const [data, setData] = useState([]);            // نتائج الامتحانات من الـ API
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // نخزن الدرجات المدخلة بمفتاح مركب studentId-assignmentId لتفادي مشاكل الترقيم/الفلترة
  const [grades, setGrades] = useState({});        // { "12-34": "80", ... }

  // فلترة حسب اسم الطالب / الامتحان / الكورس
  const filteredData = data.filter((item) => {
    const s = searchTerm.toLowerCase();
    return (
      (item.studentName || "").toLowerCase().includes(s) ||
      (item.assignmentName || "").toLowerCase().includes(s) ||
      (item.courseName || "").toLowerCase().includes(s)
    );
  });

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  const gradeKey = (stu) => `${stu.studentId}-${stu.assignmentId}`;

  const handleGradeChange = (stu, value) => {
    setGrades((prev) => ({ ...prev, [gradeKey(stu)]: value }));
  };

  const addGrade = async (stu) => {
    const key = gradeKey(stu);
    const valStr = (grades[key] || "").trim();
    if (!valStr.length) {
      toast.error("من فضلك ادخل قيمة الدرجة");
      return;
    }

    const val = Number(valStr);
    if (Number.isNaN(val)) {
      toast.error("قيمة الدرجة يجب أن تكون رقمًا");
      return;
    }
    if (val < 0 || (typeof stu.fullMark === "number" && val > stu.fullMark)) {
      toast.error("قيمة الدرجة خارج النطاق المسموح");
      return;
    }

    try {
      const res = await sendRequest(
        BASEURL,
        `${ADDGRADETOSTUDENT}`,
        "POST",
        {
          grade: val,
          studentId: stu.studentId,
          assignmentId: stu.assignmentId,
        }
      );

      if (res.status === 204) {
        toast.success("تم إضافة الدرجة بنجاح");
        // ممكن تفضي الخانة بعد الإضافة
        setGrades((prev) => ({ ...prev, [key]: "" }));
      } else {
        toast.error("حدث خطأ في العملية");
      }
    } catch (err) {
      console.error("add grades", err);
      toast.error("تعذر إضافة الدرجة");
    }
  };

  const getScoreColor = (score, total) => {
    if (!total || !Number.isFinite(total)) return "";
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-blue-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await sendRequestGet(GETASSIGNMENTS);
        const arr = Array.isArray(response?.data) ? response.data : [];
        setData(arr);
      } catch (error) {
        console.error(error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    document.title = "نتائج الامتحانات";
    return () => {
      document.title = "مستر أحمد جابر";
    };
  }, []);

  return (
    <>
      {loading ? (
        <SpinnerModal isLoading={loading} />
      ) : (
        <div className={`min-h-screen p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
          <div className="max-w-7xl mx-auto">
            {/* العنوان */}
            <div className="text-center mb-8">
              <h1 className={`text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                نتائج الامتحانات
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* البحث + إجمالي النتائج */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <input
                type="text"
                placeholder="البحث في النتائج..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
                className={`px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
              <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                إجمالي النتائج: {filteredData.length}
              </div>
            </div>

            {/* الجدول */}
            <div className={`rounded-xl shadow-lg overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-base text-center">
                  <thead
                    className={`h-16 font-bold ${
                      isDarkMode ? "bg-gray-700 text-white" : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    }`}
                  >
                    <tr>
                      <th className="px-6 py-4">إضافة درجة</th>
                      <th className="px-6 py-4">عرض الامتحان</th>
                      <th className="px-6 py-4">النسبة المئوية</th>
                      <th className="px-6 py-4">الدرجة / النهائية</th>
                      <th className="px-6 py-4">تاريخ التسليم</th>
                      <th className="px-6 py-4">الحالة</th>
                      <th className="px-6 py-4">الصف الدراسي</th>
                      <th className="px-6 py-4">اسم الكورس</th>
                      <th className="px-6 py-4">اسم الامتحان</th>
                      <th className="px-6 py-4">اسم الطالب</th>
                      <th className="px-6 py-4">رقم الطالب</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan={11} className={`py-8 text-center ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                          لا توجد نتائج متاحة
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((stu, index) => {
                        const rowNumber = indexOfFirstItem + index + 1;
                        const key = gradeKey(stu);
                        const entered = Number(grades[key]);
                        const hasGrade = !Number.isNaN(entered) && grades[key] !== undefined && grades[key] !== "";
                        const percentage = hasGrade && stu.fullMark
                          ? Math.round((entered / stu.fullMark) * 100)
                          : null;

                        const rowClassLight = index % 2 === 0 ? "bg-gray-50" : "bg-white";
                        const rowClassDark = index % 2 === 0 ? "bg-gray-800" : "bg-gray-900";

                        return (
                          <tr
                            key={`${stu.studentId}-${stu.assignmentId}`}
                            className={`border-b ${isDarkMode ? rowClassDark : rowClassLight}`}
                          >
                            {/* إضافة درجة */}
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => addGrade(stu)}
                                  className="flex items-center text-amber-500 hover:underline"
                                  title="إضافة"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="1.5"
                                    className="w-5 h-5 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  إضافة
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  max={typeof stu.fullMark === "number" ? stu.fullMark : undefined}
                                  className={`px-2 py-1 rounded-lg border-2 ${
                                    isDarkMode
                                      ? "border-amber-400 bg-transparent text-white"
                                      : "border-slate-700 bg-white text-black"
                                  }`}
                                  value={grades[key] || ""}
                                  onChange={(e) => handleGradeChange(stu, e.target.value)}
                                  placeholder="ادخل الدرجة"
                                />
                              </div>
                            </td>

                            {/* عرض الامتحان */}
                            <td className="px-5 py-4">
                              {stu.solutionUrl ? (
                                <a
                                  href={stu.solutionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center font-medium text-amber-500 hover:underline"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="1.5"
                                    className="w-5 h-5 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  عرض
                                </a>
                              ) : (
                                <span className={isDarkMode ? "text-gray-300" : "text-gray-500"}>—</span>
                              )}
                            </td>

                            {/* النسبة المئوية */}
                            <td className={`px-4 py-4 font-bold ${hasGrade ? getScoreColor(entered, stu.fullMark) : ""}`}>
                              {hasGrade && stu.fullMark ? `${percentage}%` : "—"}
                            </td>

                            {/* الدرجة / النهائية */}
                            <td className={`px-4 py-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                              {hasGrade ? entered : 0} / {stu.fullMark}
                            </td>

                            {/* تاريخ التسليم (قد لا يأتي من الـ API) */}
                            <td className={`px-4 py-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                              {formatDate(stu.submissionDate)}
                            </td>

                            {/* الحالة (قد لا تأتي من الـ API) */}
                            <td className="px-4 py-4">
                              {stu.status ? (
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    stu.status === "مكتمل"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {stu.status}
                                </span>
                              ) : (
                                <span className={isDarkMode ? "text-gray-300" : "text-gray-500"}>—</span>
                              )}
                            </td>

                            <td className="px-4 py-4">{stu.stage}</td>
                            <td className="px-4 py-4">{stu.courseName}</td>
                            <td className="px-4 py-4">{stu.assignmentName}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{stu.studentName}</td>
                            <td className="px-4 py-4 font-bold">
                              {rowNumber}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* الصفحات - ReactPaginate */}
              {pageCount > 1 && (
                <div className={`flex justify-center ${isDarkMode ? "bg-neutral-800" : "bg-gray-200"}`}>
                  <div className="my-4">
                    <ReactPaginate
                      previousLabel="السابق"
                      nextLabel="التالي"
                      breakLabel="..."
                      pageCount={pageCount}
                      onPageChange={handlePageChange}
                      forcePage={currentPage}
                      containerClassName="flex space-x-2"
                      previousLinkClassName="py-2 px-4 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 cursor-pointer"
                      nextLinkClassName="py-2 px-4 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 cursor-pointer"
                      disabledClassName="opacity-50 cursor-not-allowed"
                      activeClassName="bg-gray-800 text-white cursor-pointer"
                      pageClassName="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300 cursor-pointer"
                      pageLinkClassName="w-full h-full flex items-center justify-center"
                      breakClassName="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-gray-600"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamesResults;
