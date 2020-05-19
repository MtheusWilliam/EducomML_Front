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
      <v-row>
        <v-col cols="4">
          <TreeView />
        </v-col>
        <v-col cols="8">
          <div class="mt-3 mr-3 ml-3 mb-0">
            <v-tabs
              v-model="tab"
              background-color="#63B0B0"
              dark
              :centered="centered"
              :grow="grow"
              :vertical="vertical"
              :right="right"
              :prev-icon="prevIcon ? 'mdi-arrow-left-bold-box-outline' : undefined"
              :next-icon="nextIcon ? 'mdi-arrow-right-bold-box-outline' : undefined"
              :icons-and-text="icons"
            >
              <v-tab>Domínio</v-tab>
              <v-tab>Módulo</v-tab>
              <v-tab>Conceito</v-tab>

              <v-tab-item>
                <DominioForm />
              </v-tab-item>
              <v-tab-item>
                <ModuloForm />
              </v-tab-item>
              <v-tab-item>
                <ConceitoForm />
              </v-tab-item>
            </v-tabs>
          </div>
        </v-col>
        <!--
        <ModelTutorial />
        -->
      </v-row>
    </v-content>
  </v-app>
</template>

<script>
/*import ModelTutorial from "./components/ModelTutorial";*/
import TreeView from "./components/TreeView";
import DominioForm from "./components/concept_model/DominioForm";
import ModuloForm from "./components/concept_model/ModuloForm";
import ConceitoForm from "./components/concept_model/ConceitoForm";

export default {
  name: "App",

  components: {
    TreeView,
    DominioForm,
    ModuloForm,
    ConceitoForm
    /*ModelTutorial*/
  },

  data: () => ({})
};
</script>
