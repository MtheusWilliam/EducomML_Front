<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:#63B0B0; color:white;">
        <span class="headline">
          <p>Importe sua imagem.</p>
        </span>
      </v-card-title>
      <v-card-text>
        <!--Formulario para adição de submódulo ou conceito-->

        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="imagemDescription"
            :rules="imagemDescriptionRules"
            label="Utilize uma descrição para a imagem"
            required
          ></v-text-field>
        </v-form>
        <v-spacer></v-spacer>
        <v-file-input
          label="UPLOAD IMAGE"
          filled
          v-model="imagemObject"
          accept="image/*"
          prepend-icon="mdi-camera"
        ></v-file-input>
        <v-spacer></v-spacer>
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
import * as firebase from "firebase";
import axios from "axios";

export default {
  name: "ImageDialog",
  props: ["optionCall", "type"],
  data: () => ({
    valid: true,
    imagemDescription: "",
    imagemObject: {},
    imagemDescriptionRules: [
      v => !!v || "É necessário descrever a imagem a ser inserida",
      v =>
        (v && v.length <= 50) ||
        "A descrição da imagem deve ter no máximo 50 caracteres"
    ]
  }),
  methods: {
    reset() {
      this.$emit("close");
    },
    postMobileMedia() {
      // var vm = this;
      var mobilemedia = {
        label: this.imagemDescription,
        fk_idmediatype: "http://localhost:8000/mediatype/1/",
        difficultyLevel: null,
        learningStyle: null,
        path: this.imagemObject.name,
        namefile: this.imagemObject.name,
        resolution: "",
        description: this.imagemDescription,
        time: null,
        textfull: null,
        textshort: null,
        urllink: null
      };
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
          fk_idconcept: this.optionCall.url
        });
      }

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

      firebase
        .storage()
        .ref(this.imagemObject.name)
        .put(this.imagemObject);
      this.$emit("close");
    }
  }
};
</script>
