<template>
  <v-container class="pa-0; ml-0">
    <v-row>
      <v-card min-height="530px">
        <v-card-title style="background-color:#63B0B0; color:white;">
          <span class="headline">
            <p>Defina o conceito do módulo, bem como seu(s) relacionamento(s).</p>
          </span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="conceptName"
              :counter="25"
              :rules="conceptNameRules"
              label="Nome do conceito"
              required
              class="mt-2 mb-4"
            ></v-text-field>
            <div style="width:102.5%; position:relative;right:1.2%;margin-top:-1.3%;">
              <v-app-bar color="#D2A64D" dense dark height="45px">
                <v-toolbar-title style="font-size:1.2em;">
                  <strong>Lista de relacionamentos</strong>
                </v-toolbar-title>
              </v-app-bar>
            </div>
            <v-row class="mt-2" style="height:50px;">
              <v-col>
                <strong>
                  <p>Conceito</p>
                </strong>
              </v-col>
              <v-col>
                <strong>
                  <p>Nome da Relação</p>
                </strong>
              </v-col>
              <v-col>
                <strong>
                  <p>Tipo da Relação</p>
                </strong>
              </v-col>
              <v-col cols="1">
                <v-btn icon="icon" class="mb-1">
                  <v-icon large class="mb-1" color="primary" @click="addRelacao()">mdi-plus-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <hr />
            <v-row>
              <v-container>
                <v-row v-for="(item,i) in relationForControl" :key="i">
                  <v-col>
                    <v-select
                      v-model="conceptSelect[i]"
                      @change="teste"
                      :items="items"
                      label="Conceito"
                      style="margin:0px;"
                    ></v-select>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="relacaoName[i]"
                      counter="15"
                      label="Nome da Relação"
                      style="margin:0px;"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="relacaoType[i]"
                      :items="relacaoTypes"
                      label="Tipo da Relação"
                      style="margin:0px;"
                    ></v-select>
                  </v-col>
                  <v-col cols="1" class="mt-2">
                    <v-btn icon="icon" class="mb-1">
                      <v-icon large class="mb-1" color="red" @click="deletaRelacao(i)">mdi-minus-box</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-row>
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
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "ConceitoDialog",
  props: ["domain", "module", "concept"],
  data: () => ({
    auxConceito: "",
    relationForControl: 1,
    valid: true,
    items: [],
    conceptSelect: [""],
    auxConceptSelect: [""],
    conceptName: "",
    conceptNameRules: [
      v => !!v || "É necessário descrever o nome do conceito",
      v =>
        (v && v.length <= 25) ||
        "Nome do conceito deve ter no máximo 25 caracteres"
    ],
    relacaoName: [""],
    relacaoNameRules: [
      v => !!v || "Necessário descrever o nome da relação",
      v =>
        (v && v.length <= 15) ||
        "O nome da relação deve ter no máximo 15 caracteres"
    ],
    relacaoType: [""],
    relacaoTypes: ["typeOf", "partOf"]
  }),
  watch: {
    module: function() {
      this.items = [];
      if (this.module.concepts) {
        this.module.concepts.forEach(element => {
          this.items.push({
            text: element.nameconcept,
            value: element
          });
        });
      }
    }
  },
  methods: {
    postConceito() {
      var vm = this;
      axios
        .post(
          `http://localhost:8000/concept/`,
          {
            nameconcept: this.conceptName,
            fk_idknowledgedomain: this.domain.url,
            fk_idmodule: this.module.url
          },
          {
            auth: {
              username: "admin",
              password: "admin"
            }
          }
        )
        .then(function(resposta) {
          vm.auxConceito = resposta.data.url;
        });
    },
    postRelacoes() {
      var i;
      var vm = this;
      //console.log("aux referencia", vm.auxReferencia);
      for (i = 0; i < vm.conceptSelect.length; i++) {
        var auxReferencia = 0;
        if (this.relacaoType[i] == "typeOf") {
          auxReferencia = 1;
        } else if (this.relacaoType[i] == "partOf") {
          auxReferencia = 2;
        }
        console.log("AUXCONCEPT URL", auxReferencia);
        /*
        axios.post(
          `http://localhost:8000/reference/`,
          {
            namereference: this.relacaoName[i],
            sourceconcept: this.auxConceito,
            targetconcept: this.conceptSelect[i].url,
            fk_referencetype:
              `http://localhost:8000/referencetype/` + auxReferencia + "/"
          },
          {
            auth: {
              username: "admin",
              password: "admin"
            }
          }
        )*/
      }
    },
    putConceito() {
      axios.put(
        "http://127.0.0.1:8000/concept/" + this.concept.idconcept + "/",
        {
          nameconcept: this.conceptName,
          fk_idknowledgedomain: this.domain.url,
          fk_idmodule: this.module.url
        },
        {
          auth: {
            username: "admin",
            password: "admin"
          }
        }
      );
    },
    validate() {
      var vm = this;
      console.log("VALIDADE", vm);
      if (this.$refs.form.validate()) {
        this.$refs.form.validate();
        if (this.concept === "") {
          vm.auxConceptSelect = vm.conceptSelect;
          this.postConceito();
          setTimeout(function() {
            vm.postRelacoes();
          }, 1000);
        } else {
          this.putConceito();
        }
        this.$emit("close_or_save", "save");
      }
      this.$refs.form.reset();
    },
    reset() {
      this.$emit("close_or_save", "close");
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    /*
    validateRelacao() {
      //VALIDAÇÃO DA CRIAÇÃO DAS RELAÇÕES -REFERENCIAS REPETIDAS -CAMPOS VAZIOS

      var i;
      for (i = 0; i < this.conceptName.length; i++) {
        if (this.conceptSelect[i] && this.relacaoType[i]) {
          console.log("Referencia Nº", i, " Tudo OK!");
        } else {
          console.log(
            "Referencia Nº",
            i,
            " deu ERRO! Possui campo(s) vazio(s)"
          );
        }
      }
    },
    */
    teste() {
      console.log("");
    },
    addRelacao() {
      this.conceptSelect.push("");
      this.relacaoName.push("");
      this.relacaoType.push("");
      this.relationForControl++;
    },
    deletaRelacao(idRelacao) {
      if (this.relacaoName.length > 1) {
        this.relationForControl--;
        if (idRelacao == 0) {
          this.conceptSelect.shift();
          this.relacaoName.shift();
          this.relacaoType.shift();
        } else {
          this.conceptSelect.splice(idRelacao, 1);
          this.relacaoName.splice(idRelacao, 1);
          this.relacaoType.splice(idRelacao, 1);
        }
      }
    }
  }
};
</script>
