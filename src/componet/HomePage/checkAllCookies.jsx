import { useNavigate } from "react-router-dom";
import Cookies from "cookie-universal"

function useCheckCookiesValues() {
  const navigate = useNavigate();
  const cookies = Cookies();

  return async function () {
    console.log("inside")
    const role = cookies.get("role");
    const id = cookies.get("id");

    if (!role || !id) return;

    const target = role === "Admin" ? "/dashboard" : role === "Student" ? `/dashboardstu/${id}` : null;
    if (!target) return;
    if (window.location.pathname !== target) {
      navigate(target, { replace: true });
    }
  }
}

export default useCheckCookiesValues