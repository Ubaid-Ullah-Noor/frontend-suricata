import axios from "axios";


const base_url="http://localhost:4000/"


const postHandler=async (url,data={},headers={})=>{
    try{
      
        const response=await axios.post(`${base_url}${url}`, data, {
            headers: headers
          });
        return response;  
    }catch(error){
      return error.response;
    }
   
}

const getHandler=async(url,headers={})=>{
  try{
   
    const response=await axios.get(`${base_url}${url}`, {
        headers: headers
      });
    return response;  
  }catch(error){
    return error.response;
  }
}


export default {
    postHandler,
    getHandler
}
