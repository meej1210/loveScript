import axios from "axios";

const API_BASE = "http://127.0.0.1:5000"; // 本地后端地址

export const getEvents = async () => {
  const res = await axios.get(`${API_BASE}/events`);
  return res.data;
};

export const addEvent = async (event) => {
  const res = await axios.post(`${API_BASE}/events`, event);
  return res.data;
};
