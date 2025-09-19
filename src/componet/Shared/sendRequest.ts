/* eslint-disable */
import axios from "axios"
import Cookies from "cookie-universal"
import { refreshAccessToken } from "../Registration/authService"

const cookies = Cookies()

const defaultHeaders = {
  Accept: "*/*",
  "Content-Type": "application/json",
}

const sendRequest = async (
  baseURL: string,
  endpoint: string,
  method: string,
  data: any = {},
  customHeaders: Record<string, string> = {},
  hasHeaders = true,
) => {
  try {
    const accessToken = cookies.get("accessToken") || localStorage.getItem("accessToken")

    const methodUpper = (method || "GET").toUpperCase()
    const isGet = methodUpper === "GET"

    const headers = {
      ...(isGet ? {} : defaultHeaders),
      ...customHeaders,
      ...(methodUpper !== "POST" && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    }

    const config = {
      method: methodUpper,
      url: `${baseURL}/${endpoint}`,
      ...(isGet ? {} : { data }),
      ...(hasHeaders && { headers }),
      withCredentials: true,
    } as any

    const response = await axios(config)
    return response
  } catch (error: any) {
    if (error.response?.status === 401) {
      const newToken = await refreshAccessToken()
      if (newToken) {
        cookies.set("accessToken", newToken)
        localStorage.setItem("accessToken", newToken)
        // إعادة الطلب بعد التجديد
        return await sendRequest(baseURL, endpoint, method, data, customHeaders, hasHeaders)
      }
    }
    return error.response
  }
}

export default sendRequest
