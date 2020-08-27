import Vue from "vue";
import Vuex from "vuex";
import Api from "@/services/Api";
import jwt_decode from "jwt-decode";

Vue.use(Vuex);

var store = new Vuex.Store({
  state: {
    jwt: sessionStorage.getItem("t"),
    username: sessionStorage.getItem("u"),
    endpoints: {
      obtainJWT: "/api-token-auth/",
      refreshJWT: "/api-token-refresh/",
    },
    loading: {
      dialog: false,
      message: "",
    },
    actualKnowledge: sessionStorage.getItem("d"),
    priorConcepts: [],
  },
  mutations: {
    updateToken(state, newToken) {
      sessionStorage.setItem("t", newToken);
      state.jwt = newToken;
    },
    updateUsername(state, username) {
      sessionStorage.setItem("u", username);
      state.username = username;
    },
    removeToken(state) {
      sessionStorage.removeItem("t");
      state.jwt = null;
    },
    csrfToken(state, csrfToken) {
      state.csrf = csrfToken;
    },
    setLoading(state, loading) {
      state.loading.dialog = loading.dialog;
      state.loading.message = loading.message;
    },
    setPriorConcepts(state, objPriorConcepts) {
      state.priorConcepts = objPriorConcepts;
    },
    setActualKnowledge(state, idKnowledge) {
      sessionStorage.setItem("d", idKnowledge);
      state.actualKnowledge = idKnowledge;
    },
  },
  actions: {
    getActualKnowledge(state, idKnowledge) {
      this.commit("setActualKnowledge", idKnowledge);
    },
    async obtainToken(state, payload) {
      var name = payload.username;
      await Api()
        .post(this.state.endpoints.obtainJWT, payload)
        .then((response) => {
          this.commit("updateToken", response.data.token);
          this.commit("updateUsername", name);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getPriorConcepts(state, objPriorConcepts) {
      this.commit("setPriorConcepts", objPriorConcepts);
    },
    refreshToken() {
      const payload = {
        token: this.state.jwt,
      };
      Api()
        .post(this.state.endpoints.refreshJWT, payload)
        .then((response) => {
          this.commit("updateToken", response.data.token);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    inspectToken() {
      const token = this.state.jwt;
      if (token) {
        const decoded = jwt_decode(token);
        const exp = decoded.exp;
        const orig_iat = decoded.orig_iat;
        if (
          exp - Date.now() / 1000 < 1800 &&
          Date.now() / 1000 - orig_iat < 628200
        ) {
          this.dispatch("refreshToken");
        } else if (exp - Date.now() / 1000 < 1800) {
          // DO NOTHING, DO NOT REFRESH
        } else {
          this.commit("removeToken");
        }
      }
    },
    logout() {
      this.commit("removeToken");
    },
  },
});

export default store;