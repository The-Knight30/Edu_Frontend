import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "./../Context/ThemeContext";
import { AuthContext } from "../Context/AuthContext";
import { GETSOWNSTUDENTCOURSE } from "../API/API";
import DefaultComponet from './../Shared/DefaultComponet';
import sendRequestGet from "../Shared/sendRequestGet";
import SpinnerModal from "../Shared/SpinnerModal";
const StuCourses = () => {
  const [data, setData] = useState([]);
  const { studentId } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "كورسات   ";  

    return () => {
      document.title = "Default Title"; 
    };
  }, []);

  // studentID come from where ????
  useEffect(() => {
  
    const fetchData = async () => {
      try {
        
        setLoading(true);
        const response = await sendRequestGet(
          `${GETSOWNSTUDENTCOURSE}${studentId}`
        );
  
        setData(response.data);
      } catch (error) {
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);
 
  return (
    <>
      <div>
        <div>
          <div className="px-5 mx-auto max-w-7xl md:px-1">
            <SpinnerModal isLoading={loading} />
            {data.length === 0 &&!loading? (

              <DefaultComponet text="لا توجد كورسات" /> 
            ) : (
              <div className="grid grid-cols-1 gap-10 pb-32 mt-5 lg:grid-cols-2 xl:grid-cols-3">
                {data.map((course) => (
                  <div
                    key={course.courseId}
                    className="shadow-xl w-full max-w-[22rem] rounded-[20px] bg-white"
                  >
                    <Link to="">
                      <img
                        className="rounded-[20px] h-48 w-full object-cover"
                        src={course.profileUrl}
                        alt="كورسات الصف الأول"
                      />
                    </Link>
                    <div
                      className={`p-5 -mt-4 ${isDarkMode ? "bg-neutral-800 rounded-b-[20px]" : ""
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="bg-sky-400 rounded-full px-5 py-2 text-white flex items-center text-xl font-bold font-['Mukta'] leading-normal mt-3">
                          <span>جنيها</span>
                          <span className="ml-4">{course.coursePrice}</span>
                        </div>

                        <Link to="">
                          <h5
                            className={`text-right font-bold text-2xl ${isDarkMode ? "text-white" : "text-gray-800 rounded-b-[20px]"
                              }`}
                          >
                            {course.courseName}
                          </h5>
                        </Link>
                      </div>

                      <ul
                        className={`text-right courseDiscription-notAuth text-xl font-normal font-['Noto Sans Arabic'] leading-normal mb-2 ${isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                      >
                        {course.courseDescription}
                      </ul>
                      <div className="flex justify-center px-2">
                        <Link
                          to={`/coursecontent/${course.courseId}`}
                          state={{ data: course }}
                          className={`bg-amber-400 hover:bg-amber-500 rounded-[20px]  px-3 xl:px-7 py-2.5 transition duration-700 ${isDarkMode?"text-white":""}`}
                        >
                          الدخول للمشاهدة
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StuCourses;
