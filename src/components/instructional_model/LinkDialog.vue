<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:#63B0B0; color:white;">
        <span class="headline">
          <p>Insira seu link aqui.</p>
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="3" v-if="type==='conceito'">
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
            <v-col cols="3">
              <label for="infoItemExemplosSelect">Esse conteúdo se trata de um exemplo?</label>
              <v-select
                class="mt-5"
                id="infoItemExemplosSelect"
                v-model="infoExemplo"
                :items="infoItemExemplos"
                label="Resposta"
                style="margin:0px;"
              ></v-select>
            </v-col>
            <v-col cols="3">
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
            <v-col cols="3">
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
          <v-text-field v-model="linkUrl" :rules="linkUrlRules" label="Url" required></v-text-field>
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
import Cookie from "js-cookie";
export default {
  name: "LinkDialog",
  props: ["optionCall", "type", "dialog", "mobilemedia"],
  data: () => ({
    valid: true,
    linkUrl: "",
    linkUrlRules: [v => !!v || "É necessário inserir a url do seu link"],
    infoLevel: "",
    infoLearning: "",
    infoClasse: "",
    infoExemplo: "",
    infoItemExemplos: ["Sim", "Não"],
    infoItemClasses: ["Conceito", "Princípio", "Fato"],
    infoItemLevels: ["0 - Inicial", "1 - Fácil", "2 - Médio", "3 - Difícil"],
    infoItemLearningStyles: ["Visual", "Textual"]
  }),
  watch: {
    dialog: function() {
      this.getMobileMedia();
    }
  },
  mounted: function() {
    this.getMobileMedia();
  },
  methods: {
    getMobileMedia() {
      if (this.mobilemedia) {
        var vm = this;
        this.$nextTick(function() {
          if (vm.mobilemedia.urllink !== null) {
            vm.linkUrl = this.mobilemedia.urllink;
          }
          if (vm.mobilemedia.difficultyLevel !== null) {
            vm.infoLevel = vm.infoItemLevels[vm.mobilemedia.difficultyLevel];
          }
          if (vm.mobilemedia.learningStyle !== null) {
            vm.infoLearning =
              vm.infoItemLearningStyles[vm.mobilemedia.learningStyle];
          }
          if (vm.mobilemedia.fk_idinstructionalelement) {
            vm.infoExemplo = vm.infoItemExemplos[0];
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
                    resposta.data.fk_informationitemtype.split("/")[4] - 1
                  ];
              });
          }
        });
      }
    },
    async putOrPostMobileMedia() {
      var auxinformationitem = {
        auxinfo:
          `http://127.0.0.1:8000/informationitemtype/` +
          (this.infoClasse + 1) +
          "/"
      };
      var mobilemedia = {
        label: "",
        fk_idmediatype: "http://localhost:8000/mediatype/5/",
        path: "",
        namefile: "",
        resolution: "",
        description: "",
        time: null,
        textfull: "",
        textshort: "",
        urllink: this.linkUrl
      };

      var instructionalelement = {
        label: "Exemplo",
        fk_instructionalelementtype: `http://127.0.0.1:8000/instrucelementtype/4/`
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
          nameinformationitem: "url_",
          fk_informationitemtype: auxinformationitem.auxinfo,
          fk_idconcept: this.optionCall.url
        };
        if (this.infoExemplo) {
          Object.assign(instructionalelement, {
            fk_idconcept: this.optionCall.url
          });
        }
        Object.assign(mobilemedia, {
          fk_idconcept: this.optionCall.url
        });
      } else if (this.type === "dominio") {
        if (this.infoExemplo) {
          Object.assign(instructionalelement, {
            fk_idknowledgedomain: this.optionCall.url
          });
        }
        Object.assign(mobilemedia, {
          fk_idknowledgedomain: this.optionCall.url
        });
      } else if (this.type === "modulo") {
        if (this.infoExemplo) {
          Object.assign(instructionalelement, {
            fk_idmodule: this.optionCall.url
          });
        }
        Object.assign(mobilemedia, {
          fk_module: this.optionCall.url
        });
      }
      /* CÓDIGO PARA EDIÇÃO DO MOBILEMEDIA */
      if (this.mobilemedia) {
        var vm = this;
        if (vm.mobilemedia.fk_idinstructionalelement && !vm.infoExemplo) {
          await Object.assign(mobilemedia, {
            fk_idinstructionalelement: null
          });
        }
        if (
          !vm.mobilemedia.fk_idinstructionalelement &&
          vm.infoExemplo === vm.infoItemExemplos[0]
        ) {
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
              Object.assign(mobilemedia, {
                fk_idinstructionalelement: resposta.data.url
              });
            });
        }
        if (this.type === "conceito") {
          await axios
            .put(vm.mobilemedia.fk_informationitem, iteminfo, {
              auth: {
                username: "admin",
                password: "admin"
              }
            })
            .then(async function(resposta) {
              Object.assign(mobilemedia, {
                fk_informationitem: resposta.data.url
              });
              await axios
                .put(vm.mobilemedia.url, mobilemedia, {
                  auth: {
                    username: "admin",
                    password: "admin"
                  }
                })
                .then(async function(/*resposta*/) {
                  if (
                    vm.mobilemedia.fk_idinstructionalelement &&
                    !vm.infoExemplo
                  ) {
                    await axios.delete(
                      vm.mobilemedia.fk_idinstructionalelement,
                      {
                        auth: {
                          username: "admin",
                          password: "admin"
                        }
                      }
                    );
                  }
                });
            });
        } else if (this.type === "dominio" || this.type === "modulo") {
          await axios
            .put(this.mobilemedia.url, mobilemedia, {
              auth: {
                username: "admin",
                password: "admin"
              }
            })
            .then(async function(/*resposta*/) {
              if (vm.mobilemedia.fk_idinstructionalelement && !vm.infoExemplo) {
                await axios.delete(vm.mobilemedia.fk_idinstructionalelement, {
                  auth: {
                    username: "admin",
                    password: "admin"
                  }
                });
              }
            });
        }
      } else {
        /* CÓDIGO PARA CRIAÇÃO DO MOBILEMEDIA */
        if (this.type === "conceito") {
          /* CÓDIGO PARA CRIAÇÃO DO MOBILEMEDIA COM ITEMINFO*/
          if (this.infoExemplo) {
            /* CÓDIGO PARA CRIAÇÃO DO MOBILEMEDIA COM ITEM INFO E COM ELEMENTO INSTRUCIONAL*/
            await axios
              .post(`http://127.0.0.1:8000/informationitem/`, iteminfo, {
                auth: {
                  username: "admin",
                  password: "admin"
                }
              })
              .then(async function(resposta) {
                Object.assign(instructionalelement, {
                  fk_informationitem: resposta.data.url
                });
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
                  .then(async function(resposta2) {
                    Object.assign(mobilemedia, {
                      fk_informationitem: resposta.data.url,
                      fk_idinstructionalelement: resposta2.data.url
                    });
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
                  });
              });
          } else {
            /* CÓDIGO PARA CRIAÇÃO DO MOBILEMEDIA COM ITEM INFO E SEM ELEMENTO INSTRUCIONAL*/
            await axios
              .post(`http://127.0.0.1:8000/informationitem/`, iteminfo, {
                auth: {
                  username: "admin",
                  password: "admin"
                }
              })
              .then(async function(resposta) {
                Object.assign(mobilemedia, {
                  fk_informationitem: resposta.data.url
                });
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
              });
          }
        } else if (this.type === "dominio" || this.type === "modulo") {
          /* CÓDIGO PARA CRIAÇÃO DO MOBILEMEDIA SEM ITEM INFO*/
          if (this.infoExemplo) {
            /* CÓDIGO PARA CRIAÇÃO DO MOBILEMEDIA SEM ITEM INFO E COM ELEMENTO INSTRUCIONAL*/
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
                Object.assign(mobilemedia, {
                  fk_idinstructionalelement: resposta.data.url
                });
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
              });
          } else {
            /* CÓDIGO PARA CRIAÇÃO DO MOBILEMEDIA SEM ITEM INFO E SEM ELEMENTO INSTRUCIONAL*/
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
        }
      }
    },
    async validate() {
      var vm = this;
      if (this.$refs.form.validate()) {
        await this.$refs.form.validate();
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
        if (this.infoExemplo === this.infoItemExemplos[1]) {
          this.infoExemplo = "";
        }
        await this.putOrPostMobileMedia();
        await this.$emit("close");
        await this.$refs.form.reset();
        await this.resetVariables();
      }
    },
    resetVariables() {
      this.linkUrl = "";
      this.infoClasse = "";
      this.infoLevel = "";
      this.infoLearning = "";
      this.infoExemplo = "";
    },
    async reset() {
      await this.$emit("close");
      await this.$refs.form.reset();
      await this.resetVariables();
    }
  }
};
</script>
