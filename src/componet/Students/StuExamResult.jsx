import { useState, useContext, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { ThemeContext } from "./../Context/ThemeContext";
import { GETSTUDENTINGRADE } from "../API/API";
import { AuthContext } from "../Context/AuthContext";
import sendRequestGet from "../Shared/sendRequestGet";
import SpinnerModal from "../Shared/SpinnerModal";

const StuExamResult = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [data, setData] = useState([]);
  const { studentId } = useContext(AuthContext);
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(0);
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const [loading, setLoading] = useState(true);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const fetechStudentGrade = async () => {
    try {
      setLoading(true);
      const response = await sendRequestGet(`${GETSTUDENTINGRADE}${studentId}`);
      const list = Array.isArray(response?.data) ? response.data : [];
      setData(list);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    document.title = "نتائج الأمتحانات";
    fetechStudentGrade();
    return () => {
      document.title = "مستر أحمد جابر";
    };
  }, []);


  return (
    <>
      {loading ? (
        <SpinnerModal isLoading={loading} />

      ) : (
        <div className="relative overflow-x-auto  rounded-[25px] ml-6 md:ml-0 ">
          <div className="inline-block min-w-full">
            <table
              className={`w-full text-base text-center shadow ${isDarkMode ? "" : " "
                }`}
            >
              <thead
                className={`h-16 text-white  font-bold font-['Noto Sans Arabic'] ${isDarkMode ? " bg-neutral-800 " : "bg-amber-400  "
                  }`}
              >
                <tr>
                  <th scope="col" className="px-6 py-3">
                    درجة الأمتحان
                  </th>

                  <th scope="col" className="px-6 py-3">
                    اسم الكورس
                  </th>
                  <th scope="col" className="px-6 py-3">
                    اسم الأمتحان
                  </th>
                  <th scope="col" className="px-6 py-3">
                    رقم الأمتحان{" "}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((stu, index) => {
                  const rowNumber = indexOfFirstItem + index + 1;
                  const rowClass =
                    index % 2 === 0 ? "bg-gray-100" : "bg-gray-200";
                  const rowClassDark =
                    index % 2 === 0 ? "bg-neutral-900" : "bg-neutral-800"; // Alternating row colors
                  // Alternating row colors
                  return (
                    <tr
                      key={index}
                      className={`${isDarkMode ? `${rowClassDark} text-white` : `${rowClass}`
                        }`}
                    >
                      <td className="px-6 py-4">{`${stu.studentGrade}/${stu.fullMarkExam}`}</td>
                      <td className="px-6 py-4">{stu.courseName}</td>
                      <td className="px-6 py-4">{stu.examName}</td>
                      <td className="px-6 py-4 font-medium whitespace-nowrap ">
                        {rowNumber}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div
            className={`flex justify-center ${isDarkMode ? "bg-neutral-800" : " bg-gray-200"
              }`}
          >
            <div className="my-4 ">
              <ReactPaginate
                previousLabel="السابق"
                nextLabel="التالي"
                breakLabel="..."
                pageCount={Math.ceil(data.length / itemsPerPage)}
                onPageChange={handlePageChange}
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
        </div>
      )}

    </>
  );
};

export default StuExamResult;
