<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:#63B0B0; color:white;">
        <span class="headline">
          <p>Importe seu vídeo.</p>
        </span>
      </v-card-title>
      <v-card-text>
        <v-spacer></v-spacer>
        <v-file-input
          label="UPLOAD VIDEO"
          filled
          v-model="videoObject"
          accept="video/*"
          prepend-icon="mdi-video"
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
import axios from 'axios';

export default {
  name: "VideoDialog",
  data: () => ({
    valid: true,
    videoObject: {}
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
                path: this.videoObject.name,
                namefile: this.videoObject.name,
                resolution: "",
                description: "",
                time: null,
                textfull: "",
                textshort: "",
                urllink: ""
            }
            console.log(this.type)
            if (this.type === "dominio") {
                Object.assign(mobilemedia, {
                    fk_idknowledgedomain: this.optionCall.url
                })
            } else if (this.type === "modulo") {
                Object.assign(mobilemedia, {
                    fk_module: this.optionCall.url
                })
            } else if (this.type === "conceito") {
                Object.assign(mobilemedia, {
                    fk_concept: this.optionCall.url
                })
            }

            console.log(mobilemedia)

            axios
                .post(
                    `http://localhost:8000/mobilemedia/`,
                    mobilemedia, {
                        auth: {
                            username: "admin",
                            password: "admin"
                        }
                    }
                )
                .then(function ( /*resposta*/ ) {
                    /*vm.moduloTitle = resposta.data.namemodule;
                    vm.subTitle = resposta.data.subtitle;*/
                });
        },
        validate() {
            console.log(this.videoObject);

            this.postMobileMedia();

          firebase
                .storage()
                .ref(this.videoObject.name)
                .put(this.videoObject);
        }
    }
};
</script>
