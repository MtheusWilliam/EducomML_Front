<template>
  <v-row>
    <v-expansion-panels>
      <v-expansion-panel v-for="(item,i) in 1" :key="i">
        <v-expansion-panel-header color="red" style="color:white;">
          <v-row>
            <v-col cols="9">
              <p>[Dominio]</p>
            </v-col>
            <v-col cols="3">
              <v-dialog v-model="dialog_modulo" persistent="persistent" max-width="600px">
                <template v-slot:activator="{ on }">
                  <v-btn icon="icon" color="white" v-on="on">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>

                <ConceitoDialog />
              </v-dialog>

              <!--Formulario para edição do domínio-->
              <v-dialog v-model="dialog_dominio" persistent="persistent" max-width="600px">
                <template v-slot:activator="{ on }">
                  <v-btn icon="icon" color="white" v-on="on">
                    <v-icon>mdi-view-headline</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title style="background-color:#63B0B0; color:white;">
                    <span class="headline">
                      <p>Defina o submódulo do domínio do conhecimento.</p>
                    </span>
                  </v-card-title>
                  <v-card-text>
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-text-field
                        v-model="subModuloTitle"
                        :rules="subModuloTitleRules"
                        label="Título do submódulo"
                        required
                      ></v-text-field>

                      <v-text-field
                        v-model="subModuloSubtitle"
                        :rules="subModuloSubtitleRules"
                        label="Subtítulo do submódulo"
                        required
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" height="49" dark large @click="reset">
                      Close
                      <v-icon dark right>mdi-close</v-icon>
                    </v-btn>
                    <v-btn color="success" height="49" dark large @click="validate">
                      Save
                      <v-icon dark right>mdi-content-save</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content></v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
</template>
<script>
// import DominioDialog from "./DominioDialog";
//import SubModuloDialog from "./SubModuloDialog";
import ConceitoDialog from "./ConceitoDialog";
import axios from "axios";
export default {
  name: "ModuloPanel",
  components: {
    ConceitoDialog,
    valid: true,
    subModuloTitle: "",
    subModuloTitleRules: [
      v => !!v || "É necessário descrever o título do submódulo",
      v =>
        (v && v.length <= 40) ||
        "O título do módulo deve ter no máximo 40 caracteres"
    ],
    subModuloSubtitle: "",
    subModuloSubtitleRules: [
      v => !!v || "É necessário descrever o subtítulo do submódulo",
      v =>
        (v && v.length <= 40) ||
        "O subtítulo do módulo deve ter no máximo 40 caracteres"
    ],
    select: null,
    newItems: [],
    checkbox: false,
    modulos: ""
  },
  props: ["dominio"],
  data: () => ({})
};
</script>
<style></style>