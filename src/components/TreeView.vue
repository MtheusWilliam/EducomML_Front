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
  data: () => ({
    treeData: [
      {
        id: 1,
        name: "[Domínio] :",
        children: [
          { id: 2, name: "[Módulo] Módulo1" },
          { id: 3, name: "[Módulo] Módulo2" },
          { id: 4, name: "[Módulo] Módulo3" }
        ]
      }
    ],

    elementTypes: {
      dominio: "Domínio",
      modulo: "Módulo",
      subModulo: "SubMódulo",
      conceito: "Conceito",
      subConceito: "SubConceito"
    },
    open: []
  })
};
</script>
