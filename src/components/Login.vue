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
      <a @click="resetPassword = !resetPassword;" class="ml-5">
        <span v-if="!resetPassword">Esqueceu a senha?</span>
        <span v-else>Voltar</span>
      </a>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="login" large class="mr-4">
        <span v-if="!resetPassword">Login</span>
        <span v-else>Enviar Email</span>
      </v-btn>
    </v-card-actions>
    <div class="text-center">
      <v-dialog v-model="dialogError" width="500">
        <v-card>
          <v-card-title :class="messageClass" primary-title style="color:white;">{{messageTitle}}</v-card-title>
          <v-card-text class="mt-3" style="font-size: 1.3em;">{{message}}</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialogError = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      email: "",
      emailRules: [
        v => !!v || "É necessário inserir seu e-mail",
        v => /.+@.+\..+/.test(v) || "É necessário inserir um e-mail válido"
      ],
      resetPassword: false,
      dialogError: false,
      messageClass: "",
      messageTitle: "",
      message: ""
    };
  },
  methods: {
    async login() {
      if (this.resetPassword) {
        await this.axios
          .post(
            "http://localhost:8000/reset-password/",
            {
              email: this.email
            },
            {
              headers: {
                "Access-Control-Allow-Origin": "*"
              }
            }
          )
          .then(response => {
            if (response.data.status) {
              this.messageTitle = "Email enviado!";
              this.messageClass = "headline green";
            } else {
              this.messageTitle = "Erro na redefinição de senha!";
              this.messageClass = "headline red";
            }
            this.message = response.data.message;
            this.dialogError = true;
          });
      } else {
        try {
          await this.$store.dispatch("obtainToken", {
            username: this.username,
            password: this.password
          });
          await this.$router.push({
            name: "home"
          });
        } catch (err) {
          this.messageClass = "headline red";
          this.messageTitle = "Erro no Login!";
          this.message =
            "Verifique login e senha inseridos e se o cadastro da sua conta já foi confirmada";
          this.dialogError = true;
        }
      }
    }
  }
};
</script>