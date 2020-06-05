<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:#63B0B0; color:white;">
        <span class="headline">
          <p>Importe seu áudio.</p>
        </span>
      </v-card-title>
      <v-card-text>
        <v-btn class="mt-5" outlined rounded color="blue" height="150" block="true">
          <v-spacer></v-spacer>
          <v-icon size="50" color="blue">mdi-file-music</v-icon>
          <p style="color:#2196F3; font-size: 1.3em;" class="mt-4">Upload audio</p>
          <v-spacer></v-spacer>
        </v-btn>
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
  name: "AudioDialog",
  data: () => ({
    valid: true
  })
};
</script>
