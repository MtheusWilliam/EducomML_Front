<template>
  <v-row>
    <v-col cols="4">
      <TreeView />
    </v-col>
    <v-col cols="8">
      <div class="mt-3 mr-8 ml-3 mb-0">
        {{dominio}}
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
import axios from "axios";

export default {
  name: "CreateConceitual",
  dominio: "",
  data: () => ({}),
  components: {
    TreeView,
    Panels
  },
  created() {
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    console.log(this.$route.params.idDomain);
    axios
      .get(
        "http://127.0.0.1:8000/knowledgedomain/" +
          this.$route.params.idDomain +
          "/",
        { headers: { "X-CSRFToken": crsftoken } }
      )
      .then(response => (this.dominio = response.data));
  },
  methods: {}
};
</script>
<style>
</style>