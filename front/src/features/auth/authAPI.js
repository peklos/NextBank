import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function loginAPI(email, password) {
    const response = await axios.post(`${API_BASE}/auth/login`, { email, password })
    return response.data
}

export async function registerAPI(email, password, full_name) {
    const response = await axios.post(`${API_BASE}/auth/register`, { email, password, full_name })
    return response.data
}