<template>
  <v-row class="mt-4">
    <v-row>
      <v-app-bar color="black" z-index="1">
        <v-toolbar-title style="font-size:1.4em; color:white;" class="ml-6 mb-2">
          <div class="mt-5 d-flex align-center">
            <v-img src="@/assets/logo.png" style="width: 170px;" class="mr-3 mb-2"></v-img>
          </div>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <a href="#" style="text-decoration: none; color:#FFCC00;" class="mr-6">
          <strong>Documentação</strong>
        </a>
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

    <!--
    <v-tabs v-model="tab" background-color="transparent" grow>
      <v-tab v-for="(item, i) in menu" :key="item" @click="currentTabInfo = tabsInfo[i]">{{item}}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <PaginaInicial/>
      </v-tab-item>
      <v-tab-item>
        <Projeto />
      </v-tab-item>
      <v-tab-item>
        <Equipe />
      </v-tab-item>
    </v-tabs-items>
    -->

    <div class="text-center">
      <v-dialog v-model="dialogMessage" width="500">
        <v-card>
          <v-card-title :class="messageClass" primary-title style="color:white;">{{messageTitle}}</v-card-title>
          <v-card-text class="mt-3" style="font-size: 1.3em;">{{message}}</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialogMessage = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-row>
</template>

<script>
/**import PaginaInicial from "./home_pages/PaginaInicial";
import Projeto from "./home_pages/Projeto";
import Equipe from "./home_pages/Equipe";**/

export default {
  name: "UserHome",
  /**components: {
    PaginaInicial,
    Projeto,
    Equipe
  },**/
  data() {
    return {
      dialogMessage: false,
      messageClass: "",
      messageTitle: "",
      message: "",
      buttons: ["contato", "publicações", "projetos"]
    };
  },
  mounted() {
    if (this.$route.params.emailconfirmation === "1") {
      this.messageClass = "headline green";
      this.messageTitle = "Email confirmado com sucesso";
      this.message =
        "Seu cadastro foi confirmado! Faça login para começar a usar a plataforma EducomML.";
      this.dialogMessage = true;
    } else if (this.$route.params.emailconfirmation === "0") {
      this.messageClass = "headline red";
      this.messageTitle = "Erro na confirmação";
      this.message =
        "Houve um problema na confirmação da sua conta, realize o cadastro novamente.";
      this.dialogMessage = true;
    }
  }
};
</script>

<style>
</style>