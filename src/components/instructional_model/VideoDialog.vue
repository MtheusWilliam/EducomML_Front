<template>
  <v-container class="pa-0">
    <v-card>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-card-title style="background-color:#63B0B0; color:white;">
          <span class="headline">
            <p>Importe seu vídeo.</p>
          </span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="4" v-if="type==='conceito'">
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
            label="UPLOAD VIDEO"
            filled
            v-model="videoObject"
            accept="video/*"
            prepend-icon="mdi-video"
          ></v-file-input>
          <label v-if="mobilemedia" class="mr-2" for="viewVideoIconId">Visualizar Video</label>
          <v-icon
            id="viewVideoIconId"
            :color="iconViewVideoColor"
            icon
            @click="setIconColor()"
            v-if="mobilemedia"
          >mdi-eye</v-icon>
          <v-spacer></v-spacer>
          <v-row>
            <v-spacer></v-spacer>
            <Media :kind="'video'" :controls="true" :src="[viewVideoSrc]" v-if="viewVideo"></Media>
            <v-spacer></v-spacer>
          </v-row>
          <v-spacer></v-spacer>
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
      </v-form>
    </v-card>
    <div class="text-center">
      <v-dialog v-model="dialog_alert" width="500">
        <v-card>
          <v-card-title class="headline red" primary-title style="color:white;">ALERTA!</v-card-title>
          <v-card-text class="mt-3" style="font-size: 1.3em;">É necessário importar algum vídeo.</v-card-text>
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
import axios from "axios";
import Cookie from "js-cookie";
import Media from "@dongido/vue-viaudio";

export default {
  components: {
    Media,
  },
  name: "VideoDialog",
  props: ["optionCall", "type", "domain", "dialog", "mobilemedia"],
  data: () => ({
    valid: true,
    dialog_alert: false,
    viewVideo: false,
    viewVideoSrc: "",
    iconViewVideoColor: "blue",
    resolution: "",
    time: "",
    infoLevel: "",
    infoLearning: "",
    infoClasse: "",
    infoItemClasses: ["Conceito", "Princípio", "Fato"],
    infoItemLevels: ["0 - Inicial", "1 - Fácil", "2 - Médio", "3 - Difícil"],
    infoItemLearningStyles: ["Visual", "Textual"],
    infoResume: "",
    videoObject: {},
  }),
  watch: {
    videoObject: function () {
      if (this.videoObject) {
        var vm = this;
        var video = document.createElement("video");
        var source = document.createElement("source");
        source.setAttribute("src", URL.createObjectURL(vm.videoObject));
        video.appendChild(source);
        video.oncanplay = function () {
          vm.resolution = video.videoWidth + "X" + video.videoHeight;
          vm.time = video.duration;
        };
      }
    },
    dialog: function () {
      this.getMobileMedia();
    },
  },
  mounted: function () {
    this.getMobileMedia();
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
            var csrftoken = Cookie.get("csrftoken");
            var headers = {
              "X-CSRFTOKEN": csrftoken,
            };
            axios
              .patch(
                vm.mobilemedia.fk_informationitem,
                {
                  headers: headers,
                },
                {
                  auth: {
                    username: "admin",
                    password: "admin",
                  },
                }
              )
              .then(function (resposta) {
                vm.infoClasse =
                  vm.infoItemClasses[
                    resposta.data.fk_informationitemtype.split("/")[4] - 1
                  ];
              });
          }
        });
        vm.getSrcVideo();
        vm.viewVideo = true;
      } else {
        this.viewVideoSrc = "";
      }
    },
    async postMobileMedia() {
      var auxinformationitem = {
        auxinfo:
          `http://127.0.0.1:8000/informationitemtype/` +
          (this.infoClasse + 1) +
          "/",
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

      await firebase.storage().ref().child(path).put(this.videoObject);

      var mobilemedia = {
        fk_idmediatype: "http://localhost:8000/mediatype/2/",
        path: path,
        namefile: path.split("/")[1],
        resolution: this.resolution,
        description: "",
        time: this.time,
        textfull: "",
        textshort: "",
        urllink: "",
      };

      if (this.infoClasse == -1) {
        this.infoClasse = 1;
        auxinformationitem.auxinfo =
          `http://127.0.0.1:8000/informationitemtype/` + this.infoClasse + "/";
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
          nameinformationitem: "video_" + vm.videoObject.name,
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
          await axios
            .put(vm.mobilemedia.fk_informationitem, iteminfo, {
              auth: {
                username: "admin",
                password: "admin",
              },
            })
            .then(async function (resposta) {
              Object.assign(mobilemedia, {
                fk_informationitem: resposta.data.url,
              });
              await axios
                .put(vm.mobilemedia.url, mobilemedia, {
                  auth: {
                    username: "admin",
                    password: "admin",
                  },
                })
                .then(async function (/*resposta*/) {});
            });
        } else if (this.type === "dominio" || this.type === "modulo") {
          await axios
            .put(this.mobilemedia.url, mobilemedia, {
              auth: {
                username: "admin",
                password: "admin",
              },
            })
            .then(async function (/*resposta*/) {});
        }
      } else {
        /* CÓDIGO PARA CRIAÇÃO DO MOBILEMEDIA */
        if (this.type === "conceito") {
          /* CÓDIGO PARA CRIAÇÃO DO MOBILEMEDIA COM ITEMINFO*/
          await axios
            .post(`http://127.0.0.1:8000/informationitem/`, iteminfo, {
              auth: {
                username: "admin",
                password: "admin",
              },
            })
            .then(async function (resposta) {
              Object.assign(mobilemedia, {
                fk_informationitem: resposta.data.url,
              });
              await axios
                .post(`http://localhost:8000/mobilemedia/`, mobilemedia, {
                  auth: {
                    username: "admin",
                    password: "admin",
                  },
                })
                .then(function (/*resposta*/) {
                  /*vm.moduloTitle = resposta.data.namemodule;
                                    vm.subTitle = resposta.data.subtitle;*/
                });
            });
        } else if (this.type === "dominio" || this.type === "modulo") {
          /* CÓDIGO PARA CRIAÇÃO DO MOBILEMEDIA SEM ITEM INFO*/
          await axios
            .post(`http://localhost:8000/mobilemedia/`, mobilemedia, {
              auth: {
                username: "admin",
                password: "admin",
              },
            })
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

      if (this.videoObject) {
        await this.postMobileMedia();
        await this.$emit("close");
        await this.resetVariables();
        this.viewVideo = false;
        this.videoObject = null;
        await this.$refs.form.reset();
      } else {
        this.dialog_alert = true;
      }
    },

    async reset() {
      await this.$emit("close");
      await this.resetVariables();
      this.viewVideo = false;
      this.videoObject = null;
      await this.$refs.form.reset();
    },
    resetVariables() {
      this.infoLevel = "";
      this.infoLearning = "";
      this.infoClasse = "";
    },
    getSrcVideo() {
      if (this.mobilemedia.path) {
        var vm = this;
        firebase
          .storage()
          .ref(this.mobilemedia.path)
          .getDownloadURL()
          .then(function (url) {
            vm.viewVideoSrc = url;
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = function () {
              var blob = xhr.response;
              const file = new File([blob], vm.mobilemedia.namefile, {
                type: blob.type,
              });
              vm.videoObject = file;
            };
            xhr.open("GET", url);
            xhr.send();
          });
      }
    },
    setIconColor() {
      if (this.mobilemedia.path) {
        if (this.iconViewVideoColor === "grey") {
          this.iconViewVideoColor = "blue";
        } else {
          this.iconViewVideoColor = "grey";
        }
        this.viewVideo = !this.viewVideo;
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
