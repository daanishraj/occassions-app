import axios from "axios";

export default () => {
  
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    return instance
}  