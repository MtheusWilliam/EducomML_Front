<template>
  <v-app class="px-0 mx-0">
    <v-app-bar app color="white darken-3" dark dense flat style="height:60px;">
      <div class="mt-5 d-flex align-center">
        <v-btn icon @click="$router.push({path:'/home'})">
          <v-icon size="40" color="#63B0B0">mdi-home</v-icon>
        </v-btn>
      </div>

      <v-spacer></v-spacer>
      <div class="mt-5 d-flex align-center">
        <v-dialog v-if="!$store.state.jwt" max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn
              v-if="!$store.state.jwt"
              outlined
              color="indigo lighten-1"
              v-on="on"
              dark
              @click="dialog_signup=true"
            >CADASTRE-SE</v-btn>
          </template>
          <SignUp />
        </v-dialog>

        <v-dialog v-if="!$store.state.jwt" max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn
              class="ml-2"
              outlined
              color="indigo lighten-1"
              v-on="on"
              dark
              @click="dialog_login=true"
            >Entrar</v-btn>
          </template>
          <Login />
        </v-dialog>
        <v-btn
          v-else
          outlined
          color="indigo lighten-1"
          dark
          @click="$store.dispatch('logout');$router.push({path:'/'})"
        >Sair</v-btn>
        <v-img class="ml-5" src="@/assets/logoblack.png" style="width: 150px;"></v-img>
      </div>
    </v-app-bar>

    <v-content class="px-0 mx-0" style="width:200%;">
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
/*import ModelTutorial from "./components/ModelTutorial";*/
/*import TreeView from "./components/TreeView";*/
/*import DominioDialog from "./components/concept_model/DominioDialog";*/
/*import ModuloDialog from "./components/concept_model/ModuloDialog";*/
/*import ConceitoDialog from "./components/concept_model/ConceitoDialog";*/
import Login from "./components/Login";
import SignUp from "./components/SignUp";
export default {
  name: "App",
  components: {
    Login,
    SignUp
  },
  data: () => ({})
};
</script>
