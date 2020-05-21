<template>
  <v-row>
    <v-expansion-panels>
      <v-expansion-panel v-for="(item,i) in 1" :key="i">
        <v-expansion-panel-header color="purple" style="color:white;">[Dominio]</v-expansion-panel-header>
        <v-expansion-panel-content>
          Informações do Domínio
          <v-expansion-panels>
            <v-expansion-panel v-for="(item,i) in 1" :key="i">
              <v-expansion-panel-header color="success" style="color:white;">[Modulo]</v-expansion-panel-header>
              <v-expansion-panel-content>Informações do Módulo</v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>
<script>
export default {
  name: "Panels"
};
</script>
<style>
</style>