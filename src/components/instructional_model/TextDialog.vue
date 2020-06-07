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
            <v-col cols="4">
              <label for="infoItemResumeSelect">Quais formas de texto você quer inserir?</label>
              <v-switch v-model="switchTextShort" flat :label="Resumido"></v-switch>
              <v-switch v-model="switchTextFull" flat :label="Não-resumido"></v-switch>
            </v-col>
            <div v-if="type==='conceito'">
              <v-col cols="4">
                <label for="infoItemClassesSelect">Classifique o item de informação</label>
                <v-select
                  id="infoItemClassesSelect"
                  v-model="infoClasse"
                  :items="infoItemClasses"
                  label="Classe"
                  style="margin:0px;"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <label for="infoItemLevelsSelect">Qual o nível de dificuldade?</label>
                <v-select
                  id="infoItemLevelsSelect"
                  v-model="infoLevel"
                  :items="infoItemLevels"
                  label="Nível"
                  style="margin:0px;"
                ></v-select>
              </v-col>
            </div>
          </v-row>
          <label for="textShortArea">Seu texto na forma resumida:</label>
          <v-textarea
            v-if="switchTextShort"
            id="textShortArea"
            background-color="#F2F3F3"
            clearable
            clear-icon="mdi-close-circle"
            class="mt-2"
            name="input-6-1"
            filled
            auto-grow
            v-model="infoTextShort"
          ></v-textarea>
          <label for="textFullArea">Seu texto na forma não-resumida:</label>
          <v-textarea
            v-if="switchTextFull"
            id="textFullArea"
            background-color="#F2F3F3"
            clearable
            clear-icon="mdi-close-circle"
            class="mt-2"
            name="input-14-1"
            filled
            auto-grow
            v-model="infoTextFull"
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" height="49" dark large @click="reset">
          Close
          <v-icon dark right>mdi-close</v-icon>
        </v-btn>
        <v-btn color="success" height="49" dark large @click="validate">
          Save
          <v-icon dark right>mdi-content-save</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "textDialog",
  props: ["optionCall", "type"],
  data: () => ({
    valid: true,
    switchTextFull: true,
    switchTextShort: false,
    auxConcept: "",
    infoClasse: "",
    infoLevel: "",
    infoResume: "",
    infoTextFull: "",
    infoTextShort: "",
    infoItemClasses: ["Conceito", "Princípio", "Fato", "Procedimento"],
    infoItemLevels: ["0 - Inicial", "1 - Fácil", "2 - Médio", "3 - Difícil"],
    infoItemResume: ["Não", "Sim"]
  }),
  methods: {
    reset() {
      this.$emit("close");
    },
    async postMobileMedia() {
      // var vm = this;
      var auxinformationitem = {
        auxinfo:
          `http://127.0.0.1:8000/informationitemtype/` + this.infoClasse + "/"
      };
      var mobilemedia = {
        label: "",
        fk_idmediatype: "http://localhost:8000/mediatype/4/",
        difficultyLevel: this.infoLevel,
        path: null,
        namefile: null,
        resolution: null,
        description: null,
        time: null,
        urllink: null
      };

      if (this.infoClasse == -1) {
        this.infoClasse = 1;
        auxinformationitem.auxinfo =
          `http://127.0.0.1:8000/informationitemtype/` + this.infoClasse + "/";
      }

      if (this.switchTextFull) {
        Object.assign(mobilemedia, {
          textshort: this.infoTextFull
        });
      }
      if (this.switchTextShort) {
        Object.assign(mobilemedia, {
          textshort: this.infoTextShort
        });
      }

      if (this.type === "conceito") {
        var iteminfo = {
          nameinformationitem: "text_" + mobilemedia.textshort,
          fk_informationitemtype: auxinformationitem.auxinfo
        };
        Object.assign(mobilemedia, {
          fk_idconcept: this.optionCall.url
        });
        Object.assign(iteminfo, {
          fk_idconcept: mobilemedia.fk_concept
        });
      } else if (this.type === "dominio") {
        Object.assign(mobilemedia, {
          fk_idknowledgedomain: this.optionCall.url
        });
      } else if (this.type === "modulo") {
        Object.assign(mobilemedia, {
          fk_module: this.optionCall.url
        });
      }

      if (this.type === "conceito") {
        await axios
          .post(`http://127.0.0.1:8000/informationitem/`, iteminfo, {
            auth: {
              username: "admin",
              password: "admin"
            }
          })
          .then(function(resposta) {
            Object.assign(mobilemedia, {
              fk_informationitem: resposta.data.url
            });
            axios
              .post(`http://localhost:8000/mobilemedia/`, mobilemedia, {
                auth: {
                  username: "admin",
                  password: "admin"
                }
              })
              .then(function(/*resposta*/) {
                /*vm.moduloTitle = resposta.data.namemodule;
                    vm.subTitle = resposta.data.subtitle;*/
              });
          });
      } else if (this.type === "dominio" || this.type === "modulo") {
        await axios
          .post(`http://localhost:8000/mobilemedia/`, mobilemedia, {
            auth: {
              username: "admin",
              password: "admin"
            }
          })
          .then(function(/*resposta*/) {
            /*vm.moduloTitle = resposta.data.namemodule;
                    vm.subTitle = resposta.data.subtitle;*/
          });
      }
    },
    async validate() {
      var vm = this;
      this.infoClasse = this.infoItemClasses.findIndex(function(value) {
        return value === vm.infoClasse;
      });
      this.infoLevel = this.infoItemLevels.findIndex(function(value) {
        return value === vm.infoLevel;
      });
      this.infoResume = this.infoItemResume.findIndex(function(value) {
        return value === vm.infoResume;
      });

      await this.postMobileMedia();
      await this.$emit("close");
    }
  }
};
</script>
