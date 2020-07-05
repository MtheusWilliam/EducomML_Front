<template>
  <v-card class="elevation-12">
    <v-toolbar color="black" flat>
      <v-toolbar-title style="color:#FFCC00;">Crie sua conta no Educom.ML</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-img class="mt-1" src="../assets/logo.png" style="width: 20px;"></v-img>
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
      <v-spacer></v-spacer>
      {{ messageError }}
      <v-btn color="primary" @click="validate()" large class="mr-4">Cadastrar</v-btn>
    </v-card-actions>
    <!--
    <v-card-text class="mt-3">
      <p style="text-align: center; font-size: 1.2em;">
        Já possui conta?
        <a href="#" style="text-decoration: none;">
          <strong>ENTRE</strong>
        </a>.
      </p>
    </v-card-text>
    -->
    <!--
    <div class="text-center">
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title
            class="headline primary"
            primary-title
            style="color:white;"
          >Cadastro Realizado!</v-card-title>
          <v-card-text class="mt-3" style="font-size: 1.3em;">Para prosseguir, faça seu login!</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text>Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    -->
  </v-card>
</template>

<script>
export default {
  name: "SignUp",
  data() {
    return {
      dialog: false,
      username: "",
      usernameRules: [
        v => !!v || "É necessário inserir seu username",
        v =>
          (v && v.length <= 25) ||
          "Seu username deve possuir menos de 25 caracteres"
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
      messageError: "",
    };
  },
  computed: {
    passwordConfirmationRule() {
      return () =>
        this.password === this.passwordConfirm || "As senhas devem ser iguais";
    }
  },
  methods: {
    async postUser() {
      
      await this.axios.post(
        "http://localhost:8000/users/",
        {
          username: this.username.toLowerCase(),
          email: this.email,
          first_name: this.name,
          last_name: this.lastname,
          password: this.password,
          is_active: false
        },
        {
          auth: {
            username: "admin",
            password: "admin"
          }
        }
      );
    },
    async validate() {
      if (this.$refs.form.validate()) {
        try{
        await this.$refs.form.validate();
        await this.postUser();
        this.messageError = "Porfavor verifique o seu email";
        this.dialog = false;
        }catch(err){
        this.messageError = "O username já existe"
      }
      }
    },
    async firstLogin() {
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