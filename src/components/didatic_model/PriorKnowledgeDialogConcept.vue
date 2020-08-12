<template>
  <v-card>
    <v-card-title style="background-color:purple; color:white;">
      <span class="headline">
        <p>
          Defina as informações equivalentes aos conhecimentos prioritários
          desse conceito.
        </p>
      </span>
    </v-card-title>
    <v-row class="mx-0 px-0">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row class="mx-0 px-0 pl-6">
          <h3 class="mt-5">Conhecimentos prioritários</h3>
          <v-btn icon="icon" class="mb-1">
            <v-icon
              large
              class="mt-9 ml-2"
              color="primary"
              @click="addPriorKnowledge()"
            >mdi-plus-box</v-icon>
          </v-btn>
        </v-row>
        <v-row
          v-for="(prior, idPrior) in priorControl"
          :key="idPrior"
          style="margin-bottom: -25px;"
          class="mx-0 px-0 pl-6"
        >
          <v-col cols="4">
            <v-select
              v-model="priorControl[idPrior].fk_idconcept"
              :items="conceptsPrior"
              :rules="[(v) => !!v || 'Necessário informar o conceito prévio']"
              label="Conceito Prévio"
              style="margin:0px;"
              required
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-text-field
              style="margin-top: -1px; margin-bottom: -10px;"
              :rules="[
                (v) => !!v || 'Necessário informar identificador da prioridade',
              ]"
              v-model="priorControl[idPrior].namepriorknowledge"
              label="Identificador da prioridade"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="priorControl[idPrior].priorlevel"
              :items="priorLevels"
              :rules="[
                (v) => !!v || 'Necessário informar o nível de prioridade',
              ]"
              label="Nível de prioridade"
              style="margin:0px;"
              required
            ></v-select>
          </v-col>
          <v-col cols="1">
            <v-btn icon="icon" class="mt-4">
              <v-icon
                large
                class="mb-1"
                color="red"
                @click="deletaPriorKnowledge(idPrior)"
              >mdi-minus-box</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-row>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red" height="49" dark large @click="reset">
        Cancelar
        <v-icon dark right>mdi-close</v-icon>
      </v-btn>
      <v-btn color="success" height="49" dark large @click="validate">
        Salvar
        <v-icon dark right>mdi-content-save</v-icon>
      </v-btn>
    </v-card-actions>
    <div class="text-center">
      <v-dialog v-model="dialogError" width="500">
        <v-card>
          <v-card-title class="headline red" primary-title style="color:white;">ALERTA!</v-card-title>
          <v-card-text class="mt-3" style="font-size: 1.3em;">
            {{
            messageError
            }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialogError = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-card>
</template>

<script>
import Api from "@/services/Api";
export default {
  name: "PriorKnowledgeDialogConcept",
  props: ["domain", "dialog", "concept", "module"],
  data: () => ({
    valid: true,
    auxConcept: "",
    treeData: [],
    selection: [],
    elementData: [],
    typesThreshold: [
      {
        text: "Porcentagem",
        value: 1,
      },
      {
        text: "Literal",
        value: 2,
      },
    ],
    valueTypes: ["Single", "Range"],
    conceptsPrior: [],
    priorControl: [],
    priorLevels: [
      {
        text: "Obrigatório",
        value: 1,
      },
      {
        text: "Desejável",
        value: 2,
      },
    ],
    dialogError: false,
    messageError: "",
    newItems: [],
    checkbox: true,
  }),
  watch: {
    dialog: async function () {
      this.priorControl = [];
      if (this.concept) {
        await this.setDomainVariables();
        await this.getPriors();
      }
    },
  },
  mounted: async function () {
    this.priorControl = [];
    if (this.concept) {
      await this.setDomainVariables();
      await this.getPriors();
    }
  },
  methods: {
    getPriors() {
      var vm = this;
      if (this.concept) {
        this.auxConcept = this.domain.modules
          .filter((m) => {
            return m.url === this.concept.fk_idmodule;
          })[0]
          .concepts.filter((c) => {
            return c.url === this.concept.url;
          })[0];
        if (vm.$store.state.priorConcepts === []) {
          vm.$store.state.priorConcepts.forEach((prior) => {
            this.priorControl.push({
              namepriorknowledge: prior.namepriorknowledge,
              priorlevel: prior.priorlevel,
              fk_idconcept: prior.fk_idconcept,
              url: prior.url,
            });
          });
        } else {
          if (this.auxConcept.targetpriorknowledge.length > 0) {
            this.auxConcept.targetpriorknowledge.forEach((prior) => {
              this.priorControl.push({
                namepriorknowledge: prior.namepriorknowledge,
                priorlevel: parseInt(prior.priorlevel.split("/")[4]),
                fk_idconcept: prior.fk_priorsourceconcept,
                url: prior.url,
              });
            });
          }
        }
      } else {
        if (vm.$store.state.priorConcepts === []) {
          vm.$store.state.priorConcepts.forEach((prior) => {
            this.priorControl.push({
              namepriorknowledge: prior.namepriorknowledge,
              priorlevel: prior.priorlevel,
              fk_idconcept: prior.fk_idconcept,
              url: prior.url,
            });
          });
        }
      }
    },
    setDomainVariables() {
      for (var i = 0; i < this.domain.modules.length; i++) {
        if (this.domain.modules[i].submodules.length > 0) {
          for (var s = 0; s < this.domain.modules[i].submodules.length; s++) {
            if (this.domain.modules[i].submodules[s].concepts.length > 0) {
              for (
                var c = 0;
                c < this.domain.modules[i].submodules[s].concepts.length;
                c++
              ) {
                if (
                  this.domain.modules[i].submodules[s].concepts[c].url ===
                  this.concept.url
                ) {
                  i = this.domain.modules.length;
                  s = this.domain.modules[i].submodules.length;
                  break;
                } else {
                  this.conceptsPrior.push({
                    text: this.domain.modules[i].submodules[s].concepts[c]
                      .nameconcept,
                    value: this.domain.modules[i].submodules[s].concepts[c].url,
                  });
                }
              }
            }
          }
        }
      }
      for (var i1 = 0; i1 < this.domain.modules.length; i1++) {
        if (
          Array.isArray(this.domain.modules[i1].concepts) &&
          this.domain.modules[i1].concepts.length > 0
        ) {
          for (var c1 = 0; c1 < this.domain.modules[i1].concepts.length; c1++) {
            if (this.domain.modules[i1].concepts[c1].url === this.concept.url) {
              i1 = this.domain.modules.length;
              break;
            } else {
              this.conceptsPrior.push({
                text: this.domain.modules[i1].concepts[c1].nameconcept,
                value: this.domain.modules[i1].concepts[c1].url,
              });
            }
          }
        }
      }
    },
    async postPriorKnowledges() {
      var vm = this;

      if (this.concept) {
        await this.priorControl.forEach(async (prior) => {
          if (prior.url) {
            await Api()
              .put(prior.url, {
                namepriorknowledge: prior.namepriorknowledge,
                priorlevel: `/priorlevel/` + prior.priorlevel + `/`,
                fk_priorsourceconcept: prior.fk_idconcept,
                fk_priortargetconcept: vm.concept.url,
              })
              .then(function () {
                vm.$store.dispatch("getPriorConcepts", []);
              });
          } else {
            await Api()
              .post(`/priorknowledge/`, {
                namepriorknowledge: prior.namepriorknowledge,
                priorlevel: `/priorlevel/` + prior.priorlevel + `/`,
                fk_priorsourceconcept: prior.fk_idconcept,
                fk_priortargetconcept: vm.concept.url,
              })
              .then(function () {
                vm.$store.dispatch("getPriorConcepts", []);
              });
          }
        });
      } else {
        this.$store.dispatch("getPriorConcepts", this.priorControl);
      }
    },
    async addPriorKnowledge() {
      this.priorControl.push({
        namepriorknowledge: "",
        priorlevel: "",
        fk_idconcept: "",
        url: "",
      });
    },
    async deletaPriorKnowledge(idPrior) {
      if (this.priorControl[idPrior].url) {
        await Api().delete(this.priorControl[idPrior].url);
      }
      if (idPrior == 0) {
        this.priorControl.shift();
      } else {
        this.priorControl.splice(idPrior, 1);
      }
    },
    async validate() {
      if (this.$refs.form.validate()) {
        var auxLoopValidation = 1;
        for (var m = 0; m < this.priorControl.length; m++) {
          for (var n = 0; n < this.priorControl.length; n++) {
            if (
              this.priorControl[m].fk_idconcept ===
                this.priorControl[n].fk_idconcept &&
              m !== n
            ) {
              auxLoopValidation = 0;
              this.messageError =
                "Não é possível definir um conhecimento prioritário mais de uma vez. Verifique os conhecimentos prioritários " +
                (n + 1) +
                " e " +
                (m + 1) +
                ".";
              this.dialogError = true;
              break;
            }
          }
        }

        if (auxLoopValidation === 1) {
          await this.postPriorKnowledges();
          await this.resetVariables();
          await this.$emit("close_or_save", "save");
        }
      }
    },
    reset() {
      this.$emit("close_or_save", "close");
      this.priorControl = [];
    },
    resetVariables() {
      this.priorControl = [];
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>
