<template>
  <v-card class="elevation-12 mx-auto" style="position:relative;top:20vh;" width="50vw">
    <v-toolbar color="black" flat>
      <v-toolbar-title style="color:#FFCC00;">Crie sua conta no Educom.ML</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-img class="mt-1" src="../assets/logo.png" style="width: 20px;" max-width="200"></v-img>
      <v-tooltip bottom>
        <span>Source</span>
      </v-tooltip>
    </v-toolbar>
    <v-card-text>
      <v-form style="margin-bottom: -20px;" ref="form">
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
          type="email"
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
          id="passwordConfirm"
          label="Confirmação de Senha"
          name="passwordConfirm"
          v-model="passwordConfirm"
          type="password"
          :rules="[passwordConfirmationRule]"
          prepend-icon="mdi-lock"
          required
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <a @click="redirectLogin()" class="ml-5">
        <span>Já possui uma conta? Faça seu Login</span>
      </a>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="validate()" large class="mr-4">Cadastrar</v-btn>
    </v-card-actions>
    <div class="text-center">
      <v-dialog v-model="dialogError" width="550">
        <v-card>
          <v-card-title :class="messageClass" primary-title style="color:white;">{{ messageTitle }}</v-card-title>
          <v-card-text class="mt-3" style="font-size: 1.3em;">
            {{
            messageError
            }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialogError = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="text-center">
      <v-dialog v-model="dialogLoading" max-width="290" persistent="persistent">
        <v-card color="primary" dark>
          <v-card-text style="color:white;">
            <v-row class="pt-2 pb-3">
              <br />
              <v-spacer></v-spacer>
              <span style="font-size: 1.3em; color:white;">{{ dialogLoadingMessage }}</span>
              <v-spacer></v-spacer>
            </v-row>
            <v-row>
              <v-spacer></v-spacer>
              <v-progress-circular indeterminate color="white" class="mb-0"></v-progress-circular>
              <v-spacer></v-spacer>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </v-card>
</template>

<script>
import Api from "@/services/Api";
export default {
  name: "SignUp",
  data() {
    return {
      dialog: false,
      dialogLoading: false,
      dialogLoadingMessage: "Enviando e-mail de confirmação",
      username: "",
      usernameRules: [
        (v) => !!v || "É necessário inserir seu username",
        (v) =>
          (v && v.length <= 25) ||
          "Seu username deve possuir menos de 25 caracteres",
      ],
      name: "",
      nameRules: [
        (v) => !!v || "É necessário inserir seu nome",
        (v) =>
          (v && v.length <= 30) ||
          "Seu nome deve possuir menos de 30 caracteres",
      ],
      lastname: "",
      lastnameRules: [
        (v) => !!v || "É necessário inserir seu sobrenome",
        (v) =>
          (v && v.length <= 30) ||
          "Seu sobrenome deve possuir menos de 30 caracteres",
      ],
      email: "",
      emailRules: [
        (v) => !!v || "É necessário inserir seu e-mail",
        (v) => /.+@.+\..+/.test(v) || "É necessário inserir um e-mail válido",
      ],
      password: "",
      passwordRules: [
        (v) => !!v || "É necessário inserir sua senha",
        (v) =>
          (v && v.length <= 8) ||
          "Sua senha deve possuir no mínimo 8 caracteres",
      ],
      passwordConfirm: "",
      user_url: "",
      messageClass: "",
      messageTitle: "",
      messageError: "",
      dialogError: "",
    };
  },
  computed: {
    passwordConfirmationRule() {
      return () =>
        this.password === this.passwordConfirm || "As senhas devem ser iguais";
    },
  },
  async mounted() {
    var usr = await this.getUser();
    console.log(usr.password);
    if (usr) {
      this.user_url = usr.url;
      this.username = usr.username.toLowerCase();
      this.email = usr.email;
      this.first_name = usr.name;
      this.last_name = usr.lastname;
      this.password = usr.password;
    }
  },
  methods: {
    async postOrPutUser() {
      var usr = {
        username: this.username.toLowerCase(),
        email: this.email,
        first_name: this.name,
        last_name: this.lastname,
        password: this.password,
        is_active: false,
      };
      var auth = {
        auth: {
          username: "admin",
          password: "admin",
        },
      };

      try {
        if (this.user_url) await Api().put(this.user_url, usr, auth);
        else await Api().post("/users/", usr, auth);
      } catch (err) {
        console.log(err);
      }
    },

    async validate() {
      if (this.$refs.form.validate()) {
        this.dialogLoading = true;
        try {
          await this.$refs.form.validate();
          await this.postOrPutUser();
          this.messageClass = "headline green";
          this.messageTitle = "Email de confirmação enviado com sucesso";
          this.messageError =
            "Enviamos um email de confirmação para você. Verifique a caixa de mensagens do seu email para ativar sua conta.";
          this.dialogLoading = false;
          this.dialogError = true;
        } catch (err) {
          this.messageClass = "headline red";
          this.messageTitle = "Erro";
          this.messageError =
            "O username ou email já estão sendo utilizados na plataforma";
          this.dialogLoading = false;
          this.dialogError = true;
        }
      }
    },
    async firstLogin() {
      await this.$store.dispatch("obtainToken", {
        username: this.username,
        password: this.password,
      });
      await this.$router.push({
        name: "home",
      });
    },
    async redirectLogin() {
      this.$router.push({
        name: "login",
      });
    },
    async getUser() {
      var usr;
      try {
        await Api()
          .post("/userId/", {
            username: this.$store.state.username,
          })
          .then(async (response) => {
            await Api()
              .get(response.data.url)
              .then((response) => (usr = response.data));
          });
      } catch (error) {
        usr = null;
      }
      return usr;
    },
  },
};
</script>
