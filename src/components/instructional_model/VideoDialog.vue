<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:#63B0B0; color:white;">
        <span class="headline">
          <p>Importe seu vídeo.</p>
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="videoDescription"
            :rules="videoDescriptionRules"
            label="Utilize uma descrição para o vídeo"
            required
          ></v-text-field>
        </v-form>
        <v-btn outlined rounded color="blue" height="150" block="true">
          <v-spacer></v-spacer>
          <v-icon size="50" color="blue">mdi-video</v-icon>
          <p style="color:#2196F3; font-size: 1.3em;" class="mt-4">Upload video</p>
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
  name: "VideoDialog",
  data: () => ({
    valid: true,
    videoDescription: "",
    videoDescriptionRules: [
      v => !!v || "É necessário descrever a imagem a ser inserida",
      v =>
        (v && v.length <= 50) ||
        "A descrição da imagem deve ter no máximo 50 caracteres"
    ]
  })
};
</script>
