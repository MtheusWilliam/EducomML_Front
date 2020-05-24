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
              <p>Defina o módulo do domínio do conhecimento.</p>
            </span>
          </v-card-title>
          <v-card-text>
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
  name: "ModuloDialog",
  data: () => ({
    valid: true,
    dominioName: "Estatística Básica",
    identifierName: "",
    identifierNameRules: [
      v => !!v || "É necessário atribuir um identificador para o submódulo",
      v =>
        (v && v.length <= 25) ||
        "Nome do identificador deve ter no máximo 25 caracteres"
    ],
    moduloTitle: "",
    moduloTitleRules: [
      v => !!v || "É necessário descrever o título do submódulo",
      v =>
        (v && v.length <= 40) ||
        "O título do módulo deve ter no máximo 40 caracteres"
    ],
    moduloSubtitle: "",
    moduloSubtitleRules: [
      v => !!v || "É necessário descrever o subtítulo do submódulo",
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