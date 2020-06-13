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
          <label class="pt-2" style="font-size:1.3em;" for="procedureNameArea">
            <strong>Identificador do procedimento:</strong>
          </label>
          <v-text-field
            id="procedureNameArea"
            v-model="procedureName"
            :counter="25"
            :rules="procedureNameRules"
            required
            class="mt-2 mb-4"
          ></v-text-field>
          <label class="pt-2" style="font-size:1.3em;" for="procedureDescriptionArea">
            <strong>Escreva a descrição do procedimento:</strong>
          </label>
          <v-textarea
            id="procedureDescriptionArea"
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
              <v-col cols="3">
                <strong>
                  <p style="font-size:1.2em;">Ordem da fase</p>
                </strong>
              </v-col>
              <v-col cols="8">
                <strong>
                  <p style="font-size:1.2em;">Descrição da fase</p>
                </strong>
              </v-col>
              <v-col cols="1">
                <v-btn icon="icon">
                  <v-icon large class="mb-3" color="primary" @click="addPhase()">mdi-plus-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row v-for="(item,i) in phasesControl" :key="i">
              <v-col cols="3" style="text-align:center; font-size: 1.8em; margin-top:20px;">{{i+1}}º</v-col>
              <v-col cols="8">
                <v-textarea
                  v-model="phasesControl[i].description"
                  background-color="#F2F3F3"
                  :rules="phasesControlRules"
                  rows="2"
                  clearable
                  clear-icon="mdi-close-circle"
                  filled
                  auto-grow
                  required
                ></v-textarea>
              </v-col>
              <v-col cols="1">
                <v-btn icon="icon">
                  <v-icon large color="red" @click="deletaPhase(i)">mdi-minus-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" height="49" dark large @click="reset()">
          Close
          <v-icon dark right>mdi-close</v-icon>
        </v-btn>
        <v-btn color="success" height="49" dark large @click="validate()">
          Save
          <v-icon dark right>mdi-content-save</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <div class="text-center">
      <v-dialog v-model="dialog_alert" width="500">
        <v-card>
          <v-card-title class="headline red" primary-title style="color:white;">ALERTA!</v-card-title>
          <v-card-text
            class="mt-3"
            style="font-size: 1.3em;"
          >Para criar um procedimento, é necessário criar pelo menos uma etapa.</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog_alert = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "ProcedureDialog",
  props: ["dialog", "procedure", "concept", "module"],
  data: () => ({
    valid: true,
    dialog_alert: false,
    auxItemInfo: "",
    phasesControl: [],
    phasesControlRules: [
      v =>
        !!v || "É necessário inserir algum conteúdo nessa etapa do procedimento"
    ],
    procedureName: "",
    procedureNameRules: [
      v => !!v || "É necessário descrever o nome do procedimento",
      v =>
        (v && v.length <= 25) ||
        "Nome do procedimento deve ter no máximo 25 caracteres"
    ],
    procedureDescription: "",
    procedureDescriptionRules: [
      v =>
        !!v ||
        "É necessário inserir uma descrição do procedimento a ser inserido"
    ]
  }),
  watch: {
    dialog: function() {
      var vm = this;
      this.$nextTick(function() {
        vm.procedureName = vm.procedure.nameinformationitem;
        vm.procedureDescription = vm.procedure.descriptioninformationitem;
      });
      this.phasesControl = [];
      if (this.procedure !== "") {
        this.procedure.phaseprocedures.forEach(element => {
          this.phasesControl.push({
            description: element.description,
            url: element.url
          });
        });
      }
    },
    procedure: function() {
      var vm = this;
      this.$nextTick(function() {
        vm.procedureName = vm.procedure.nameinformationitem;
        vm.procedureDescription = vm.procedure.descriptioninformationitem;
      });
      this.phasesControl = [];
      if (this.procedure !== "") {
        this.procedure.phaseprocedures.forEach(element => {
          this.phasesControl.push({
            description: element.description,
            url: element.url
          });
        });
      }
    }
  },
  methods: {
    async altera_Cria_Procedimento() {
      var vm = this;
      if (this.procedure === "") {
        await axios
          .post(
            `http://localhost:8000/informationitem/`,
            {
              nameinformationitem: this.procedureName,
              descriptioninformationitem: this.procedureDescription,
              fk_informationitemtype: `http://localhost:8000/informationitemtype/4/`,
              fk_idconcept: this.concept.url
            },
            {
              auth: {
                username: "admin",
                password: "admin"
              }
            }
          )
          .then(function(resposta) {
            vm.auxItemInfo = resposta.data.url;
          });
      } else {
        await axios
          .put(
            `http://localhost:8000/informationitem/` +
              this.procedure.idinformationitem +
              `/`,
            {
              nameinformationitem: this.procedureName,
              descriptioninformationitem: this.procedureDescription,
              fk_informationitemtype: `http://localhost:8000/informationitemtype/4/`,
              fk_idconcept: this.concept.url
            },
            {
              auth: {
                username: "admin",
                password: "admin"
              }
            }
          )
          .then(function(resposta) {
            vm.auxItemInfo = resposta.data.url;
          });
      }
    },
    async altera_Cria_Fases() {
      var vm = this;
      this.phasesControl.forEach(async function(element, index) {
        if (element.url === null) {
          await axios.post(
            `http://localhost:8000/phaseprocedure/`,
            {
              order: index + 1,
              description: element.description,
              fk_informationitem: vm.auxItemInfo
            },
            {
              auth: {
                username: "admin",
                password: "admin"
              }
            }
          );
        } else {
          await axios.put(
            element.url,
            {
              order: index + 1,
              description: element.description,
              fk_informationitem: vm.auxItemInfo
            },
            {
              auth: {
                username: "admin",
                password: "admin"
              }
            }
          );
        }
      });
    },

    async validate() {
      if (this.$refs.form.validate()) {
        if (this.phasesControl.length > 0) {
          var i = this.phasesControl.length;
          await this.altera_Cria_Procedimento();
          await this.altera_Cria_Fases();
          this.phasesControl = [];
          await this.$emit("close", i);
        } else {
          this.dialog_alert = true;
        }
      }
    },
    reset() {
      this.$refs.form.reset();
      this.phasesControl = [];
      this.$emit("close");
    },
    addPhase() {
      this.phasesControl.push({
        description: null,
        url: null
      });
    },
    async deletaPhase(idPhase) {
      if (this.phasesControl[idPhase].url !== null) {
        await axios.delete(this.phasesControl[idPhase].url, {
          auth: {
            username: "admin",
            password: "admin"
          }
        });
        await this.altera_Cria_Fases();
      }
      if (idPhase == 0) {
        this.phasesControl.shift();
      } else {
        this.phasesControl.splice(idPhase, 1);
      }
    }
  }
};
</script>
