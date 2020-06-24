<template>
  <v-row class="mt-2">
    <v-row>
      <v-app-bar color="blue-grey lighten-4" z-index="1">
        <v-toolbar-title style="font-size:1.4em; color:white;" class="ml-6 mb-2">
          <div class="mt-5 d-flex align-center">
            <v-img src="@/assets/logo.svg" style="width: 170px;" class="mr-3"></v-img>
          </div>
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-div class="mr-6">
          <strong class="mx-2">Você ainda não se identificou</strong>
          <router-link :to="{path: '/home'}">
            <v-btn outlined color="indigo lighten-1" dark>Acessar</v-btn>
          </router-link>
        </v-div>
      </v-app-bar>
    </v-row>
    <v-row style="background-image: linear-gradient(#7993a5, #101223); color:white; width: 100%">
      <v-col cols="7" class="mx-3" justify-center>
        <h3 class="ml-3">
          <strong>Criar contéudo educacional para aplicações móveis</strong>
        </h3>
        <br />
        <v-row class="mx-4 ml-5">
          A educomML é uma abordagem que auxilia o time de produçao de contéudo na estruturação de material didático destinados a aplicativos móveis.
          <br />
          <br />Com educomML.ml é possivel gerar uma aplicação móvel com o contéudo educacional produzido.
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-img src="@/assets/home.png"></v-img>
      </v-col>
      <v-row>
        <v-btn class="mx-auto mb-7" v-for="(btn,i) in buttons" :key="i" outlined dark>{{btn}}</v-btn>
      </v-row>
    </v-row>
  </v-row>
</template>

<script>
export default {
  name: "UserHome",
  data: () => ({
    buttons: ["contato", "publicações", "projetos"]
  }),
  methods: {}
};
</script>

<style>
</style>