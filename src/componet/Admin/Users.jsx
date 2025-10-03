import { useState, useContext, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { ThemeContext } from "./../Context/ThemeContext";
import { BASEURL, BLACKLIST_ADD, GETSTUDENTS } from "../API/API";
import { toast } from "react-toastify";
import ConfirmationModal from "../Shared/ConfirmationModal";
import sendRequest from "../Shared/sendRequest";
import sendRequestGet from "../Shared/sendRequestGet";
import SpinnerModal from "../Shared/SpinnerModal";

export default function Users() {
  const { isDarkMode } = useContext(ThemeContext);
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false); // State to track modal visibility
  const [selectedStudentId, setSelectedStudentId] = useState(null); // State to store selected student ID
  const itemsPerPage = 6;
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(students) ? students.slice(indexOfFirstItem, indexOfLastItem) : [];
  const [loading, setLoading] = useState(true)
  const fetchData = async (setStudents) => {
    try {
      setLoading(true)
      const response = await sendRequestGet(`${GETSTUDENTS}false`);
      const list = Array.isArray(response?.data) ? response.data : [];
      setStudents(list);
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false)
    }
  };
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    document.title = "الطلاب";

    return () => {
      document.title = "مستر أحمد جابر";
    };
  }, []);

  useEffect(() => {
    fetchData(setStudents);
  }, []);

  const addToBlacklist = async (studentId) => {
    setSelectedStudentId(studentId); // Store the selected student ID
    setShowModal(true); // Show the modal
  };

  const handleConfirmBlacklist = async () => {
    try {
      let res = await sendRequest(BASEURL, `${BLACKLIST_ADD}/${selectedStudentId}`, "POST");
      if (res.status === 200) {
        toast.success("تم إضافة الطالب إلى القائمة السوداء");
      }

      fetchData(setStudents);
    } catch (error) {
      console.error("Error adding student to blacklist:", error);
    }

    setSelectedStudentId(null);
    setShowModal(false);
  };

  const handleCancelBlacklist = () => {
    // Reset the selected student ID and hide the modal
    setSelectedStudentId(null);
    setShowModal(false);
  };

  return (
    <>
      <SpinnerModal isLoading={loading} />
      <div className="relative overflow-x-auto rounded-[25px] ml-6 md:ml-0">
        <div className="inline-block min-w-full">
          <table
            className={`w-full text-base text-center shadow ${isDarkMode ? "" : ""
              }`}
          >
            <thead
              className={`h-16 font-bold font-['Noto Sans Arabic'] ${isDarkMode
                  ? "bg-neutral-800 text-white"
                  : "bg-amber-400 text-neutral-800"
                }`}
            >
              <tr>
                <th className={`${isDarkMode ? "text-white" : "text-black"}`}>
                  <span className="text-center">أضف إلى القائمة السوداء</span>
                </th>
                <th scope="col" className="px-6 py-3">
                  رقم هاتف ولي الأمر
                </th>
                <th scope="col" className="px-6 py-3">
                  رقم الهاتف
                </th>
                <th scope="col" className="px-6 py-3">
                  البريد الإلكتروني
                </th>
                <th scope="col" className="px-6 py-3">
                  اسم الطالب
                </th>
                <th scope="col" className="px-6 py-3">
                  رقم الطالب
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((stu, index) => {
                const rowNumber = indexOfFirstItem + index + 1;
                const rowClass =
                  index % 2 === 0 ? "bg-gray-100" : "bg-gray-200";
                const rowClassDark =
                  index % 2 === 0 ? "bg-neutral-900" : "bg-neutral-800";

                return (
                  <tr
                    key={index}
                    className={`${isDarkMode ? `${rowClassDark} text-white` : `${rowClass}`
                      }`}
                  >
                    <td className="flex items-center justify-center px-6 py-4 text-neutral-800">
                      <button
                        className="flex space-x-4 font-medium text-amber-500 hover:underline"
                        onClick={() => addToBlacklist(stu.phone[0].studentId)} // Call addToBlacklist function with student ID as parameter
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6 mr-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                          />
                        </svg>
                        إضافة
                      </button>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {stu.phone[0].phone}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      {stu.phone[0].dadPhone}
                    </td>
                    <td className="px-6 py-4">{stu.email}</td>
                    <td className="px-6 py-4 font-medium whitespace-nowrap">{`${stu.firstName} ${stu.lastName}`}</td>
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      {rowNumber}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div
          className={`flex justify-center ${isDarkMode ? "bg-neutral-800" : "bg-gray-200"
            }`}
        >
          <div className="my-4">
            <ReactPaginate
              previousLabel="السابق"
              nextLabel="التالي"
              breakLabel="..."
              pageCount={Math.ceil(students.length / itemsPerPage)}
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
        <ConfirmationModal
          isOpen={showModal}
          message="هل أنت متأكد من رغبتك في إضافة الطالب إلى القائمة السوداء؟"
          onConfirm={handleConfirmBlacklist}
          onCancel={handleCancelBlacklist}
        />
      </div>
    </>
  );
}
