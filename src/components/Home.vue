<template>
  <v-row class="text-center">
    <v-img src="@/assets/home.jpg" height="40vh">
      <v-toolbar class="black"  style="opacity:0.6;">

      <v-toolbar-title dark class="ml-5"><v-img src="@/assets/logoblack.png" style="width: 8vw;"></v-img></v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn  dark class="black" style="opacity:0.6;">
        Pagina Inicial
      </v-btn>

      <v-btn  dark class="black" style="opacity:0.6;">
        Equipe
      </v-btn>

      <v-btn  dark class="black" style="opacity:0.6;">
        Projeto
      </v-btn>
      <v-btn  icon dark class="black" style="opacity:0.6;">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-toolbar>
    
      <v-row style="height:50%;opacity:0.6;" align="end" class="black" justify="center">
        <h1 style="color:white; font-size: 4.4em;">Educom Tool!</h1>
      </v-row>
      <v-row style="height:50%;opacity:0.6;font-size: 1.4em" align="start" class="black white--text" justify="center">
        Educational content modelling
      </v-row>
    </v-img>
    <v-row align="start" class="grey white--text" style="padding:4vh;width:100vw;" justify="center">
        <h4 >Educom é uma abordagem de modelagem que auxilia<br>
         professores e autores a modelar conteúdo didático de domínio<br> do conhecimento. </h4>
      </v-row>
    <v-row align="start" justify="center">
      <v-btn outlined color="primary" class="ma-8" width="15vw" dark>Acesse aqui</v-btn>
    </v-row>
      
  </v-row>
</template>

<script>
export default {
  name: "UserHome",
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