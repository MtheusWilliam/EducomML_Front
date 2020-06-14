<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:#63B0B0; color:white;">
        <span class="headline">
          <p>Importe sua imagem.</p>
        </span>
      </v-card-title>
      <v-card-text>
        <!--Formulario para adição de submódulo ou conceito-->

        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="imagemDescription"
            :rules="imagemDescriptionRules"
            label="Utilize uma descrição para a imagem"
            required
          ></v-text-field>
        </v-form>
        <v-row>
          <v-col cols="4" v-if="type==='conceito'">
            <label for="infoItemClassesSelect">Classifique o item de informação</label>
            <v-select
              id="infoItemClassesSelect"
              class="mt-5"
              v-model="infoClasse"
              :items="infoItemClasses"
              label="Classe"
              style="margin:0px;"
            ></v-select>
          </v-col>

          <v-col cols="4">
            <label for="infoItemLevelsSelect">Qual o nível de dificuldade deste conteúdo?</label>
            <v-select
              class="mt-5"
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
          label="UPLOAD IMAGE"
          filled
          v-model="imagemObject"
          accept="image/*"
          prepend-icon="mdi-camera"
        ></v-file-input>
        <v-spacer></v-spacer>
        <label class="mr-2" for="viewImageIconId">Visualizar Imagem</label>
        <v-icon
          id="viewImageIconId"
          :color="iconViewImageColor"
          icon
          @click="setIconColor()"
          v-if="mobilemedia"
        >mdi-eye</v-icon>

        <v-img class="mt-3" v-bind:src="viewImageSrc" v-if="viewImage"></v-img>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" height="49" dark large @click="reset()">
          Close
          <v-icon dark right>mdi-close</v-icon>
        </v-btn>
        <v-btn color="success" height="49" dark large @click="validate()">
          Save
          <v-icon dark right>mdi-content-save</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import * as firebase from "firebase";
import axios from "axios";
import Cookie from "js-cookie";

export default {
  name: "ImageDialog",
  props: ["optionCall", "type", "domain", "dialog", "mobilemedia"],
  data: () => ({
    valid: true,
    viewImage: false,
    viewImageSrc: "",
    iconViewImageColor: "grey",
    urlDownload: "",
    infoLevel: "",
    infoLearning: "",
    infoClasse: "",
    infoItemClasses: ["Conceito", "Princípio", "Fato"],
    infoItemLevels: ["0 - Inicial", "1 - Fácil", "2 - Médio", "3 - Difícil"],
    infoItemLearningStyles: ["Visual", "Textual"],
    infoResume: "",
    imagemDescription: "",
    imagemObject: {},
    imagemDescriptionRules: [
      v => !!v || "É necessário descrever a imagem a ser inserida",
      v =>
        (v && v.length <= 50) ||
        "A descrição da imagem deve ter no máximo 50 caracteres"
    ]
  }),
  watch: {
    dialog: function() {
      if (this.mobilemedia) {
        var vm = this;
        this.$nextTick(function() {
          if (vm.mobilemedia.path !== null) {
            vm.imagemDescription = this.mobilemedia.description;
          }
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
              "X-CSRFTOKEN": csrftoken
            };
            axios
              .patch(
                vm.mobilemedia.fk_informationitem,
                {
                  headers: headers
                },
                {
                  auth: {
                    username: "admin",
                    password: "admin"
                  }
                }
              )
              .then(function(resposta) {
                vm.infoClasse =
                  vm.infoItemClasses[
                    resposta.data.fk_informationitemtype.split("/")[4]
                  ];
              });
          }
        });
        vm.getSrcImage();
      } else {
        vm.viewImageSrc = "";
      }
    }
  },
  methods: {
    async postMobileMedia() {
      var auxinformationitem = {
        auxinfo:
          `http://127.0.0.1:8000/informationitemtype/` + this.infoClasse + "/"
      };
      var vm = this;
      var path = Date.now().toString();
      await firebase
        .storage()
        .ref()
        .child(this.domain.idknowledgedomain.toString())
        .child(path)
        .put(this.imagemObject);
      var mobilemedia = {
        label: this.imagemDescription,
        fk_idmediatype: "http://localhost:8000/mediatype/1/",
        path: this.domain.idknowledgedomain.toString() + "/" + path,
        namefile: this.imagemObject.name,
        resolution: "",
        description: this.imagemDescription,
        time: null,
        textfull: null,
        textshort: null,
        urllink: null
      };

      if (this.infoClasse == -1) {
        this.infoClasse = 1;
        auxinformationitem.auxinfo =
          `http://127.0.0.1:8000/informationitemtype/` + this.infoClasse + "/";
      }

      if (this.infoLevel > -1) {
        Object.assign(mobilemedia, {
          difficultyLevel: this.infoLevel
        });
      }

      if (this.infoLearning > -1) {
        Object.assign(mobilemedia, {
          learningStyle: this.infoLearning
        });
      }

      if (this.type === "conceito") {
        var iteminfo = {
          nameinformationitem: "imagem_" + vm.imagemObject.name,
          fk_informationitemtype: auxinformationitem.auxinfo,
          fk_idconcept: this.optionCall.url
        };
        Object.assign(mobilemedia, {
          fk_idconcept: this.optionCall.url
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
      this.infoLearning = this.infoItemLearningStyles.findIndex(function(
        value
      ) {
        return value === vm.infoLearning;
      });

      await this.postMobileMedia();
      await this.$emit("close");
      await this.$refs.form.reset();
    },
    reset() {
      this.$emit("close");
      this.imagemObject = {};
      this.$refs.form.reset();
    },
    getSrcImage() {
      if (this.mobilemedia.path) {
        var vm = this;
        firebase
          .storage()
          .ref(this.mobilemedia.path)
          .getDownloadURL()
          .then(function(url) {
            vm.viewImageSrc = url;
          });
      }
    },
    setIconColor() {
      if (this.mobilemedia.path) {
        if (this.iconViewImageColor === "grey") {
          this.iconViewImageColor = "blue";
        } else {
          this.iconViewImageColor = "grey";
        }
        this.viewImage = !this.viewImage;
        /*firebase
          .storage()
          .ref(this.mobilemedia.path)
          .getDownloadURL()
          .then(function(url) {
            window.open(url, "_blank");
          });*/
      }
    }
  }
};
</script>
