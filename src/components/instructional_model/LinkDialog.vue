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
import axios from "axios";

export default {
  name: "LinkDialog",
  props: ["optionCall", "type"],
  data: () => ({
    valid: true,
    linkUrl: "",
    linkUrlRules: [v => !!v || "É necessário inserir o link a ser inserido"]
  }),
  methods: {
    reset() {
      this.$emit("close");
    },
    postMobileMedia() {
      // var vm = this;
      var mobilemedia = {
        label: "",
        fk_idmediatype: "http://localhost:8000/mediatype/5/",
        difficultyLevel: null,
        learningStyle: null,
        path: "",
        namefile: "",
        resolution: "",
        description: "",
        time: null,
        textfull: "",
        textshort: "",
        urllink: this.linkUrl
      };
      console.log(this.type);
      if (this.type === "dominio") {
        Object.assign(mobilemedia, {
          fk_idknowledgedomain: this.optionCall.url
        });
      } else if (this.type === "modulo") {
        Object.assign(mobilemedia, {
          fk_module: this.optionCall.url
        });
      } else if (this.type === "conceito") {
        Object.assign(mobilemedia, {
          fk_concept: this.optionCall.url
        });
      }

      console.log(mobilemedia);

      axios
        .post(`http://localhost:8000/mobilemedia/`, mobilemedia, {
          auth: {
            username: "admin",
            password: "admin"
          }
        })
        .then(function(/*resposta*/) {
          /*vm.moduloTitle = resposta.data.namemodule;
                    vm.subTitle = resposta.data.subtitle;*/
        });
    },
    validate() {
      this.postMobileMedia();
      this.$emit("close");
    }
  }
};
</script>
