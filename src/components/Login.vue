<template>
  <v-card class="elevation-12">
    <v-toolbar color="black" flat>
      <v-toolbar-title style="color:#FFCC00;">Faça seu login no Educom.ML</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-img class="mt-1" src="../assets/logo.png" style="width: 20px;"></v-img>
      <v-tooltip bottom>
        <span>Source</span>
      </v-tooltip>
    </v-toolbar>
    <v-card-text>
      <v-form style="margin-bottom: -20px;">
        <v-text-field
          v-model="username"
          label="Username"
          name="login"
          prepend-icon="mdi-account"
          type="text"
          required
        ></v-text-field>

        <v-text-field
          id="password"
          label="Senha"
          name="password"
          v-model="password"
          prepend-icon="mdi-lock"
          type="password"
          required
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      {{ messageError }}
      <v-btn color="primary" @click="login" large class="mr-4">Login</v-btn>
    </v-card-actions>
    <!--
    <v-card-text class="mt-3">
      <p style="text-align: center; font-size: 1.2em;">
        Não tem conta?
        <a href="#" style="text-decoration: none;">
          <strong>CADASTRE-SE</strong>
        </a>.
      </p>
    </v-card-text>
    -->
  </v-card>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      messageError: ""
    };
  },
  methods: {
    async login() {
      try{
        await this.$store.dispatch("obtainToken", {
        username: this.username,
        password: this.password
      });
      await this.$router.push({
        name: "home"
      });
      }catch(err){
        this.messageError = "Você ainda nao verificou o seu email";
      }
      
    }
  }
};
</script>