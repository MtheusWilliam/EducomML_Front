<template>
  <v-row>
    <v-expansion-panels>
      <v-expansion-panel v-for="(item,i) in 1" :key="i">
        <v-expansion-panel-header color="purple" style="color:white;">
          <v-row>
            <v-col cols="9">
              <p>[Dominio]</p>
            </v-col>
            <v-col cols="3">
              <v-dialog v-model="dialog_modulo" persistent max-width="600px">
                <template v-slot:activator="{ on }">
                  <v-btn icon color="white" v-on="on">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title style="background-color:#63B0B0; color:white;">
                    <span class="headline">
                      <p>Defina o módulo do domínio do conhecimento.</p>
                    </span>
                  </v-card-title>
                  <v-card-text>
                    <v-form ref="form" v-model="valid_modulo" lazy-validation>
                      <v-text-field disabled label="Estatística Básica" required>Etatística Básica</v-text-field>

                      <v-text-field
                        v-model="identifierName"
                        :counter="25"
                        :rules="identifierNameRules"
                        label="Atribua um identificador para o módulo"
                        required
                      ></v-text-field>

                      <v-text-field
                        v-model="moduloTitle"
                        :rules="moduloTitleRules"
                        label="Título do módulo"
                        required
                      ></v-text-field>

                      <v-text-field
                        v-model="moduloSubtitle"
                        :rules="moduloSubtitleRules"
                        label="Subtítulo do módulo"
                        required
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" height="49" dark large @click="reset_modulo">
                      Close
                      <v-icon dark right>mdi-close</v-icon>
                    </v-btn>
                    <v-btn color="success" height="49" dark large @click="validate">
                      Save
                      <v-icon dark right>mdi-content-save</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialog_dominio" persistent max-width="600px">
                <template v-slot:activator="{ on }">
                  <v-btn icon color="white" v-on="on">
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
                    <v-form ref="form" v-model="valid_dominio" lazy-validation>
                      <v-text-field
                        v-model="domainName"
                        :counter="20"
                        :rules="domainNameRules"
                        label="Dominío modelado"
                        required
                      ></v-text-field>

                      <v-text-field
                        v-model="contentTitle"
                        :rules="contentTitleRules"
                        label="Título para o conteúdo modelado"
                        required
                      ></v-text-field>

                      <v-text-field
                        v-model="authorsName"
                        :rules="authorsNameRules"
                        label="Autor(es) da modelagem"
                        required
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" height="49" dark large @click="reset_dominio">
                      Close
                      <v-icon dark right>mdi-close</v-icon>
                    </v-btn>
                    <v-btn color="success" height="49" dark large @click="validate">
                      Save
                      <v-icon dark right>mdi-content-save</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>Informações do Domínio</v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>
<script>
/*import DominioDialog from "./concept_model/DominioDialog";
import ModuloDialog from "./concept_model/ModuloDialog";
import ConceitoDialog from "./concept_model/ConceitoDialog";*/

export default {
  name: "Panels",
  data: () => ({
    valid_modulo: true,
    dialog_modulo: false,
    dominioName: "Estatística Básica",
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
    checkbox: false,
    valid_dominio: true,
    dialog_dominio: false,
    domainName: "",
    domainNameRules: [
      v => !!v || "É necessário descrever o nome do domínio modelado",
      v =>
        (v && v.length <= 25) ||
        "Nome do domínio deve ter no máximo 25 caracteres"
    ],
    contentTitle: "",
    contentTitleRules: [
      v => !!v || "É necessário descrever o título para o conteúdo modelado",
      v =>
        (v && v.length <= 40) ||
        "O título do conteúdo modelado deve ter no máximo 40 caracteres"
    ],
    authorsName: "",
    authorsNameRules: [
      v => !!v || "É necessário descrever o(s) autores da modelagem",
      v =>
        (v && v.length <= 60) ||
        "Os nomes dos autores devem ter no máximo 60 caracteres"
    ]
  }),
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset_modulo() {
      this.dialog_modulo = false;
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    reset_dominio() {
      this.dialog_dominio = false;
      this.$refs.form.reset();
    }
  },
  components: {
    /*DominioDialog,
    ModuloDialog,
    ConceitoDialog*/
  },
  props: {}
};
</script>
<style>
</style>