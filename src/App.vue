<template>
  <v-app class="px-0 mx-0">
    <v-app-bar app color="white darken-3" dark dense flat>
      <div class="mt-5 d-flex align-center">
        <v-btn icon @click="$router.push({path:'/home'})">
          <v-icon size="40" color="#63B0B0">mdi-home</v-icon>
        </v-btn>
      </div>

      <v-spacer></v-spacer>
      <div class="mt-5 d-flex align-center">
        <strong
          v-if="!$store.state.jwt"
          class="mx-2"
          style="color:black;"
        >Você ainda não se identificou</strong>
        <v-dialog v-if="!$store.state.jwt" max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn
              outlined
              color="indigo lighten-1"
              v-on="on"
              dark
              @click="dialog_login=true"
            >Acessar</v-btn>
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
        <v-img class="ml-5" src="@/assets/logo.svg" style="width: 150px;"></v-img>
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
export default {
  name: "App",
  components: {
    Login
  },
  data: () => ({})
};
</script>
