import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

// Componentes das rotas
import UserHome from "@/components/UserHome";
import Home from "@/components/Home";
import ResetPassword from "@/components/ResetPassword";
import Login from "@/components/Login";
import SignUp from "@/components/SignUp";
import CreateConceitual from "@/components/CreateConceitual";
import SettingsProfile from "@/components/SettingsProfile";
import SettingsAccount from "@/components/SettingsAccount";
import SettingsPassword from "@/components/SettingsPassword";
// Componentes das rotas

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/home/",
      name: "home",
      component: UserHome,
    },
    {
      path: "/create/",
      name: "create",
      component: CreateConceitual,
    },
    {
      path: "/",
      component: Home,
      name: "root",
    },
    {
      path: "/reset_password/:username/:token",
      name: "reset_password",
      component: ResetPassword,
    },
    {
      path: "/login/:emailconfirmation",
      name: "login",
      component: Login,
    },
    {
      path: "/settings/profile/",
      name: "settingsprofile",
      component: SettingsProfile,
    },
    {
      path: "/settings/account/",
      name: "settingssaccount",
      component: SettingsAccount,
    },
    {
      path: "/settings/password/",
      name: "settingspassword",
      component: SettingsPassword,
    },
    {
      path: "/signup/",
      name: "signup",
      component: SignUp,
    }
  ],
});

router.beforeEach((to, from, next) => {
  if (
    to.name === "reset_password" ||
    to.name === "login" ||
    to.name === "signup"
  )
    next();
  else if (to.name !== "root" && store.state.jwt === null) next({ path: "/" });
  else next();
});

export default router;
