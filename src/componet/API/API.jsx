// During development, target backend directly; in production use current origin
const isDev = import.meta && import.meta.env && import.meta.env.DEV;
const origin = isDev ? "https://localhost:7155" : window.location.origin;
export const BASEURL = `${origin}/api`;
export const SIGNUP_ENDPOINT = "Accounts/SignUp";
export const LOGIN_ENDPOINT = "Accounts/Login";
export const SENDCODE_ENDPOINT = "Accounts/SendCode";
export const VERIVICATION_ENDPOINT = "Accounts/ValidateCode";
export const ADDCOURSES_ENDPOINT = "Courses/CreateCourse";
export const GETCOURSES = `${BASEURL}/Courses/AllCoursesInSameStage?stage=`;
export const ADDUNITETOCOURSES_ENDPOINT = "Courses/AddUniteToCourse";
export const ADDASSIGNMENT_ENDPOINT = "Courses/AddAssignment";
export const ALLCOURSESINSAMESTAGE_ENDPOINT = "Courses/AllCoursesInSameStage";
export const RESETPASSWORD_ENDPOINT = "Accounts/ResetPassword";
export const VALIDATERESETPASSWORD_ENDPOINT = "Accounts/ValidateResetPasswordCode";
export const GETSTUDENTS = `${BASEURL}/Admin/students?blocked=`;
export const USERSFORCOURESE = `${BASEURL}/Courses/AllStudentsInCoursById`;
export const BLACKLIST_ADD = "Admin/blacklist/add";
export const BLACKLIST_REMOVE = "Admin/blacklist/remove";
export const ADDSTUDENTTOCOURSE = "Payment/add-student";
export const REMOVESTUDENFROMCOURSE = "Payment/remove-student";
export const GETASSIGNMENTS = `${BASEURL}/Courses/AssignmentsOfStudentsToAddGrade`;
export const ALLCOURSES = "Courses/GetAllCourses";
export const DELETECOURSE = "Courses/DeleteCourse/";
export const GETSTUDENTINCOURSE = `${BASEURL}/Student/AllCoursesForStudent`;
export const GETSTUDENTINFORMATION = `${BASEURL}/Student/StudentProfile?id=`
export const GETSTUDENTINGRADE = `${BASEURL}/Courses/GetGradeOfExam?id=`;
export const GETSOWNSTUDENTCOURSE = `${BASEURL}/Student/AllCoursesForStudent?studentId=`;
export const SIGNOUT = "Accounts/SignOut";
export const ADDGRADETOSTUDENT = "Courses/GiveGrade";
export const GETUNITESBYCOURSEID = `${BASEURL}/Courses/AllUnitesByCourseIdForStudent/`;
export const UPLOADSOLUTION = `Courses/UploadSolution`;
export const ISPAYORNOT = `${BASEURL}/Courses/IsPayOrNot?`;
export const REFRESHENDPOINT = "Accounts/UpdateTokens?email=";

export const PAYMOB_START_PAYMENT_ENDPOINT = "PayMob/start"
export const PAYMOB_PAYMENT_CALLBACK_ENDPOINT = "PayMob/callback"


export const CREATE_EXAM_ENDPOINT = "Exams"
export const ADD_QUESTION_ENDPOINT = "Exams/question"
export const GET_EXAM_ENDPOINT = "Exams"
export const GET_ALL_EXAMS_ENDPOINT = "Exams?includeQuestions=true"
export const GET_EXAMS_LIST_ENDPOINT = "Exams?includeQuestions=false"
export const SUBMIT_EXAM_ENDPOINT = "Exams/submit"
export const GET_EXAM_RESULTS_ENDPOINT = "Exams/results"
export const GET_EXAM_STUDENTS_ENDPOINT = "Exams/{examId}/students"
export const GET_STUDENT_ANSWERS_ENDPOINT = "Exams/{examId}/student/{studentId}/answers"
export const GIVE_EXAM_GRADE_ENDPOINT = "Exams/grade"
