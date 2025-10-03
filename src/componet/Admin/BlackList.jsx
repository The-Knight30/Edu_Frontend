import { useState, useContext, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { ThemeContext } from "./../Context/ThemeContext";
import { BASEURL, BLACKLIST_ADD, BLACKLIST_REMOVE, GETSTUDENTS } from "../API/API";
import { toast } from "react-toastify";
import sendRequest from "../Shared/sendRequest";
import sendRequestGet from "../Shared/sendRequestGet";
import SpinnerModal from "../Shared/SpinnerModal";

// function to block students
export default function BlackList() {
  const { isDarkMode } = useContext(ThemeContext);
  const [BlockStudents, setBlockStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(true);

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(BlockStudents) ? BlockStudents.slice(indexOfFirstItem, indexOfLastItem) : [];

  const fetchData = async (setBlockStudents) => {
    try {
      setLoading(true);
      const response = await sendRequestGet(`${GETSTUDENTS}true`);
      const list = Array.isArray(response?.data) ? response.data : [];
      setBlockStudents(list);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
    finally {
      setLoading(false)
    }
  };
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    document.title = "القائمة السوداء";

    return () => {
      document.title = "مستر أحمد جابر";
    };
  }, []);

  useEffect(() => {
    fetchData(setBlockStudents);
  }, []);

  const RemoveToBlacklist = async (studentId) => {
    console.log(studentId);
    try {
      const res = await sendRequest(BASEURL, `${BLACKLIST_REMOVE}/${studentId}`, "POST");
      if (res.status === 200) {
        toast.success("تم حذف الطالب من القائمة السوداء");
      }
      // After successfully adding to blacklist, refetch the student data
      fetchData(setBlockStudents);
    } catch (error) {
      console.error("Error adding student to blacklist:", error);
    }
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
                  <span className="text-center"> حذف من القائمة السوداء</span>
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
                        className="flex space-x-4 font-medium text-red-600 hover:underline"
                        onClick={() =>
                          RemoveToBlacklist(stu.phone[0].studentId)
                        } // Call addToBlacklist function with student ID as parameter
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
                        حذف
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
              pageCount={Math.ceil(BlockStudents.length / itemsPerPage)}
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
    </>
  );
}
