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
export default {
  name: "LinkDialog",
  data: () => ({
    valid: true,
    linkUrl: "",
    linkUrlRules: [v => !!v || "É necessário inserir o link a ser inserido"]
  })
};
</script>
