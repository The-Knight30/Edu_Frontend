import { useNavigate } from "react-router-dom";
import Cookies from "cookie-universal";

function useCheckCookiesValues() {
  const navigate = useNavigate();
  const cookies = Cookies();

  return async function () {
    console.log("🔎 Checking cookies...");

    const email = cookies.get("email");
    const id = cookies.get("id");
    const role = cookies.get("role");

    console.log("Cookies =>", { email, id, role });

    // لا تزيل الكوكيز إذا كانت ناقصة؛ اسمح بتدفق التحقق/التسجيل بالعمل
    if (!role || !id) return;

    // تجنب تكرار التوجيه إذا كنا بالفعل في الوجهة الصحيحة
    const target = role === "Admin" ? "/dashboard" : role === "Student" ? `/dashboardstu/${id}` : null;
    if (!target) return;
    if (window.location.pathname !== target) {
      console.log(`✅ ${role} detected, navigating...`);
      navigate(target, { replace: true });
    }
  };
}

export default useCheckCookiesValues;
