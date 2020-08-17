<template>
  <div>
    <v-menu bottom origin="center center" transition="slide-x-transition">
      <template v-slot:activator="{ on }">
        <v-list-item-avatar v-on="on">
          <img src="https://randomuser.me/api/portraits/men/81.jpg" />
        </v-list-item-avatar>
      </template>

      <v-list dense nav class="py-0">
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/men/81.jpg" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Name</v-list-item-title>
            <v-list-item-subtitle>lastname</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item v-for="item in items" :key="item.title" @click="goTo(item.path)" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "UserMenu",
  data: () => ({
    items: [
      { title: "Home", icon: "mdi-home", path: "/" },
      { title: "Configurações", icon: "mdi-account-settings", path: "/signup" },
      { title: "Sair", icon: "mdi-exit-to-app", path: "logout" },
    ],
  }),
  methods: {
    goTo(path) {
      if (path === "logout") {
        this.$store.dispatch("logout");
        this.$router.push({ path: "/" });
      } else {
        this.$router.push({ path: path });
      }
    },
  },
};
</script>
