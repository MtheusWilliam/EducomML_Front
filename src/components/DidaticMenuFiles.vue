<template>
  <v-card width="230px" max-width="350px">
    <v-card-title style="background-color:#63B0B0; color:white;">
      <span>Modelo Didático</span>
    </v-card-title>
    <v-list>
      <v-row v-for="(item,i) in items" :key="i">
        <v-list-item @click="option(item)">
          <v-spacer></v-spacer>
          <v-list-item-title class="ml-2" style="color: #2196F3">
            <!-- <v-icon color="blue">{{item.icon}}</v-icon> -->
            {{ item.name }}
          </v-list-item-title>
          <v-spacer></v-spacer>
        </v-list-item>
      </v-row>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: "DidaticMenuFiles",

  data: () => ({
    items: [
      {
        // icon: "mdi-clipboard-text",
        name: "Visibilidade de Elementos",
        valueType: 1,
      },
      {
        // icon: "mdi-clipboard-check",
        name: "Conhecimentos Prévios",
        valueType: 3,
      },
      {
        // icon: "mdi-account-switch",
        name: "Parâmetros de Avaliação",
        valueType: 2,
      },
    ],
  }),
  methods: {
    option(value) {
      this.$emit("didaticdialogoption", {
        type: value.valueType,
      });
    },
  },
};
</script>
