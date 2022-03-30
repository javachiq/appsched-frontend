import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/scheduler/";


const postCreateAppointment = (data) => {
    return axios.post(API_URL + "appointment",
        {
    data,
  }, { headers: authHeader() });
};

const postUpdateAppointment = (data) => {
    return axios.post(API_URL + "update-appointment",
    {
    data,
  }, { headers: authHeader() });
};

const postDeleteAppointment = (data) => {
    return axios.post(API_URL + "delete-appointment",
    {
    data,
  }, { headers: authHeader() });
};

const getAppointments = () => {
  return axios.get(API_URL + "appointments", { headers: authHeader() });
};

const getAppointment = (id) => {
    return axios.get(API_URL + "appointment", {
        params: {
            appId: id
        }, 
        headers: authHeader()
    });
};

export default {
  postCreateAppointment,
  postUpdateAppointment,
  postDeleteAppointment,
  getAppointments,
  getAppointment
};
