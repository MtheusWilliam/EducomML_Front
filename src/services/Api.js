import axios from "axios";
import store from "@/store";
import Cookie from "js-cookie";

export default () => {
  var csrftoken = Cookie.get("csrftoken");
  var jwt = store.state.jwt;
  return axios.create({
    //baseURL: "http://127.0.0.1:8000/",
    baseURL: "https://educomml-back.herokuapp.com/",
    withCredentials: false,
    headers: {
      "x-csrftoken": csrftoken,
      Authorization: "JWT " + jwt,
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
};