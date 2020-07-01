<template>
  <v-card class="elevation-12">
    <v-toolbar color="#63B0B0" flat>
      <v-toolbar-title style="color:white;">Faça seu login no Educom.ML</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-img class="mt-1" src="../assets/logo.svg" style="width: 20px;"></v-img>
      <v-tooltip bottom>
        <span>Source</span>
      </v-tooltip>
    </v-toolbar>
    <v-card-text>
      <v-form style="margin-bottom: -20px;">
        <v-text-field
          v-model="username"
          label="Login"
          name="login"
          prepend-icon="mdi-account"
          type="text"
          required
        ></v-text-field>

        <v-text-field
          id="password"
          label="Password"
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
      <v-btn color="primary" @click="login" large class="mr-4">Login</v-btn>
    </v-card-actions>
    <!--
    <v-card-text class="mt-3">
      <p style="text-align: center; font-size: 1.2em;">
        Não tem conta?
        <a href style="text-decoration: none;">
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
      password: ""
    };
  },
  methods: {
    async login() {
      await this.$store.dispatch("obtainToken", {
        username: this.username,
        password: this.password
      });
      await this.$router.push({
        name: "home"
      });
    }
  }
};
</script>