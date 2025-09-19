/* eslint-disable */
import axios from "axios"
import Cookies from "cookie-universal"
import { BASEURL, REFRESHENDPOINT } from "../API/API"

const cookies = Cookies()

export async function refreshAccessToken() {
  try {
    const refreshToken = cookies.get("refreshToken")
    const email = cookies.get("email")

    if (!refreshToken || !email) {
      console.warn("⚠️ No refresh token or email found")
      return null
    }

    const res = await axios.get(`${BASEURL}/${REFRESHENDPOINT}${email}`, {
      headers: { Authorization: `Bearer ${refreshToken}` },
      withCredentials: true,
    })

    if (res.status === 200 && res.data?.accessToken) {
      cookies.set("accessToken", res.data.accessToken, { secure: true, sameSite: "None" })
      return res.data.accessToken
    }

    return null
  } catch (error) {
    console.error("❌ Failed to refresh token:", error)
    return null
  }
}

// دالة تسجيل الدخول
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${BASEURL}/Auth/login`, {
      email,
      password,
    })

    if (response.status === 200) {
      const { accessToken, refreshToken, role, studentId, adminId } = response.data

      // حفظ البيانات في الكوكيز
      cookies.set("accessToken", accessToken, { secure: true, sameSite: "None" })
      cookies.set("refreshToken", refreshToken, { secure: true, sameSite: "None" })
      cookies.set("email", email, { secure: true, sameSite: "None" })
      cookies.set("role", role, { secure: true, sameSite: "None" })

      if (studentId) cookies.set("studentId", studentId, { secure: true, sameSite: "None" })
      if (adminId) cookies.set("adminId", adminId, { secure: true, sameSite: "None" })

      return response.data
    }
  } catch (error) {
    throw error
  }
}

// دالة تسجيل الخروج
export const logoutUser = () => {
  cookies.remove("accessToken")
  cookies.remove("refreshToken")
  cookies.remove("email")
  cookies.remove("role")
  cookies.remove("studentId")
  cookies.remove("adminId")
  localStorage.clear()
}

// دالة التحقق من حالة المصادقة
export const isAuthenticated = () => {
  const accessToken = cookies.get("accessToken")
  const role = cookies.get("role")
  return { isAuth: !!accessToken, role }
}
