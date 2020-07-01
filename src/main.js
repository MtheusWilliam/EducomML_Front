import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import jwt_decode from 'jwt-decode';
import Vuex from 'vuex';
import Cookie from "js-cookie";

/*import ModelTutorial from './components/ModelTutorial';*/
import UserHome from './components/UserHome';
import Home from './components/Home';
import CreateConceitual from './components/CreateConceitual';
import VisibleDialog from './components/didatic_model/VisibleDialog';
import * as firebase from "firebase";

var config = {
  apiKey: "AIzaSyDX9Xyh5rlSGDTcuUjn1GEIRq-1e5uF5Sw",
  authDomain: "project-498769410478.firebaseapp.com",
  storageBucket: "gs://educomml.appspot.com/"
}
firebase.initializeApp(config);

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

Vue.use(VueAxios, axios);
Vue.use(VueRouter);
Vue.use(Vuex);

Vue.config.productionTip = false;

var store = new Vuex.Store({
  state: {
    jwt: null,
    username: '',
    endpoints: {
      obtainJWT: 'http://127.0.0.1:8000/api-token-auth/',
      refreshJWT: 'http://127.0.0.1:8000/api-token-refresh/'
    },
  },
  mutations: {
    updateToken(state, newToken) {
      localStorage.setItem('t', newToken);
      state.jwt = newToken;
    },
    updateUsername(state, username) {
      state.username = username;
    },
    removeToken(state) {
      localStorage.removeItem('t');
      state.jwt = null;
    },
    csrfToken(state, csrfToken) {
      state.csrf = csrfToken;
    }
  },
  actions: {
    async obtainToken(state, payload) {
      var name = payload.username;
      await axios.post(this.state.endpoints.obtainJWT, payload)
        .then((response) => {
          this.commit('updateToken', response.data.token);
          this.commit('updateUsername', name);
        })
        .catch((error) => {
          console.log(error);
        })
    },
    refreshToken() {
      const payload = {
        token: this.state.jwt
      }
      axios.post(this.state.endpoints.refreshJWT, payload)
        .then((response) => {
          this.commit('updateToken', response.data.token)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    inspectToken() {
      const token = this.state.jwt;
      if (token) {
        const decoded = jwt_decode(token);
        const exp = decoded.exp
        const orig_iat = decoded.orig_iat
        if (exp - (Date.now() / 1000) < 1800 && (Date.now() / 1000) - orig_iat < 628200) {
          this.dispatch('refreshToken')
        } else if (exp - (Date.now() / 1000) < 1800) {
          // DO NOTHING, DO NOT REFRESH          
        } else {
          // PROMPT USER TO RE-LOGIN, THIS ELSE CLAUSE COVERS THE CONDITION WHERE A TOKEN IS EXPIRED AS WELL
        }
      }
    },
    logout() {
      this.commit('removeToken');
    },
    getHeader() {
      var csrftoken = Cookie.get("csrftoken");
      var jwt = this.state.jwt;
      return {
        headers: {
          "X-CSRFTOKEN": csrftoken,
          "Authorization": "JWT " + jwt,
        }
      }
    }
  },
})

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/home',
      name: 'home',
      component: UserHome
    },
    {
      path: '/create/',
      name: 'create',
      component: CreateConceitual
    },
    {
      path: '/teste',
      name: 'teste',
      component: VisibleDialog
    },
    {
      path: '/',
      component: Home
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/' && store.state.jwt === null) next({ path: '/' })
  else next()
})

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
