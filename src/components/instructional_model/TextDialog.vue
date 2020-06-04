<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:#63B0B0; color:white;">
        <span class="headline">
          <p>Escreva seu texto aqui.</p>
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="1">
              <label for="enableInfoItems">On</label>
              <br />
              <v-btn icon color="blue" class="mt-3">
                <v-icon large>mdi-eye</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <label for="infoItemClassesSelect">Classifique o item de informação</label>
              <v-select
                id="infoItemClassesSelect"
                :items="infoItemClasses"
                :rules="[v => !!v || 'Conceito é requerido']"
                label="Classe"
                style="margin:0px;"
                required
              ></v-select>
            </v-col>
            <v-col cols="4">
              <label for="infoItemLevelsSelect">Qual o nível de dificuldade?</label>
              <v-select
                id="infoItemLevelsSelect"
                :items="infoItemLevels"
                :rules="[v => !!v || 'Conceito é requerido']"
                label="Nível"
                style="margin:0px;"
                required
              ></v-select>
            </v-col>
            <v-col cols="3">
              <label for="infoItemResumeSelect">É um texto resumido?</label>
              <v-select
                id="infoItemResumeSelect"
                :items="infoItemResume"
                :rules="[v => !!v || 'Conceito é requerido']"
                label="Resposta"
                style="margin:0px;"
                required
              ></v-select>
            </v-col>
          </v-row>
          <label for="textTextArea">Seu texto:</label>
          <v-textarea
            id="textTextArea"
            background-color="#F2F3F3"
            clearable
            clear-icon="mdi-close-circle"
            class="mt-2"
            name="input-8-1"
            filled
            auto-grow
            value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
          ></v-textarea>
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
  name: "textDialog",
  data: () => ({
    valid: true,
    infoItemClasses: ["Conceito", "Princípio", "Fato", "Procedimento"],
    infoItemLevels: ["0 - Inicial", "1 - Fácil", "2 - Médio", "3 - Difícil"],
    infoItemResume: ["Não", "Sim"]
  })
};
</script>
