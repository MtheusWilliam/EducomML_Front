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
      <v-btn color="primary" @click="validate()" large class="mr-4">Resetar Senha</v-btn>
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
  name: "ResetPassword",
  data() {
    return {
      password: "",
      passwordRules: [v => !!v || "É necessário inserir sua senha"],
      passwordConfirm: "",
      messageError: ""
    };
  },
  computed: {
    passwordConfirmationRule() {
      return () =>
        this.password === this.passwordConfirm || "As senhas devem ser iguais";
    }
  },
  methods: {
    async validate() {
        await this.axios.post('http://localhost:8000/update-password/',{
            username: this.$route.params.username,
            password: this.password,
        },{
            headers: {
                "Authorization": "JWT " + this.$route.params.token,
            }
        }).then(response => {
          this.$store.commit('updateToken',response.data.token);
          this.$store.commit('updateUsername',response.data.username);
          this.$router.push('/home');
        });
    }
  }
};
</script>