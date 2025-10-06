import axios from "axios";

// 'http://127.0.0.1:8000'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://192.168.1.135:8000/',
    headers: {
        'Content-Type': 'application/json'
    }
})

export default api