<template>
  <v-row>
    <v-navigation-drawer
      class="ml-6 mt-3 mr-3"
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
      color="#63B0B0"
      dark
    >
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-title>John Leider</v-list-item-title>

        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block v-if="!mini">Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-col class="ml-6 mr-6">
      <v-row>
        <v-app-bar color="#63B0B0" height="60%">
          <v-toolbar-title style="font-size:1.4em; color:white;">Seus Domínios</v-toolbar-title>
        </v-app-bar>
        <v-container>
          <v-row>
            <v-spacer></v-spacer>
            <h3 class="pt-8 pb-12">Você não tem nenhum domínio atualmente...</h3>
            <v-spacer></v-spacer>
          </v-row>
          <v-row>
            <v-dialog v-model="dialog" persistent max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn
                  class="mx-auto"
                  width="50%"
                  x-large
                  color="primary"
                  dark
                  v-on="on"
                >Criar Novo Domínio</v-btn>
              </template>

              <v-card>
                <v-card-title style="background-color:#63B0B0; color:white;">
                  <span class="headline">
                    <p>Defina o domínio do conhecimento a ser modelado</p>
                  </span>
                </v-card-title>
                <v-card-text>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                      v-model="domainName"
                      :counter="20"
                      :rules="domainNameRules"
                      label="Dominío modelado"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model="contentTitle"
                      :rules="contentTitleRules"
                      label="Título para o conteúdo modelado"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model="authorsName"
                      :rules="authorsNameRules"
                      label="Autor(es) da modelagem"
                      required
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red" height="49" dark large @click="reset">
                    Close
                    <v-icon dark right>mdi-close</v-icon>
                  </v-btn>
                  <v-btn
                    color="success"
                    height="49"
                    dark
                    large
                    @click="validate;$router.push('/Create/Conceitual')"
                  >
                    Save
                    <v-icon dark right>mdi-content-save</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </v-container>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "UserHome",
  data: () => ({
    valid: true,
    dialog: false,
    domainName: "",
    domainNameRules: [
      v => !!v || "É necessário descrever o nome do domínio modelado",
      v =>
        (v && v.length <= 25) ||
        "Nome do domínio deve ter no máximo 25 caracteres"
    ],
    contentTitle: "",
    contentTitleRules: [
      v => !!v || "É necessário descrever o título para o conteúdo modelado",
      v =>
        (v && v.length <= 40) ||
        "O título do conteúdo modelado deve ter no máximo 40 caracteres"
    ],
    authorsName: "",
    authorsNameRules: [
      v => !!v || "É necessário descrever o(s) autores da modelagem",
      v =>
        (v && v.length <= 60) ||
        "Os nomes dos autores devem ter no máximo 60 caracteres"
    ],

    drawer: true,
    items: [
      { title: "Home", icon: "mdi-home-city" },
      { title: "My Account", icon: "mdi-account" },
      { title: "Users", icon: "mdi-account-group-outline" }
    ],
    mini: false
  }),
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>

<style>
</style>