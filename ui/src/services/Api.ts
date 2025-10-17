import axios from "axios";

export default () => {
  
    console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);

    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    return instance
}