import { useState, useContext, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { ThemeContext } from "./../Context/ThemeContext";
import { USERSFORCOURESE } from "../API/API";
import sendRequestGet from "../Shared/sendRequestGet";
import { useParams } from "react-router-dom";
export default function UsersForCourses() {
  const stages = [" الأول", " الثاني", " الثالث"];
  const { courseId  } = useParams();
  const { isDarkMode } = useContext(ThemeContext);
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = students.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    document.title = " الطلاب المشتركة في الكورس";

    return () => {
      document.title = "مستر أحمد جابر";
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await sendRequestGet(`${USERSFORCOURESE}/${courseId}`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);


  return (
    <>
      <div className="relative overflow-x-auto rounded-[25px] ml-6 md:ml-0">
        <div className="inline-block min-w-full">
          <table
            className={`w-full text-base text-center shadow ${
              isDarkMode ? "" : ""
            }`}
          >
            <thead
              className={`h-16 font-bold font-['Noto Sans Arabic'] ${
                isDarkMode
                  ? "bg-neutral-800 text-white"
                  : "bg-amber-400 text-neutral-800"
              }`}
            >
              <tr>
            
                
                <th scope="col" className="px-6 py-3">
                   تاريخ الشراء
                </th>
                <th scope="col" className="px-6 py-3">
                   الصف الدراسي
                </th>
                <th scope="col" className="px-6 py-3">
                   اسم الكورس
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
                    className={`${
                      isDarkMode ? `${rowClassDark} text-white` : `${rowClass}`
                    }`}
                  >
                 
                    <td className="px-5 py-4 whitespace-nowrap">
                      {stu.joinedAt}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {stages[stu.stage]}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {stu.courseName}
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
          className={`flex justify-center ${
            isDarkMode ? "bg-neutral-800" : "bg-gray-200"
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
       
      </div>
    </>
  );
}
