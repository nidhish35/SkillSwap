import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";

export const registerUser = (data: any) => axios.post(`${API_URL}/register`, data);
export const loginUser = (data: any, p0: { withCredentials: boolean; }) => axios.post(`${API_URL}/login`, data);
