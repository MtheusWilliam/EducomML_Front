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
            <v-col cols="1">
              <label for="enableInfoItems">On</label>
              <br />
              <v-btn class="mt-3" icon :color="onIconEnable" @click="enableInfoText">
                <v-icon large>mdi-eye</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <label for="infoItemClassesSelect">Classifique o item de informação</label>
              <v-select
                id="infoItemClassesSelect"
                :disabled="selectsDisabled"
                v-model="infoClasse"
                :items="infoItemClasses"
                :rules="[v => !!v || 'Conceito é requerido']"
                label="Classe"
                style="margin:0px;"
                required
              ></v-select>
            </v-col>
            <v-col cols="4">
              <label for="infoItemLevelsSelect">Qual o nível de dificuldade?</label>
              <v-select
                id="infoItemLevelsSelect"
                :disabled="selectsDisabled"
                v-model="infoLevel"
                :items="infoItemLevels"
                :rules="[v => !!v || 'Conceito é requerido']"
                label="Nível"
                style="margin:0px;"
                required
              ></v-select>
            </v-col>
            <v-col cols="3">
              <label for="infoItemResumeSelect">É um texto resumido?</label>
              <v-select
                id="infoItemResumeSelect"
                :disabled="selectsDisabled"
                v-model="infoResume"
                :items="infoItemResume"
                :rules="[v => !!v || 'Conceito é requerido']"
                label="Resposta"
                style="margin:0px;"
                required
              ></v-select>
            </v-col>
          </v-row>
          <label for="textTextArea">Seu texto:</label>
          <v-textarea
            id="textTextArea"
            background-color="#F2F3F3"
            clearable
            clear-icon="mdi-close-circle"
            class="mt-2"
            name="input-8-1"
            filled
            auto-grow
            v-model="infoText"
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
    selectsDisabled: true,
    onIconEnable: "grey",
    valid: true,
    auxConcept: "",
    infoClasse: "",
    infoLevel: "",
    infoResume: "",
    infoText: "",
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
        path: null,
        namefile: null,
        resolution: null,
        description: null,
        time: null,
        textfull: this.infoText,
        urllink: null
      };

      if (this.selectsDisabled == true) {
        this.infoClasse = 1;
        auxinformationitem.auxinfo =
          `http://127.0.0.1:8000/informationitemtype/` + this.infoClasse + "/";
        Object.assign(mobilemedia, {
          difficultyLevel: null
        });
        Object.assign(mobilemedia, {
          learningStyle: null
        });
      } else {
        Object.assign(mobilemedia, {
          difficultyLevel: this.infoLevel
        });
        Object.assign(mobilemedia, {
          learningStyle: this.infoClasse
        });
      }

      if (this.infoText.length <= 20) {
        Object.assign(mobilemedia, {
          textshort: this.infoText
        });
      } else {
        Object.assign(mobilemedia, {
          textshort: this.infoText.substr(0, 20)
        });
      }
      console.log("INFO CLASSE2", this.infoClasse);
      if (this.type === "dominio") {
        Object.assign(mobilemedia, {
          fk_idknowledgedomain: this.optionCall.url
        });
      } else if (this.type === "modulo") {
        Object.assign(mobilemedia, {
          fk_module: this.optionCall.url
        });
      } else if (this.type === "conceito") {
        Object.assign(mobilemedia, {
          fk_idconcept: this.optionCall.url
        });
      }
      console.log("INFO CLASSE3", this.infoClasse);
      var iteminfo = {
        nameinformationitem: "text_" + mobilemedia.textshort,
        fk_informationitemtype: auxinformationitem.auxinfo
      };
      if (this.type === "conceito") {
        Object.assign(iteminfo, {
          fk_idconcept: mobilemedia.fk_concept
        });
      }

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
    },
    enableInfoText() {
      this.selectsDisabled = !this.selectsDisabled;
      this.onIconEnable = this.onIconEnable == "grey" ? "blue" : "grey";
    }
  }
};
</script>
