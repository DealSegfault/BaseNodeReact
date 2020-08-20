import axiosService from "./axios-service"
const axiosInstance = axiosService.getInstance()
// const axios = require("axios")
export default {
  login (login, password) { 
	  return axiosInstance.post("/auth/login", { login, password }).then(res => res.data)
  },
    
  register (login, password, referral="") {
	  return axiosInstance.post("/user", { login, password, email: login, referral: referral }).then(res => res.data)
  },

  confirm_email (token) {
    return axiosInstance.post("/user/confirm", { token }).then(res => res.data)
  },

  modify_password ( login, key, password ) {
    return axiosInstance.post("/password", { login , key, password }).then(res => res.data)
  }
}
