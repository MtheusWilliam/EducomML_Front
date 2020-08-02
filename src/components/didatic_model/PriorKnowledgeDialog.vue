<template>
  <v-card>
    <v-card-title style="background-color:purple; color:white;">
      <span class="headline">
        <p>Defina as informações equivalentes aos conhecimentos prioritários.</p>
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
              :rules="[v => !!v || 'Necessário informar o conceito prioritário']"
              label="Conceito Prioritário"
              style="margin:0px;"
              required
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-text-field
              style="margin-top: -1px; margin-bottom: -10px;"
              :rules="[v => !!v || 'Necessário informar identificador da prioridade']"
              v-model="priorControl[idPrior].namepriorknowledge"
              label="Identificador da prioridade"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="priorControl[idPrior].priorlevel"
              :items="priorLevels"
              :rules="[v => !!v || 'Necessário informar o nível de prioridade']"
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
          <v-card-text class="mt-3" style="font-size: 1.3em;">{{messageError}}</v-card-text>
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
export default {
  name: "VisibleDialog",
  props: ["domain", "dialog"],
  data: () => ({
    valid: true,
    treeData: [],
    selection: [],
    elementData: [],
    scopoTypes: [
      {
        text: "Avaliação",
        value: 1,
      },
      {
        text: "Domínio",
        value: 2,
      },
    ],
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
    domain: async function () {
      this.priorControl = [];
      if (this.domain) {
        await this.getPriors();
        await this.setDomainVariables();
      }
    },
    dialog: async function () {
      this.priorControl = [];
      if (this.domain) {
        await this.getPriors();
        await this.setDomainVariables();
      }
    },
  },
  mounted: async function () {
    this.priorControl = [];
    if (this.domain) {
      await this.getPriors();
      await this.setDomainVariables();
    }
  },
  methods: {
    getPriors() {
      // var vm = this;
      if (this.domain) {
        if (this.domain.modules) {
          this.domain.modules.forEach((module) => {
            if (module.concepts) {
              module.concepts.forEach((moduleConcept) => {
                if (moduleConcept.priorknowledge.length > 0) {
                  this.priorControl.push({
                    namepriorknowledge:
                      moduleConcept.priorknowledge[0].namepriorknowledge,
                    priorlevel: parseInt(
                      moduleConcept.priorknowledge[0].priorlevel.split("/")[4]
                    ),
                    fk_idconcept: moduleConcept.priorknowledge[0].fk_idconcept,
                    url: moduleConcept.priorknowledge[0].url,
                  });
                }
              });
            }
            if (module.submodules) {
              module.submodules.forEach((submodule) => {
                if (submodule.concepts) {
                  submodule.concepts.forEach((submoduleConcept) => {
                    if (submoduleConcept.priorknowledge.length > 0) {
                      this.priorControl.push({
                        namepriorknowledge:
                          submoduleConcept.priorknowledge[0].namepriorknowledge,
                        priorlevel: parseInt(
                          submoduleConcept.priorknowledge[0].priorlevel.split(
                            "/"
                          )[4]
                        ),
                        fk_idconcept:
                          submoduleConcept.priorknowledge[0].fk_idconcept,
                        url: submoduleConcept.priorknowledge[0].url,
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }
    },
    setDomainVariables() {
      if (Array.isArray(this.domain.modules) && this.domain.modules.length) {
        this.domain.modules.forEach((modulo) => {
          if (modulo.fk_idmodule === null) {
            if (modulo.submodules.length) {
              modulo.submodules.forEach((submodulo) => {
                if (submodulo.concepts.length) {
                  submodulo.concepts.forEach((conceito) => {
                    var object = {
                      id: conceito.url,
                      name: "[CONCEITO] " + conceito.nameconcept,
                      visible: conceito.visible,
                      children: [],
                    };
                    this.conceptsPrior.push({
                      text: object.name,
                      value: object.id,
                    });
                  });
                }
              });
            }
            if (modulo.concepts.length) {
              modulo.concepts.forEach((conceito) => {
                var object = {
                  id: conceito.url,
                  name: "[CONCEITO] " + conceito.nameconcept,
                  visible: conceito.visible,
                  children: [],
                };

                this.conceptsPrior.push({
                  text: object.name,
                  value: object.id,
                });
              });
            }
          }
        });
      }
    },
    async postPriorKnowledges() {
      var vm = this;
      var header = await this.$store.dispatch("getHeader");
      await this.priorControl.forEach(async (prior) => {
        if (prior.url) {
          await vm.axios.put(
            prior.url,
            {
              namepriorknowledge: prior.namepriorknowledge,
              priorlevel:
                `http://127.0.0.1:8000/priorlevel/` + prior.priorlevel + `/`,
              fk_idconcept: prior.fk_idconcept,
            },
            header
          );
        } else {
          await vm.axios.post(
            `http://127.0.0.1:8000/priorknowledge/`,
            {
              namepriorknowledge: prior.namepriorknowledge,
              priorlevel:
                `http://127.0.0.1:8000/priorlevel/` + prior.priorlevel + `/`,
              fk_idconcept: prior.fk_idconcept,
            },
            header
          );
        }
      });
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
        var header = await this.$store.dispatch("getHeader");
        await this.axios.delete(this.priorControl[idPrior].url, header);
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