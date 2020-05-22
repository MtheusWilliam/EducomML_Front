<template>
  <v-container>
    <v-row>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn
            class="mx-auto"
            width="50%"
            x-large
            color="primary"
            dark
            v-on="on"
          >Criar Novo Domínio</v-btn>
        </template>

        <v-card>
          <v-card-title style="background-color:#63B0B0; color:white;">
            <span class="headline">
              <p>Defina o domínio do conhecimento a ser modelado</p>
            </span>
          </v-card-title>
          <v-card-text>
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
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DominioDialog",
  data: () => ({
    valid: true,
    dialog: false,
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
    reset() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>