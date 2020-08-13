<template>
  <v-row>
    <v-col cols="4">
      <TreeView @type="typeOfDialog" @elementToScroll="scrollElement" :dominio="dominio" />
    </v-col>
    <v-col cols="8">
      <div class="mt-3 mr-8 ml-3 mb-0">
        <!--{{this.dominio.nameknowledgedomain}}-->
        <Panels
          @dominio_data="atualizatreeview"
          @close="closeType"
          :objectTreeView="objectTreeView"
          :dialog_knowledgedomain="dialog_knowledgedomain"
          :dialog_module="dialog_module"
          :dialog_submodule="dialog_submodule"
          :dialog_concept="dialog_concept"
          :dialog_proceduretree="dialog_procedure"
          :dialog_mobilemediatree="dialog_mobilemedia"
          :dialog_instructionalelementtree="dialog_instructionalelement"
          :dominio="dominio"
          :elementToScroll="elementToScrollUrl"
        />
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
import Api from "@/services/Api";

export default {
  name: "CreateConceitual",
  data: () => ({
    dominio: "",
    objectTreeView: "",
    dialog_knowledgedomain: false,
    dialog_module: false,
    dialog_submodule: false,
    dialog_concept: false,
    dialog_procedure: false,
    dialog_mobilemedia: false,
    dialog_instructionalelement: false,
    elementToScrollUrl: "",
  }),
  components: {
    TreeView,
    Panels,
  },
  beforeCreate() {
    var vm = this;

    if (this.$route.params.idDomain) {
      Api()
        .patch("/knowledgedomain/" + this.$route.params.idDomain + "/", {})
        .then(function (resposta) {
          vm.dominio = resposta.data;
        });
    } else {
      Api()
        .patch(
          "/knowledgedomain/" + this.$store.state.actualKnowledge + "/",
          {}
        )
        .then(function (resposta) {
          vm.dominio = resposta.data;
        });
    }
  },
  props: [],
  methods: {
    atualizatreeview(value) {
      this.dominio = value;
    },
    typeOfDialog(value) {
      if (value.type === "knowledgedomain") {
        this.dialog_knowledgedomain = true;
      } else if (value.type === "module") {
        this.dialog_module = true;
      } else if (value.type === "concept") {
        this.dialog_concept = true;
      } else if (value.type === "submodulo") {
        this.dialog_submodule = true;
      } else if (value.type === "informationitem") {
        this.dialog_procedure = true;
      } else if (value.type === "mobilemedia") {
        this.dialog_mobilemedia = true;
      } else if (value.type === "instructionalelement") {
        this.dialog_instructionalelement = true;
      }
      this.objectTreeView = value;
    },
    closeType(value) {
      if (value === "dominio") {
        this.dialog_knowledgedomain = false;
      } else if (value === "modulo") {
        this.dialog_module = false;
      } else if (value === "conceito") {
        this.dialog_concept = false;
      } else if (value === "submodulo") {
        this.dialog_submodule = false;
      } else if (value === "procedimento") {
        this.dialog_procedure = false;
      } else if (value === "mobilemedia") {
        this.dialog_mobilemedia = false;
      } else if (value === "elementoinstrucional") {
        this.dialog_instructionalelement = false;
      }
    },
    scrollElement(value) {
      this.elementToScrollUrl = value;
    },
  },
};
</script>
<style></style>
