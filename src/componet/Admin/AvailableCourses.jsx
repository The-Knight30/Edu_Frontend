import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "./../Context/ThemeContext";
import { ALLCOURSES, BASEURL, DELETECOURSE } from "../API/API";
import ConfirmationModal from "../Shared/ConfirmationModal";
import DefaultComponet from "../Shared/DefaultComponet";
import sendRequestGet from "../Shared/sendRequestGet";
import sendRequest from "../Shared/sendRequest";
import SpinnerModal from "../Shared/SpinnerModal";

const AvailableCourses = () => {
  const [data, setData] = useState([]);
  const [courseToDelete, setCourseToDelete] = useState(null); // For tracking which course to delete
  const { isDarkMode } = useContext(ThemeContext);
  const stages = [" الأول", " الثاني", " الثالث"];
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const response = await sendRequestGet(`${BASEURL}/${ALLCOURSES}`);
        const list = Array.isArray(response?.data) ? response.data : [];
        setData(list);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
      finally {
        setLoading(false)
      }
    };

    fetchCourses();
  }, []);

  const confirmDeletion = (courseId) => {
    setCourseToDelete(courseId); // Show the modal with the course ID to delete
  };

  const deleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      const response = await sendRequest(BASEURL, `${DELETECOURSE}${courseToDelete}`, "DELETE");
      if (response.status === 200) {
        setData(data.filter((course) => course.courseId !== courseToDelete));
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }

    setCourseToDelete(null);
  };

  useEffect(() => {
    document.title = "كورسات   ";

    return () => {
      document.title = "Default Title";
    };
  }, []);

  return (
    <div className="px-5 mx-auto max-w-7xl md:px-1">
      <SpinnerModal isLoading={loading} />
      {data.length === 0 && !loading ? (
        <DefaultComponet text="لا توجد كورسات" />
      ) : (
        <div className="grid grid-cols-1 gap-10 pb-32 mt-5 md:mr-0 lg:grid-cols-2 xl:grid-cols-3">
          {data.map((course) => (
            <div
              key={course.courseId}
              className={` w-full max-w-[22rem] rounded-[20px] ${isDarkMode ? "" : "bg-white shadow-xl"}`}

            >
              <img
                className="rounded-[20px] h-64 w-full object-cover"
                src={course.profileUrl}
                alt="Course"
              />
              <div className={`p-5 -mt-4 ${isDarkMode ? "bg-neutral-800" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center px-4 py-2 mt-3 text-xl text-white rounded-full bg-sky-400">
                    <span>جنيها</span>
                    <span className="ml-4">{course.coursePrice}</span>
                  </div>

                  <div className="flex flex-col">
                    <h5 className={`text-right font-bold text-xl  ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {course.courseName}
                    </h5>
                    <h5
                      className={`text-right  my-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}
                    >
                      {`الصف الدراسي ${stages[course.coursStage]}`}
                    </h5>
                  </div>
                </div>

                <div
                  className={` text-right my-6 text-xl font-normal courseDiscription ${isDarkMode ? "text-white" : "text-gray-800"}`}

                >
                  {course.courseDescription}
                </div>

                <div className="flex justify-center space-x-2">
                  <Link
                    to={`/dashboard/usersForCourses/${course.courseId}`}
                    className="bg-amber-400 rounded-[20px] px-2 md:px-5 text-white py-2.5 hover:bg-amber-500 transition duration-700"
                  >
                    عرض الطلاب
                  </Link>


                  <Link
                    to={`/dashboard/addcoursetostudent/${course.courseId}`}
                    className="bg-sky-400 rounded-[20px] px-2 md:px-5 text-white py-2.5 hover:bg-sky-500 transition duration-700"
                  >
                    إضافة طالب
                  </Link>

                </div>
                <div className=" flex justify-center py-2 space-x-2">
                  <button
                    onClick={() => confirmDeletion(course.courseId)} // Show modal for confirmation
                    className="bg-red-600 rounded-[20px] px-2 md:px-5 py-2.5 text-white hover:bg-red-700   transition duration-700"
                  >
                    حذف الكورس
                  </button>
                  <Link
                    to={`/dashboard/removecoursefromstudent/${course.courseId}`}
                    className="bg-red-600 rounded-[20px] px-2 md:px-5 py-2.5 text-white hover:bg-red-700  transition duration-700"
                  >
                    حذف طالب
                  </Link>


                </div>
              </div>
            </div>
          ))}
        </div>)}

      {/* Confirmation modal */}
      <ConfirmationModal
        isOpen={!!courseToDelete}
        onConfirm={deleteCourse}
        onCancel={() => setCourseToDelete(null)}
        message="هل أنت متأكد من أنك تريد حذف هذه الدورة؟"
      />
    </div>
  );
};

export default AvailableCourses;
