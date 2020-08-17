<template>
  <div>
    <v-list-item class="px-2" style="height:65px;">
      <v-list-item-avatar v-if="searchBool">
        <v-img class="white">
          <h3 class="mx-auto mt-2 black--text">DM</h3>
        </v-img>
      </v-list-item-avatar>

      <v-list-item-title v-if="searchBool">Dominios</v-list-item-title>

      <v-btn icon v-if="searchBool" @click="searchBool = !searchBool">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-divider></v-divider>
      <v-text-field
        background-color="#B19114"
        style="color:white;"
        v-if="!searchBool"
        v-model="search"
        dark
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn
        icon
        v-if="!searchBool"
        @click="
          searchBool = !searchBool;
          search = '';
        "
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-list-item>
    <v-list-item v-for="domain in domains" :key="domain.url">
      <v-list-item-content>
        <v-list-item-title>{{ domain.nameknowledgedomain }}</v-list-item-title>
        <v-list-item-subtitle>{{ domain.subtitle }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
export default {
  name: "ListDomain",
  props: ["domains"],
  data: () => ({
    searchBool: true,
    search: "",
  }),
  watch: {
    search() {
      this.$emit("emitDomains", this.search);
    },
  },
};
</script>
