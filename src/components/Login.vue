<template>
  <v-card class="elevation-12 mx-auto" style="position:relative;top:20vh;" width="50vw">
    <v-toolbar color="black" flat>
      <v-toolbar-title style="color:#FFCC00;">Faça seu login no Educom.ML</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-img class="mt-1" src="../assets/logo.png" style="width: 20px;" max-width="200"></v-img>
      <v-tooltip bottom>
        <span>Source</span>
      </v-tooltip>
    </v-toolbar>
    <v-card-text>
      <v-form style="margin-bottom: -20px;">
        <v-text-field
          v-if="!resetPassword"
          v-model="username"
          label="Username"
          name="login"
          prepend-icon="mdi-account"
          type="text"
          required
        ></v-text-field>

        <v-text-field
          v-if="!resetPassword"
          id="password"
          label="Senha"
          name="password"
          v-model="password"
          prepend-icon="mdi-lock"
          type="password"
          required
        ></v-text-field>

        <v-text-field
          v-if="resetPassword"
          id="email"
          label="E-mail"
          name="email"
          :rules="emailRules"
          v-model="email"
          prepend-icon="mdi-email"
          type="email"
          required
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <a @click="resetPassword = !resetPassword" class="ml-5">
        <span v-if="!resetPassword">Esqueceu a senha?</span>
        <span v-else>Voltar</span>
      </a>
      <v-spacer></v-spacer>
      <a @click="redirectSignUp()" class="ml-5">
        <span>Não possui uma conta? Faça seu cadastro</span>
      </a>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="login" large class="mr-4">
        <span v-if="!resetPassword">Login</span>
        <span v-else>Enviar Email</span>
      </v-btn>
    </v-card-actions>
    <div class="text-center">
      <v-dialog v-model="dialogMessage" width="500">
        <v-card>
          <v-card-title :class="messageClass" primary-title style="color:white;">{{ messageTitle }}</v-card-title>
          <v-card-text class="mt-3" style="font-size: 1.3em;">{{ message }}</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialogMessage = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-card>
</template>

<script>
import Api from "@/services/Api";
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      email: "",
      emailRules: [
        (v) => !!v || "É necessário inserir seu e-mail",
        (v) => /.+@.+\..+/.test(v) || "É necessário inserir um e-mail válido",
      ],
      resetPassword: false,
      dialogMessage: false,
      messageClass: "",
      messageTitle: "",
      message: "",
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
  },
  methods: {
    async login() {
      if (this.resetPassword) {
        await Api()
          .post(
            "/reset-password/",
            {
              email: this.email,
            },
            {
              auth: {
                username: "admin",
                password: "admin",
              },
            }
          )
          .then((response) => {
            if (response.data.status) {
              this.messageTitle = "Email enviado!";
              this.messageClass = "headline green";
            } else {
              this.messageTitle = "Erro na redefinição de senha!";
              this.messageClass = "headline red";
            }
            this.message = response.data.message;
            this.dialogMessage = true;
          });
      } else {
        await this.$store
          .dispatch("obtainToken", {
            username: this.username,
            password: this.password,
          })
          .then(() => {
            if (this.$store.state.jwt) {
              this.$router.push({ path: "/home" });
            } else {
              this.messageClass = "headline red";
              this.messageTitle = "Erro no Login!";
              this.message =
                "Verifique login e senha inseridos e se o cadastro da sua conta já foi confirmada";
              this.dialogMessage = true;
            }
          });
      }
    },
    async redirectSignUp() {
      this.$router.push({
        name: "signup",
      });
    },
  },
};
</script>
