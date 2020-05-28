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
    dominio_data: "dominio",
    treeData: [
      {
        id: 1,
        name: "Applications :",
        children: [
          { id: 2, name: "Calendar : app" },
          { id: 3, name: "Chrome : app" },
          { id: 4, name: "Webstorm : app" }
        ]
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
      vm.setDomainVariables();
    }, 650);
  },
  updated() {
    var vm = this;
    setTimeout(function() {
      vm.dominio_data = vm.dominio;
      vm.setDomainVariables();
    }, 650);
  },
  methods: {
    setDomainVariables() {
      console.log(this.dominio_data.modules[0].namemodule);
      /*this.treeData = arrayIOfObj;*/
      /*console.log(this.treeData);*/
    }
  }
};
</script>