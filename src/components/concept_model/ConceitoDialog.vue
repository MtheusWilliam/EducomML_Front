<template>
  <v-container>
    <div style="width:102.5%; position:relative;right:1.2%;margin-top:-1.3%;">
      <v-app-bar color="#D2A64D" dense dark height="45px">
        <v-toolbar-title
          style="font-size:1.2em;"
        >Defina os conceitos de cada módulo do domínio do conhecimento.</v-toolbar-title>
      </v-app-bar>
    </div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="conceptName"
        :counter="15"
        :rules="conceptNameRules"
        label="Nome do conceito"
        required
        class="mt-2 mb-4"
      ></v-text-field>
      <div style="width:102.5%; position:relative;right:1.2%;margin-top:-1.3%;">
        <v-app-bar color="#D2A64D" dense dark height="45px">
          <v-toolbar-title style="font-size:1.2em;">
            <strong>Lista de relacionamentos</strong>
          </v-toolbar-title>
        </v-app-bar>
      </div>
      <v-row class="mt-2" style="height:50px;">
        <v-col>
          <strong>
            <p>Conceito</p>
          </strong>
        </v-col>
        <v-col>
          <strong>
            <p>Nome da Relação</p>
          </strong>
        </v-col>
        <v-col>
          <strong>
            <p>Tipo da Relação</p>
          </strong>
        </v-col>
        <v-col cols="1">
          <v-icon large class="mb-1" color="primary">mdi-plus-box</v-icon>
        </v-col>
      </v-row>
      <hr />
      <v-row>
        <v-col>
          <v-select
            v-model="select"
            :items="conceitosList"
            :rules="[v => !!v || 'Necessário selecionar algum conceito existente']"
            label="Conceito"
            required
            style="margin:0px;"
          ></v-select>
        </v-col>
        <v-col>
          <v-text-field
            v-model="relacaoName"
            :rules="relacaoNameRules"
            counter="15"
            label="Nome da Relação"
            required
            style="margin:0px;"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-select
            v-model="select"
            :items="relacaoTypes"
            :rules="[v => !!v || 'Necessário selecionar o tipo da relação']"
            label="Tipo da Relação"
            required
            style="margin:0px;"
          ></v-select>
        </v-col>
        <v-col cols="1" class="mt-2">
          <v-icon large color="red">mdi-minus-box</v-icon>
        </v-col>
      </v-row>

      <v-layout row wrap justify-end>
        <v-flex shrink>
          <v-col class="d-flex" cols="12" sm="12">
            <v-select
              :menu-props="{ top:true, overflowY: true }"
              :items="newItems"
              label="Novo"
              dark
              solo
              class="mr-3"
              background-color="primary"
            ></v-select>
            <v-btn color="#63B0B0" @click="validate" dark height="49" large>
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
  name: "ConceitoDialog",
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
    conceptName: "",
    conceptNameRules: [
      v => !!v || "É necessário descrever o nome do conceito",
      v =>
        (v && v.length <= 15) ||
        "Nome do conceito deve ter no máximo 25 caracteres"
    ],
    relacaoName: "",
    relacaoNameRules: [
      v => !!v || "Necessário descrever o nome da relação",
      v =>
        (v && v.length <= 15) ||
        "O nome da relação deve ter no máximo 15 caracteres"
    ],
    newItems: ["Conceito", "Subconceito"],
    conceitosList: ["Conceito1", "Conceito2", "Conceito3"],
    select: null,
    relacaoTypes: ["typeOf", "partOf"],
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