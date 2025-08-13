/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  BASEURL,
  GETUNITESBYCOURSEID,
  ISPAYORNOT,
  UPLOADSOLUTION,
} from "../API/API";
import Wave from "../Shared/Wave";
import sendRequest from "../Shared/sendRequest";
import SpinnerModal from "../Shared/SpinnerModal";
import { toast } from "react-toastify";
import sendRequestGet from "../Shared/sendRequestGet";
import Cookies from "cookie-universal";
import axios from "axios";
const CourseInformation = () => {
  const [AssignmentId, setAssignmentId] = useState();
  const [ASSigementfileUrl, setASSigementfileUrl] = useState();
  const { isDarkMode } = useContext(ThemeContext);
  const courseId = useParams();
  const [courseDataa, setCourseDataa] = useState({});
  const [videosCount, setVideosCount] = useState(0);
  const [filesCount, setFilesCount] = useState(0);
  const [isLoading, setIsLoading] = useState();
  const [isPay, setIsPay] = useState(true);
  function checkCookies() {
    if (
      !(
        cookies.get("firstName") &&
        cookies.get("lastName") &&
        cookies.get("email") &&
        cookies.get("id") &&
        cookies.get("role")
      )
    ) {
      return false;
    }
    return true;
  }
  async function obtainDuration(videoUrl, setState) {
    function getId(videoUrl){
      let id;
      if(videoUrl.includes("v="))
       id=`${videoUrl
        .slice(videoUrl.indexOf("="))
        .split("&")[0]
        .slice(
          1
        )}`
        else{
          const splited=videoUrl.split("/")
          id=splited[splited.length-1].split("?")[0]
        }
        return id 
    }
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${getId(videoUrl)}&key=AIzaSyDJoN-yLKN0eXpA1uepIsYUvp5XhcLBBLs&part=contentDetails`
    );
    const data = await res.json();
    const duration = data.items[0].contentDetails.duration;
    var s =
      "PT" + duration.replace("H", "H").replace("M", "M").replace("S", "S");
    let dura = s
      .slice(s.indexOf("T"))
      .slice(1)
      .slice(s.indexOf("T"))
      .slice(1)
      .replaceAll(/[a-z]/gi, ":")
      .slice(0, -1);
    // dura=dura.padStart(8,"0")
    return dura;
  }
  // function getDuration(videoUrl, setState) {
  //   const cookies = Cookies();
  //   let result = "00:00:00";
  //   let video = document.createElement("video");
  //   video.src = videoUrl;

  //   if (checkCookies())
  //     video.addEventListener("loadedmetadata", () => {
  //       const durationInSeconds = video.duration;
  //       result = `${parseInt(durationInSeconds / 60 / 60)
  //         .toString()
  //         .padStart(2, "0")}:${parseInt(durationInSeconds/60%60)
  //         .toString()
  //         .padStart(2, "0")}:${parseInt(durationInSeconds)%60
  //         .toString()
  //         .padStart(2, "0")}`;

  //       //setDuration(result)
  //       if (setState == "skills") {
  //         setskillsDuration(result.toString());
  //       } else if (setState == "vocabulary") {
  //         setsvocabularyDuration(result.toString());
  //       } else if (setState == "exams") {
  //         setexamDuration(result.toString());
  //       } else if (setState == "story") {
  //         setstoryDuration(result.toString());
  //       } else if (setState == "translation") {
  //         settranslationDuration(result.toString());
  //       }
  //     });
  //   else {
  //     result = "يجب الشراء اولا";
  //     if (setState == "skills") {
  //       setskillsDuration(result.toString());
  //     } else if (setState == "vocabulary") {
  //       setsvocabularyDuration(result.toString());
  //     } else if (setState == "exams") {
  //       setexamDuration(result.toString());
  //     } else if (setState == "story") {
  //       setstoryDuration(result.toString());
  //     } else if (setState == "translation") {
  //       settranslationDuration(result.toString());
  //     }
  //   }
  //   // console.log(result.length);
  // }

  // states to fetch the duration of videos
  const [skillsDuration, setskillsDuration] = useState("");
  const [vocabularyDuration, setsvocabularyDuration] = useState("");
  const [examDuration, setexamDuration] = useState("");
  const [storyDuration, setstoryDuration] = useState("");
  const [translationDuration, settranslationDuration] = useState("");
  //
  function getSkills(s) {
    // console.log(s);
    return !s ? (
      <div role="status" className="flex justify-center items-center mt-3">
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    ) : (
      s
    );
  }
  const cookies = Cookies();
  const fileRef = useRef();
  const location = useLocation();
  function FileCounter(responseData) {
    console.log(responseData);
    
    const urls = Object.values(responseData);
    const pdfCount = urls.filter(
      (url) => typeof url === "string" && url.endsWith(".pdf")
    ).length;
    const videoCount = urls.filter(
      (url) => typeof url === "string" && url.includes("youtu")
    ).length;
    setVideosCount(videoCount);
    setFilesCount(pdfCount);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const rawStudentId = cookies.get("id");
    const studentID = +rawStudentId; // Use base 10 for decimal
    // console.log(typeof studentID);
    try {
      const body = new FormData();
      body.append("SolutionFileUrl", fileRef.current.files[0]);
      body.append("StudentId", studentID);
      body.append("AssignmentId", AssignmentId);
      // console.log(Array.from(body.entries()));

      const res3 = await sendRequest(
        BASEURL,
        `${UPLOADSOLUTION}`,
        "POST",
        body,
        {},
        false
      );
      console.log(res3);
      if (res3.status == 204) toast.success("تم رفع الملف بنجاح");
      else if (res3.status == 400) toast.error("تم رفع الحل من قبل");
      else toast.error("خطا");
    } catch (err) {
      toast.error("خطا");
    } finally {
      setIsLoading(false);
    }
  };

  const data = location.state ? location.state.data : "";

  // console.log(data);
  const fetechCourseData = async () => {
    try {
      const response = await sendRequestGet(
        `${GETUNITESBYCOURSEID}${courseId.courseId}`
      );
      // console.log(response.data);
      // getDuration(r);
      
      if (response.data[0].assignment) {
        setAssignmentId(response.data[0].assignment?.assignmentId);
        setASSigementfileUrl(response.data[0].assignment?.assFiles);
      }

      if (response.status === 200) {
        setCourseDataa(response.data[0]);
        FileCounter(response.data[0]);
      }
      // console.log(courseDataa);
      const checkCookesRes = checkCookies();
      let durationOfUndefinedUrl = checkCookesRes
        ? "00:00:00"
        : "يجب الشراء اولا";
      if (response.data[0].vocablaryUrl && checkCookesRes)
        setsvocabularyDuration(
          await obtainDuration(response.data[0].vocablaryUrl)
        );
      // getDuration(response.data[0].vocablaryUrl, "vocabulary");
      else setsvocabularyDuration(durationOfUndefinedUrl);
      if (response.data[0].skillUrl && checkCookesRes)
        setskillsDuration(await obtainDuration(response.data[0].skillUrl));
      // getDuration(response.data[0].skillUrl, "skills");
      else setskillsDuration(durationOfUndefinedUrl);

      if (response.data[0].storyUrl && checkCookesRes)
        setstoryDuration(await obtainDuration(response.data[0].storyUrl));
      // getDuration(response.data[0].storyUrl, "story");
      else setstoryDuration(durationOfUndefinedUrl);

      if (response.data[0].translationUrl && checkCookesRes)
        settranslationDuration(
          await obtainDuration(response.data[0].translationUrl)
        );
      // getDuration(response.data[0].translationUrl, "translation");
      else settranslationDuration(durationOfUndefinedUrl);

      if (response.data[0].examUrl && checkCookesRes)
        setexamDuration(await obtainDuration(response.data[0].examUrl));
      // getDuration(response.data[0].examUrl, "exams");
      else setexamDuration(durationOfUndefinedUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPay = async () => {
    const rawStudentId = cookies.get("id");
    const studentID = +rawStudentId;
    const courseID = parseInt(courseId.courseId, 10);
    try {
      const response = await sendRequestGet(
        `${ISPAYORNOT}studentId=${studentID}&courseId=${courseID}`
      );
      if (response.status === 200) {
        setIsPay(true);
      } else {
        setIsPay(false);
      }
    } catch (error) {
      console.error("Error fetching pay data:", error);
    }
  };

  // const handleSubscribe = async (e) => {
  //   e.preventDefault();
  //   await fetchPay();
  //   if (isPay) {
  //     toast.success("انت بالفعل مشترك بالكورس");
  //   } else {
  //     window.location.href = `/payment/${data.coursePrice}/${data.courseName}`;
  //   }
  // };

  useEffect(() => {
    fetechCourseData();
    fetchPay();
  }, [location.pathname]);

  const spanStyle =
    " px-2 ml-2 text-black bg-white w-14 rounded-xl flex justify-between items-center";
  const courseData = [
    {
      label: "الفيديوهات",
      count: videosCount,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5 text-yellow-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      ),
    },
    {
      label: "الامتحانات",
      count: 1,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 text-yellow-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
          />
        </svg>
      ),
    },
    {
      label: "الملفات",
      count: filesCount,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5 text-yellow-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
          />
        </svg>
      ),
    },
  ];
  const courseDetails = [
    {
      name: "الكلمات",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5 mr-5 text-yellow-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      ),
      length: getSkills(vocabularyDuration),
      numberViews: 5,
      linkIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 m-auto"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
          />
        </svg>
      ),
      videoUrl: courseDataa.vocablaryUrl,
      pdfUrl: courseDataa.vocablaryPdfUrl,
    },
    {
      name: "اسكيلز",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5 mr-5 text-yellow-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      ),
      length: getSkills(skillsDuration),
      numberViews: 5,
      linkIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 m-auto"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
          />
        </svg>
      ),
      videoUrl: courseDataa.skillUrl,
      pdfUrl: courseDataa.skillPdfUrl,
    },
    {
      name: "قطع وترجمة",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5 mr-5 text-yellow-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      ),
      length: getSkills(translationDuration),
      numberViews: 5,
      linkIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 m-auto"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
          />
        </svg>
      ),
      videoUrl: courseDataa.translationUrl,
      pdfUrl: courseDataa.translationPdfUrl,
    },
    {
      name: "حل امتحان",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5 mr-5 text-yellow-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      ),
      length: getSkills(examDuration),
      numberViews: 5,
      linkIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 m-auto"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
          />
        </svg>
      ),
      videoUrl: courseDataa.examUrl,
    },
    {
      name: "القصة",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5 mr-5 text-yellow-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      ),
      length: getSkills(storyDuration),
      numberViews: 5,
      linkIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 m-auto"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
          />
        </svg>
      ),
      videoUrl: courseDataa.storyUrl,
      pdfUrl: courseDataa.storyPdfUrl,
    },
  ];
  const ListItems = (
    <ul className="bg-green-950 rounded-xl w-[30rem] md:h-16 text-white p-5 flex justify-between font-bold flex-wrap h-auto gap-3 md:gap-0">
      {courseData.map((item, index) => (
        <li key={index} className="flex items-center">
          <div className={spanStyle}>
            <span>{item.count}</span>
            {item.icon}
          </div>
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <Wave title={data.courseName} />
      <SpinnerModal isLoading={isLoading} />

      <div className="h-full p-5 lg:p-20">
        <div className="flex flex-wrap items-end justify-center gap-8 md:justify-between md:gap-0">
          <img
            src={data.profileUrl}
            alt="revison image"
            className="w-64 lg:h-96 rounded-xl lg:w-80 h-80 object-cover"
          />
          <div>
            {!isPay && (
              <div className="flex items-center justify-end " dir="rtl">
                <p className="ml-4 text-base leading-10 text-center text-white bg-blue-600 h-11 md:w-36 w-28 rounded-3xl">
                  {data.coursePrice}جنيهًا
                </p>

                <Link
                  to={`/payment/${data.coursePrice}/${data.courseName}`}
                  // onClick={handleSubscribe}
                  className={` text-lg text-white px-8 py-5 rounded-xl ${
                    isDarkMode ? "bg-red-600 " : "bg-green-950"
                  }`}
                >
                  اشتراك
                </Link>
              </div>
            )}
            <div
              className={`p-8 md:p-10 mt-2  lg:w-[30rem]  rounded-xl md:text-3xl text-xl ${
                isDarkMode ? "bg-[#1E1F25] text-white" : "bg-gray-50"
              } `}
              dir="rtl"
            >
              <p>- اسم الكورس : {data.courseName}</p>
              <p>- وصف الكورس : {data.courseDescription}</p>
              <p>- عدد ساعات الكورس : {data.totoalHoure}</p>
            </div>
          </div>
        </div>
        <div
          className={`p-5 mt-16  rounded-xl ${
            isDarkMode ? "bg-[#1E1F25]" : "bg-gray-100"
          }`}
          dir="rtl"
        >
          <div className="flex flex-wrap md:flex-nowrap md:mb-3">
            <p className="w-40 p-3 mb-2 ml-20 mr-3 text-lg font-bold text-white bg-yellow-500 md:p-5 rounded-xl">
              محتوي الكورس
            </p>
            {ListItems}
          </div>
          <div className="overflow-x-auto">
            <table
              className={`w-full rounded-xl ${
                isDarkMode ? "bg-black text-yellow-500" : "bg-white"
              }`}
            >
              <thead>
                <tr className="flex items-center justify-between px-5 py-10 space-x-2">
                  <th className="flex items-center justify-center w-48">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-16 h-16 md:h-20 md:w-20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                    <span className="text-lg">المحتوى</span>
                  </th>
                  <th className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>

                    <span className="text-lg md:mr-3">مدة الفيديو</span>
                  </th>
                  <th className="flex items-center">
                    <span className="text-lg">الدخول للمشاهدة</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {courseDetails.map((item, index) => (
                  <tr
                    key={index}
                    className="flex items-center justify-between px-5 py-2 space-x-2"
                  >
                    <td className="flex items-center w-40 h-12 leading-10 text-center text-white lg:w-56 md:w-52 texet-lg bg-green-950 rounded-3xl ">
                      {item.icon}
                      <span className="mr-4">{item.name}</span>
                    </td>
                    <td className="w-32 h-12 text-lg leading-10 text-center text-white bg-blue-600 md:w-36 rounded-3xl">
                      {item.length}
                    </td>

                    <td>
                      <Link
                        to={`displaycourse/${courseId.courseId}`}
                        state={{
                          videoUrl: item.videoUrl,
                          pdfUrl: item.pdfUrl,
                          title: data.courseName,
                          // assignmentId: courseDataa.assignment[0].assignmentId
                        }}
                        className="inline-block w-32 h-12 pt-3 text-lg leading-10 text-center text-white bg-red-600 md:w-36 rounded-3xl"
                      >
                        {item.linkIcon}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>

              {
                //to be disabled
                isPay && (
                  <div className="flex items-start justify-center my-4 ">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <p
                        className={`md:px-4 md:py-2 leading-10 font-bold text-center shadow-md w-28 bg-gray-50 rounded-xl ${
                          isDarkMode ? "bg-yellow-500 text-white" : "bg-gray-50"
                        }`}
                      >
                        الامتحان
                      </p>

                      <button
                        onClick={() => {
                          // console.log(ASSigementfileUrl);
                          
                          window.open(ASSigementfileUrl), "_blank";
                        }}
                        className="flex items-center justify-center w-48 font-bold text-white border-8 h-11 border-y-0 border-r-yellow-500 border-l-green-700 rounded-2xl bg-green-950"
                      >
                        <span>حل الأمتحان</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6 ml-2 text-green-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              }
            </table>
          </div>
        </div>
        {isPay && (
          <div className="flex items-center justify-center my-5 ">
            <form onSubmit={handleSubmit}>
              <label htmlFor="fileInput" className="block lg:w-[50rem]">
                <div
                  className={`md:p-32 px-8 md:px-14 py-20 mt-5 rounded-lg cursor-pointer h-72 md:h-80   ${
                    isDarkMode ? "bg-[#1E1F25]" : "bg-white"
                  }`}
                >
                  <p className="flex justify-between py-3 m-auto text-blue-600 border-2 border-blue-600 px-7 rounded-3xl w-44">
                    <span>رفع الحل</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                      />
                    </svg>
                  </p>
                  <h3
                    className={` text-right mt-4 md:mt-16 text-xl font-Mukta ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    يرجي الملاحظة انه لن يتم الرفع الا مره واحده فقط
                  </h3>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  ref={fileRef}
                  // onChange={(e) => console.log(AssignmentId)}
                />
              </label>
              <div className="w-full text-center">
                <button className="px-16 py-3 mx-auto mt-5 text-white bg-green-600 rounded-lg w-60">
                  تسليم
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseInformation;
