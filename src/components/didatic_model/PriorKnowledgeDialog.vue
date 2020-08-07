<template>
  <v-card>
    <v-card-title style="background-color:purple; color:white;">
      <span class="headline">
        <p>Defina as informações equivalentes aos conhecimentos prévios.</p>
      </span>
    </v-card-title>
    <v-row class="mx-0 px-0">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row class="mx-0 px-0 pl-6">
          <h3 class="mt-5">Conhecimentos prévios</h3>
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
          <v-col cols="3">
            <v-select
              v-model="priorControl[idPrior].fk_priorsourceconcept"
              @change="alterTargetControl(idPrior, priorControl[idPrior].fk_priorsourceconcept)"
              :items="sourceConceptsPrior"
              :rules="[
                (v) => !!v || 'Necessário informar o conceito prioritário',
              ]"
              label="Conceito Prévio"
              style="margin:0px;"
              required
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="priorControl[idPrior].fk_priortargetconcept"
              :items="targetConceptsPrior[idPrior]"
              :rules="[
                (v) => !!v || 'Necessário informar o conceito alvo',
              ]"
              label="Conceito Alvo"
              style="margin:0px;"
              required
            ></v-select>
          </v-col>
          <v-col cols="3">
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
          <v-col cols="2">
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
      <v-btn color="yellow" height="49" dark large @click="teste()">
        Teste
        <v-icon dark right>mdi-close</v-icon>
      </v-btn>
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
  name: "PriorKnowledgeDialog",
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
    sourceConceptsPrior: [],
    targetConceptsPrior: [],
    auxTargetConceptsPrior: [],
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
        await this.setDomainVariables();
        await this.getPriors();
      }
    },
    dialog: async function () {
      this.priorControl = [];
      if (this.domain) {
        await this.setDomainVariables();
        await this.getPriors();
      }
    },
  },
  mounted: async function () {
    this.priorControl = [];
    if (this.domain) {
      await this.setDomainVariables();
      await this.getPriors();
    }
  },
  methods: {
    atualizaControl() {
      console.log("atualiza");
    },
    getPriors() {
      // var vm = this;
      if (this.domain) {
        if (this.domain.modules) {
          this.domain.modules.forEach((module) => {
            if (module.concepts) {
              module.concepts.forEach((moduleConcept) => {
                if (moduleConcept.targetpriorknowledge.length > 0) {
                  moduleConcept.targetpriorknowledge.forEach((prior) => {
                    this.targetConceptsPrior.push(
                      this.auxTargetConceptsPrior.filter((m) => {
                        return m.idTargetModulo === module.url;
                      })[0].moduloConcepts
                    );

                    this.priorControl.push({
                      namepriorknowledge: prior.namepriorknowledge,
                      priorlevel: parseInt(prior.priorlevel.split("/")[4]),
                      fk_priorsourceconcept: prior.fk_priorsourceconcept,
                      fk_priortargetconcept: prior.fk_priortargetconcept,
                      fk_module: module.url,
                      url: prior.url,
                    });
                  });
                }
              });
            }
            if (module.submodules) {
              module.submodules.forEach((submodule) => {
                if (submodule.concepts) {
                  submodule.concepts.forEach((submoduleConcept) => {
                    if (submoduleConcept.priorknowledge.length > 0) {
                      submoduleConcept.targetpriorknowledge.forEach((prior) => {
                        this.targetConceptsPrior.push(
                          this.auxTargetConceptsPrior.filter((m) => {
                            return m.idTargetModulo === submodule.url;
                          })[0].moduloConcepts
                        );

                        this.priorControl.push({
                          namepriorknowledge: prior.namepriorknowledge,
                          priorlevel: parseInt(prior.priorlevel.split("/")[4]),
                          fk_priorsourceconcept: prior.fk_priorsourceconcept,
                          fk_priortargetconcept: prior.fk_priortargetconcept,
                          fk_module: submodule.url,
                          url: prior.url,
                        });
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
      this.targetConceptsPrior = [];
      this.auxTargetConceptsPrior = [];
      if (Array.isArray(this.domain.modules) && this.domain.modules.length) {
        this.domain.modules.forEach((modulo) => {
          if (modulo.fk_idmodule === null) {
            if (modulo.concepts.length) {
              var targetModulo = {
                idTargetModulo: modulo.url,
                moduloConcepts: [],
              };
              modulo.concepts.forEach((conceito, iconceito) => {
                var object = {
                  id: conceito.url,
                  name: "[CONCEITO] " + conceito.nameconcept,
                  visible: conceito.visible,
                  children: [],
                };

                targetModulo.moduloConcepts.push({
                  text: object.name,
                  url_modulo: modulo.url,
                  value: object.id,
                });

                if (iconceito !== modulo.concepts.length - 1) {
                  this.sourceConceptsPrior.push({
                    text: object.name,
                    url_modulo: modulo.url,
                    value: object.id,
                  });
                }
              });

              this.auxTargetConceptsPrior.push(targetModulo);
            }
            if (modulo.submodules.length) {
              modulo.submodules.forEach((submodulo) => {
                if (submodulo.concepts.length) {
                  var targetModulo = {
                    idTargetModulo: submodulo.modulo.url,
                    moduloConcepts: [],
                  };
                  submodulo.concepts.forEach((conceito, iconceito) => {
                    var object = {
                      id: conceito.url,
                      name: "[CONCEITO] " + conceito.nameconcept,
                      visible: conceito.visible,
                      children: [],
                    };

                    targetModulo.moduloConcepts.push({
                      text: object.name,
                      url_modulo: submodulo.url,
                      value: object.id,
                    });

                    if (iconceito !== modulo.concepts.length - 1) {
                      this.sourceConceptsPrior.push({
                        text: object.name,
                        url_modulo: submodulo.url,
                        value: object.id,
                      });
                    }
                  });
                  this.auxTargetConceptsPrior.push(targetModulo);
                }
              });
            }
          }
        });
      }
    },
    async postPriorKnowledges() {
      await this.priorControl.forEach(async (prior) => {
        if (prior.url) {
          await Api().put(prior.url, {
            namepriorknowledge: prior.namepriorknowledge,
            priorlevel: `/priorlevel/` + prior.priorlevel + `/`,
            fk_priorsourceconcept: prior.fk_idconcept,
            fk_priortargetconcept: prior.fk_idconcept,
          });
        } else {
          await Api().post(`/priorknowledge/`, {
            namepriorknowledge: prior.namepriorknowledge,
            priorlevel: `/priorlevel/` + prior.priorlevel + `/`,
            fk_priorsourceconcept: prior.fk_idconcept,
            fk_priortargetconcept: prior.fk_idconcept,
          });
        }
      });
    },
    async addPriorKnowledge() {
      this.priorControl.push({
        namepriorknowledge: "",
        priorlevel: "",
        fk_priorsourceconcept: "",
        fk_priortargetconcept: "",
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
      this.targetConceptsPrior = [];
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    teste() {
      console.log("teste", this.auxTargetConceptsPrior[0].moduloConcepts);
    },

    alterTargetControl(idPrior, urlConceito) {
      var auxUrlModule = "";
      this.auxTargetConceptsPrior.forEach((element) => {
        element.moduloConcepts.forEach((auxauxconceito) => {
          if (auxauxconceito.value === urlConceito) {
            auxUrlModule = element.idTargetModulo;
          }
        });
      });

      var auxArrayConcepts = (this.targetConceptsPrior[
        idPrior
      ] = this.auxTargetConceptsPrior.filter((m) => {
        return m.idTargetModulo === auxUrlModule;
      })[0].moduloConcepts);

      var control = 0;

      for (var i = 0; i < auxArrayConcepts.length; i++) {
        if (auxArrayConcepts.value === urlConceito) {
          control = 1;
        }
        if (control === 0 || control === 1) {
          auxArrayConcepts.splice(i, 1);
        }
        if (control === 1) {
          break;
        }
      }

      this.targetConceptsPrior[idPrior] = auxArrayConcepts;
    },
  },
};
</script>
