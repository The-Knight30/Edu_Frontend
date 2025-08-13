// sendRequest.js
/*eslint-disable */
import axios from "axios";
import { refreshAccessToken } from "../Registration/Login";

const sendRequestGet = async (baseURL) => {
  try {
    const url = `${baseURL}`;
    const response = await axios.get(url 
      // ,{withCredentials:true}
    );
   

    return response;
  } catch (error) {
    if (error.response.status === 401) {
      await refreshAccessToken();
      return await sendRequestGet(baseURL);
    }
    return error.response;
  }
};

export default sendRequestGet;
