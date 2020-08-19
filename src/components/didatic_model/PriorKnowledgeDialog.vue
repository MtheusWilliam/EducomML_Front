<template>
  <v-card>
    <v-card-title style="background-color:purple; color:white;">
      <span class="headline">
        <p>Defina as informações equivalentes aos conhecimentos prévios.</p>
      </span>
    </v-card-title>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row class="mx-0 px-0 pl-6 mb-6">
        <h3 class="mt-5">Conhecimentos prévios</h3>
        <v-btn icon="icon" class="mb-1">
          <v-icon
            large
            class="mt-9 ml-2"
            color="primary"
            @click="addTargetPriorKnowledge()"
          >mdi-plus-box</v-icon>
        </v-btn>
      </v-row>
      <v-row
        v-for="(prior, idPrior) in priorControl"
        :key="idPrior"
        class="mx-0 px-0 pl-10"
        style="margin-top: -20px;"
      >
        <v-row>
          <v-col cols="3">
            <v-select
              v-model="priorControl[idPrior].fk_priortargetconcept"
              @change="alterTargetControl('alter', priorControl[idPrior].fk_priortargetconcept, idPrior)"
              :items="targetConceptsPrior"
              :rules="[
                (v) => !!v || 'Necessário informar o conceito alvo',
              ]"
              label="Conceito Alvo"
              style="margin:0px;"
              required
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-btn icon="icon" class="mt-4">
              <v-icon
                large
                class="mb-1"
                color="primary"
                @click="addSourcePriorKnowledge(idPrior)"
              >mdi-plus-box</v-icon>
            </v-btn>
            <v-btn icon="icon" class="mt-4">
              <v-icon
                large
                class="mb-1"
                color="red"
                @click="deletaTargetPriorKnowledge(idPrior)"
              >mdi-minus-box</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row
          v-for="(sourceprior, idsourceprior) in prior.priorknowledges"
          :key="idsourceprior"
          style="margin-top: -30px;"
        >
          <v-spacer></v-spacer>
          <v-col cols="3">
            <v-select
              v-model="priorControl[idPrior].priorknowledges[idsourceprior].fk_priorsourceconcept"
              :items="sourceConceptsPrior[idPrior]"
              :rules="[
                (v) => !!v || 'Necessário informar o conceito prévio',
              ]"
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
              v-model="priorControl[idPrior].priorknowledges[idsourceprior].namepriorknowledge"
              label="Identificador da prioridade"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="priorControl[idPrior].priorknowledges[idsourceprior].priorlevel"
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
                @click="deletaSourcePriorKnowledge(idPrior, idsourceprior)"
              >mdi-minus-box</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-row>
    </v-form>
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
  name: "PriorKnowledgeDialog",
  props: ["domain", "dialog"],
  data: () => ({
    valid: true,
    controlsave: 0,
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
    targetConceptsPrior: [],
    sourceConceptsPrior: [],
    auxSourceConceptsPrior: [],
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
      console.log("atualiza", this.sourceConceptsPrior);
    },
    getPriors() {
      // var vm = this;
      if (this.domain) {
        if (this.domain.modules) {
          this.domain.modules.forEach((module) => {
            if (
              Array.isArray(module.submodules) &&
              module.submodules.length > 0
            ) {
              module.submodules.forEach((submodule) => {
                if (
                  Array.isArray(submodule.concepts) &&
                  submodule.concepts.length > 0
                ) {
                  submodule.concepts.forEach((submoduleConcept) => {
                    if (submoduleConcept.targetpriorknowledge.length > 0) {
                      var auxSourcePrior = {
                        fk_priortargetconcept: submoduleConcept.url,
                        priorknowledges: [],
                      };

                      this.sourceConceptsPrior.push(
                        this.alterTargetControl(
                          "watch",
                          submoduleConcept.url,
                          ""
                        )
                      );
                      submoduleConcept.targetpriorknowledge.forEach((prior) => {
                        Object.assign(auxSourcePrior.priorknowledges, {
                          namepriorknowledge: prior.namepriorknowledge,
                          priorlevel: parseInt(prior.priorlevel.split("/")[4]),
                          fk_priorsourceconcept: prior.fk_priorsourceconcept,
                          fk_module: module.url,
                          url: prior.url,
                        });
                      });
                      this.priorControl.push(auxSourcePrior);
                    }
                  });
                }
              });
            }
            if (Array.isArray(module.concepts) && module.concepts.length > 0) {
              module.concepts.forEach((moduleConcept) => {
                if (moduleConcept.targetpriorknowledge.length > 0) {
                  var auxSourcePrior = {
                    fk_priortargetconcept: moduleConcept.url,
                    priorknowledges: [],
                  };

                  this.sourceConceptsPrior.push(
                    this.alterTargetControl("watch", moduleConcept.url, "")
                  );
                  moduleConcept.targetpriorknowledge.forEach((prior) => {
                    auxSourcePrior.priorknowledges.push({
                      namepriorknowledge: prior.namepriorknowledge,
                      priorlevel: parseInt(prior.priorlevel.split("/")[4]),
                      fk_priorsourceconcept: prior.fk_priorsourceconcept,
                      fk_module: module.url,
                      url: prior.url,
                    });
                  });
                  this.priorControl.push(auxSourcePrior);
                }
              });
            }
          });
        }
      }
    },
    setDomainVariables() {
      var auxFirstModulo = 0;
      var auxFirstSubmodulo = 0;
      this.targetConceptsPrior = [];
      this.auxTargetConceptsPrior = [];

      if (Array.isArray(this.domain.modules) && this.domain.modules.length) {
        this.domain.modules.forEach((modulo) => {
          if (modulo.submodules.length) {
            modulo.submodules.forEach((submodulo) => {
              if (submodulo.concepts.length) {
                submodulo.concepts.forEach((conceito, iconceito) => {
                  if (
                    !(
                      auxFirstModulo === 0 &&
                      auxFirstSubmodulo === 0 &&
                      iconceito === 0
                    )
                  ) {
                    this.targetConceptsPrior.push({
                      text: conceito.nameconcept,
                      url_modulo: submodulo.url,
                      value: conceito.url,
                    });
                    auxFirstModulo++;
                  }
                });
                auxFirstModulo++;
                auxFirstSubmodulo++;
              }
            });
          }
          if (modulo.concepts.length) {
            modulo.concepts.forEach((conceito, iconceito) => {
              if (!(auxFirstModulo === 0 && iconceito === 0)) {
                this.targetConceptsPrior.push({
                  text: conceito.nameconcept,
                  url_modulo: modulo.url,
                  value: conceito.url,
                });
              }
            });
            auxFirstModulo++;
          }
        });
      }
    },
    async postPriorKnowledges() {
      await this.priorControl.forEach(async (targetprior) => {
        await targetprior.priorknowledges.forEach(async (sourceprior) => {
          if (sourceprior.url) {
            await Api().put(sourceprior.url, {
              namepriorknowledge: sourceprior.namepriorknowledge,
              priorlevel: `/priorlevel/` + sourceprior.priorlevel + `/`,
              fk_priorsourceconcept: sourceprior.fk_priorsourceconcept,
              fk_priortargetconcept: targetprior.fk_priortargetconcept,
            });
          } else {
            await Api().post(`/priorknowledge/`, {
              namepriorknowledge: sourceprior.namepriorknowledge,
              priorlevel: `/priorlevel/` + sourceprior.priorlevel + `/`,
              fk_priorsourceconcept: sourceprior.fk_priorsourceconcept,
              fk_priortargetconcept: targetprior.fk_priortargetconcept,
            });
          }
        });
      });
    },
    async addSourcePriorKnowledge(idTargetPriorKnowledge) {
      this.priorControl[idTargetPriorKnowledge].priorknowledges.push({
        fk_priorsourceconcept: "",
        namepriorknowledge: "",
        priorlevel: "",
        url: "",
      });
    },
    async deletaSourcePriorKnowledge(
      idTargetPriorKnowledge,
      idSourcePriorKnowledge
    ) {
      if (
        this.priorControl[idTargetPriorKnowledge].priorknowledges[
          idSourcePriorKnowledge
        ].url
      ) {
        Api().delete(
          this.priorControl[idTargetPriorKnowledge].priorknowledges[
            idSourcePriorKnowledge
          ].url
        );
      }
      if (idSourcePriorKnowledge == 0) {
        this.priorControl[idTargetPriorKnowledge].priorknowledges.shift();
      } else {
        this.priorControl[idTargetPriorKnowledge].priorknowledges.splice(
          idSourcePriorKnowledge,
          1
        );
      }
      this.controlsave++;
    },
    async addTargetPriorKnowledge() {
      this.priorControl.push({
        fk_priortargetconcept: "",
        priorknowledges: [],
      });
    },
    async deletaTargetPriorKnowledge(idPrior) {
      this.priorControl[idPrior].priorknowledges.forEach(
        async (sourcePrior) => {
          if (sourcePrior.url) {
            await Api().delete(sourcePrior.url);
          }
        }
      );

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
          if (this.priorControl[m].priorknowledges.length === 0) {
            auxLoopValidation = 0;
            this.messageError =
              "Não é possível definir conceitos alvo sem declarar seu(s) respectivo(s) conhecimentos prévios. Verifique o conceito alvo " +
              +(m + 1) +
              ".";
            this.dialogError = true;
            break;
          }
          for (
            var n = 0;
            n < this.priorControl[m].priorknowledges.length;
            n++
          ) {
            for (
              var o = 0;
              o < this.priorControl[m].priorknowledges.length;
              o++
            ) {
              if (
                this.priorControl[m].priorknowledges[n]
                  .fk_priorsourceconcept ===
                  this.priorControl[m].priorknowledges[o]
                    .fk_priorsourceconcept &&
                n !== o
              ) {
                auxLoopValidation = 0;
                this.messageError =
                  "Não é possível definir conhecimentos prévios iguais para o mesmo conceito. Verifique os conhecimentos prévios " +
                  (n + 1) +
                  " e " +
                  (o + 1) +
                  " do conceito " +
                  (m + 1) +
                  ".";
                this.dialogError = true;
                break;
              }
            }
          }
        }

        for (m = 0; m < this.priorControl.length; m++) {
          for (n = 0; n < this.priorControl[m].priorknowledges.length; n++) {
            if (
              this.priorControl[m].fk_priortargetconcept ===
                this.priorControl[n].fk_priortargetconcept &&
              m !== n
            ) {
              auxLoopValidation = 0;
              this.messageError =
                "Não é possível repetir conceitos alvo. Verifique os conceitos alvo " +
                (m + 1) +
                " e " +
                (n + 1) +
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
      if (this.controlsave > 0) {
        this.$emit("close_or_save", "save");
      } else {
        this.$emit("close_or_save", "close");
      }
      this.priorControl = [];
    },
    resetVariables() {
      this.priorControl = [];
      this.targetConceptsPrior = [];
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    alterTargetControl(type, urlConceito, idPrior) {
      var auxSources = [];
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
                  urlConceito
                ) {
                  i = this.domain.modules.length;
                  s = this.domain.modules[i].submodules.length;
                  break;
                } else {
                  auxSources.push({
                    text: this.domain.modules[i].submodules[s].concepts[c]
                      .nameconcept,
                    url_modulo: this.domain.modules[i].submodules[s].url,
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
            if (this.domain.modules[i1].concepts[c1].url === urlConceito) {
              i1 = this.domain.modules.length;
              break;
            } else {
              auxSources.push({
                text: this.domain.modules[i1].concepts[c1].nameconcept,
                url_modulo: this.domain.modules[i1].url,
                value: this.domain.modules[i1].concepts[c1].url,
              });
            }
          }
        }
      }

      if (type === "alter") {
        this.sourceConceptsPrior[idPrior] = auxSources;
      } else if (type === "watch") {
        return auxSources;
      }
    },
  },
};
</script>
