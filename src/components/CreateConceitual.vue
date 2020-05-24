<template>
  <v-row>
    <v-col cols="4">
      <TreeView />
    </v-col>
    <v-col cols="8">
      <div class="mt-3 mr-8 ml-3 mb-0">
        {{this.dominio.nameknowledgedomain}}
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
import Cookie from "js-cookie";
export default {
  name: "CreateConceitual",
  data: () => ({
    dominio: ""
  }),

  components: {
    TreeView,
    Panels
  },
  created() {
    var vm = this;
    var csrftoken = Cookie.get("csrftoken");
    var headers = { "X-CSRFTOKEN": csrftoken };
    axios
      .patch(
        "http://127.0.0.1:8000/knowledgedomain/" +
          this.$route.params.idDomain +
          "/",
        { headers: headers },
        { auth: { username: "admin", password: "admin" } }
      )
      .then(function(resposta) {
        vm.dominio = resposta.data;
      });
  },
  methods: {}
};
</script>
<style>
</style>