import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router';
/*import ModelTutorial from './components/ModelTutorial';*/
import UserHome from './components/UserHome';
import CreateConceitual from './components/CreateConceitual';


Vue.config.productionTip = false
Vue.use(VueRouter);

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

    }
  ]
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
