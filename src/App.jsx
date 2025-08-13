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
import PageNotFound from "./componet/PageNotFound";
import CourseContent from "./componet/Students/CourseContent";
import AvailableCourses from "./componet/Admin/AvailableCourses";
import ExamesResults from "./componet/Admin/ExamesResults";
import BlackList from "./componet/Admin/BlackList";
import DashboardStudent from "./componet/Students/DashboardStudent";
import StuProfile from "./componet/Students/StuProfile";
import StuExamResult from "./componet/Students/StuExamResult";
import StuCourses from "./componet/Students/StuCourses";
import DisplayCourse from "./componet/DisplayCourse";
import VerificationCode from "./componet/Registration/VerificationCode";
import AddStudentToCourse from "./componet/Admin/AddStudentToCourse";
import Payment from "./componet/Payment";
import RequireAuth from "./componet/Registration/RequireAuth";
import RemoveStudentFromCourse from "./componet/Admin/RemoveStudentFromCourse";
import UsersForCourses from "./componet/Admin/UsersForCourses";
import { useEffect } from "react";

function App() {
  const navigate=useNavigate()
  // const location=useLocation()
  useEffect(_=>{
    
    const search=window.location.search.split("=")
    console.log(window.location.search);
    if(search.length==2&&search[0]=='?route'){
      navigate('/'+search[1])

    }
  },[])
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
        <Route path="secondgrade" element={<SecondgradeSecondary />} />
        <Route path="thirdgrade" element={<Thirdrgadesecondary />} />
        <Route
          path="/payment/:coursePrice/:courseName"
          element={<Payment />}
        />
        {/* Routes for students */}
        <Route  element={<RequireAuth allowedroles={"Student"} />}>
          <Route path="dashboardstu/:studentId" element={<DashboardStudent />}>
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
          <Route path="dashboard" element={<Dashboard />}>
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
            <Route path="blacklist" element={<BlackList />} />
          </Route>
        </Route>
        {/* Routes for student */}
      </Routes>
    </>
  );
}

export default App;
