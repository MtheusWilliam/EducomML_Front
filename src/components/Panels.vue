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
                />
              </v-dialog>

              <!--Formulario para edição do domínio-->
              <v-dialog v-model="dialog_dominio" persistent="persistent" max-width="600px">
                <template v-slot:activator="{ on }">
                  <v-btn icon="icon" color="white" v-on="on">
                    <v-icon>mdi-view-headline</v-icon>
                  </v-btn>
                </template>

                <DominioDialog
                  @close_or_save="close_or_save_dominio"
                  @dominio_data="setDomainVariables"
                  :domain="dominio_data"
                />
              </v-dialog>
              <!--Formulario para criação de submódulo-->
              <v-dialog v-model="dialog_submodulo" persistent="persistent" max-width="600px">
                <SubModuloDialog
                  :module="modulo"
                  @close_or_save="close_or_save_submodulo "
                  :domain="dominio"
                />
              </v-dialog>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          {{ dominio_data.subtitle }}
          <!--Panels dos Módulos-->
          <v-expansion-panels v-for="(modulo) in modulos" :key="modulo.idmodule" class="mt-2 mb-2">
            <v-expansion-panel>
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
                      top
                      origin="center center"
                      :offset-y="true"
                      transition="scale-transition"
                    >
                      <template v-slot:activator="{ on }">
                        <v-btn icon color="white" dark v-on="on">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>

                      <v-list>
                        <v-list-item>
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
                  </v-col>
                </v-row>
              </v-expansion-panel-header>

              <v-expansion-panel-content>
                {{ modulo.subtitle }}
                <!--Panels dos SubMódulos-->
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

import axios from "axios";
import Cookie from "js-cookie";
export default {
  name: "Panels",
  components: {
    ModuloDialog,
    DominioDialog,
    SubModuloDialog
  },
  props: ["dominio"],
  data: () => ({
    itemsMenuNewModulo: [{ type: "Conceito" }, { type: "Submódulo" }],
    modulo: "",
    valid_modulo: true,
    dialog_modulo: false,
    dialog_submodulo: false,
    dialog_dominio: false,
    select: null,
    modulos: "",
    checkbox: false,
    /*ATRIBUTOS DO DOMINIO*/
    dominio_data: {}
  }),
  mounted() {
    /* Função que "atrasa" atualização da variável para conseguir pegar dados do
     * props:[]
     */
    var vm = this;
    setTimeout(function() {
      vm.setDomainVariables(vm.dominio);
    }, 1000);
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
      this.modulos = this.dominio_data.modules;
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
    },
    close_or_save_dominio() {
      this.dialog_dominio = !this.dialog_dominio;
    },
    setmodulo(value) {
      this.modulo = value;
    },
    close_or_save_submodulo(value) {
      // var vm = this;
      if (value === "save") {
        this.dialog_submodulo = false;
      } else if (value === "close") {
        this.dialog_submodulo = false;
      }
    }
  }
};
</script>
<style></style>