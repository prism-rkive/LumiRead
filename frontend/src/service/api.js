import axios from "axios";

// Change this to YOUR backend URL
let apiURL = "http://localhost:5000";  

const api = axios.create({
  baseURL: apiURL,
  withCredentials: true,  // Important for cookies/sessions
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;