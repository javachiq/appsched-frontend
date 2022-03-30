import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/doctor/";

const getAppointments = (username) => {
    return axios.get(API_URL + "appointments",
        {
            headers: authHeader()
        },
        {
            params: { userId: username }
        }
    );
};

const approveAppointment = (id) => {
    return axios.post(API_URL + "approve-appointment",
        {
            params: { id: id }
        },
        {
            headers: authHeader()
        }
    );
};



export default {
  getAppointments,
  approveAppointment
};
