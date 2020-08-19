<template>
  <v-container class="pa-0">
    <v-card>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-card-title style="background-color:#63B0B0; color:white;">
          <span class="headline">
            <p>Importe seu áudio.</p>
          </span>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="4" v-if="type === 'conceito'">
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
              <label for="infoItemLevelsSelect">Qual o nível de dificuldade deste conteúdo?</label>
              <v-select
                id="infoItemLevelsSelect"
                v-model="infoLevel"
                :items="infoItemLevels"
                label="Nível"
                style="margin:0px;"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <label for="infoItemLearningStylesSelect">Qual o estilo de aprendizado deste conteúdo?</label>
              <v-select
                id="infoItemLearningStylesSelect"
                v-model="infoLearning"
                :items="infoItemLearningStyles"
                label="Nível"
                style="margin:0px;"
              ></v-select>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
          <v-file-input
            label="UPLOAD AUDIO"
            filled
            v-model="audioObject"
            accept="audio/*"
            prepend-icon="mdi-file-music"
          ></v-file-input>
          <label v-if="mobilemedia" class="mr-2" for="viewAudioIconId">Visualizar Audio</label>

          <v-spacer></v-spacer>
          <v-icon
            id="viewAudioIconId"
            :color="iconViewAudioColor"
            icon
            @click="setIconColor()"
            v-if="mobilemedia"
          >mdi-eye</v-icon>
          <vuetify-audio class="mt-3" v-if="viewAudio" :file="viewAudioSrc" color="success"></vuetify-audio>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" height="49" dark large @click="reset()">
            Cancelar
            <v-icon dark right>mdi-close</v-icon>
          </v-btn>
          <v-btn color="success" height="49" dark large @click="validate()">
            Salvar
            <v-icon dark right>mdi-content-save</v-icon>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    <div class="text-center">
      <v-dialog v-model="dialog_alert" width="500">
        <v-card>
          <v-card-title class="headline red" primary-title style="color:white;">ALERTA!</v-card-title>
          <v-card-text class="mt-3" style="font-size: 1.3em;">É necessário importar algum áudio.</v-card-text>
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
import * as firebase from "firebase/app";
import Api from "@/services/Api";

export default {
  components: {
    VuetifyAudio: () => import("vuetify-audio"),
  },
  name: "AudioDialog",
  props: ["optionCall", "type", "domain", "dialog", "mobilemedia"],
  data: () => ({
    valid: true,
    dialog_alert: false,
    viewAudio: false,
    viewAudioSrc: "",
    iconViewAudioColor: "blue",
    infoClasse: "",
    infoLevel: "",
    infoLearning: "",
    infoItemClasses: ["Conceito", "Princípio", "Fato"],
    infoItemLevels: ["0 - Inicial", "1 - Fácil", "2 - Médio", "3 - Difícil"],
    infoItemLearningStyles: ["Visual", "Textual"],
    infoResume: "",
    audioObject: {},
  }),
  watch: {
    dialog: function () {
      this.getMobileMedia();
    },
  },
  mounted: function () {
    this.getMobileMedia();
    this.$refs.form.resetValidation();
  },
  methods: {
    getMobileMedia() {
      if (this.mobilemedia) {
        var vm = this;
        this.$nextTick(function () {
          if (vm.mobilemedia.difficultyLevel !== null) {
            vm.infoLevel = vm.infoItemLevels[vm.mobilemedia.difficultyLevel];
          }
          if (vm.mobilemedia.learningStyle !== null) {
            vm.infoLearning =
              vm.infoItemLearningStyles[vm.mobilemedia.learningStyle];
          }
          if (vm.mobilemedia.fk_informationitem) {
            Api()
              .patch(vm.mobilemedia.fk_informationitem, {})
              .then(function (resposta) {
                vm.infoClasse =
                  vm.infoItemClasses[
                    resposta.data.fk_informationitemtype.split("/")[4] - 1
                  ];
              });
          }
        });
        vm.getSrcAudio();
        vm.viewAudio = true;
      } else {
        this.viewAudioSrc = "";
      }
    },
    async postMobileMedia() {
      var auxinformationitem = {
        auxinfo: `/informationitemtype/` + (this.infoClasse + 1) + "/",
      };
      var vm = this;
      var path = "";
      if (this.mobilemedia) {
        path = this.mobilemedia.path;
      } else {
        path =
          this.domain.idknowledgedomain.toString() +
          "/" +
          Date.now().toString();
      }

      await firebase.storage().ref().child(path).put(vm.audioObject);

      var mobilemedia = {
        fk_idmediatype: "/mediatype/3/",
        path: path,
        namefile: path.split("/")[1],
        resolution: null,
        description: null,
        time: null,
        textfull: null,
        textshort: null,
        urllink: null,
      };

      if (this.infoClasse == -1) {
        this.infoClasse = 1;
        auxinformationitem.auxinfo =
          `/informationitemtype/` + this.infoClasse + "/";
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
          nameinformationitem: "audio_" + vm.audioObject.name,
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
        vm = this;
        if (this.type === "conceito") {
          await Api()
            .put(vm.mobilemedia.fk_informationitem, iteminfo)
            .then(async function (resposta) {
              Object.assign(mobilemedia, {
                fk_informationitem: resposta.data.url,
              });
              await Api()
                .put(vm.mobilemedia.url, mobilemedia)
                .then(async function (/*resposta*/) {});
            });
        } else if (this.type === "dominio" || this.type === "modulo") {
          await Api()
            .put(this.mobilemedia.url, mobilemedia)
            .then(async function (/*resposta*/) {});
        }
      } else {
        /* CÓDIGO PARA CRIAÇÃO DO MOBILEMEDIA */
        if (this.type === "conceito") {
          /* CÓDIGO PARA CRIAÇÃO DO MOBILEMEDIA COM ITEMINFO*/
          await Api()
            .post(`/informationitem/`, iteminfo)
            .then(async function (resposta) {
              Object.assign(mobilemedia, {
                fk_informationitem: resposta.data.url,
              });
              await Api()
                .post(`/mobilemedia/`, mobilemedia)
                .then(function (/*resposta*/) {
                  /*vm.moduloTitle = resposta.data.namemodule;
                                    vm.subTitle = resposta.data.subtitle;*/
                });
            });
        } else if (this.type === "dominio" || this.type === "modulo") {
          /* CÓDIGO PARA CRIAÇÃO DO MOBILEMEDIA SEM ITEM INFO*/
          await Api()
            .post(`/mobilemedia/`, mobilemedia)
            .then(function (/*resposta*/) {
              /*vm.moduloTitle = resposta.data.namemodule;
                                vm.subTitle = resposta.data.subtitle;*/
            });
        }
      }
    },
    async validate() {
      var vm = this;
      this.infoClasse = this.infoItemClasses.findIndex(function (value) {
        return value === vm.infoClasse;
      });
      this.infoLevel = this.infoItemLevels.findIndex(function (value) {
        return value === vm.infoLevel;
      });
      this.infoLearning = this.infoItemLearningStyles.findIndex(function (
        value
      ) {
        return value === vm.infoLearning;
      });
      if (this.audioObject) {
        await this.postMobileMedia();
        await this.$emit("close", "save");
        await this.resetVariables();
        this.viewAudio = false;
        this.audioObject = null;
        await this.$refs.form.reset();
      } else {
        this.dialog_alert = true;
      }
    },
    async reset() {
      await this.$emit("close", "close");
      await this.resetVariables();
      this.viewAudio = false;
      this.audioObject = null;
      await this.$refs.form.reset();
    },
    resetVariables() {
      this.infoLevel = "";
      this.infoLearning = "";
      this.infoClasse = "";
    },
    getSrcAudio() {
      if (this.mobilemedia.path) {
        var vm = this;
        firebase
          .storage()
          .ref(this.mobilemedia.path)
          .getDownloadURL()
          .then(function (url) {
            vm.viewAudioSrc = url;
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = function () {
              var blob = xhr.response;
              const file = new File([blob], vm.mobilemedia.namefile, {
                type: blob.type,
              });
              vm.audioObject = file;
            };
            xhr.open("GET", url);
            xhr.send();
          });
      }
    },
    setIconColor() {
      if (this.mobilemedia.path) {
        if (this.iconViewAudioColor === "grey") {
          this.iconViewAudioColor = "blue";
        } else {
          this.iconViewAudioColor = "grey";
        }
        this.viewAudio = !this.viewAudio;
        /*firebase
          .storage()
          .ref(this.mobilemedia.path)
          .getDownloadURL()
          .then(function(url) {
            window.open(url, "_blank");
          });*/
      }
    },
  },
};
</script>
