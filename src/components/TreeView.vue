<template>
  <v-container>
    <div class="ml-4">
      <v-app-bar color="#63B0B0" dense dark>
        <v-spacer />
        <v-toolbar-title>Modelo Conceitual</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-app-bar>
    </div>
    <v-treeview open-all :items="treeData"></v-treeview>
  </v-container>
</template>
    
<script>
export default {
  name: "TreeView",
  props: ["dominio"],
  data: () => ({
    dominio_data: "dominaio",
    treeData: [
      {
        id: 1,
        name: "",
        children: [{}]
      }
    ],

    elementTypes: {
      dominio: "Domínio",
      modulo: "Módulo",
      subModulo: "SubMódulo",
      conceito: "Conceito"
    },
    open: []
  }),
  mounted() {
    var vm = this;
    setTimeout(function() {
      vm.dominio_data = vm.dominio;
      console.log("TIMEOUT");
      vm.setDomainVariables();
    }, 650);
  },
  methods: {
    setDomainVariables() {
      this.treeData[0].name = this.dominio_data.nameknowledgedomain;
    }
  },
};
</script>
