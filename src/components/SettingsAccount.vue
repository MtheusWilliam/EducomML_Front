<template>
  <v-row>
    <v-col style="max-width: 277px;" class="ml-4">
      <v-app-bar color="#B19114" dense dark style="height:65px; ">
        <v-toolbar-title style="font-size:1.2em; color:white;" class="mt-4">Configurações Pessoais</v-toolbar-title>
      </v-app-bar>
      <v-navigation-drawer permanent>
        <v-list-item style="height: 70px;">
          <v-list-item-content>
            <v-row>
              <v-col cols="3">
                <v-list-item-avatar>
                  <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                </v-list-item-avatar>
              </v-col>
              <v-col cols="8" class="d-flex align-center">
                <v-list-item-title style="font-size: 0.9em;">
                  <strong>{{$store.state.username}}</strong>
                </v-list-item-title>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense nav>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            :style="item.style"
            @click="routerLink(item.link)"
          >
            <v-list-item-content>
              <v-list-item-title style="font-size: 0.9em;">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-col>
    <v-col class="mr-4" style="margin-left: -10px;">
      <v-app-bar color="#B19114" dense dark style="height:65px;">
        <v-toolbar-title style="font-size:1.4em; color:white;" class="mt-3">Conta</v-toolbar-title>
      </v-app-bar>
      <v-card>
        <v-card-text>
          <v-form style="margin-bottom: -20px;">
            <v-text-field id="username" label="Username" v-model="username" type="text" required></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" height="49" dark @click.prevent="submit()" large class="mr-2">
            Atualizar perfil
            <v-icon dark right>mdi-content-save</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Api from "@/services/Api";
export default {
  name: "SettingsAccount",
  data: () => ({
    search: "",
    valid: true,
    dialog: false,
    dialogLoading: false,
    lastversion: "versao_teste",
    alertDelete: false,
    username: "",
    drawer: true,
    items: [
      {
        title: "Perfil",
        icon: "mdi-view-dashboard",
        style: "background-color: white;",
        link: "/settings/profile/",
      },
      {
        title: "Conta",
        icon: "mdi-image",
        style: "background-color: white;",
        link: "/settings/account/",
      },
      {
        title: "Senha",
        icon: "mdi-help-box",
        style: "background-color: white;",
        link: "/settings/password/",
      },
    ],
    right: null,
    mini: false,
  }),
  mounted() {
    this.getUserParameters();
  },
  methods: {
    routerLink(link) {
      this.$router.push({ path: link });
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.$refs.form.validate();
      }
    },
    reset() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    setSearch(s) {
      this.search = s;
    },
    async submit() {
      await this.getUser().then(async (res) => {
        await Api().put(res.data.url, {
          username: this.username,
          password: "º",
        });
      });
    },
    async getUser() {
      return await Api().post("userId/", {
        username: this.$store.state.username,
      });
    },
    async getUserParameters() {
      var vm = this;
      await this.getUser().then(
        async (res) =>
          await Api()
            .get(res.data.url)
            .then((response) => {
              vm.username = response.data.username;
            })
      );
    },
  },
};
</script>

<style></style>
