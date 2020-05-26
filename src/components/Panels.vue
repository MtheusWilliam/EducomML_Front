<template>
  <v-row>
    <v-expansion-panels>
      <v-expansion-panel v-for="(item,i) in 1" :key="i">
        <v-expansion-panel-header color="purple" style="color:white;">
          <v-row>
            <v-col cols="9">
              <p>
                [Dominio]
                {{ dominio_data.nameknowledgedomain }}
              </p>
            </v-col>
            <v-col cols="3">
            <!--Formulario para adição do módulo-->
              <v-dialog v-model="dialog_modulo" persistent="persistent" max-width="600px">
                <template v-slot:activator="{ on }">
                  <v-btn icon="icon" color="white" v-on="on">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>

                <ModuloDialog @close_or_save="close_or_save_modulo"  :domain="dominio" />
                
              </v-dialog>

              <!--Formulario para edição do domínio-->
              <v-dialog v-model="dialog_dominio" persistent="persistent" max-width="600px">
                <template v-slot:activator="{ on }">
                  <v-btn icon="icon" color="white" v-on="on">
                    <v-icon>mdi-view-headline</v-icon>
                  </v-btn>
                </template>

                <DominioDialog @close_or_save="close_or_save_dominio" @dominio_data="setDomainVariables"  :domain="dominio_data" />

              </v-dialog>
              
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          {{ dominio_data.subtitle }}
          <v-expansion-panels v-for="(modulo) in modulos" :key="modulo.idmodule">
            <v-expansion-panel>
              <v-expansion-panel-header>[Modulo] {{ modulo.namemodule }}</v-expansion-panel-header>

              <v-expansion-panel-content>{{ modulo.subtitle }}</v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>
<script>
import DominioDialog from "./concept_model/DominioDialog";
import ModuloDialog from "./concept_model/ModuloDialog";
// import ConceitoDialog from "./concept_model/ConceitoDialog";
import axios from "axios";
export default {
  name: "Panels",
  components: {
    ModuloDialog,
    DominioDialog
  },
  props: ["dominio"],
  data: () => ({
    valid_modulo: true,
    dialog_modulo: false,
    dialog_dominio: false,
    select: null,
    newItems: ["Módulo", "SubMódulo"],
    modulos: "",
    checkbox: false,
    /*ATRIBUTOS DO DOMINIO*/
    dominio_data: {},
    
  }),
  mounted() {
    /* Função que "atrasa" atualização da variável para conseguir pegar dados do
     * props:[]
     */
    
    var vm = this;
    setTimeout(function() {
      vm.setDomainVariables(vm.dominio);
    }, 1000);

  },
  computed: {
    nomeDominioPanel: function() {
      return this.domainName;
    }
  },
  methods: {
    validate() {
      if (
        this.domainName &&
        this.domainContentTitle &&
        this.domainAuthorsName
      ) {
        this.putDominio();
        this.dialog_dominio = false;
      }
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    reset() {
      this.dialog_dominio = false;
      this.setDomainVariables();
    },
    setDomainVariables(dominio_data) {
      console.log("s")
      this.dominio_data = dominio_data;
      console.log(this.dominio_data);
      this.getModulos();
    },
    getModulos(){
      var vm = this;
      axios
        .get("http://127.0.0.1:8000/module/", {
          auth: {
            username: "admin",
            password: "admin"
          }
        })
        .then(function(resposta) {
          vm.modulos = resposta.data;
        });
    },
    close_or_save_modulo(value){
      if(value === "save"){
        this.getModulos();
        this.dialog_modulo = false;
      }else{
        console.log("oi chuchu");
        this.dialog_modulo = false;
      }
    },
    close_or_save_dominio(value){
      if(value === "save"){

        this.dialog_dominio = !this.dialog_dominio;
      }else{
        this.dialog_dominio = !this.dialog_dominio;
      }
    }
  }
};
</script>
<style></style>