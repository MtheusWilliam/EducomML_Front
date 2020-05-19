<template>
  <v-container>
    <v-row dense>
      <v-col cols="4">
        <v-card class="mr-2 mt-2">
          <v-img
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>Modelo Conceitual</v-card-title>
          </v-img>

          <v-card-text class="text--primary">
            <div>
              <p style="font-size:17px;">
                Defina os principais conceitos
                do domínio do conhecimento que
                deseja ensinar.
              </p>
            </div>
          </v-card-text>

          <v-card-actions class="d-flex flex-row-reverse">
            <v-btn
              @click="$router.push('/create/conceitual')"
              color="success white--text"
              large
            >Criar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="mt-2">
          <v-img
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>Modelo Instrucional</v-card-title>
          </v-img>

          <v-card-text class="text--primary">
            <div>
              <p style="font-size:17px;">
                Atribua aos conceitos modelados
                informações que os esclareçam
                ao aprendiz.
              </p>
            </div>
          </v-card-text>

          <v-card-actions class="d-flex flex-row-reverse">
            <v-btn color="success white--text" large disabled>Criar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="mx-auto ml-2 mt-2">
          <v-img
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>Modelo Didático</v-card-title>
          </v-img>

          <v-card-text class="text--primary" style="text-size:2.0em;">
            <div>
              <p style="font-size:17px;">
                Determine como o aprendiz pode
                navegar no conteudo modelado.
              </p>
            </div>
          </v-card-text>

          <v-card-actions class="d-flex flex-row-reverse">
            <v-btn color="success white--text" large disabled>Criar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-7">
      <v-select
        :items="items"
        dark
        solo
        class="mr-3 ml-3"
        background-color="primary"
        label="Selecione um modelo para alterar"
        :menu-props="{ top:true, overflowY: true,}"
      ></v-select>

      <v-btn class="mr-3 text-white" dark color="#63B0B0" height="49">Gerar conteúdo educacional</v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ModelTutorial",

  data: () => ({
    items: ["Modelo Conceitual", "Modelo Instrucional", "Modelo Didático"]
  })
};
</script>
<style>
</style>