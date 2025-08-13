import { useNavigate } from "react-router-dom";
import Cookies from "cookie-universal"
  function useCheckCookiesValues() {
   
    const navigate = useNavigate();
    console.log("inside")
  
    const cookies = Cookies();
    return async function (){
    if (cookies.get("firstName") && cookies.get("lastName") && cookies.get("email") && cookies.get("id") && cookies.get("role")) {
     const userRole=cookies.get("role")
     const studentId=cookies.get("id")
        if (userRole === "Admin") {
        navigate("/dashboard");
      } else if (userRole === "Student") {
        navigate(`/dashboardstu/${studentId}`);
      }
      else {
        try {
       await sendRequest(BASEURL, `/${SIGNOUT}`, "DELETE");
          cookies.removeAll();
        }
        catch{}
      }
  
    //   return true;
    }
    else {
      cookies.removeAll();
    //   return false;  
    }
}
  }
  export default useCheckCookiesValues