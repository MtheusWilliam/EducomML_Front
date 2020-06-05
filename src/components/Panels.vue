<template>
  <v-row>
    <!--Panel do Domínio-->
    <v-expansion-panels>
      <v-expansion-panel v-for="(item,i) in 1" :key="i">
        <v-expansion-panel-header color="purple" style="color:white;">
          <v-row>
            <v-col cols="9">
              <p>
                [Dominio]
                {{ dominio_data.nameknowledgedomain }}
              </p>
            </v-col>
            <v-col cols="3">
              <!--Formulario para adição do módulo-->
              <v-dialog v-model="dialog_modulo" persistent="persistent" max-width="600px">
                <template v-slot:activator="{ on }">
                  <v-btn icon="icon" color="white" v-on="on">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>

                <ModuloDialog
                  :module="modulo"
                  @close_or_save="close_or_save_modulo"
                  :domain="dominio"
                  :dialog="dialog_modulo"
                />
              </v-dialog>

              <!--Formulario para edição do domínio-->
              <v-dialog v-model="dialog_dominio" persistent="persistent" max-width="600px">
                <template v-slot:activator="{ on }">
                  <v-btn icon="icon" color="white" v-on="on">
                    <v-icon>mdi-view-headline</v-icon>
                  </v-btn>
                </template>
                <!--Formulario para criação de módulo-->
                <DominioDialog
                  @close_or_save="close_or_save_dominio"
                  @dominio_data="setDomainVariables"
                  :domain="dominio_data"
                  :dialog="dialog_dominio"
                />
              </v-dialog>

              <!--Formulario para criação de submódulo-->
              <v-dialog v-model="dialog_submodulo" persistent="persistent" max-width="600px">
                <SubModuloDialog
                  :submodule="submodulo"
                  :module="modulo"
                  @close_or_save="close_or_save_submodulo "
                  :domain="dominio"
                  :dialog="dialog_submodulo"
                />
              </v-dialog>
              <!--Formulario para criação de conceito-->
              <v-dialog
                style="overflow-y:hidden; overflow-x:hidden;"
                v-model="dialog_conceito"
                persistent="persistent"
                max-width="745px"
                max-height="530px"
              >
                <ConceitoDialog
                  :concept="conceito"
                  :module="modulo"
                  @close_or_save="close_or_save_conceito"
                  :domain="dominio"
                  :dialog="dialog_conceito"
                />
              </v-dialog>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          {{ dominio_data.subtitle }}
          <!--Panels dos Módulos-->
          <v-expansion-panels
            v-for="(modulo) in dominio_data.modules"
            :key="modulo.idmodule"
            class="mt-2 mb-2"
          >
            <v-expansion-panel v-if="modulo.fk_idmodule === null">
              <v-expansion-panel-header color="primary" style="color:white;">
                <v-row>
                  <v-col cols="9">
                    <p>
                      [Modulo]
                      {{ modulo.namemodule }}
                    </p>
                  </v-col>
                  <v-col cols="3">
                    <!--Formulario para adição de submódulo ou conceito-->
                    <v-menu
                      top="top"
                      origin="center center"
                      :offset-y="true"
                      transition="scale-transition"
                    >
                      <template v-slot:activator="{ on }">
                        <v-btn icon="icon" color="white" dark="dark" v-on="on">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>

                      <v-list>
                        <v-list-item @click="setmodulo(modulo);dialog_conceito=true">
                          <v-list-item-title>Conceito</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="setmodulo(modulo);dialog_submodulo=true">
                          <v-list-item-title>Submódulo</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                    <!--Formulario para edição do modulo-->
                    <v-btn icon="icon" color="white" @click="setmodulo(modulo);dialog_modulo=true">
                      <v-icon>mdi-view-headline</v-icon>
                    </v-btn>
                    <!--Função para excluir módulo-->
                    <v-btn icon="icon" color="white" @click="deleteelemento(modulo)">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>

              <v-expansion-panel-content>
                {{ modulo.subtitle }}
                <!--Panels dos SubMódulos-->
                <v-expansion-panels
                  v-for="(submodulo) in modulo.submodules"
                  :key="submodulo.idmodule"
                  class="mt-2 mb-2"
                >
                  <v-expansion-panel>
                    <v-expansion-panel-header color="pink" style="color:white;">
                      <v-row>
                        <v-col cols="9">
                          <p>
                            [Submodulo]
                            {{ submodulo.namemodule }}
                          </p>
                        </v-col>
                        <v-col cols="3">
                          <!--Formulario para adição de conceito-->
                          <v-btn
                            icon="icon"
                            color="white"
                            @click="setmodulo(submodulo);dialog_conceito=true"
                          >
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>

                          <!--Formulario para edição do submodulo-->
                          <v-btn
                            icon="icon"
                            color="white"
                            @click="setsubmodulo(submodulo);dialog_submodulo=true"
                          >
                            <v-icon>mdi-view-headline</v-icon>
                          </v-btn>
                          <!--Função para excluir submódulo-->
                          <v-btn icon="icon" color="white" @click="deleteelemento(submodulo)">
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                      {{ submodulo.subtitle }}
                      <!--Panels dos conceitos adicionados dentro de submódulos-->
                      <v-expansion-panels
                        v-for="(conceito) in submodulo.concepts"
                        :key="conceito.idconceito"
                        class="mt-2 mb-2"
                      >
                        <v-expansion-panel>
                          <v-expansion-panel-header color="#00C853" style="color:white;">
                            <v-row>
                              <v-col cols="9">
                                <p>
                                  [Conceito]
                                  {{ conceito.nameconcept }}
                                </p>
                              </v-col>
                              <v-col cols="3">
                                <!--Formulario para adição de relacionamento-->
                                <v-btn icon="icon" color="white">
                                  <v-icon>mdi-window-restore</v-icon>
                                </v-btn>

                                <!--Formulario para edição do conceito-->
                                <v-btn
                                  icon="icon"
                                  color="white"
                                  @click="setconceito(conceito, submodulo);dialog_conceito=true"
                                >
                                  <v-icon>mdi-view-headline</v-icon>
                                </v-btn>
                                <!--Função para excluir conceito-->
                                <v-btn icon="icon" color="white" @click="deleteelemento(conceito)">
                                  <v-icon>mdi-close</v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-header>

                          <v-expansion-panel-content>
                            <p>Relacionamentos:</p>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                      <!--Panels dos SubMódulos-->
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>

                <!-- Panels dos Conceitos-->
                <v-expansion-panels
                  v-for="(conceito) in modulo.concepts"
                  :key="conceito.idconceito"
                  class="mt-2 mb-2"
                >
                  <v-expansion-panel>
                    <v-expansion-panel-header color="#00C853" style="color:white;">
                      <v-row>
                        <v-col cols="9">
                          <p>
                            [Conceito]
                            {{ conceito.nameconcept }}
                          </p>
                        </v-col>
                        <v-col cols="3">
                          <!--Formulario para edição do conceito-->
                          <v-btn
                            icon="icon"
                            color="white"
                            @click="setconceito(conceito, modulo);dialog_conceito=true"
                          >
                            <v-icon>mdi-view-headline</v-icon>
                          </v-btn>
                          <!--Função para excluir conceito-->
                          <v-btn icon="icon" color="white" @click="deleteelemento(conceito)">
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                      <h3 class="mt-2">Relacionamentos:</h3>
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">Conceito Alvo</th>
                              <th class="text-left">Nome da Relação</th>
                              <th class="text-left">Tipo da Relação</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="relacao in conceito.sourceconcept"
                              :key="relacao.idreference"
                            >
                              <td>{{findNameTarget(modulo.concepts, relacao)}}</td>
                              <td>{{relacao.namereference}}</td>
                              <td>{{findTipoRelation(relacao.fk_referencetype)}}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>

<script>
import DominioDialog from "./concept_model/DominioDialog";
import ModuloDialog from "./concept_model/ModuloDialog";
import SubModuloDialog from "./concept_model/SubModuloDialog";
import ConceitoDialog from "./concept_model/ConceitoDialog";

import axios from "axios";
import Cookie from "js-cookie";
export default {
  name: "Panels",
  components: {
    ModuloDialog,
    DominioDialog,
    SubModuloDialog,
    ConceitoDialog
  },
  props: [
    "dominio",
    "objectTreeView",
    "dialog_knowledgedomain",
    "dialog_module",
    "dialog_submodule",
    "dialog_concept"
  ],
  data: () => ({
    itemsMenuNewModulo: [
      {
        type: "Conceito"
      },
      {
        type: "Submódulo"
      }
    ],
    modulo: "",
    submodulo: "",
    conceito: "",
    dialog_modulo: false,
    dialog_submodulo: false,
    dialog_conceito: false,
    dialog_dominio: false,
    select: null,
    checkbox: false,
    /*ATRIBUTOS DO DOMINIO*/
    dominio_data: {}
  }),

  watch: {
    dominio: function() {
      this.setDomainVariables(this.dominio);
    },
    dialog_knowledgedomain: function() {
      if (this.dialog_knowledgedomain === true) {
        this.dialog_dominio = this.dialog_knowledgedomain;
      }
    },
    dialog_module: function() {
      if (this.dialog_module === true) {
        var vm = this;
        var csrftoken = Cookie.get("csrftoken");
        var headers = {
          "X-CSRFTOKEN": csrftoken
        };
        this.dialog_modulo = this.dialog_module;
        axios
          .patch(
            this.objectTreeView.url,
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
            vm.modulo = resposta.data;
          });
      }
    },
    dialog_submodule: function() {
      if (this.dialog_submodule === true) {
        var vm = this;
        var csrftoken = Cookie.get("csrftoken");
        var headers = {
          "X-CSRFTOKEN": csrftoken
        };
        this.dialog_submodulo = this.dialog_submodule;
        axios
          .patch(
            this.objectTreeView.url.substr(
              0,
              this.objectTreeView.url.length - 3
            ),
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
            vm.submodulo = resposta.data;
          });
      }
    },
    dialog_concept: function() {
      if (this.dialog_concept === true) {
        var vm = this;
        var csrftoken = Cookie.get("csrftoken");
        var headers = {
          "X-CSRFTOKEN": csrftoken
        };
        this.dialog_conceito = this.dialog_concept;
        axios
          .patch(
            this.objectTreeView.url,
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
            vm.conceito = resposta.data;
            axios
              .patch(
                resposta.data.fk_idmodule,
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
              .then(function(resposta2) {
                vm.modulo = resposta2.data;
              });
          });
      }
    }
  },
  computed: {
    nomeDominioPanel: function() {
      return this.domainName;
    }
  },
  methods: {
    validate() {
      if (
        this.domainName &&
        this.domainContentTitle &&
        this.domainAuthorsName
      ) {
        this.putDominio();
        this.dialog_dominio = false;
      }
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    reset() {
      this.dialog_dominio = false;
      this.setDomainVariables();
    },
    setDomainVariables(dominio_data) {
      this.dominio_data = dominio_data;
      this.$emit("dominio_data", this.dominio_data);
    },
    getDominio() {
      var vm = this;
      var csrftoken = Cookie.get("csrftoken");
      var headers = {
        "X-CSRFTOKEN": csrftoken
      };
      axios
        .patch(
          "http://127.0.0.1:8000/knowledgedomain/" +
            this.dominio_data.idknowledgedomain +
            "/",
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
          vm.setDomainVariables(resposta.data);
        });
    },

    close_or_save_dominio() {
      this.dialog_dominio = !this.dialog_dominio;
      this.controlTreeView("dominio");
    },
    setmodulo(value) {
      this.modulo = value;
    },
    setsubmodulo(value) {
      this.submodulo = value;
    },
    setconceito(value, value2) {
      this.modulo = value2;
      this.conceito = value;
    },
    close_or_save_modulo(value) {
      var vm = this;
      if (value === "save") {
        setTimeout(function() {
          vm.getDominio();
        }, 1000);
        this.dialog_modulo = false;
      } else if (value === "close") {
        this.dialog_modulo = false;
      }
      this.modulo = "";
      this.controlTreeView("modulo");
    },
    close_or_save_submodulo(value) {
      var vm = this;
      if (value === "save") {
        setTimeout(function() {
          vm.getDominio();
        }, 1000);
        this.dialog_submodulo = false;
      } else if (value === "close") {
        this.dialog_submodulo = false;
      }
      this.modulo = "";
      this.submodulo = "";
      this.controlTreeView("submodulo");
    },
    close_or_save_conceito(value) {
      var vm = this;
      if (value === "save") {
        setTimeout(function() {
          vm.getDominio();
        }, 1000);
        this.dialog_conceito = false;
      } else if (value === "close") {
        this.dialog_conceito = false;
      }
      this.conceito = "";
      this.modulo = "";
      this.controlTreeView("conceito");
    },

    deleteelemento(value) {
      var vm = this;
      axios.delete(value.url, {
        auth: {
          username: "admin",
          password: "admin"
        }
      });
      setTimeout(function() {
        vm.getDominio();
      }, 1000);
    },

    controlTreeView(value) {
      this.$emit("close", value);
    },

    findNameTarget(conceitos, relacao) {
      var targetconcept = relacao.targetconcept;
      var conceptSelect = conceitos.find(function(conceitofinded) {
        return conceitofinded.url === targetconcept;
      });

      return conceptSelect.nameconcept;
    },
    findTipoRelation(typeUrl) {
      if (typeUrl.split("/")[4] == "1") {
        return "typeOf";
      } else if (typeUrl.split("/")[4] == "2") {
        return "partOf";
      }
    }
  }
};
</script>

<style></style>
