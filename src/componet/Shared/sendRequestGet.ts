/* eslint-disable */
import axios from "axios"
import Cookies from "cookie-universal"
import { refreshAccessToken } from "../Registration/authService"

const cookies = Cookies()

const defaultHeaders = { "Content-Type": "application/json" }

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
    const headers = {
      ...defaultHeaders,
      ...customHeaders,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    }

    const config = {
      method,
      url: `${baseURL}/${endpoint}`,
      data,
      ...(hasHeaders && { headers }),
      withCredentials: true,
    }

    const response = await axios(config)
    return response
  } catch (error: any) {
    if (error.response?.status === 401) {
      const newToken = await refreshAccessToken()
      if (newToken) {
        cookies.set("accessToken", newToken, { secure: true, sameSite: "none" })
        localStorage.setItem("accessToken", newToken)
        return await sendRequest(baseURL, endpoint, method, data, customHeaders, hasHeaders)
      }
    }
    return error.response
  }
}

export default sendRequest
