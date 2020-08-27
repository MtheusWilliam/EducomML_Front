<template>
  <v-container class="pa-0; ml-0">
    <v-row>
      <v-card min-height="530px" min-width="750px">
        <v-card-title style="background-color:#63B0B0; color:white;">
          <span class="headline">
            <p v-if="concept">{{ conceitoDialogHeader1 }}</p>
            <p v-else>{{ conceitoDialogHeader2 }}</p>
          </span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation="lazy-validation">
            <v-text-field
              v-model="conceptName"
              :counter="100"
              :rules="conceptNameRules"
              label="Nome do conceito"
              required="required"
              class="mt-2"
            ></v-text-field>
            <v-row>
              <v-col cols="4">
                <v-btn
                  style="margin-top: -10px;"
                  class="mb-2"
                  color="primary"
                  height="40"
                  dark
                  small
                  @click="openDidaticDialog(4)"
                >Conhecimentos Prévios</v-btn>
              </v-col>
            </v-row>
            <div>
              <v-app-bar color="#D2A64D" dense="dense" dark="dark" height="45px">
                <v-toolbar-title style="font-size:1.2em;">
                  <strong>Lista de relacionamentos</strong>
                </v-toolbar-title>
              </v-app-bar>
            </div>
            <v-row class="mt-2" style="height:50px;">
              <v-col>
                <strong>
                  <p>Conceito</p>
                </strong>
              </v-col>
              <v-col>
                <strong>
                  <p>Nome da Relação</p>
                </strong>
              </v-col>
              <v-col>
                <strong>
                  <p>Tipo da Relação</p>
                </strong>
              </v-col>
              <v-col cols="1">
                <v-btn icon="icon" class="mb-1">
                  <v-icon
                    large="large"
                    class="mb-1"
                    color="primary"
                    @click="addRelacao()"
                  >mdi-plus-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <hr />
            <v-row>
              <v-container>
                <v-row v-for="(item, i) in relationForControl" :key="i">
                  <v-col>
                    <v-select
                      :class="alert"
                      v-model="relationForControl[i].conceptSelect"
                      :items="targetconcepts"
                      :rules="[(v) => !!v || 'Conceito é requerido']"
                      label="Conceito"
                      style="margin:0px;"
                      required="required"
                    ></v-select>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="relationForControl[i].relacaoName"
                      counter="100"
                      label="Nome da Relação"
                      style="margin:0px;"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-select
                      :class="alert"
                      v-model="relationForControl[i].relacaoType"
                      :items="relacaoTypes"
                      :rules="[(v) => !!v || 'O tipo do conceito é requerido']"
                      label="Tipo da Relação"
                      style="margin:0px;"
                      required="required"
                    ></v-select>
                  </v-col>
                  <v-col cols="1" class="mt-2">
                    <v-btn icon="icon" class="mb-1">
                      <v-icon
                        large="large"
                        class="mb-1"
                        color="red"
                        @click="deletaRelacao(i)"
                      >mdi-minus-box</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" height="49" dark="dark" large="large" @click="reset">
            Cancelar
            <v-icon dark="dark" right="right">mdi-close</v-icon>
          </v-btn>
          <v-btn color="success" height="49" dark="dark" large="large" @click="validate">
            Salvar
            <v-icon dark="dark" right="right">mdi-content-save</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import Api from "@/services/Api";
export default {
  name: "ConceitoDialog",
  props: ["domain", "module", "concept", "dialog"],
  data: () => ({
    conceitoDialogHeader1: "Edite o conceito selecionado.",
    conceitoDialogHeader2:
      "Defina o conceito do módulo e seu(s) relacionamento(s).",
    alert: "",
    auxSelectTeste: "",
    auxConceito: "",
    relationForControl: [],
    valid: true,
    targetconcepts: [],
    conceptSelect: [""],
    conceptName: "",
    conceptNameRules: [
      (v) => !!v || "É necessário descrever o nome do conceito",
      (v) =>
        (v && v.length <= 100) ||
        "Nome do conceito deve ter no máximo 100 caracteres",
    ],
    relacaoName: [""],
    relacaoNameRules: [
      (v) => !!v || "Necessário descrever o nome da relação",
      (v) =>
        (v && v.length <= 100) ||
        "O nome da relação deve ter no máximo 100 caracteres",
    ],
    relacaoType: [""],
    relacaoTypes: ["typeOf", "partOf"],
    priorKnowledge: 2,
    priorKnowledgeItems: [
      {
        text: "Sim",
        value: 1,
      },
      {
        text: "Não",
        value: 2,
      },
    ],
    priorKnowledgeName: "",
    priorKnowledgeNameRules: [
      (v) => !!v || "Necessário descrever identificador para a prioridade",
      (v) =>
        (v && v.length <= 100) ||
        "O identificador da prioridade deve ter no máximo 100 caracteres",
    ],
    priorLevel: "",
    priorLevelItems: [
      {
        text: "Obrigatório",
        value: 1,
      },
      {
        text: "Desejável",
        value: 2,
      },
    ],
  }),
  watch: {
    dialog: function () {
      this.getConceito();
    },
    module: function () {
      this.getConceito();
    },
  },
  mounted: function () {
    this.getConceito();
    this.$refs.form.resetValidation();
  },
  methods: {
    getConceito() {
      var vm = this;
      this.$nextTick(function () {
        vm.conceptName = vm.concept.nameconcept;
      });
      this.targetconcepts = [];

      if (this.domain.modules) {
        this.domain.modules.forEach((module) => {
          if (module.concepts) {
            module.concepts.forEach((moduleConcept) => {
              if (!this.concept || this.concept.url !== moduleConcept.url) {
                this.targetconcepts.push({
                  text: moduleConcept.nameconcept,
                  value: moduleConcept,
                });
              }
            });
          }
          if (module.submodules) {
            module.submodules.forEach((submodule) => {
              if (submodule.concepts) {
                submodule.concepts.forEach((submoduleConcept) => {
                  if (
                    !this.concept ||
                    this.concept.url !== submoduleConcept.url
                  ) {
                    this.targetconcepts.push({
                      text: submoduleConcept.nameconcept,
                      value: submoduleConcept,
                    });
                  }
                });
              }
            });
          }
        });
      }

      if (this.concept !== "") {
        if (this.concept.targetpriorknowledge.length > 0) {
          vm.priorKnowledge = 1;
          vm.priorKnowledgeName = this.concept.targetpriorknowledge[0].namepriorknowledge;
          vm.priorLevel = parseInt(
            this.concept.targetpriorknowledge[0].priorlevel.split("/")[4]
          );
        } else {
          vm.priorKnowledge = 2;
        }
        var i = 0;
        this.concept.sourceconcept.forEach((element) => {
          var conceptSelect = this.targetconcepts.find(function (conceito) {
            return conceito.value.url === element.sourceconcept;
          });
          var auxConceptTarget = this.targetconcepts.find(function (conceito) {
            return (
              conceito.value.url ===
              conceptSelect.value.sourceconcept[i].targetconcept
            );
          });
          var type = "";
          if (element.fk_referencetype.split("/")[4] == "1") {
            type = "typeOf";
          } else {
            type = "partOf";
          }
          this.relationForControl.push({
            conceptSelect: auxConceptTarget,
            relacaoName: element.namereference,
            relacaoType: type,
            url: element.url,
          });
          i++;
        });
      } else {
        vm.priorKnowledge = 2;
      }
    },
    async altera_Cria_Conceito() {
      var vm = this;
      if (this.concept === "") {
        await Api()
          .post(`/concept/`, {
            nameconcept: this.conceptName,
            fk_idknowledgedomain: this.domain.url,
            fk_idmodule: this.module.url,
          })
          .then(async function (resposta) {
            vm.auxConceito = resposta.data.url;
            if (vm.$store.state.priorConcepts) {
              vm.$store.state.priorConcepts.forEach(async (prior) => {
                console.log("vamo quase", prior);
                console.log(`/priorlevel/` + prior.priorlevel + `/`);
                console.log(prior.namepriorknowledge);
                console.log(resposta.data.url);

                await Api()
                  .post(`/priorknowledge/`, {
                    namepriorknowledge: prior.namepriorknowledge,
                    priorlevel: `/priorlevel/` + prior.priorlevel + `/`,
                    fk_priorsourceconcept: prior.fk_idconcept,
                    fk_priortargetconcept: resposta.data.url,
                  })
                  .then(function () {
                    vm.$store.dispatch("getPriorConcepts", []);
                  });
              });
            }
          });
      } else {
        await Api().put("/concept/" + this.concept.idconcept + "/", {
          nameconcept: this.conceptName,
          fk_idknowledgedomain: this.domain.url,
          fk_idmodule: this.module.url,
        });
      }
    },
    async altera_Cria_Relacoes() {
      this.relationForControl.forEach(async (element) => {
        if (element.url === null) {
          var auxReferencia = 0;
          if (element.relacaoType == "typeOf") {
            auxReferencia = 1;
          } else if (element.relacaoType == "partOf") {
            auxReferencia = 2;
          }
          await Api().post(`/reference/`, {
            namereference: element.relacaoName,
            sourceconcept: this.auxConceito,
            targetconcept: element.conceptSelect.url,
            fk_referencetype: `/referencetype/` + auxReferencia + "/",
          });
        } else {
          auxReferencia = 0;
          if (element.relacaoType == "typeOf") {
            auxReferencia = 1;
          } else if (element.relacaoType == "partOf") {
            auxReferencia = 2;
          }
          await Api().put(element.url, {
            namereference: element.relacaoName,
            sourceconcept: this.auxConceito,
            targetconcept: element.conceptSelect.value.url,
            fk_referencetype: `/referencetype/` + auxReferencia + "/",
          });
        }
      });
    },
    openDidaticDialog(value) {
      this.$emit("openDidaticDialog", {
        type: value,
      });
    },
    async validate() {
      if (this.$refs.form.validate()) {
        //await this.$refs.form.validate();
        await this.altera_Cria_Conceito();
        await this.altera_Cria_Relacoes();
        //await this.$refs.form.reset();
        this.relationForControl = [];
        this.resetVariables();
        this.$emit("close_or_save", "save");
      }
    },
    reset() {
      this.$refs.form.reset();
      this.relationForControl = [];
      this.resetVariables();
      this.$emit("close_or_save", "close");
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    addRelacao() {
      this.relationForControl.push({
        conceptSelect: null,
        relacaoName: null,
        relacaoType: null,
        url: null,
      });
    },
    deletaRelacao(idRelacao) {
      if (this.relationForControl[idRelacao].url !== null) {
        Api().delete(this.relationForControl[idRelacao].url);
      }
      if (idRelacao == 0) {
        this.relationForControl.shift();
      } else {
        this.relationForControl.splice(idRelacao, 1);
      }
    },
    resetVariables() {
      this.$store.dispatch("getPriorConcepts", []);
    },
  },
};
</script>
