import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueYouTubeEmbed from "vue-youtube-embed";
import router from "./router";
import store from "./store";
import config from "./services/firebase";
import firebase from "firebase/app";

firebase.initializeApp(config);

Vue.use(VueYouTubeEmbed);

Vue.config.productionTip = true;

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
