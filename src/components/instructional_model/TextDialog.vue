<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:#63B0B0; color:white;">
        <span class="headline">
          <p>Escreva seu texto aqui.</p>
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="4" v-if="type === 'conceito'">
              <label for="infoItemClassesSelect"
                >Classifique o item de informação</label
              >
              <v-select
                id="infoItemClassesSelect"
                v-model="infoClasse"
                :items="infoItemClasses"
                label="Classe"
                style="margin:0px;"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <label for="infoItemLevelsSelect"
                >Qual o nível de dificuldade deste conteúdo?</label
              >
              <v-select
                id="infoItemLevelsSelect"
                v-model="infoLevel"
                :items="infoItemLevels"
                label="Nível"
                style="margin:0px;"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <label for="infoItemLearningStylesSelect"
                >Qual o estilo de aprendizado deste conteúdo?</label
              >
              <v-select
                id="infoItemLearningStylesSelect"
                v-model="infoLearning"
                :items="infoItemLearningStyles"
                label="Nível"
                style="margin:0px;"
              ></v-select>
            </v-col>
          </v-row>
          <br />
          <v-row style="margin-bottom: -35px;">
            <v-col cols="11">
              <label for="textFullArea">Seu texto na forma não-resumida:</label>
              <v-textarea
                id="textFullArea"
                background-color="#F2F3F3"
                clearable
                clear-icon="mdi-close-circle"
                rows="12"
                filled
                auto-grow
                v-model="infoTextFull"
              ></v-textarea>
            </v-col>
            <v-col cols="1" style="red; padding-top: 20%;">
              <v-switch v-model="switchTextFull"></v-switch>
            </v-col>
          </v-row>
          <v-row style="margin-bottom: -30px;">
            <v-col cols="11">
              <label for="textShortArea">Seu texto na forma resumida:</label>
              <v-textarea
                id="textShortArea"
                background-color="#F2F3F3"
                clearable
                clear-icon="mdi-close-circle"
                class="mt-2"
                rows="5"
                filled
                auto-grow
                v-model="infoTextShort"
              ></v-textarea>
            </v-col>
            <v-col cols="1" style="padding-top: 70px;">
              <v-switch v-model="switchTextShort"></v-switch>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
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
    </v-card>
    <div class="text-center">
      <v-dialog v-model="dialog_alert" width="500">
        <v-card>
          <v-card-title class="headline red" primary-title style="color:white;"
            >ALERTA!</v-card-title
          >
          <v-card-text class="mt-3" style="font-size: 1.3em;"
            >Pelo menos um dos tipos de texto deve estar
            habilitado!</v-card-text
          >
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog_alert = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
  import Api from "@/services/Api";

  export default {
    name: "textDialog",
    props: ["optionCall", "type", "dialog", "mobilemedia"],
    data: () => ({
      valid: true,
      dialog_alert: false,
      switchTextFull: true,
      switchTextShort: false,
      infoClasse: "",
      infoLevel: "",
      infoLearning: "",
      infoResume: "",
      infoTextFull: "",
      infoTextShort: "",
      infoItemClasses: ["Conceito", "Princípio", "Fato"],
      infoItemLevels: ["0 - Inicial", "1 - Fácil", "2 - Médio", "3 - Difícil"],
      infoItemLearningStyles: ["Visual", "Textual"],
    }),
    watch: {
      dialog: function() {
        this.getMobileMedia();
      },
    },
    mounted: function() {
      this.getMobileMedia();
      this.$refs.form.resetValidation();
    },
    methods: {
      getMobileMedia() {
        if (this.mobilemedia) {
          var vm = this;
          this.$nextTick(function() {
            if (vm.mobilemedia.difficultyLevel !== null) {
              vm.infoLevel = vm.infoItemLevels[vm.mobilemedia.difficultyLevel];
            }
            if (vm.mobilemedia.learningStyle !== null) {
              vm.infoLearning =
                vm.infoItemLearningStyles[vm.mobilemedia.learningStyle];
            }
            if (vm.mobilemedia.textfull !== null) {
              vm.infoTextFull = vm.mobilemedia.textfull;
              vm.switchTextFull = true;
            } else {
              vm.switchTextFull = false;
            }
            if (vm.mobilemedia.textshort !== null) {
              vm.infoTextShort = vm.mobilemedia.textshort;
              vm.switchTextShort = true;
            } else {
              vm.switchTextShort = false;
            }
            if (vm.mobilemedia.fk_informationitem) {
              Api()
                .patch(vm.mobilemedia.fk_informationitem, {})
                .then(function(resposta) {
                  vm.infoClasse =
                    vm.infoItemClasses[
                      resposta.data.fk_informationitemtype.split("/")[4] - 1
                    ];
                });
            }
          });
        }
      },
      async postOrPutMobileMedia() {
        // var vm = this;
        var auxinformationitem = {
          auxinfo: `/informationitemtype/` + (this.infoClasse + 1) + "/",
        };
        var mobilemedia = {
          label: "",
          fk_idmediatype: "/mediatype/4/",
          path: null,
          namefile: null,
          resolution: null,
          description: null,
          time: null,
          urllink: null,
        };

        if (this.infoClasse == -1) {
          this.infoClasse = 1;
          auxinformationitem.auxinfo =
            `/informationitemtype/` + this.infoClasse + "/";
        }

        if (this.switchTextFull) {
          Object.assign(mobilemedia, {
            textfull: this.infoTextFull,
          });
        } else {
          Object.assign(mobilemedia, {
            textfull: null,
          });
        }
        if (this.switchTextShort) {
          Object.assign(mobilemedia, {
            textshort: this.infoTextShort,
          });
        } else {
          Object.assign(mobilemedia, {
            textshort: null,
          });
        }

        if (this.infoLevel > -1) {
          Object.assign(mobilemedia, {
            difficultyLevel: this.infoLevel,
          });
        }

        if (this.infoLearning > -1) {
          Object.assign(mobilemedia, {
            learningStyle: this.infoLearning,
          });
        }

        if (this.type === "conceito") {
          var iteminfo = {
            nameinformationitem: "text_" + mobilemedia.textshort,
            fk_informationitemtype: auxinformationitem.auxinfo,
            fk_idconcept: this.optionCall.url,
          };
        } else if (this.type === "dominio") {
          Object.assign(mobilemedia, {
            fk_idknowledgedomain: this.optionCall.url,
          });
        } else if (this.type === "modulo") {
          Object.assign(mobilemedia, {
            fk_module: this.optionCall.url,
          });
        }

        /* CÓDIGO PARA EDIÇÃO DO MOBILEMEDIA */
        if (this.mobilemedia) {
          var vm = this;
          if (this.type === "conceito") {
            await Api()
              .put(vm.mobilemedia.fk_informationitem, iteminfo)
              .then(async function() {
                await Api()
                  .put(vm.mobilemedia.url, mobilemedia)
                  .then(async function(/*resposta*/) {});
              });
          } else if (this.type === "dominio" || this.type === "modulo") {
            await Api()
              .put(this.mobilemedia.url, mobilemedia)
              .then(async function(/*resposta*/) {});
          }
        } else {
          /* CÓDIGO PARA CRIAÇÃO DO MOBILEMEDIA */
          if (this.type === "conceito") {
            /* CÓDIGO PARA CRIAÇÃO DO MOBILEMEDIA COM ITEMINFO*/
            await Api()
              .post(`/informationitem/`, iteminfo)
              .then(async function(resposta) {
                Object.assign(mobilemedia, {
                  fk_informationitem: resposta.data.url,
                });
                await Api()
                  .post(`/mobilemedia/`, mobilemedia)
                  .then(function(/*resposta*/) {
                    /*vm.moduloTitle = resposta.data.namemodule;
                                    vm.subTitle = resposta.data.subtitle;*/
                  });
              });
          } else if (this.type === "dominio" || this.type === "modulo") {
            /* CÓDIGO PARA CRIAÇÃO DO MOBILEMEDIA SEM ITEM INFO*/
            await Api()
              .post(`/mobilemedia/`, mobilemedia)
              .then(function(/*resposta*/) {
                /*vm.moduloTitle = resposta.data.namemodule;
                                vm.subTitle = resposta.data.subtitle;*/
              });
          }
        }
      },
      async validate() {
        var vm = this;
        if (this.switchTextFull === true || this.switchTextShort === true) {
          this.infoClasse = this.infoItemClasses.findIndex(function(value) {
            return value === vm.infoClasse;
          });
          this.infoLevel = this.infoItemLevels.findIndex(function(value) {
            return value === vm.infoLevel;
          });
          this.infoLearning = this.infoItemLearningStyles.findIndex(function(
            value
          ) {
            return value === vm.infoLearning;
          });
          await this.postOrPutMobileMedia();
          await this.$emit("close");

          await this.$refs.form.reset();
          await this.resetVariables();
        } else {
          this.dialog_alert = true;
        }
      },
      resetVariables() {
        this.switchTextFull = true;
        this.switchTextShort = false;
        this.infoClasse = "";
        this.infoLevel = "";
        this.infoLearning = "";
        this.infoResume = "";
        this.infoTextFull = "";
        this.infoTextShort = "";
      },
      async reset() {
        await this.$emit("close");
        await this.$refs.form.reset();
        await this.resetVariables();
      },
    },
  };
</script>
