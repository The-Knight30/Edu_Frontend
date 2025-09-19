// sendRequestGet.js
/*eslint-disable */
import axios from "axios";
import { refreshAccessToken } from "../Registration/Login";

const sendRequestGet = async (url) => {
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      return await sendRequestGet(url);
    }
    return error.response;
  }
};

export default sendRequestGet;
