<template>
  <v-card class="elevation-12">
    <v-toolbar color="#63B0B0" flat>
      <v-toolbar-title style="color:white;">Crie sua conta no Educom.ML</v-toolbar-title>
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
          label="Username"
          name="username"
          :rules="usernameRules"
          prepend-icon="mdi-account"
          required
        ></v-text-field>

        <v-text-field
          v-model="name"
          label="Nome"
          name="name"
          :rules="nameRules"
          prepend-icon="mdi-account"
          required
        ></v-text-field>

        <v-text-field
          v-model="lastname"
          label="Sobrenome"
          name="lastname"
          :rules="lastnameRules"
          prepend-icon="mdi-account"
          required
        ></v-text-field>

        <v-text-field
          id="email"
          label="E-mail"
          name="email"
          :rules="emailRules"
          v-model="email"
          prepend-icon="mdi-email"
          required
        ></v-text-field>

        <v-text-field
          id="password"
          label="Senha"
          name="password"
          v-model="password"
          :rules="passwordRules"
          type="password"
          prepend-icon="mdi-lock"
          required
        ></v-text-field>

        <v-text-field
          id="password"
          label="Confirmação de Senha"
          name="password"
          v-model="passwordConfirm"
          type="password"
          :rules="passwordConfirmRules"
          prepend-icon="mdi-lock"
          required
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="login" large class="mr-4">Cadastrar</v-btn>
    </v-card-actions>
    <!--
    <v-card-text class="mt-3">
      <p style="text-align: center; font-size: 1.2em;">
        Já possui conta?
        <a href style="text-decoration: none;">
          <strong>ENTRE</strong>
        </a>.
      </p>
    </v-card-text>
    -->
  </v-card>
</template>

<script>
export default {
  name: "SignUp",
  data() {
    return {
      username: "",
      usernameRules: [
        v => !!v || "É necessário inserir seu username",
        v =>
          (v && v.length <= 10) ||
          "Seu username deve possuir menos de 30 caracteres"
      ],
      name: "",
      nameRules: [
        v => !!v || "É necessário inserir seu nome",
        v =>
          (v && v.length <= 30) ||
          "Seu nome deve possuir menos de 30 caracteres"
      ],
      lastname: "",
      lastnameRules: [
        v => !!v || "É necessário inserir seu sobrenome",
        v =>
          (v && v.length <= 30) ||
          "Seu sobrenome deve possuir menos de 30 caracteres"
      ],
      email: "",
      emailRules: [
        v => !!v || "É necessário inserir seu e-mail",
        v => /.+@.+\..+/.test(v) || "É necessário inserir um e-mail válido"
      ],
      password: "",
      passwordRules: [v => !!v || "É necessário inserir sua senha"],
      passwordConfirm: "",
      passwordConfirmRules: [v => !!v || "É necessário confirmar sua senha"]
    };
  },
  methods: {}
};
</script>