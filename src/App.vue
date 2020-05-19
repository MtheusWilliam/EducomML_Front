<template>
  <v-app>
    <v-app-bar app color="white darken-3" dark flat>
      <div class="mt-5 d-flex align-center">
        <v-icon size="55" color="#63B0B0">mdi-home</v-icon>
      </div>

      <v-spacer></v-spacer>

      <div class="mt-5 d-flex align-center">
        <v-img src="@/assets/logo.svg" style="width: 190px;"></v-img>
      </div>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
/*import ModelTutorial from "./components/ModelTutorial";*/
/*import TreeView from "./components/TreeView";*/
/*import DominioForm from "./components/concept_model/DominioForm";*/
/*import ModuloForm from "./components/concept_model/ModuloForm";*/
/*import ConceitoForm from "./components/concept_model/ConceitoForm";*/

export default {
  name: "App",

  components: {
    /*TreeView,
    DominioForm,
    ModuloForm,
    ConceitoForm
    /*ModelTutorial*/
  },

  data: () => ({})
};
</script>
