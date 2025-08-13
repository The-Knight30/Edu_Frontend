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
  const itemsPerPage = 6;
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [grades, setGrades] = useState(Array(data.length).fill(""));
  const [loading, setLoading] = useState(true);


  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleGradeChange = (index, value) => {
    const newGrades = [...grades];
    newGrades[index] = value;
    setGrades(newGrades);
  };

  const addGrade = async (e) => {
    if (e.target.parentElement.children[1].value.length==0)
    {
      toast.error("من فضلك ادخل قيمة الدرجة")
      return;
    }
    
    try {
      const id = e.target.parentElement.parentElement.parentElement.id;
      const ids = id.slice(1).split("-")
      const studentId = ids[0];
      const assignmentId = ids[1];
      let res = await sendRequest(BASEURL,`${ADDGRADETOSTUDENT}`,"POST", {
        grade: +grades[0],
        studentId: studentId,
        assignmentId: assignmentId,
      });   
      if(res.status==204)   
      toast.success("تم إضافة الدرجة بنجاح")

      else
      toast.error("حدث خطأ في العملية")

    } catch (error) {
      console.error("add grades", error);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await sendRequestGet(GETASSIGNMENTS);
        setData(response.data);
        console.log(response);
      } catch (error) {
        // setError(error.message);
      }
      finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    document.title = "نتائج الأمتحانات";      

    return () => {
      document.title = "مستر أحمد جابر"; 
    };
  }, []);
  return (
    <>
      {loading ? (
        <SpinnerModal isLoading={loading} />

      ) : (
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
                    <th scope="col" className="px-6 py-3">
                      درجة الأمتحان
                    </th>
                    <th scope="col" className="px-6 py-3">
                      عرض الأمتحان
                    </th>
                    <th scope="col" className="px-6 py-3">
                      الدرجة النهائية
                    </th>
                    <th scope="col" className="px-6 py-3">
                      الصف الدراسي
                    </th>
                    <th scope="col" className="px-6 py-3">
                      اسم الكورس
                    </th>
                    <th scope="col" className="px-6 py-3">
                      اسم الأمتحان
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
                      <tr id={`s${stu.studentId}-${stu.assignmentId}`}
                        key={index}
                        className={`${isDarkMode ? `${rowClassDark} text-white` : `${rowClass}`
                          }`}
                      >
                        <td className="">
                          <div className="flex items-center ">
                            <button onClick={(e) => addGrade(e)}
                              className="flex ml-4 space-x-4 font-medium text-amber-500 hover:underline"
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
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                              </svg>
                              إضافة
                            </button>
                            <input
                              id={`gradeInput-${index}`}
                              className={`shadow text-right py-2 ml-4 pr-2 rounded-xl border-2 ${isDarkMode
                                  ? "border-amber-400 bg-transparent text-white"
                                  : "border-slate-700 bg-white text-black"
                                }`}
                              value={grades[index]}
                              onChange={(e) =>
                                handleGradeChange(index, e.target.value)
                              }
                              placeholder="  ادخل درجة الأمتحان"

                            />
                          </div>
                        </td>
                        <td className="px-5 py-4 text-neutral-800 ">
                          <a
                            href={stu.solutionUrl} // Using dynamic URL from the API
                            target="_blank"
                            rel="noopener noreferrer" // Security for opening links in new tabs
                            className="flex font-medium text-amber-500 hover:underline"
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
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>
                            عرض
                          </a>
                        </td>
                        <td className="px-2 py-4">{stu.fullMark}</td>
                        <td className="px-2 py-4">{stu.stage}</td>
                        <td className="px-2 py-4">{stu.courseName}</td>
                        <td className="px-2 py-4">{stu.assignmentName}</td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {stu.studentName}
                        </td>
                        <td className="px-3 py-4 font-medium whitespace-nowrap">
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

export default ExamesResults;
