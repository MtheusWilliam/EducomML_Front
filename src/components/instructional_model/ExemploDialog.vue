<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:#63B0B0; color:white;">
        <v-col>
          <span class="headline">
            <p>Defina o exemplo</p>
          </span>
        </v-col>
        <v-col cols="7" class="pl-11" style="margin-right: -16px;">
          <v-spacer></v-spacer>
          <v-menu
            top="top"
            width="300px"
            origin="center center"
            :offset-y="true"
            transition="scale-transition"
          >
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" large color="primary" style="color:white;" class="mb-3">
                <strong>Adicionar MobileMedia</strong>
                <v-icon class="ml-2" large color="white">mdi-plus-box</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="(item, i) in itemsMobileMedia"
                :key="i"
                @click="addMobileMedia(i+1)"
              >
                <v-icon x-large color="blue">{{item.icon}}</v-icon>
                <v-list-item-title style="font-size: 1.2em; color:#2196F3;" class="ml-1">
                  <strong>{{item.name}}</strong>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn color="red" dark large @click="reset()" class="ml-2 mb-3">
            Close
            <v-icon dark right>mdi-close</v-icon>
          </v-btn>
          <v-btn color="success" dark large @click="validate()" class="ml-2 mb-3">
            Save
            <v-icon dark right>mdi-content-save</v-icon>
          </v-btn>
        </v-col>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation class="mt-3">
          <label class="pt-2" style="font-size:1.3em;" for="avaliacaoNameArea">
            <strong>Identificador do exemplo:</strong>
          </label>
          <v-text-field
            id="exemploNameArea"
            v-model="exemploName"
            :counter="100"
            :rules="exemploNameRules"
            required
            class="mt-2 mb-4"
          ></v-text-field>
          <div v-if="mobileMediasControl.length > 0">
            <label class="mb-6 pt-2" style="font-size:1.3em;">
              <strong>MobileMedias do exemplo:</strong>
            </label>
            <div class="mt-8"></div>
            <div v-for="(mobilemedia,i) in mobileMediasControl" :key="i">
              <v-row v-if="mobilemedia.type === 1">
                <v-spacer></v-spacer>
                <v-file-input
                  style="width: 165px;"
                  label="UPLOAD IMAGE"
                  filled
                  @change="atualizaMeta"
                  v-model="mobilemedia.object"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                ></v-file-input>
                <v-btn icon="icon" class="mt-2 ml-3">
                  <v-icon x-large color="red" @click="deleteMobileMedia(i)">mdi-minus-box</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
              </v-row>
              <v-row v-if="mobilemedia.type === 2">
                <v-spacer></v-spacer>
                <v-file-input
                  style="width: 165px;"
                  label="UPLOAD VIDEO"
                  filled
                  @change="atualizaMeta"
                  v-model="mobilemedia.object"
                  accept="video/*"
                  prepend-icon="mdi-video"
                ></v-file-input>
                <v-btn icon="icon" class="mt-2 ml-3">
                  <v-icon x-large color="red" @click="deleteMobileMedia(i)">mdi-minus-box</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
              </v-row>
              <v-row v-if="mobilemedia.type === 3">
                <v-spacer></v-spacer>
                <v-file-input
                  style="width: 165px;"
                  label="UPLOAD AUDIO"
                  filled
                  v-model="mobilemedia.object"
                  accept="audio/*"
                  prepend-icon="mdi-file-music"
                ></v-file-input>
                <v-btn icon="icon" class="mt-2 ml-3">
                  <v-icon x-large color="red" @click="deleteMobileMedia(i)">mdi-minus-box</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
              </v-row>
              <v-row v-if="mobilemedia.type === 5" class="mb-2">
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="mobilemedia.object"
                  :rules="linkUrlRules"
                  label="Url"
                  required
                ></v-text-field>
                <v-btn icon="icon" class="mt-2 ml-3">
                  <v-icon x-large color="red" @click="deleteMobileMedia(i)">mdi-minus-box</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
              </v-row>
            </div>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-menu
          top="top"
          width="300px"
          origin="center center"
          :offset-y="true"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" large color="primary" style="color:white;">
              <strong>Adicionar MobileMedia</strong>
              <v-icon class="ml-2" large color="white">mdi-plus-box</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(item, i) in itemsMobileMedia"
              :key="i"
              @click="addMobileMedia(i+1)"
            >
              <v-icon x-large color="blue">{{item.icon}}</v-icon>
              <v-list-item-title style="font-size: 1.2em; color:#2196F3;" class="ml-1">
                <strong>{{item.name}}</strong>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
    <div class="text-center">
      <v-dialog v-model="dialog_alert" width="500">
        <v-card>
          <v-card-title class="headline red" primary-title style="color:white;">ALERTA!</v-card-title>
          <v-card-text
            class="mt-3"
            style="font-size: 1.3em;"
          >Para criar uma avaliação, é necessário criar pelo uma questão.</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog_alert = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="text-center">
      <v-dialog v-model="dialog_alert2" width="500">
        <v-card>
          <v-card-title class="headline red" primary-title style="color:white;">ALERTA!</v-card-title>
          <v-card-text class="mt-3" style="font-size: 1.3em;">
            Questões objetivas necessitam de pelo menos uma alternativa correta.
            <br />
            Ajuste a questão {{questionAjust}}.
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog_alert2 = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="text-center">
      <v-dialog v-model="dialog_alert3" width="500">
        <v-card>
          <v-card-title class="headline red" primary-title style="color:white;">ALERTA!</v-card-title>
          <v-card-text class="mt-3" style="font-size: 1.3em;">
            Questões objetivas necessitam de pelo menos uma alternativa.
            <br />
            Ajuste a questão {{questionAjust}}.
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog_alert3 = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import * as firebase from "firebase";
export default {
  name: "ExemploDialog",
  props: [
    "instrucOptionCall",
    "instrucType",
    "instrucValueType",
    "domain",
    "dialog",
    "concept",
    "module",
    "instructionalelement"
  ],
  data: () => ({
    valid: true,
    dialog_alert: false,
    dialog_alert2: false,
    dialog_alert3: false,
    itemsMobileMedia: [
      {
        icon: "mdi-file-image",
        name: "Imagem"
      },
      {
        icon: "mdi-file-video",
        name: "Video"
      },
      {
        icon: "mdi-file-music",
        name: "Audio"
      },
      {
        icon: "mdi-link-variant",
        name: "Link"
      }
    ],
    linkUrlRules: [v => !!v || "É necessário inserir a url do seu link"],
    exemploName: "",
    avaliacaoNameRules: [
      v => !!v || "É necessário descrever um identificador para o exemplo",
      v =>
        (v && v.length <= 100) ||
        "Nome do identificador do exemplo deve ter no máximo 100 caracteres"
    ],
    mobileMediasControl: []
  }),
  watch: {
    dialog: async function() {
      this.getExemplo();
    }
  },
  mounted: function() {
    this.getExemplo();
    this.$refs.form.resetValidation();
  },
  methods: {
    async getExemplo() {
      if (this.instructionalelement) {
        var vm = this;
        this.$nextTick(function() {
          this.avaliacaoName = this.instructionalelement.label;
        });
        this.mobileMediasControl = [];
        if (this.instructionalelement !== "") {
          if (this.instructionalelement.mobilemedias.length > 0) {
            await this.instructionalelement.mobilemedias.forEach(async function(
              elementMobile,
              indexMobile
            ) {
              if (elementMobile.fk_idmediatype.split("/")[4] === "1") {
                vm.getSrcImage(
                  indexMobile,
                  elementMobile.path,
                  elementMobile.namefile
                );
                await vm.mobileMediasControl.push({
                  type: parseInt(elementMobile.fk_idmediatype.split("/")[4]),
                  object: null,
                  resolution: elementMobile.resolution,
                  path: elementMobile.path,
                  namefile: elementMobile.namefile,
                  url: elementMobile.url
                });
              } else if (elementMobile.fk_idmediatype.split("/")[4] === "2") {
                vm.getSrcVideo(
                  indexMobile,
                  elementMobile.path,
                  elementMobile.namefile
                );
                await vm.mobileMediasControl.push({
                  type: parseInt(elementMobile.fk_idmediatype.split("/")[4]),
                  object: null,
                  resolution: elementMobile.resolution,
                  time: elementMobile.time,
                  path: elementMobile.path,
                  namefile: elementMobile.namefile,
                  url: elementMobile.url
                });
              } else if (elementMobile.fk_idmediatype.split("/")[4] === "3") {
                vm.getSrcAudio(
                  indexMobile,
                  elementMobile.path,
                  elementMobile.namefile
                );
                await vm.mobileMediasControl.push({
                  type: parseInt(elementMobile.fk_idmediatype.split("/")[4]),
                  object: null,
                  path: elementMobile.path,
                  namefile: elementMobile.namefile,
                  url: elementMobile.url
                });
              } else if (elementMobile.fk_idmediatype.split("/")[4] === "5") {
                await vm.mobileMediasControl.push({
                  type: parseInt(elementMobile.fk_idmediatype.split("/")[4]),
                  object: elementMobile.urllink,
                  url: elementMobile.url
                });
              }
            });
          }
        }
      } else {
        this.mobileMediasControl = [];
        this.resetValidation();
        this.resetVariables();
      }
    },
    async postQuestions() {
      var instructionalelement = {
        label: this.avaliacaoName,
        fk_instructionalelementtype:
          `http://127.0.0.1:8000/instrucelementtype/` +
          this.instrucValueType +
          `/`
      };
      var vm = this;
      var auxPath = "";
      if (this.mobileMediasControl) {
        this.mobileMediasControl.forEach(async mobilemedia => {
          if (mobilemedia.url) {
            if (mobilemedia.type !== 5) {
              firebase
                .storage()
                .ref()
                .child(mobilemedia.path)
                .put(mobilemedia.object);
            }
          } else {
            auxPath =
              vm.domain.idknowledgedomain.toString() +
              "/" +
              (await setTimeout(async function() {
                await Date.now().toString();
              }, 1));
            if (mobilemedia.type !== 5) {
              firebase
                .storage()
                .ref()
                .child(auxPath)
                .put(mobilemedia.object);

              mobilemedia.path = auxPath;
            }
          }
        });
      }

      if (this.instrucType === "dominio") {
        Object.assign(instructionalelement, {
          fk_idknowledgedomain: this.instrucOptionCall.url
        });
      } else if (this.instrucType === "modulo") {
        Object.assign(instructionalelement, {
          fk_idmodule: this.instrucOptionCall.url
        });
      } else if (this.instrucType === "conceito") {
        Object.assign(instructionalelement, {
          fk_idconcept: this.instrucOptionCall.url
        });
      }
      if (this.instructionalelement) {
        /* CÓDIGO PARA EDIÇÃO DA AVALIAÇÃO/EXERCÍCIO */
        await axios
          .put(vm.instructionalelement.url, instructionalelement, {
            auth: {
              username: "admin",
              password: "admin"
            }
          })
          .then(async function(resposta) {
            if (vm.mobileMediasControl) {
              var i = 0;
              await vm.mobileMediasControl.forEach(async function(
                mobilemedia,
                indexmobile
              ) {
                /* DANDO PUT NOS MOBILEMEDIAS QUE POSSUEM URL*/
                if (mobilemedia.url) {
                  if (mobilemedia.type === 1) {
                    await axios.put(
                      mobilemedia.url,
                      {
                        label: "Imagem " + (indexmobile + 1),
                        fk_idmediatype:
                          "http://localhost:8000/mediatype/" +
                          mobilemedia.type +
                          "/",
                        path: mobilemedia.path,
                        resolution: mobilemedia.resolution,
                        namefile: mobilemedia.namefile,
                        description:
                          "Imagem " +
                          (indexmobile + 1) +
                          " " +
                          resposta.data.label,
                        time: null,
                        textfull: null,
                        textshort: null,
                        urllink: null,
                        difficultyLevel: null,
                        learningStyle: null,
                        fk_idinstructionalelement: resposta.data.url
                      },
                      {
                        auth: {
                          username: "admin",
                          password: "admin"
                        }
                      }
                    );
                  } else if (mobilemedia.type === 2) {
                    await axios.put(
                      mobilemedia.url,
                      {
                        label: "Video " + (indexmobile + 1),
                        fk_idmediatype:
                          "http://localhost:8000/mediatype/" +
                          mobilemedia.type +
                          "/",
                        path: mobilemedia.path,
                        resolution: mobilemedia.resolution,
                        namefile: mobilemedia.namefile,
                        description: null,
                        time: mobilemedia.time,
                        textfull: null,
                        textshort: null,
                        urllink: null,
                        difficultyLevel: null,
                        learningStyle: null,
                        fk_idinstructionalelement: resposta.data.url
                      },
                      {
                        auth: {
                          username: "admin",
                          password: "admin"
                        }
                      }
                    );
                  } else if (mobilemedia.type === 3) {
                    await axios.put(
                      mobilemedia.url,
                      {
                        label: "Audio " + (indexmobile + 1),
                        fk_idmediatype:
                          "http://localhost:8000/mediatype/" +
                          mobilemedia.type +
                          "/",
                        path: mobilemedia.path,
                        resolution: null,
                        namefile: mobilemedia.namefile,
                        description: null,
                        time: null,
                        textfull: null,
                        textshort: null,
                        urllink: null,
                        difficultyLevel: null,
                        learningStyle: null,
                        fk_idinstructionalelement: resposta.data.url
                      },
                      {
                        auth: {
                          username: "admin",
                          password: "admin"
                        }
                      }
                    );
                  } else if (mobilemedia.type === 5) {
                    await axios.put(
                      mobilemedia.url,
                      {
                        label: "Link " + (indexmobile + 1),
                        fk_idmediatype:
                          "http://localhost:8000/mediatype/" +
                          mobilemedia.type +
                          "/",
                        path: null,
                        resolution: null,
                        namefile: null,
                        description: null,
                        time: null,
                        textfull: null,
                        textshort: null,
                        urllink: mobilemedia.object,
                        difficultyLevel: null,
                        learningStyle: null,
                        fk_idinstructionalelement: resposta.data.url
                      },
                      {
                        auth: {
                          username: "admin",
                          password: "admin"
                        }
                      }
                    );
                  }
                } else {
                  /* DANDO POST NOS MOBILEMEDIAS QUE NÃO POSSUEM URL*/
                  if (mobilemedia.type === 1) {
                    await axios.post(
                      `http://localhost:8000/mobilemedia/`,
                      {
                        label: "Imagem " + (indexmobile + 1),
                        fk_idmediatype:
                          "http://localhost:8000/mediatype/" +
                          mobilemedia.type +
                          "/",
                        path: mobilemedia.path,
                        resolution: mobilemedia.resolution,
                        namefile: mobilemedia.path.split("/")[1],
                        description:
                          "Imagem " +
                          (indexmobile + 1) +
                          " " +
                          resposta.data.label,
                        time: null,
                        textfull: null,
                        textshort: null,
                        urllink: null,
                        difficultyLevel: null,
                        learningStyle: null,
                        fk_idinstructionalelement: resposta.data.url
                      },
                      {
                        auth: {
                          username: "admin",
                          password: "admin"
                        }
                      }
                    );
                  } else if (mobilemedia.type === 2) {
                    console.log("i", i);
                    await axios.post(
                      `http://localhost:8000/mobilemedia/`,
                      {
                        label: "Video " + (indexmobile + 1),
                        fk_idmediatype:
                          "http://localhost:8000/mediatype/" +
                          mobilemedia.type +
                          "/",
                        path: mobilemedia.path,
                        resolution: mobilemedia.resolution,
                        namefile: mobilemedia.path.split("/")[1],
                        description: null,
                        time: mobilemedia.time,
                        textfull: null,
                        textshort: null,
                        urllink: null,
                        difficultyLevel: null,
                        learningStyle: null,
                        fk_idinstructionalelement: resposta.data.url
                      },
                      {
                        auth: {
                          username: "admin",
                          password: "admin"
                        }
                      }
                    );
                  } else if (mobilemedia.type === 3) {
                    await axios.post(
                      `http://localhost:8000/mobilemedia/`,
                      {
                        label: "Audio " + (indexmobile + 1),
                        fk_idmediatype:
                          "http://localhost:8000/mediatype/" +
                          mobilemedia.type +
                          "/",
                        path: mobilemedia.path,
                        resolution: null,
                        namefile: mobilemedia.path.split("/")[1],
                        description: null,
                        time: null,
                        textfull: null,
                        textshort: null,
                        urllink: null,
                        difficultyLevel: null,
                        learningStyle: null,
                        fk_idinstructionalelement: resposta.data.url
                      },
                      {
                        auth: {
                          username: "admin",
                          password: "admin"
                        }
                      }
                    );
                  } else if (mobilemedia.type === 5) {
                    await axios.post(
                      `http://localhost:8000/mobilemedia/`,
                      {
                        label: "Link " + (indexmobile + 1),
                        fk_idmediatype:
                          "http://localhost:8000/mediatype/" +
                          mobilemedia.type +
                          "/",
                        path: null,
                        resolution: null,
                        namefile: null,
                        description: null,
                        time: null,
                        textfull: null,
                        textshort: null,
                        urllink: mobilemedia.object,
                        difficultyLevel: null,
                        learningStyle: null,
                        fk_idinstructionalelement: resposta.data.url
                      },
                      {
                        auth: {
                          username: "admin",
                          password: "admin"
                        }
                      }
                    );
                  }
                }
              });
            }
          });
      } else {
        /* CÓDIGO PARA CRIAÇÃO DA AVALIAÇÃO/EXERCÍCIO */
        await axios
          .post(
            `http://127.0.0.1:8000/instructionalelement/`,
            instructionalelement,
            {
              auth: {
                username: "admin",
                password: "admin"
              }
            }
          )
          .then(async function(resposta) {
            if (vm.mobileMediasControl) {
              /* INSERÇÃO DOS MOBILEMEDIAS DA AVALIAÇÃO/EXERCÍCIO */
              await vm.mobileMediasControl.forEach(async function(
                mobilemedia,
                indexmobile
              ) {
                if (mobilemedia.type === 1) {
                  await axios.post(
                    `http://localhost:8000/mobilemedia/`,
                    {
                      label: "Imagem " + (indexmobile + 1),
                      fk_idmediatype:
                        "http://localhost:8000/mediatype/" +
                        mobilemedia.type +
                        "/",
                      path: mobilemedia.path,
                      resolution: mobilemedia.resolution,
                      namefile: mobilemedia.path.split("/")[1],
                      description:
                        "Imagem " +
                        (indexmobile + 1) +
                        " " +
                        resposta.data.label,
                      time: null,
                      textfull: null,
                      textshort: null,
                      urllink: null,
                      difficultyLevel: null,
                      learningStyle: null,
                      fk_idinstructionalelement: resposta.data.url
                    },
                    {
                      auth: {
                        username: "admin",
                        password: "admin"
                      }
                    }
                  );
                } else if (mobilemedia.type === 2) {
                  await axios.post(
                    `http://localhost:8000/mobilemedia/`,
                    {
                      label: "Video " + (indexmobile + 1),
                      fk_idmediatype:
                        "http://localhost:8000/mediatype/" +
                        mobilemedia.type +
                        "/",
                      path: mobilemedia.path,
                      resolution: mobilemedia.resolution,
                      namefile: mobilemedia.path.split("/")[1],
                      description: null,
                      time: mobilemedia.time,
                      textfull: null,
                      textshort: null,
                      urllink: null,
                      difficultyLevel: null,
                      learningStyle: null,
                      fk_idinstructionalelement: resposta.data.url
                    },
                    {
                      auth: {
                        username: "admin",
                        password: "admin"
                      }
                    }
                  );
                } else if (mobilemedia.type === 3) {
                  await axios.post(
                    `http://localhost:8000/mobilemedia/`,
                    {
                      label: "Audio " + (indexmobile + 1),
                      fk_idmediatype:
                        "http://localhost:8000/mediatype/" +
                        mobilemedia.type +
                        "/",
                      path: mobilemedia.path,
                      resolution: null,
                      namefile: mobilemedia.path.split("/")[1],
                      description: null,
                      time: null,
                      textfull: null,
                      textshort: null,
                      urllink: null,
                      difficultyLevel: null,
                      learningStyle: null,
                      fk_idinstructionalelement: resposta.data.url
                    },
                    {
                      auth: {
                        username: "admin",
                        password: "admin"
                      }
                    }
                  );
                } else if (mobilemedia.type === 5) {
                  await axios.post(
                    `http://localhost:8000/mobilemedia/`,
                    {
                      label: "Link " + (indexmobile + 1),
                      fk_idmediatype:
                        "http://localhost:8000/mediatype/" +
                        mobilemedia.type +
                        "/",
                      path: null,
                      resolution: null,
                      namefile: null,
                      description: null,
                      time: null,
                      textfull: null,
                      textshort: null,
                      urllink: mobilemedia.object,
                      difficultyLevel: null,
                      learningStyle: null,
                      fk_idinstructionalelement: resposta.data.url
                    },
                    {
                      auth: {
                        username: "admin",
                        password: "admin"
                      }
                    }
                  );
                }
              });
            }
          });
      }
    },
    addMobileMedia(mobileMediaType) {
      if (mobileMediaType === 1) {
        this.mobileMediasControl.push({
          type: mobileMediaType,
          object: null,
          resolution: null,
          path: null,
          namefile: null,
          url: null
        });
      } else if (mobileMediaType === 2) {
        this.mobileMediasControl.push({
          type: mobileMediaType,
          object: null,
          resolution: null,
          time: null,
          path: null,
          namefile: null,
          url: null
        });
      } else if (mobileMediaType === 3) {
        this.mobileMediasControl.push({
          type: mobileMediaType,
          object: null,
          path: null,
          namefile: null,
          url: null
        });
      } else if (mobileMediaType === 4) {
        this.mobileMediasControl.push({
          type: mobileMediaType + 1,
          object: null,
          url: null
        });
      }
    },
    async deleteMobileMedia(idMobileMedia) {
      if (this.mobileMediasControl[idMobileMedia].url) {
        if (this.mobileMediasControl[idMobileMedia].type !== 5) {
          await firebase
            .storage()
            .ref()
            .child(this.mobileMediasControl[idMobileMedia].path)
            .delete();
        }
        await axios.delete(this.mobileMediasControl[idMobileMedia].url, {
          auth: {
            username: "admin",
            password: "admin"
          }
        });
      }
      if (idMobileMedia == 0) {
        this.mobileMediasControl.shift();
      } else {
        this.mobileMediasControl.splice(idMobileMedia, 1);
      }
    },
    atualizaMeta() {
      if (this.mobileMediasControl.length > 0) {
        this.mobileMediasControl.forEach(mobilemedia => {
          if (mobilemedia.object && !mobilemedia.url) {
            if (mobilemedia.type === 1) {
              var img = new Image();
              img.src = URL.createObjectURL(mobilemedia.object);
              img.onload = function() {
                mobilemedia.resolution = img.width + "X" + img.height;
              };
            } else if (mobilemedia.type === 2) {
              var video = document.createElement("video");
              var source = document.createElement("source");
              source.setAttribute(
                "src",
                URL.createObjectURL(mobilemedia.object)
              );
              video.appendChild(source);
              video.oncanplay = function() {
                mobilemedia.resolution =
                  video.videoWidth + "X" + video.videoHeight;
                mobilemedia.time = video.duration;
              };
            }
          }
        });
      }
    },
    async getSrcImage(indexMobile, path, namefile) {
      /*var obj = {};*/
      if (path) {
        var vm = this;
        await firebase
          .storage()
          .ref(path)
          .getDownloadURL()
          .then(function(url) {
            /*vm.viewImageSrc = url;*/
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = function() {
              var blob = xhr.response;
              var file = new File([blob], namefile, {
                type: blob.type
              });
              // vm.auxGetSrc.push(file);
              vm.atualizaObj(file, indexMobile);
            };
            xhr.open("GET", url);
            xhr.send();
          });
      }
    },
    async getSrcVideo(indexMobile, path, namefile) {
      /*var obj = {};*/
      if (path) {
        var vm = this;
        await firebase
          .storage()
          .ref(path)
          .getDownloadURL()
          .then(function(url) {
            /*vm.viewVideoSrc = url;*/
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = function() {
              var blob = xhr.response;
              var file = new File([blob], namefile, {
                type: blob.type
              });
              // vm.auxGetSrc.push(file);
              vm.atualizaObj(file, indexMobile);
            };
            xhr.open("GET", url);
            xhr.send();
          });
      }
    },
    async getSrcAudio(indexMobile, path, namefile) {
      /*var obj = {};*/
      if (path) {
        var vm = this;
        await firebase
          .storage()
          .ref(path)
          .getDownloadURL()
          .then(function(url) {
            /*vm.viewAudioSrc = url;*/
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = function() {
              var blob = xhr.response;
              var file = new File([blob], namefile, {
                type: blob.type
              });
              // vm.auxGetSrc.push(file);
              vm.atualizaObj(file, indexMobile);
            };
            xhr.open("GET", url);
            xhr.send();
          });
      }
    },
    atualizaObj(file, indexMobile) {
      this.mobileMediasControl[indexMobile].object = file;
    },

    async validate() {
      if (this.$refs.form.validate()) {
        await this.postQuestions();
        this.mobileMediasControl = [];
        await this.$emit("instrucclose");
        await this.resetVariables();
      } else {
        this.dialog_alert = true;
      }
    },
    resetVariables() {
      this.mobileMediasControl = [];
      this.exemploName = "";
    },
    async reset() {
      await this.$emit("instrucclose");
      await this.resetVariables();
      this.mobileMediasControl = [];
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>
