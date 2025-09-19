import React, { useEffect, useState } from 'react';
import NavbarApp from './NavbarApp';
import AllCourses from './AllCourses';
import FooterApp from '../FooterApp';
import Profile from './Profile';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Cookies from 'cookie-universal';
import { useNavigate } from 'react-router-dom';
import useCheckCookiesValues from './checkAllCookies';

// export async function checkCookiesValues() {
//   const navigate = useNavigate();
//   console.log("inside")

//   const cookies = Cookies();
//   if (cookies.get("firstName") && cookies.get("lastName") && cookies.get("email") && cookies.get("id") && cookies.get("role")) {
//     if (userRole === "Admin") {
//       navigate("/dashboard");
//     } else if (userRole === "Student") {
//       navigate(`/dashboardstu/${studentId}`);
//     }
//     else {
//       try {
//         const res = await sendRequest(BASEURL, `/${SIGNOUT}`, "DELETE");
//         cookies.removeAll();
//       }
//       catch{}
//     }

//     return true;
//   }
//   else {
//     cookies.removeAll();
//     return false;  
//   }
// }
function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const checkAllCookies = useCheckCookiesValues()
  useEffect(() => {
    // لا تقم بالتوجيه من الصفحة الرئيسية لتجنب التعارض مع الفاحص العام في App
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.title = "مستر أحمد جابر";

    return () => {
      document.title = " مستر أحمد جابر";
    };
  }, []);
  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <> <NavbarApp />
          <Profile />
          <AllCourses />
          <FooterApp />
        </>
      )}
    </>
  );
}

export default HomePage;
