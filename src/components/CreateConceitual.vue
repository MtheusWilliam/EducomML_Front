<template>
  <v-row>
    <v-col cols="4">
      <TreeView @type="typeOfDialog" :dominio="dominio" />
    </v-col>
    <v-col cols="8">
      <div class="mt-3 mr-8 ml-3 mb-0">
        <!--{{this.dominio.nameknowledgedomain}}-->
        <Panels @dominio_data="atualizatreeview" @close="closeType" :objectTreeView="objectTreeView" :dialog_knowledgedomain="dialog_knowledgedomain" :dialog_module="dialog_module" :dialog_submodule="dialog_submodule" :dialog_concept="dialog_concept"  :dominio="dominio" />
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
    dominio: "",
    objectTreeView: "",
    dialog_knowledgedomain: false,
    dialog_module: false,
    dialog_submodule: false,
    dialog_concept: false
  }),
  components: {
    TreeView,
    Panels
  },
  beforeCreate() {
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
  props: [],
  methods: {
    atualizatreeview(value) {
      this.dominio = value;
    },
    typeOfDialog(value){
      console.log(value);
      if (value.type === "knowledgedomain") {
        this.dialog_knowledgedomain = true;
      } else if(value.type === "module"){
        this.dialog_module = true;
      }else if(value.type === "concept"){
        this.dialog_concept = true;
      }else if(value.type === "submodulo"){
        this.dialog_submodule = true;
      }
      this.objectTreeView = value;
    },
    closeType(value){
      console.log(value);
      if (value === "dominio") {
        this.dialog_knowledgedomain = false;
      } else if(value === "modulo"){
        this.dialog_module = false;
      }else if(value === "conceito"){
        this.dialog_concept = false;
      }else if(value === "submodulo"){
        this.dialog_submodule = false;
      }
    }
  }
};
</script>
<style>
</style>