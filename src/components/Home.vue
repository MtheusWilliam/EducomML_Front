<template>
  <v-row class="text-center">
    <v-img :src="atual_page.img_src" height="40vh">
      <v-toolbar class="pt-1" style="box-shadow:none; background-color: rgba(0, 0, 0, .6);">
        <v-toolbar-title dark class="ml-5 pt-1">
          <v-img src="@/assets/logo.png" style="width: 13vw;"></v-img>
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-tabs
          class="d-flex justify-end mr-1"
          active-class="white--text"
          v-model="tab"
          hide-slider
        >
          <v-tab
            @click="atual_page = pages[0]"
            style="background-color: rgba(0, 0, 0, .01); box-shadow:none; color:white;"
          >Pagina Inicial</v-tab>
          <v-tab
            @click="atual_page = pages[1]"
            style="background-color: rgba(0, 0, 0, .01); box-shadow:none; color:white;"
          >Projeto</v-tab>
          <v-tab
            @click="atual_page = pages[2]"
            style="background-color: rgba(0, 0, 0, .01); box-shadow:none; color:white;"
          >Equipe</v-tab>
        </v-tabs>
      </v-toolbar>
      <v-row style="height:50%;opacity:0.6;" align="end" class="black" justify="center">
        <h1 style="color:white; font-size: 4.4em;">{{atual_page.title}}</h1>
      </v-row>
      <v-row
        style="height:50%;opacity:0.6;font-size: 1.4em"
        align="start"
        class="black white--text"
        justify="center"
      >{{atual_page.subtitle}}</v-row>
    </v-img>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-row
          align="start"
          class="black--text"
          style="background-color: white ;padding:4vh;width:101vw;"
          justify="center"
        >
          <h3>
            Educom é uma abordagem de modelagem que auxilia
            <br />professores e autores a modelar conteúdo didático de
            <br />domínio do conhecimento.
          </h3>
        </v-row>
        <v-row align="start" justify="center">
          <v-btn
            outlined
            color="#B19114"
            class="ma-8"
            width="20vw"
            dark
            @click="$store.state.jwt ?$router.push({ path: '/home' }) :  $router.push({ path: '/login/ ' })"
          >Acesse aqui</v-btn>
        </v-row>
        <v-row
          align="start"
          class="black--text"
          style="background-color: #B19114 ;padding:4vh;width:101vw;"
          justify="center"
        >
          <h2>Abordagem de Modelagem de Conteúdo Educacional</h2>
        </v-row>

        <v-row
          align="start"
          class="black--text pb-0"
          style="background-color: white; padding:4vh;width:101vw;"
          justify="center"
        >
          <v-col cols="6">
            <youtube video-id="FxT6cG9tUPI" player-width="90%" @ready="ready" @playing="playing"></youtube>
            <h2 class="mt-1 mb-3">Diretriz de produção de mídia</h2>
            <v-row style="max-width: 640px; text-align: center;" class="mx-auto">
              <p
                style="text-align: left; font-size: 1.15em;"
              >Um conjunto de diretrizes são apresentadas nesse vídeo que ajudam o autor a produzir um conteúdo educacional mais adequado para uso em dispositivos móveis.</p>
            </v-row>
          </v-col>
          <v-col cols="6">
            <youtube video-id="SiuUfNyMyGk" player-width="90%" @ready="ready" @playing="playing"></youtube>
            <h2 class="mt-1 mb-3">Modelo Conceitual</h2>
            <v-row style="max-width: 640px; text-align: center;" class="mx-auto">
              <p
                style="text-align: left; font-size:1.15em;"
              >A Educom.ml é composta por três modelos que estruturam o conteúdo educacional. Esse vídeo apresenta o Modelo Conceitual, que tem a finalidade de modelar um conjunto de conceitos de um domínio do conhecimento.</p>
            </v-row>
          </v-col>
        </v-row>

        <v-row
          align="start"
          class="black--text mt-0"
          style="background-color: white; padding:4vh;width:101vw;"
          justify="center"
        >
          <v-col cols="6">
            <youtube video-id="ggVE8KayWi0" player-width="90%" @ready="ready" @playing="playing"></youtube>
            <h2 class="mt-1 mb-3">Modelo Instrucional</h2>
            <v-row style="max-width: 640px; text-align: center;" class="mx-auto">
              <p
                style="text-align: left; font-size: 1.15em;"
              >Modelo Instrucional permite que o autor inclua no Modelo Conteitual informações complementares como descrição de conteitos, imagens, vídeos, exemplos exercícios e atividades avaliativas.</p>
            </v-row>
          </v-col>
          <v-col cols="6">
            <youtube video-id="ooiPjc0t3Ts" player-width="90%" @ready="ready" @playing="playing"></youtube>
            <h2 class="mt-1 mb-3">Modelo Didático</h2>
            <v-row style="max-width: 640px; text-align: center; " class="mx-auto">
              <p
                style="text-align: left; font-size: 1.15em;"
              >O Modelo Didático tem a finalidade de definir a navegabilidade do aprendiz no conteúdo educacional modelado.</p>
            </v-row>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item></v-tab-item>
      <v-tab-item>
        <v-row
          align="start"
          class="black--text"
          style="background-color: white ;padding:4vh;width:101vw;"
          justify="center"
        >
          <v-col cols="4"></v-col>
          <v-col cols="5" class="d-flex justify-start">
            <h3>Coordenadores</h3>
          </v-col>
          <v-col cols="3"></v-col>
          <v-col cols="4"></v-col>
          <v-col cols="5" class="d-flex justify-start">
            <p style="text-align: left;">
              <span>Marcus Vinicius Ribeiro de Carvalho - mvcarvalhopi@ctu.uespi.br</span>
              <br />
              <span>Ellem Francine Barbosa - francine@usp.br</span>
            </p>
          </v-col>
          <v-col cols="3"></v-col>

          <v-col cols="4"></v-col>
          <v-col cols="5" class="d-flex justify-start">
            <h3>Desenvolvedores</h3>
          </v-col>
          <v-col cols="3"></v-col>
          <v-col cols="4"></v-col>
          <v-col cols="5" class="d-flex justify-start">
            <p style="text-align: left;">
              <span>Matheus William Gomes dos Santos - matheuswg99@gmail.com</span>
              <br />
              <span>Vitor Azevedo</span>
            </p>
          </v-col>
          <v-col cols="3"></v-col>
          <v-col cols="4"></v-col>
          <v-col cols="5" class="d-flex justify-start">
            <v-card>
              <v-img
                src="https://cdn.vuetifyjs.com/images/cards/house.jpg"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                width="180px"
              ></v-img>

              <v-card-actions>
                <v-row>
                  <v-spacer></v-spacer>
                  <span>
                    <strong>Nome1</strong>
                  </span>
                  <v-spacer></v-spacer>
                </v-row>
              </v-card-actions>
            </v-card>
            <v-card class="ml-1">
              <v-img
                src="https://cdn.vuetifyjs.com/images/cards/house.jpg"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                width="180px"
              ></v-img>

              <v-card-actions>
                <v-row>
                  <v-spacer></v-spacer>
                  <span>
                    <strong>Nome2</strong>
                  </span>
                  <v-spacer></v-spacer>
                </v-row>
              </v-card-actions>
            </v-card>
            <v-card class="ml-1">
              <v-img
                src="https://cdn.vuetifyjs.com/images/cards/house.jpg"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                width="180px"
              ></v-img>

              <v-card-actions>
                <v-row>
                  <v-spacer></v-spacer>
                  <span>
                    <strong>Nome3</strong>
                  </span>
                  <v-spacer></v-spacer>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="3"></v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </v-row>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      dialogMessage: false,
      messageClass: "",
      messageTitle: "",
      message: "",
      atual_page: "",
      tab: "",
      pages: [
        {
          title: "Educom Tool!",
          subtitle: "Educational content modelling",
          img_src: require("@/assets/home/bg1.jpg"),
        },
        {
          title: "Projeto",
          subtitle: "",
          img_src: require("@/assets/home/bg2.jpg"),
        },
        {
          title: "Equipe",
          subtitle: "",
          img_src: require("@/assets/home/bg3.jpg"),
        },
      ],
    };
  },
  created: function () {
    this.atual_page = this.pages[0];
  },
};
</script>

<style>
</style>
