<template>
  <v-app class="px-0 mx-0">
    <v-app-bar app color="white darken-3" dark dense flat>
      <div class="mt-5 d-flex align-center">
        <v-icon size="40" color="#63B0B0">mdi-home</v-icon>
      </div>

      <v-spacer></v-spacer>

      <div class="mt-5 d-flex align-center">
        <v-img src="@/assets/logo.svg" style="width: 150px;" class="mr-3"></v-img>
      </div>
    </v-app-bar>

    <v-content class="px-0 mx-0" style="width:200%;">
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
/*import ModelTutorial from "./components/ModelTutorial";*/
/*import TreeView from "./components/TreeView";*/
/*import DominioDialog from "./components/concept_model/DominioDialog";*/
/*import ModuloDialog from "./components/concept_model/ModuloDialog";*/
/*import ConceitoDialog from "./components/concept_model/ConceitoDialog";*/

export default {
  name: "App",

  components: {
    /*TreeView,
    DominioDialog,
    ModuloDialog,
    ConceitoDialog
    /*ModelTutorial*/
  },

  data: () => ({})
};
</script>
