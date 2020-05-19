<template>
  <v-container>
    <div style="width:102.5%; position:relative;right:1.2%;margin-top:-1.3%;">
      <v-app-bar color="#D2A64D" dense dark height="45px">
        <v-toolbar-title style="font-size:1.2em;">Defina os módulos do domínio do conhecimento.</v-toolbar-title>
      </v-app-bar>
    </div>
    <v-form ref="form" v-model="valid" lazy-validation>
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

      <v-layout row wrap justify-end>
        <v-flex shrink>
          <v-col class="d-flex" cols="12" sm="12">
            <v-select
              :menu-props="{ top:true, overflowY: true }"
              :items="newItems"
              dark
              label="Novo"
              class="mr-3"
              background-color="primary"
              solo
            ></v-select>
            <v-btn color="success" @click="validate" dark height="49" large>
              Salvar
              <v-icon dark right>mdi-content-save</v-icon>
            </v-btn>
          </v-col>
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
export default {
  name: "ModuloForm",
  data: () => ({
    tab: null,
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    icons: false,
    centered: false,
    grow: false,
    vertical: false,
    prevIcon: false,
    nextIcon: false,
    right: false,
    tabs: 3,
    valid: true,
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
    checkbox: false
  }),

  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>