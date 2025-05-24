import axios from "axios";

const apiURL = "https://www.polloymariscoezm.com";

const api = axios.create({
    baseURL: apiURL,
    headers: {
        'Accept': 'application/json',  // We always accept JSON responses
        'Content-Type': 'application/json'
    },
});
// Automatically attach token if it exists
api.interceptors.request.use(
  //Do sonthing before request is sent
    async (config) => {
      //console.log('Entering interceptor configuration')
      const token = await localStorage.getItem("token");
      //console.debug('token:', token);
      if (token) {
        let bearer = 'Bearer ' + token;
        bearer = bearer.replace(/"/g, '')
        //bearer.replace('"', '');
        //console.debug('Bearer:', bearer);
        config.headers.Authorization = bearer;
      }//console.debug("Returning interceptor configuration: ", config);
      return config;
    },
    (error) => {
      console.error("Error in interceptor configuration", error);
      Promise.reject(error);
    }
  );
  
  export default api;