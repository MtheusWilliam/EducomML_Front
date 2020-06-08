import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router';
import axios from "axios";

/*import ModelTutorial from './components/ModelTutorial';*/
import UserHome from './components/UserHome';
import CreateConceitual from './components/CreateConceitual';
import TextDialog from './components/instructional_model/TextDialog';
import * as firebase from "firebase";

var config = {
  apiKey: "AIzaSyDX9Xyh5rlSGDTcuUjn1GEIRq-1e5uF5Sw",
  authDomain: "project-498769410478.firebaseapp.com",
  storageBucket: "gs://educomml.appspot.com"
}
firebase.initializeApp(config);

Vue.config.productionTip = false
Vue.use(VueRouter);
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const router = new VueRouter({
  mode: 'history',
  routes: [

    {
      path: '/home',
      component: UserHome
    },
    {
      path: '/create/conceitual',
      name: 'createConceitual',
      component: CreateConceitual
    },
    {
      path: '/teste',
      name: 'teste',
      component: TextDialog
    },
  ]
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
