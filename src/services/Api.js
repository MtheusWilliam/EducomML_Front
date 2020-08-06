import axios from "axios";
import store from "@/store";
import Cookie from "js-cookie";

export default () => {
  var csrftoken = Cookie.get("csrftoken");
  var jwt = store.state.jwt;
  return axios.create({
    baseURL: " https://educomml-back.herokuapp.com/",
    withCredentials: false,
    headers: {
      "x-csrftoken": csrftoken,
      Authorization: "JWT " + jwt,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};
