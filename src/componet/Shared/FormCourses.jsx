/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useRef } from "react";
import { ThemeContext } from "./../Context/ThemeContext";
import {
  ADDASSIGNMENT_ENDPOINT,
  ADDCOURSES_ENDPOINT,
  ADDUNITETOCOURSES_ENDPOINT,
  BASEURL,
} from "../API/API";
import sendRequest from "./sendRequest";
import SpinnerModal from "./SpinnerModal";
import { toast } from "react-toastify";


const FormCourses = ({ title }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [courseName, setCourseName] = useState("");
  const [examName, setExamName] = useState("");
  const InputsRef = useRef([
    { name: "الكلمات", pdfFiles: [], videoFiles: [] },
    { name: "القصة", pdfFiles: [], videoFiles: [] },
    { name: "المهارات", pdfFiles: [], videoFiles: [] },
    { name: "الترجمة", pdfFiles: [], videoFiles: [] },
    { name: " امتحان علي الوحدة", pdfFiles: [], videoFiles: [] },
  ]);
  const imageCourseRef = useRef(null);
  const [stuDegree, setStuDegree] = useState();
  const [coursePrice, setCoursePrice] = useState();
  const [Hourscourse, setHourscourse] = useState();
  const [CourseDescription, setcourseDescription] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    document.title = " اضافة وحده";
    return () => {
      document.title = "مستر أحمد جابر";
    };
  }, []);

  async function handleFormSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    try {
      const body = new FormData();
      body.append("CourseName", courseName);
      body.append("coursePrice", coursePrice);
      body.append("TotoalHoure", Hourscourse);
      body.append("CourseDescription", CourseDescription);
      body.append("Profile", imageCourseRef.current.files[0]);
      body.append("CoursStage", selectedStage);
      const res = await sendRequest(
        BASEURL,
        ADDCOURSES_ENDPOINT,
        "POST",
        body,
        headers
      );

      if (res.status === 200) {
        console.log(res);
        try {
          const body = new FormData();
          console.log(InputsRef.current);

          InputsRef.current[1].videoFiles[0] ? body.append('Story', InputsRef.current[1].videoFiles[0]) : null;
          body.append('StoryPdf', InputsRef.current[1].pdfFiles[0]);
          InputsRef.current[0].videoFiles[0] ? body.append('Vocablary', InputsRef.current[0].videoFiles[0]) : null;
          body.append('VocablaryPdf', InputsRef.current[0].pdfFiles[0]);
          InputsRef.current[3].videoFiles[0] ? body.append('Translation', InputsRef.current[3].videoFiles[0]) : null;
          body.append('TranslationPdf', InputsRef.current[3].pdfFiles[0]);
          InputsRef.current[4].videoFiles[0] ? body.append('Exam', InputsRef.current[4].videoFiles[0]) : null;
          InputsRef.current[2].videoFiles[0] ? body.append('Skill', InputsRef.current[2].videoFiles[0]) : null;
          body.append('SkillPdf', InputsRef.current[2].pdfFiles[0]);

          console.log(Array.from(body.entries()));
          const createdId = res?.data?.courseId || res?.data?.coursId || res?.data?.id;
          body.append("CourseId", createdId);
          const res2 = await sendRequest(
            BASEURL,
            ADDUNITETOCOURSES_ENDPOINT,
            "POST",
            body,
            headers
          );
          if (res2.status === 200) {
            // res2.tocken
            // console.log(res2);
            try {
              const body = new FormData();
              body.append("AssFile", InputsRef.current[4].pdfFiles[0]);
              body.append("FullMark", stuDegree);
              body.append("UnitId", res2.data);
              body.append("Name", examName);
              // console.log(Array.from(body.entries()));
              const res3 = await sendRequest(
                BASEURL,
                ADDASSIGNMENT_ENDPOINT,
                "POST",
                body,
                headers
              );
              console.log(res3)
            } catch (err) {
              toast.error("حدث خطأ")

              console.log(err);
            }
          }
          toast.success("تم إضافة الكورس بنجاح")
        } catch (err) {
          toast.error("حدث خطأ")

          console.log(err);
        }
      }
    }


    catch (err) {
      toast.error("حدث خطأ")
      console.log(err);
    } finally {
      setIsLoading(false); // Stop loading
    }
  }

  const handleStageChange = (event) => {
    setSelectedStage(parseInt(event.target.value)); // Parse the selected value to integer
  };

  const handleInputVideoChange = (index, videoFiles) => {

    InputsRef.current[index].videoFiles.push(videoFiles);

  };
  const handleInputFileChange = (index, pdfFiles) => {
    InputsRef.current[index].pdfFiles = pdfFiles;
  };
  return (
    <>
      <SpinnerModal isLoading={isLoading} />

      <div
        className={`grid grid-cols-6 lg:grid-cols-4 gap-4 mt-0 lg:pt-4 mx-2  md:m-0 min-h-screen pb-10  ${isDarkMode ? "bg-neutral-900" : ""
          }`}
      >
        <div className="col-span-6 md:col-start-2">
          <div
            className={`text-right text-[20px] font-medium leading-normal mb-2 ${isDarkMode ? "text-white" : "text-black"
              }`}
          >
            {title}
          </div>

          <form
            onSubmit={handleFormSubmit}
            className="grid grid-cols-2 gap-4 text-right"
          >
            {/* Add input field for image course */}
            <div className="col-span-2 lg:col-span-1">
              <label
                htmlFor="imageCourse"
                className={`flex justify-end my-1 ${isDarkMode ? "text-white" : "text-black"
                  }`}
              >
                صورة الوحدة
              </label>
              <input
                type="file"
                id="imageCourse"
                placeholder="اختر صورة الوحدة"
                className={`rounded-lg p-2 bg-gray-400 border-none w-full text-right ${isDarkMode ? "" : ""
                  }`}
                ref={imageCourseRef}
                required
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <label
                htmlFor="courseName"
                className={`flex justify-end my-1 ${isDarkMode ? "text-white" : "text-black"
                  }`}
              >
                اسم الوحدة
              </label>
              <input
                type="text"
                id="courseName"
                placeholder="ادخل اسم الوحدة"
                className={`rounded-lg p-2 bg-gray-400 placeholder:text-black   border-none w-full text-right outline-none  ${isDarkMode ? "" : ""
                  }`}
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
              />
            </div>
            {/* add input for price of course  */}
            <div className="col-span-2 lg:col-span-1">
              <label
                htmlFor="coursePrice"
                className={`flex justify-end my-1 ${isDarkMode ? "text-white" : "text-black"
                  }`}
              >
                سعر الوحدة
              </label>
              <input
                type="number"
                id="coursePrice"
                placeholder="ادخل سعر الوحدة"
                className={`rounded-lg p-2 bg-gray-400 placeholder:text-black   border-none w-full text-right outline-none  ${isDarkMode ? "" : ""
                  }`}
                value={coursePrice}
                onChange={(e) => setCoursePrice(e.target.value)}
                required
              />
            </div>
            {/* add input for number of hours  of course  */}

            <div className="col-span-2 lg:col-span-1">
              <label
                htmlFor="courseName"
                className={`flex justify-end my-1 ${isDarkMode ? "text-white" : "text-black"
                  }`}
              >
                عدد ساعات الوحده
              </label>
              <input
                type="number"
                id="Hourscourse"
                placeholder="ادخل عدد ساعات الوحدة"
                className={`rounded-lg p-2 bg-gray-400 placeholder:text-black   border-none w-full text-right outline-none  ${isDarkMode ? "" : ""
                  }`}
                value={Hourscourse}
                onChange={(e) => setHourscourse(e.target.value)}
                required
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <label
                htmlFor="coursedescription"
                className={`flex justify-end my-1 ${isDarkMode ? "text-white" : "text-black"
                  }`}
              >
                إضافة وصف الكورس
              </label>
              <input
                type="text"
                id="coursedescription"
                placeholder="ادخل وصف الكورس"
                className={`rounded-lg p-2 bg-gray-400 placeholder:text-black   border-none w-full text-right outline-none  ${isDarkMode ? "" : ""
                  }`}
                value={CourseDescription}
                onChange={(e) => setcourseDescription(e.target.value)}
                required
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <label
                htmlFor="studentLevel"
                className={`my-0.5 flex justify-end ${isDarkMode ? "text-white" : "text-black"
                  }`}
              >
                اختيار الصف
              </label>
              <select
                id="studentLevel"
                className={` rounded-lg p-2 border-none w-full text-right bg-gray-400   ${isDarkMode ? "" : ""
                  }`}
                value={selectedStage}
                onChange={handleStageChange}
                required
              >
                <option value="">رجاء اختيار الصف الدراسي</option>
                <option value={0}>الصف الاول</option>
                <option value={1}>الصف الثانى</option>
                <option value={2}>الصف الثالث</option>
              </select>
            </div>

            {/* Render video input fields */}
            {InputsRef.current.map((input, index) => (
              <div
                key={index}
                className="flex flex-col col-span-2 gap-5 lg:flex-row"
              >
                <div className="w-full ">
                  <label
                    htmlFor={`${input.name}-pdf`}
                    className={`my-1 ${isDarkMode ? "text-white" : "text-black"
                      }`}
                  >
                    ملف {input.name}
                  </label>
                  <input
                    type="file"
                    id={`${input.name}-pdf`}
                    placeholder={`ادخل PDF ${input.name}`}
                    className={`rounded-lg p-2 bg-gray-400 border-none w-full text-right  ${isDarkMode ? "" : ""
                      }`}
                    // value={input.pdfValue} // Remove value attribute
                    onChange={
                      (e) => handleInputFileChange(index, e.target.files) // Pass null as videoFiles parameter
                    }
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor={`${input.name}-video`}
                    className={`my-1 ${isDarkMode ? "text-white" : "text-black"
                      }`}
                  >
                    فيديو {input.name}
                  </label>
                  <input
                    type="url"
                    id={`${input.name}-video`}
                    placeholder={`ادخل فيديو ${input.name}`}
                    className={`rounded-lg p-2 bg-gray-400 border-none w-full text-right  ${isDarkMode ? "" : ""
                      }`}
                    // value={input.videoValue} // Remove value attribute
                    onChange={
                      (e) => handleInputVideoChange(index, e.target.value) // Pass null as pdfFiles parameter
                    }
                  />
                </div>
              </div>
            ))}

            <div className="col-span-2 lg:col-span-1">
              <label
                htmlFor="assignmentName"
                className={`flex justify-end my-1 ${isDarkMode ? "text-white" : "text-black"
                  }`}
              >
                اسم الأمتحان
              </label>
              <input
                type="text"
                id="assignmentName"
                placeholder="ادخل اسم الامتحان"
                className={`rounded-lg p-2 bg-gray-400 placeholder:text-black   border-none w-full text-right outline-none  ${isDarkMode ? "" : ""
                  }`}
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <label
                htmlFor="studegree"
                className={`flex justify-end my-1 ${isDarkMode ? "text-white" : "text-black"
                  }`}
              >
                درجة الأمتحان النهائية
              </label>
              <input
                type="number"
                id="studegree"
                placeholder="ادخل الدرجة النهائية"
                className={`rounded-lg p-2 bg-gray-400 placeholder:text-black   border-none w-full text-right outline-none  ${isDarkMode ? "" : ""
                  }`}
                value={stuDegree}
                onChange={(e) => setStuDegree(e.target.value)}
              />
            </div>

            <div className="col-span-2 text-right">
              <button
                className={`rounded-[9px] shadow px-4 lg:px-20 py-3 hover:border hover:border-amber-400 hover:bg-white hover:text-black my-2 transition duration-700 ${isDarkMode
                    ? "bg-amber-400 text-white"
                    : "bg-gray-800 text-white "
                  }`}
              >
                {title}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormCourses;
