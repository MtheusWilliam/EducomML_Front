<template>
  <v-container>
    <div style="width:102.5%; position:relative;right:1.2%;margin-top:-1.3%;">
      <v-app-bar color="#D2A64D" dense dark height="45px">
        <v-toolbar-title style="font-size:1.2em;">Defina o domínio do conhecimento a ser modelado.</v-toolbar-title>
      </v-app-bar>
    </div>
    <v-form ref="form" v-model="valid" lazy-validation>
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

      <v-layout row wrap justify-end>
        <v-flex shrink>
          <v-col class="d-flex" cols="12" sm="12">
            <v-btn
              color="success"
              v-on:click.stop="initTree"
              @click="validate"
              dark
              height="49"
              large
            >
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
  name: "DominioDialog",
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
    controlInitTree: false,
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
    initTree() {
      this.$emit("emitInitTree", true);
    },
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