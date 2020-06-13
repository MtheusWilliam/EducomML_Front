<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:#63B0B0; color:white;">
        <span class="headline">
          <p>Descreva a avaliação a ser criada.</p>
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation class="mt-3">
          <label class="pt-2" style="font-size:1.3em;" for="procedureNameArea">
            <strong>Identificador da avaliação:</strong>
          </label>
          <v-text-field
            id="avaliacaoNameArea"
            v-model="avaliacaoName"
            :counter="25"
            :rules="avaliacaoNameRules"
            required
            class="mt-2 mb-4"
          ></v-text-field>
          <v-app-bar color="#D2A64D" dense dark height="45px">
            <v-col cols="9">
              <v-toolbar-title style="font-size:1.2em;">
                <strong>Lista de questões da avaliação</strong>
              </v-toolbar-title>
            </v-col>
            <v-col cols="2">
              <v-menu
                top="top"
                width="300px"
                origin="center center"
                :offset-y="true"
                transition="scale-transition"
              >
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" color="white" style="color:black; font-size: 1.2em;">
                    <strong>Adicionar Questão</strong>
                    <v-icon class="ml-2" large color="black">mdi-plus-box</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item @click="addQuestion(1)">
                    <v-list-item-title>Questão Objetiva</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="addQuestion(2)">
                    <v-list-item-title>Questão Discussiva</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-app-bar>
          <v-container>
            <v-row v-for="(item,i) in questionsControl" :key="i">
              <v-col cols="11" style="background-color:grey;color:white;">
                <h3>Questão {{i+1}}</h3>
              </v-col>
              <v-col cols="1" style="margin-bottom:-10px;">
                <v-btn icon @click="deleteQuestion(i)">
                  <v-icon class="ml-8 mb-2" x-large color="red">mdi-close-box</v-icon>
                </v-btn>
              </v-col>
              <v-row>
                <v-col>
                  <v-text-field
                    class="ml-3"
                    v-model="questionsControl[i].descriptionQuestion"
                    label="Descrição da questão"
                    required
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="3"
                  class="mt-3"
                  v-if="item.typeQuestion === 1"
                  style=" margin-right:-35px;"
                >
                  <v-btn
                    color="primary"
                    style="color:white;"
                    @click="addAlternative(i)"
                  >Adicionar Alternativa</v-btn>
                </v-col>
              </v-row>
              <div
                v-if="item.typeQuestion === 1"
                style="display: block; width: 100%; margin-top:-20px;"
              >
                <div
                  style="display: flex;"
                  v-for="(itemAlternative,indexAlternative) in questionsControl[i].answersAlternatives"
                  :key="indexAlternative"
                >
                  <v-col cols="6">
                    <v-text-field
                      v-model="questionsControl[i].answersAlternatives[indexAlternative].descriptionAlternative"
                      label="Descrição da alternativa"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1" style="margin-right:-50px;">
                    <v-checkbox
                      v-model="questionsControl[i].answersAlternatives[indexAlternative].isTrue"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="1">
                    <v-btn icon="icon" @click="deleteAlternative(i, indexAlternative)">
                      <v-icon large class="mt-4" color="red">mdi-minus-box</v-icon>
                    </v-btn>
                  </v-col>
                </div>
              </div>
              <div
                v-else-if="item.typeQuestion === 2"
                style="display: block; width: 100%; margin-top:-20px;"
              >
                <v-col cols="12">
                  <v-textarea
                    v-model="questionsControl[i].correctAnswer"
                    background-color="#F2F3F3"
                    clearable
                    clear-icon="mdi-close-circle"
                    class="mt-2"
                    name="input-3-1"
                    label="Resposta da questão"
                    filled
                    auto-grow
                    required
                  ></v-textarea>
                </v-col>
              </div>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" height="49" dark large>
          Close
          <v-icon dark right>mdi-close</v-icon>
        </v-btn>
        <v-btn color="success" height="49" dark large>
          Save
          <v-icon dark right>mdi-content-save</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "AvaliacaoDialog",
  props: ["dialog", "procedure", "concept", "module"],
  data: () => ({
    valid: true,
    dialog_alert: false,
    avaliacaoName: "",
    avaliacaoNameRules: [
      v => !!v || "É necessário descrever um identificador para a avaliação",
      v =>
        (v && v.length <= 25) ||
        "Nome do identificador da avaliação deve ter no máximo 25 caracteres"
    ],
    questionTypes: ["Questão Objetiva", "Questão Discussiva"],
    questionsControl: []
  }),
  methods: {
    addQuestion(questionType) {
      if (questionType === 1) {
        this.questionsControl.push({
          typeQuestion: questionType,
          descriptionQuestion: null,
          answersAlternatives: [],
          url: null
        });
      } else if (questionType === 2) {
        this.questionsControl.push({
          typeQuestion: questionType,
          descriptionQuestion: null,
          correctAnswer: null,
          url: null
        });
      }
    },
    deleteQuestion(idQuestion) {
      if (idQuestion == 0) {
        this.questionsControl.shift();
      } else {
        this.questionsControl.splice(idQuestion, 1);
      }
    },
    addAlternative(idQuestion) {
      this.questionsControl[idQuestion].answersAlternatives.push({
        isTrue: false,
        descriptionAlternative: null
      });
    },
    deleteAlternative(idQuestion, idAlternative) {
      if (idAlternative == 0) {
        this.questionsControl[idQuestion].answersAlternatives.shift();
      } else {
        this.questionsControl[idQuestion].answersAlternatives.splice(
          idAlternative,
          1
        );
      }
    }
  }
};
</script>
