<template>
  <v-app class="px-0 mx-0">
    <v-app-bar
      v-if="this.$store.state.jwt"
      app
      color="white darken-3"
      dark
      dense
      flat
      style="height:60px;"
    >
      <div class="mt-5 d-flex align-center">
        <v-btn icon @click="$router.push({ path: '/home' })">
          <v-icon size="40" color="#B19114">mdi-home</v-icon>
        </v-btn>
      </div>

      <v-spacer></v-spacer>
      <div class="mt-5 d-flex align-center">
        <v-btn
          v-if="!$store.state.jwt"
          outlined
          color="#B19114"
          dark
          @click="$router.push({ path: '/signup' })"
          >CADASTRE-SE</v-btn
        >
        <v-btn
          v-if="!$store.state.jwt"
          class="ml-2"
          outlined
          color="#B19114"
          dark
          @click="$router.push({ path: '/login/ ' })"
          >Entrar</v-btn
        >
        <UserMenu class="ma-2" />
        <v-img
          class="ml-5"
          src="@/assets/logoblack.png"
          style="width: 150px;"
        ></v-img>
      </div>
    </v-app-bar>

    <v-content class="px-0 mx-0" style="width:200%;">
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
  import UserMenu from "@/components/UserMenu";
  export default {
    name: "App",
    components: {
      UserMenu,
    },
    data: () => ({}),
  };
</script>
