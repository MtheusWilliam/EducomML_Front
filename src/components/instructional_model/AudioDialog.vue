<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:#63B0B0; color:white;">
        <span class="headline">
          <p>Importe seu áudio.</p>
        </span>
      </v-card-title>
      <v-card-text>
        <v-spacer></v-spacer>
        <v-file-input
          label="UPLOAD AUDIO"
          filled
          v-model="audioObject"
          accept="audio/*"
          prepend-icon="mdi-file-music"
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

export default {
  name: "AudioDialog",
  data: () => ({
    valid: true,
    audioObject: {}
  }),
  methods: {
    reset() {},
    validate() {
      console.log(this.audioObject);
      const storageRef = firebase
        .storage()
        .ref(this.audioObject.name)
        .put(this.audioObject);
      console.log(storageRef);
    }
  }
};
</script>
