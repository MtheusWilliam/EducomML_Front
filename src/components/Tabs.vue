<template>
  <v-row>
    <v-col cols="4">
      <TreeView v-show="initTree" />
    </v-col>
    <v-col cols="8">
      <div class="mt-3 mr-3 ml-3 mb-0">
        <v-tabs background-color="#63B0B0" dark>
          <v-tab>Domínio</v-tab>
          <v-tab>Módulo</v-tab>
          <v-tab>Conceito</v-tab>

          <v-tab-item>
            <DominioForm v-on:emitInitTree="firstInitTree" />
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
  </v-row>
</template>
<script>
import DominioForm from "./concept_model/DominioForm";
import ModuloForm from "./concept_model/ModuloForm";
import ConceitoForm from "./concept_model/ConceitoForm";
import TreeView from "./TreeView";
export default {
  name: "Tabs",
  data: () => ({
    initTree: false
  }),
  components: {
    DominioForm,
    ModuloForm,
    ConceitoForm,
    TreeView
  },
  methods: {
    firstInitTree() {
      this.initTree = true;
    }
  }
};
</script>
<style>
</style>