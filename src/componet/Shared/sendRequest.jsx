// sendRequest.js
/*eslint-disable */
import axios from "axios";
import { refreshAccessToken } from "../Registration/authService.js";

const defaultHeaders = {
  "Content-Type": "application/json",
};

const sendRequest = async (baseURL, endpoint, method, data = {}, customHeaders = {}, hasheaders=true) => {

  try {
    const headers = { ...defaultHeaders, ...customHeaders };
    const config = hasheaders?{
      
      method: method,
      url: `${baseURL}/${endpoint}`,
      data: data,
      headers: headers
      // ,withCredentials:true
    }:{ method: method,
      url: `${baseURL}/${endpoint}`,
      data: data
      // ,withCredentials:true
    };
    const response = await axios(config);
    
    return response;
  } catch (error) {
    if(error.response.status===401){
      await refreshAccessToken()
     return await sendRequest(baseURL, endpoint, method, data , customHeaders)
    }
    return error.response
  }
};

export default sendRequest;
