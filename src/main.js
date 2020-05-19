import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router';
import ModelTutorial from './components/ModelTutorial';
import Tabs from './components/Tabs';
/*import ModuloForm from './components/concept_model/ModuloForm';*/


Vue.config.productionTip = false
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/create',
      name: 'create',
      component: ModelTutorial,
    },
    {
      path: '/create/conceitual',
      name: 'createConceitual',
      component:
        Tabs

    }
  ]
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
