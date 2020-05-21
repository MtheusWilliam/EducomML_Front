<template>
  <v-row>
    <v-col cols="4">
      <TreeView />
    </v-col>
    <v-col cols="8">
      <div class="mt-3 mr-8 ml-3 mb-0">
        <Panels />
      </div>
    </v-col>
  </v-row>
</template>
<script>
/*import DominioDialog from "./concept_model/DominioDialog";
import ModuloDialog from "./concept_model/ModuloDialog";
import ConceitoDialog from "./concept_model/ConceitoDialog";*/
import Panels from "./Panels";
import TreeView from "./TreeView";
export default {
  name: "CreateConceitual",
  data: () => ({}),
  components: {
    TreeView,
    Panels
  },
  methods: {}
};
</script>
<style>
</style>