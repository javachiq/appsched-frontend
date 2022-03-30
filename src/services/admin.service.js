import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/admin/";

const getUsers= () => {
  return axios.get(API_URL + "getUsers", { headers: authHeader() });
};

export default {
  getUsers,
};
