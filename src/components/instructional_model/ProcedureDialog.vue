<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:#63B0B0; color:white;">
        <span class="headline">
          <p>Descreva o procedimento a ser criado.</p>
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation class="mt-3">
          <label class="pt-2" style="font-size:1.3em;" for="textShortArea">
            <strong>Escreva a descrição do procedimento:</strong>
          </label>
          <v-textarea
            id="textShortArea"
            v-model="procedureDescription"
            :rules="procedureDescriptionRules"
            background-color="#F2F3F3"
            clearable
            clear-icon="mdi-close-circle"
            class="mt-2"
            name="input-3-1"
            filled
            auto-grow
            required
          ></v-textarea>
          <v-app-bar color="#D2A64D" dense dark height="45px">
            <v-toolbar-title style="font-size:1.2em;">
              <strong>Lista de fases do procedimento</strong>
            </v-toolbar-title>
          </v-app-bar>
          <v-container>
            <v-row style="height:50px;">
              <v-col>
                <strong>
                  <p style="font-size:1.2em;">Descrição da fase</p>
                </strong>
              </v-col>
              <v-col cols="1">
                <v-btn icon="icon" class="mb-1">
                  <v-icon large class="mb-3" color="primary" @click="addPhase()">mdi-plus-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row v-for="(item,i) in phasesControl" :key="i">
              <v-text-field
                class="ml-3"
                v-model="phasesControl[i].description"
                :rules="phasesControlRules"
                label="Fase do procedimento"
                required
              ></v-text-field>
              <v-col cols="1" class="mt-2">
                <v-btn icon="icon" class="mb-1">
                  <v-icon large class="mb-1" color="red" @click="deletaPhase(i)">mdi-minus-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
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
  </v-container>
</template>

<script>
export default {
  name: "ProcedureDialog",
  props: ["optionCall", "type"],
  data: () => ({
    valid: true,
    phasesControl: [],
    phasesControlRules: [
      v =>
        !!v || "É necessário inserir algum conteúdo nessa etapa do procedimento"
    ],
    procedureDescription: "",
    procedureDescriptionRules: [
      v =>
        !!v ||
        "É necessário inserir uma descrição do procedimento a ser inserido"
    ]
  }),
  methods: {
    reset() {
      this.$emit("close");
    },
    addPhase() {
      this.phasesControl.push({
        description: null
      });
    },
    deletaPhase(idPhase) {
      if (idPhase == 0) {
        this.phasesControl.shift();
      } else {
        this.phasesControl.splice(idPhase, 1);
      }
    }
  }
};
</script>
