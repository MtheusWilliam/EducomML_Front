<template>
  <v-row>
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
              <v-dialog v-model="dialog_modulo" persistent="persistent" max-width="600px">
                <template v-slot:activator="{ on }">
                  <v-btn icon="icon" color="white" v-on="on">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>

                <ModuloDialog @dialog_modulo="dialog_modulo = !dialog_modulo" :idDomain="dominio" />
              </v-dialog>

              <!--Formulario para edição do domínio-->
              <v-dialog v-model="dialog_dominio" persistent="persistent" max-width="600px">
                <template v-slot:activator="{ on }">
                  <v-btn icon="icon" color="white" v-on="on">
                    <v-icon>mdi-view-headline</v-icon>
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title style="background-color:#63B0B0; color:white;">
                    <span class="headline">
                      <p>Defina o domínio do conhecimento a ser modelado</p>
                    </span>
                  </v-card-title>
                  <v-card-text>
                    <v-form ref="form" v-model="valid" lazy-validation="lazy-validation">
                      <v-text-field
                        v-model="domainName"
                        :counter="25"
                        :rules="domainNameRules"
                        label="Dominío modelado"
                        required="required"
                      ></v-text-field>

                      <v-text-field
                        v-model="domainContentTitle"
                        :rules="domainContentTitleRules"
                        label="Título para o conteúdo modelado"
                        required="required"
                        ref="refSubtitleDominio"
                      ></v-text-field>

                      <v-text-field
                        v-model="domainAuthorsName"
                        :rules="domainAuthorsNameRules"
                        label="Autor(es) da modelagem"
                        required="required"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" height="49" dark="dark" large="large" @click="reset">
                      Close
                      <v-icon dark="dark" right="right">mdi-close</v-icon>
                    </v-btn>
                    <v-btn
                      color="success"
                      height="49"
                      dark="dark"
                      large="large"
                      @click="validate"
                      :disabled="!valid"
                    >
                      Save
                      <v-icon dark="dark" right="right">mdi-content-save</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          {{ dominio_data.subtitle }}
          <v-expansion-panels v-for="(modulo) in modulos" :key="modulo.idmodule">
            <v-expansion-panel>
              <v-expansion-panel-header>[Modulo] {{ modulo.namemodule }}</v-expansion-panel-header>

              <v-expansion-panel-content>{{ modulo.subtitle }}</v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>
<script>
// import DominioDialog from "./concept_model/DominioDialog";
import ModuloDialog from "./concept_model/ModuloDialog";
// import ConceitoDialog from "./concept_model/ConceitoDialog";
import axios from "axios";
export default {
  name: "Panels",
  components: {
    ModuloDialog
  },
  props: ["dominio"],
  data: () => ({
    valid_modulo: true,
    dialog_modulo: false,
    identifierName: "",
    identifierNameRules: [
      v => !!v || "É necessário atribuir um identificador para o módulo",
      v =>
        (v && v.length <= 25) ||
        "Nome do identificador deve ter no máximo 25 caracteres"
    ],
    moduloTitle: "",
    moduloTitleRules: [
      v => !!v || "É necessário descrever o título do módulo",
      v =>
        (v && v.length <= 40) ||
        "O título do módulo deve ter no máximo 40 caracteres"
    ],
    moduloSubtitle: "",
    moduloSubtitleRules: [
      v => !!v || "É necessário descrever o subtítulo do módulo",
      v =>
        (v && v.length <= 40) ||
        "O subtítulo do módulo deve ter no máximo 40 caracteres"
    ],
    select: null,
    newItems: ["Módulo", "SubMódulo"],
    modulos: "",
    checkbox: false,
    /*ATRIBUTOS DO DOMINIO*/
    dominio_data: {},
    domainName: "a",
    domainContentTitle: "",
    domainAuthorsName: "",
    valid: true,
    dialog_dominio: false,
    /*REGRAS PARA VALIDAÇÃO DO FORMULÁRIO DOMÍNIO*/
    domainNameRules: [
      v => !!v || "É necessário descrever o nome do domínio modelado",
      v =>
        (v && v.length <= 25) ||
        "Nome do domínio deve ter no máximo 25 caracteres"
    ],
    domainContentTitleRules: [
      v => !!v || "É necessário descrever o título para o conteúdo modelado",
      v =>
        (v && v.length <= 40) ||
        "O título do conteúdo modelado deve ter no máximo 40 caracteres"
    ],
    domainAuthorsNameRules: [
      v => !!v || "É necessário descrever o(s) autores da modelagem",
      v =>
        (v && v.length <= 60) ||
        "Os nomes dos autores devem ter no máximo 60 caracteres"
    ]
  }),
  mounted() {
    /* Função que "atrasa" atualização da variável para conseguir pegar dados do
     * props:[]
     */
    var vm = this;
    setTimeout(function() {
      vm.dominio_data = vm.dominio;
      console.log("TIMEOUT");
      vm.setDomainVariables();
    }, 1000);
  },
  computed: {
    nomeDominioPanel: function() {
      return this.domainName;
    }
  },
  methods: {
    putDominio() {
      var vm = this;
      /*var vm = this;*/
      axios
        .put(
          "http://127.0.0.1:8000/knowledgedomain/" +
            this.dominio.idknowledgedomain +
            "/",
          {
            nameknowledgedomain: this.domainName,
            subtitle: this.domainContentTitle,
            lastversion: this.dominio_data.lastversion,
            author: this.domainAuthorsName
          },
          {
            auth: {
              username: "admin",
              password: "admin"
            }
          }
        )
        .then(function(resposta) {
          vm.dominio_data = resposta.data;
          vm.setDomainVariables();
        });
    },
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
    setDomainVariables() {
      var vm = this;
      this.domainName = this.dominio_data.nameknowledgedomain;
      this.domainContentTitle = this.dominio_data.subtitle;
      this.domainAuthorsName = this.dominio_data.author;
      axios
        .get("http://127.0.0.1:8000/module/", {
          auth: {
            username: "admin",
            password: "admin"
          }
        })
        .then(function(resposta) {
          console.log(resposta.data);
          vm.modulos = resposta.data;
        });
    }
  }
};
</script>
<style></style>