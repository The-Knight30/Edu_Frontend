import { useState, useEffect, useContext, useRef } from "react";
import NavbarApp from "./../HomePage/NavbarApp";
import { Link } from "react-router-dom";
import Wave from "../Shared/Wave";
import { ThemeContext } from "./../Context/ThemeContext";
import FooterApp from "./../FooterApp";
import { GETCOURSES } from "../API/API";
import sendRequestGet from "../Shared/sendRequestGet";
import SpinnerModal from "../Shared/SpinnerModal";


function Firstgradesecondary(props) {
  const [loading, setLoading] = useState(true)
  const [firstgrade, setFirstGrade] = useState([]);
  const { isDarkMode } = useContext(ThemeContext);
  useEffect(() => {
    document.title = "كورسات الصف الأول الثانوي";

    return () => {
      document.title = "مستر أحمد جابر ";
    };
  }, []);


  const fetchData = async () => {
    try {
      const response = await sendRequestGet(`${GETCOURSES}0`);
      const list = Array.isArray(response?.data) ? response.data : [];
      setFirstGrade(list);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {

    fetchData();
  }, []);

  return (
    <>
      <SpinnerModal isLoading={loading} />

      <NavbarApp />
      <div
        className={`min-h-screen ${isDarkMode ? "bg-gray-950" : "bg-amber-100"
          } `}
      >
        <div>
          <Wave title="الصف الأول الثانوي" />
          <div className="px-5 mx-auto max-w-7xl md:px-8">
            {firstgrade.length === 0 && !loading ? (
              <div className="max-w-7xl mx-auto   flex justify-center items-center h-[50vh]">
                <div
                  className={`text-2xl ${isDarkMode ? "text-white" : "text-black"
                    }`}
                >
                  لا توجد كورسات متاحة حاليا
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-10 pb-32 mt-5 sm:grid-cols-2 lg:grid-cols-3">
                {firstgrade.map((course, index) => (
                  <div
                    key={index}
                    className={` shadow-xl w-full max-w-[22rem] rounded-[20px] ${isDarkMode ? "bg-neutral-800" : "bg-white"
                      }`}
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
                        <button className="bg-sky-400 rounded-full px-5 py-2 text-white flex items-center text-xl font-bold font-['Mukta'] leading-normal mt-3 cursor-auto">
                          <span>جنيها</span>
                          <span className="ml-4">{course.coursePrice}</span>
                        </button>

                        <Link to="">
                          <h5
                            className={`text-right font-bold text-2xl ${isDarkMode
                              ? "text-white"
                              : "text-gray-800 rounded-b-[20px]"
                              }`}
                          >
                            {course.courseName}
                          </h5>
                        </Link>
                      </div>
                      <div
                        className={`text-center courseDiscription-notAuth  my-6  text-xl font-normal font-['Noto Sans Arabic'] leading-normal  ${isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                      >
                        {/* {`${}`} */}
                        {/* <ShowMoreButton text={course.courseDescription.split("-").join(" ")} maxChars={20}/> */}
                        {course.courseDescription.split("-")}
                      </div>
                      <div className="flex justify-between mb-3">
                        <div className="">
                          <Link
                            to={`/payment/${course.coursePrice}/${course.courseName}`}
                            className={`p-5 rounded-[20px] shadow text-white  ${isDarkMode ? "bg-red-600 hover:bg-red-700 " : "bg-gray-800 hover:bg-gray-900"
                              } `}
                          >
                            اشتراك
                          </Link>
                        </div>
                        <div className="xl:px-2">
                          <Link
                            to={`/coursecontent/${course.courseId}`}
                            state={{ data: course }}
                            className={`bg-amber-400 rounded-[20px] hover:bg-amber-500 px-3 xl:px-7 py-2.5 transition duration-700 ${isDarkMode ? "text-white" : ""}`}
                          >
                            الدخول للكورس
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <FooterApp />
    </>
  );
}

export default Firstgradesecondary;
