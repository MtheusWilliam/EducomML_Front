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
          <v-app-bar color="#D2A64D" dense dark height="45px" style="margin-bottom: -15px;">
            <v-col cols="8">
              <v-toolbar-title style="font-size:1.2em;">
                <strong>Lista de questões da avaliação</strong>
              </v-toolbar-title>
            </v-col>
            <v-col cols="2" class="ml-8">
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
              <v-col cols="11" style="background-color:grey;color:white;" class="mt-5">
                <h3>Questão {{i+1}}</h3>
              </v-col>
              <v-col cols="1">
                <v-btn icon @click="deleteQuestion(i)">
                  <v-icon class="ml-8 mt-6" x-large color="red">mdi-close-box</v-icon>
                </v-btn>
              </v-col>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="questionsControl[i].descriptionQuestion"
                    label="Descrição da questão"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="3" class="mt-3" v-if="item.typeQuestion === 1">
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
                <p style="color:#f43e00; margin-bottom: -10px;">
                  <strong>*AVISO:</strong> Marque o checkbox da alternativa caso ela esteja correta.
                </p>
                <div
                  style="display: flex; margin-bottom:-30px;"
                  v-for="(itemAlternative,indexAlternative) in questionsControl[i].answersAlternatives"
                  :key="indexAlternative"
                >
                  <v-col cols="1" class="mt-5" style=" margin-right: -40px;font-size:1.3em;">
                    <strong>{{idObjAnswerItems[indexAlternative]}})</strong>
                  </v-col>
                  <v-col cols="7">
                    <v-text-field
                      v-model="questionsControl[i].answersAlternatives[indexAlternative].answers"
                      label="Descrição da alternativa"
                      :rules="alternativeDescriptionRules"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1" style="margin-right:-40px;">
                    <v-checkbox
                      v-model="questionsControl[i].answersAlternatives[indexAlternative].isTrue"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="1">
                    <v-btn icon="icon" @click="deleteAlternative(i, indexAlternative)">
                      <v-icon large class="mt-7" color="red">mdi-minus-box</v-icon>
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
          >Para criar uma avaliação, é necessário criar pelo uma questão.</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog_alert = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="text-center">
      <v-dialog v-model="dialog_alert2" width="500">
        <v-card>
          <v-card-title class="headline red" primary-title style="color:white;">ALERTA!</v-card-title>
          <v-card-text class="mt-3" style="font-size: 1.3em;">
            Questões objetivas necessitam de pelo menos uma alternativa correta.
            <br />
            Ajuste a questão {{questionAjust}}.
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog_alert2 = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="text-center">
      <v-dialog v-model="dialog_alert3" width="500">
        <v-card>
          <v-card-title class="headline red" primary-title style="color:white;">ALERTA!</v-card-title>
          <v-card-text class="mt-3" style="font-size: 1.3em;">
            Questões objetivas necessitam de pelo menos uma alternativa.
            <br />
            Ajuste a questão {{questionAjust}}.
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog_alert3 = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "AvaliacaoDialog",
  props: [
    "instrucOptionCall",
    "instrucType",
    "domain",
    "dialog",
    "concept",
    "module",
    "instructionalelement"
  ],
  data: () => ({
    valid: true,
    dialog_alert: false,
    dialog_alert2: false,
    dialog_alert3: false,
    questionAjust: "",
    idObjAnswerItems: [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ],
    avaliacaoName: "",
    avaliacaoNameRules: [
      v => !!v || "É necessário descrever um identificador para a avaliação",
      v =>
        (v && v.length <= 25) ||
        "Nome do identificador da avaliação deve ter no máximo 25 caracteres"
    ],
    questionTypes: ["Questão Objetiva", "Questão Discussiva"],
    alternativeDescriptionRules: [
      v => !!v || "É necessário descrever a alternativa."
    ],
    questionsControl: []
  }),
  methods: {
    async postQuestions() {
      var instructionalelement = {
        label: "Exemplo",
        fk_instructionalelementtype: `http://127.0.0.1:8000/instrucelementtype/2/`
      };
      var vm = this;

      if (this.instrucType === "dominio") {
        Object.assign(instructionalelement, {
          fk_idknowledgedomain: this.instrucOptionCall.url
        });
      } else if (this.instrucType === "modulo") {
        Object.assign(instructionalelement, {
          fk_idmodule: this.instrucOptionCall.url
        });
      } else if (this.instrucType === "conceito") {
        Object.assign(instructionalelement, {
          fk_idconcept: this.instrucOptionCall.url
        });
      }

      if (!this.instructionalelement) {
        /* CÓDIGO PARA CRIAÇÃO DA AVALIAÇÃO/EXERCÍCIO */
        await axios
          .post(
            `http://127.0.0.1:8000/instructionalelement/`,
            instructionalelement,
            {
              auth: {
                username: "admin",
                password: "admin"
              }
            }
          )
          .then(async function(resposta) {
            vm.questionsControl.forEach(async function(
              elementQuestion,
              indexQuestion
            ) {
              await axios
                .post(
                  `http://127.0.0.1:8000/question/`,
                  {
                    orderquestion: indexQuestion + 1,
                    descriptionquestion: elementQuestion.descriptionQuestion,
                    fk_idinstructionalelement: resposta.data.url,
                    typequestion:
                      `http://127.0.0.1:8000/questiontype/` +
                      elementQuestion.typeQuestion +
                      `/`
                  },
                  {
                    auth: {
                      username: "admin",
                      password: "admin"
                    }
                  }
                )
                .then(async function(resposta2) {
                  if (elementQuestion.typeQuestion === 1) {
                    elementQuestion.answersAlternatives.forEach(async function(
                      elementAlternative,
                      indexAlternative
                    ) {
                      await axios.post(
                        `http://127.0.0.1:8000/answersalternatives/`,
                        {
                          idobjanswer: vm.idObjAnswerItems[indexAlternative],
                          answers: elementAlternative.answers,
                          istrue: elementAlternative.isTrue,
                          fk_idquestion: resposta2.data.url,
                          orderansweralternatives: indexAlternative
                        },
                        {
                          auth: {
                            username: "admin",
                            password: "admin"
                          }
                        }
                      );
                    });
                  } else if (elementQuestion.typeQuestion === 2) {
                    await axios.post(
                      `http://127.0.0.1:8000/resolutionquestion/`,
                      {
                        correctanswer: elementQuestion.correctAnswer,
                        fk_idquestion: resposta2.data.url
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
            });
          });
      }
    },
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
          url: null,
          urlCorrectAnswer: null
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
        answers: null,
        url: null
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
    },
    async validate() {
      if (this.$refs.form.validate()) {
        if (this.questionsControl.length > 0) {
          var vm = this;
          var aux = 1;
          for (var i = 0; i < this.questionsControl.length; i++) {
            if (aux === 1) {
              if (this.questionsControl[i].typeQuestion === 1) {
                if (this.questionsControl[i].answersAlternatives.length === 0) {
                  vm.questionAjust = i + 1;
                  vm.dialog_alert3 = true;
                  aux = 0;
                  break;
                }
                for (
                  var j = 0;
                  j < this.questionsControl[i].answersAlternatives.length;
                  j++
                ) {
                  if (this.questionsControl[i].answersAlternatives[j].isTrue) {
                    break;
                  }
                  if (
                    j ===
                    this.questionsControl[i].answersAlternatives.length - 1
                  ) {
                    vm.questionAjust = i + 1;
                    vm.dialog_alert2 = true;
                    aux = 0;
                  }
                }
              }
            } else {
              break;
            }
          }
          if (aux === 1) {
            await this.postQuestions();
            this.questionsControl = [];
            await this.$emit("instrucclose");
          }
        } else {
          this.dialog_alert = true;
        }
      }
    },
    async reset() {
      await this.$emit("instrucclose");
      await this.$refs.form.reset();
    }
  }
};
</script>
