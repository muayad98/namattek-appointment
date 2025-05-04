import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",   // change to Render URL later
});

export const getServices = () => api.get("/services");
export const getAppointments = () => api.get("/appointments");
export const createAppointment = (data) => api.post("/appointments", data);
