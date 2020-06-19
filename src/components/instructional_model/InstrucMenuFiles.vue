<template>
  <v-card width="260px" max-width="300px">
    <v-card-title style="background-color:#63B0B0; color:white;">
      <span>Elementos Instrucionais</span>
    </v-card-title>
    <v-list>
      <v-row v-for="(item,i) in items" :key="i">
        <v-list-item @click="option(item)">
          <v-spacer></v-spacer>

          <v-list-item-title class="ml-2" style="color: #2196F3
">
            <v-icon color="blue">{{item.icon}}</v-icon>
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
  name: "InstrucMenuFiles",
  props: ["instrucOptionCall", "instrucType"],

  data: () => ({
    items: [
      {
        icon: "mdi-clipboard-text",
        name: "Exercício",
        valueType: 1
      },
      {
        icon: "mdi-clipboard-check",
        name: "Avaliação",
        valueType: 2
      },
      {
        icon: "mdi-account-switch",
        name: "Atividade Colaborativa",
        valueType: 3
      }
    ]
  }),
  methods: {
    option(value) {
      this.$emit("instrucdialogoption", {
        name: value.name,
        optionCall: this.instrucOptionCall,
        type: this.instrucType,
        valueType: value.valueType
      });
    }
  }
};
</script>
