import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import HomePage from "./componet/HomePage/HomePage";
import Login from "./componet/Registration/Login";
import SignUp from "./componet/Registration/SignUp";
import ForgetPassword from "./componet/Registration/ForgetPassword";
import Firstgradesecondary from "./componet/CouresesLevels/Firstgradesecondary";
import SecondgradeSecondary from "./componet/CouresesLevels/SecondgradeSecondary";
import Thirdrgadesecondary from "./componet/CouresesLevels/Thirdrgadesecondary";
import AllCourses from "./componet/HomePage/AllCourses";
import Dashboard from "./componet/Admin/DashboardAdmin";
import Users from "./componet/Admin/Users";
import AddCourses from "./componet/Admin/AddCourses";
import CreateNewPassword from "./componet/Registration/CreateNewPassword";
import UnitContent from "./componet/Students/UnitContent";
import StudentExamList from "./componet/Students/StudentExamsList";
import TakeExam from "./componet/Students/TakeExam";
import Payments from "./componet/Payments/Payment";
import PaymentManagement from "./componet/Payments/PaymentManagement";
import PageNotFound from "./componet/PageNotFound";
import CourseContent from "./componet/Students/CourseContent";
import AvailableCourses from "./componet/Admin/AvailableCourses";
import ExamesResults from "./componet/Admin/ExamesResults";
import CreateExam from "./componet/Admin/CreateExam";
import AddQuestion from "./componet/Admin/AddQuestion";
import PaymobPayment from "./componet/PayMob/PayMobPayment";
import PaymentCallback from "./componet/PayMob/PaymentCallback";
import PayMobWrapper from "./componet/PayMob/PayMobWrapper";
import AvailableCoursesToBuy from "./componet/Students/AvailableCoursesToBuy";
import AvailableExams from "./componet/Students/AvailableExams";
import ExamDetails from "./componet/Students/ExamDetails";
import ExamResultsManagement from "./componet/Admin/ExamResultsManagement";
import ExamResultsDetail from "./componet/Admin/ExamResultsDetail";




import BlackList from "./componet/Admin/BlackList";
import DashboardStudent from "./componet/Students/DashboardStudent";
import StudentExam from "./componet/Students/StudentExams";
import StuProfile from "./componet/Students/StuProfile";
import StuExamResult from "./componet/Students/StuExamResult";
import StuCourses from "./componet/Students/StuCourses";
import DisplayCourse from "./componet/DisplayCourse";
import VerificationCode from "./componet/Registration/VerificationCode";
import AddStudentToCourse from "./componet/Admin/AddStudentToCourse";

import Payment from "./componet/Payments/Payment";
import RequireAuth from "./componet/Registration/RequireAuth";
import useCheckCookiesValues from "./componet/Hooks/useCheckCookiesValues";

import RemoveStudentFromCourse from "./componet/Admin/RemoveStudentFromCourse";
import Terms from "./Pages/Terms";
import PrivacyPolicy from "./Pages/privacy-policy";
import RefundPolicy from "./Pages/RefundPolicy";
import ShippingPolicy from "./Pages/shipping-policy";
import AboutUs from "./Pages/AboutUs";

import UsersForCourses from "./componet/Admin/UsersForCourses";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate()
  const checkCookies = useCheckCookiesValues();
  // const location=useLocation()
  useEffect(() => {
    // نفذ فحص الكوكيز مرة واحدة فقط للتوجيه العام
    checkCookies();
    const search = window.location.search.split("=");
    if (search.length === 2 && search[0] === "?route") {
      navigate("/" + search[1]);
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/index.html" element={<HomePage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="reset" element={<CreateNewPassword />} />
        <Route path="forget-password" element={<ForgetPassword />} />
        <Route path="verificationCode" element={<VerificationCode />} />
        <Route path="all-courses" element={<AllCourses />} />
        <Route path="firstgrade" element={<Firstgradesecondary />} />
        <Route path="students" element={<students />} />
        <Route path="secondgrade" element={<SecondgradeSecondary />} />
        <Route path="thirdgrade" element={<Thirdrgadesecondary />} />
        <Route path="student-exams" element={<StudentExam />} />
        <Route path="student-exams-list" element={<StudentExamList />} />
        <Route path="take-exam/:examId" element={<TakeExam />} />
        <Route path="payment-management" element={<PaymentManagement />} />
        <Route path="payments" element={<Payments />} />
        <Route path="paymob-payment/:courseId/:coursePrice/:courseName" element={<PayMobWrapper />} />
        <Route path="paymob-callback" element={<PaymentCallback />} />
        <Route path="course-payment/:courseId" element={<PayMobWrapper />} />
        <Route path="buy-courses" element={<AvailableCoursesToBuy />} />
        <Route path="available-exams" element={<AvailableExams />} />
        <Route path="exam-details/:examId" element={<ExamDetails />} />

        {/* Payment Route */}
        <Route
          path="/payment/:coursePrice/:courseName"
          element={<Payment />}
        />
        {/* Routes for students */}
        <Route element={<RequireAuth allowedroles={"Student"} />}>
          <Route path="dashboardstu/:studentId" element={<DashboardStudent />}>
            <Route index element={<StuCourses />} />
            <Route path="profile" element={<StuProfile />} />
            <Route path="stuavailablecourses" element={<StuCourses />} />
            <Route path="stuexamresult" element={<StuExamResult />} />
          </Route>
          <Route
            path="coursecontent/:courseId/displaycourse/:courseId"
            element={<DisplayCourse />}
          />
        </Route>
        <Route path="unIt-content" element={<UnitContent />} />
        <Route path="coursecontent/:courseId" element={<CourseContent />} />

        {/*  */}

        {/* Routes for Admin */}
        <Route element={<RequireAuth allowedroles={"Admin"} />}>
          <Route path="dashboard/*" element={<Dashboard />}>
            <Route path="users" element={<Users />} />
            <Route path="usersForCourses/:courseId" element={<UsersForCourses />} />
            <Route
              path="addcoursetostudent/:courseId"
              element={<AddStudentToCourse />}
            />
            <Route
              path="removecoursefromstudent/:courseId"
              element={<RemoveStudentFromCourse />}
            />
            <Route path="addcourse" element={<AddCourses />} />
            <Route path="availablecourses" element={<AvailableCourses />} />
            <Route path="exam-result" element={<ExamesResults />} />
            <Route path="create-exam" element={<CreateExam />} />
            <Route path="add-question" element={<AddQuestion />} />
            <Route path="exam-results" element={<ExamResultsManagement />} />
            <Route path="exam-results/:examId" element={<ExamResultsDetail />} />
            <Route path="blacklist" element={<BlackList />} />
          </Route>
        </Route>
        {/* Routes for student */}
        {/* Legal Pages */}
<Route path="/terms-and-conditions" element={<Terms />} />
<Route path="/privacy-policy" element={<PrivacyPolicy />} />
<Route path="/refund-policy" element={<RefundPolicy />} />
<Route path="/shipping-policy" element={<ShippingPolicy />} />
<Route path="/about-us" element={<AboutUs />} />

      </Routes>
     
    </>
  );
}

export default App;
