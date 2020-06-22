<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:#63B0B0; color:white;">
        <span class="headline">
          <p>Descreva a atividade colaborativa a ser criada.</p>
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation class="mt-3">
          <label class="pt-2" style="font-size:1.3em;" for="colaborativeNameArea">
            <strong>Identificador da atividade:</strong>
          </label>
          <v-text-field
            id="colaborativeNameArea"
            v-model="colaborativeName"
            :counter="25"
            :rules="colaborativeNameRules"
            required
            class="mt-2 mb-4"
          ></v-text-field>
          <label class="pt-2" style="font-size:1.3em;" for="colaborativeDescriptionArea">
            <strong>Escreva a descrição da atividade:</strong>
          </label>
          <v-textarea
            id="colaborativeDescriptionArea"
            v-model="colaborativeDescription"
            :rules="colaborativeDescriptionRules"
            background-color="#F2F3F3"
            clearable
            clear-icon="mdi-close-circle"
            class="mt-2"
            name="input-4-1"
            rows="8"
            filled
            auto-grow
            required
          ></v-textarea>
          <p class="pt-2" style="font-size:1.3em;">
            <strong>Número de alunos para realização da atividade:</strong>
            <v-text-field
              style="width: 15%;"
              id="memberAmountArea"
              type="number"
              v-model="memberAmount"
              :rules="memberAmountRules"
              required
              class="mt-2 mb-4"
            ></v-text-field>
          </p>

          <v-row style="margin-top: -20px;" class="mb-2">
            <v-col cols="4"></v-col>
            <v-col>
              <v-menu
                top="top"
                width="300px"
                origin="center center"
                :offset-y="true"
                transition="scale-transition"
              >
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" large color="primary" style="color:white; font-size: 1.2em;">
                    <strong>Adicionar MobileMedia</strong>
                    <v-icon class="ml-2" large color="white">mdi-plus-box</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item
                    v-for="(item, i) in itemsMobileMedia"
                    :key="i"
                    @click="addMobileMedia(i+1)"
                  >
                    <v-icon x-large color="blue">{{item.icon}}</v-icon>
                    <v-list-item-title style="font-size: 1.2em; color:#2196F3;" class="ml-1">
                      <strong>{{item.name}}</strong>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

              <v-btn
                color="primary"
                class="ml-2"
                large
                style="color:white; font-size: 1.2em;"
                @click="addQuestionario()"
              >
                <strong>Adicionar Questões</strong>
                <v-icon class="ml-2" large color="white">mdi-plus-box</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <div v-if="mobileMediasControl.length > 0">
            <label class="mb-6 pt-2" style="font-size:1.3em;" for="colaborativeNameArea">
              <strong>MobileMedias da atividade:</strong>
            </label>
            <div class="mt-8"></div>
            <div v-for="(mobilemedia,i) in mobileMediasControl" :key="i">
              <v-row v-if="mobilemedia.type === 'Imagem'">
                <v-spacer></v-spacer>
                <v-file-input
                  style="width: 165px;"
                  label="UPLOAD IMAGE"
                  filled
                  v-model="mobileMediasControl[i].object"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                ></v-file-input>
                <v-btn icon="icon" class="mt-2 ml-3">
                  <v-icon x-large color="red" @click="deleteMobileMedia(i)">mdi-minus-box</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
              </v-row>
              <v-row v-if="mobilemedia.type === 'Video'">
                <v-spacer></v-spacer>
                <v-file-input
                  style="width: 165px;"
                  label="UPLOAD VIDEO"
                  filled
                  v-model="mobileMediasControl[i].object"
                  accept="video/*"
                  prepend-icon="mdi-video"
                ></v-file-input>
                <v-btn icon="icon" class="mt-2 ml-3">
                  <v-icon x-large color="red" @click="deleteMobileMedia(i)">mdi-minus-box</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
              </v-row>
              <v-row v-if="mobilemedia.type === 'Audio'">
                <v-spacer></v-spacer>
                <v-file-input
                  style="width: 165px;"
                  label="UPLOAD AUDIO"
                  filled
                  v-model="mobileMediasControl[i].object"
                  accept="audio/*"
                  prepend-icon="mdi-file-music"
                ></v-file-input>
                <v-btn icon="icon" class="mt-2 ml-3">
                  <v-icon x-large color="red" @click="deleteMobileMedia(i)">mdi-minus-box</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
              </v-row>
              <v-row v-if="mobilemedia.type === 'Link'" class="mb-2">
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="mobileMediasControl[i].object"
                  :rules="linkUrlRules"
                  label="Url"
                  required
                ></v-text-field>
                <v-btn icon="icon" class="mt-2 ml-3">
                  <v-icon x-large color="red" @click="deleteMobileMedia(i)">mdi-minus-box</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
              </v-row>
            </div>
          </div>
          <div v-if="viewQuestions">
            <v-app-bar color="#D2A64D" dense dark height="45px" class="mt-4">
              <v-col cols="7">
                <v-toolbar-title style="font-size:1.2em;">
                  <strong>Lista de questões da atividade</strong>
                </v-toolbar-title>
              </v-col>
              <v-col class="ml-8">
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
              <v-col cols="2">
                <v-btn icon="icon">
                  <v-icon
                    x-large
                    color="red"
                    @click="deleteQuestionario()"
                    style="background-color:white;"
                  >mdi-close-box</v-icon>
                </v-btn>
              </v-col>
            </v-app-bar>
            <v-container>
              <v-row v-for="(item,i) in questionsControl" :key="i">
                <v-col cols="11" style="background-color:grey;color:white;" class="mt-5">
                  <h3>Questão {{i+1}}</h3>
                </v-col>
                <v-col cols="1">
                  <v-btn icon @click="deleteQuestion(i)">
                    <v-icon class="ml-8 mb-2" x-large color="red">mdi-close-box</v-icon>
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
          </div>
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
          >Para salvar um questionário, é necessário criar pelo uma questão.</v-card-text>
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
  name: "AtividadeColaborativaDialog",
  props: [
    "instrucOptionCall",
    "instrucType",
    "domain",
    "dialog",
    "procedure",
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
    colaborativeName: "",
    colaborativeNameRules: [
      v =>
        !!v ||
        "É necessário descrever um identificador para a atividade colaborativa",
      v =>
        (v && v.length <= 25) ||
        "Nome do identificador da atividade colaborativa deve ter no máximo 25 caracteres"
    ],
    memberAmount: "",
    memberAmountRules: [
      v =>
        !!v ||
        "É necessário inserir a quantidade de alunos envolvidos na atividade"
    ],
    colaborativeDescription: "",
    colaborativeDescriptionRules: [
      v =>
        !!v ||
        "É necessário inserir uma descrição da atividade colaborativa a ser inserida"
    ],
    itemsMobileMedia: [
      {
        icon: "mdi-file-image",
        name: "Imagem"
      },
      {
        icon: "mdi-file-video",
        name: "Video"
      },
      {
        icon: "mdi-file-music",
        name: "Audio"
      },
      {
        icon: "mdi-link-variant",
        name: "Link"
      }
    ],
    linkUrlRules: [v => !!v || "É necessário inserir a url do seu link"],
    mobileMediasControl: [],
    viewQuestions: false,
    questionTypes: ["Questão Objetiva", "Questão Discussiva"],
    questionsControl: [],
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
    alternativeDescriptionRules: [
      v => !!v || "É necessário descrever a alternativa."
    ]
  }),
  watch: {
    dialog: function() {
      if (this.instructionalelement) {
        var vm = this;
        this.$nextTick(function() {
          this.colaborativeName = this.instructionalelement.label;
          this.colaborativeDescription = this.instructionalelement.description;
          this.memberAmount = parseInt(this.instructionalelement.memberamount);
        });
        this.questionsControl = [];
        if (this.instructionalelement.questions.length > 0) {
          this.viewQuestions = true;
          this.instructionalelement.questions.forEach(function(
            elementQuestion,
            indexQuestion
          ) {
            if (
              elementQuestion.typequestion ===
              `http://127.0.0.1:8000/questiontype/1/`
            ) {
              vm.questionsControl.push({
                typeQuestion: parseInt(
                  elementQuestion.typequestion.split("/")[4]
                ),
                descriptionQuestion: elementQuestion.descriptionquestion,
                answersAlternatives: [],
                url: elementQuestion.url
              });
              elementQuestion.answersalternatives.forEach(function(
                elementAlternative
              ) {
                vm.questionsControl[indexQuestion].answersAlternatives.push({
                  isTrue: elementAlternative.istrue,
                  answers: elementAlternative.answers,
                  url: elementAlternative.url
                });
              });
            } else if (
              elementQuestion.typequestion ===
              `http://127.0.0.1:8000/questiontype/2/`
            ) {
              vm.questionsControl.push({
                typeQuestion: parseInt(
                  elementQuestion.typequestion.split("/")[4]
                ),
                descriptionQuestion: elementQuestion.descriptionquestion,
                correctAnswer:
                  elementQuestion.resolutionquestion[0].correctanswer,
                url: elementQuestion.url,
                urlCorrectAnswer: elementQuestion.resolutionquestion[0].url
              });
            }
          });
          vm.viewQuestions = true;
        }
      } else {
        this.resetValidation();
        this.viewQuestions = false;
        this.avaliacaoName = "";
      }
    }
  },
  methods: {
    async postOnlyInstruc() {
      var instructionalelement = {
        label: this.colaborativeName,
        fk_instructionalelementtype: `http://127.0.0.1:8000/instrucelementtype/3/`,
        memberamount: this.memberAmount,
        description: this.colaborativeDescription
      };

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
        /* CÓDIGO PARA CRIAÇÃO DA AVALIAÇÃO/EXERCÍCIO SEM QUESTÕES*/
        await axios.post(
          `http://127.0.0.1:8000/instructionalelement/`,
          instructionalelement,
          {
            auth: {
              username: "admin",
              password: "admin"
            }
          }
        );
      } else {
        await axios.put(this.instructionalelement.url, instructionalelement, {
          auth: {
            username: "admin",
            password: "admin"
          }
        });
      }
    },
    async postQuestions() {
      var instructionalelement = {
        label: "Atividade Colaborativa",
        fk_instructionalelementtype: `http://127.0.0.1:8000/instrucelementtype/3/`,
        memberamount: this.memberAmount,
        description: this.colaborativeDescription
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

      if (this.instructionalelement) {
        /* CÓDIGO PARA EDIÇÃO DA AVALIAÇÃO/EXERCÍCIO */
        await axios
          .put(vm.instructionalelement.url, instructionalelement, {
            auth: {
              username: "admin",
              password: "admin"
            }
          })
          .then(async function(resposta) {
            vm.questionsControl.forEach(async function(
              elementQuestion,
              indexQuestion
            ) {
              if (elementQuestion.url) {
                await axios
                  .put(
                    elementQuestion.url,
                    {
                      orderquestion: indexQuestion,
                      descriptionquestion: elementQuestion.descriptionQuestion,
                      typequestion:
                        `http://127.0.0.1:8000/questiontype/` +
                        elementQuestion.typeQuestion +
                        `/`,
                      fk_idinstructionalelement: vm.instructionalelement.url
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
                      elementQuestion.answersAlternatives.forEach(
                        async function(elementAlternative, indexAlternative) {
                          if (elementAlternative.url) {
                            await axios.put(
                              elementAlternative.url,
                              {
                                idobjanswer:
                                  vm.idObjAnswerItems[indexAlternative],
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
                          } else {
                            await axios.post(
                              `http://127.0.0.1:8000/answersalternatives/`,
                              {
                                idobjanswer:
                                  vm.idObjAnswerItems[indexAlternative],
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
                          }
                        }
                      );
                    } else if (elementQuestion.typeQuestion === 2) {
                      await axios.put(
                        elementQuestion.urlCorrectAnswer,
                        {
                          correctanswer: elementQuestion.correctAnswer
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
              } else {
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
                      elementQuestion.answersAlternatives.forEach(
                        async function(elementAlternative, indexAlternative) {
                          await axios.post(
                            `http://127.0.0.1:8000/answersalternatives/`,
                            {
                              idobjanswer:
                                vm.idObjAnswerItems[indexAlternative],
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
                        }
                      );
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
              }
            });
          });
      } else {
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
              console.log("oi", indexQuestion);
              await axios
                .post(
                  `http://127.0.0.1:8000/question/`,
                  {
                    descriptionquestion: elementQuestion.descriptionQuestion,
                    orderquestion: indexQuestion,
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
    addMobileMedia(mobileMediaType) {
      if (mobileMediaType === 1) {
        this.mobileMediasControl.push({
          type: "Imagem",
          object: null,
          url: null
        });
      } else if (mobileMediaType === 2) {
        this.mobileMediasControl.push({
          type: "Video",
          object: null,
          url: null
        });
      } else if (mobileMediaType === 3) {
        this.mobileMediasControl.push({
          type: "Audio",
          object: null,
          url: null
        });
      } else if (mobileMediaType === 4) {
        this.mobileMediasControl.push({
          type: "Link",
          object: null,
          url: null
        });
      }
    },
    deleteMobileMedia(idMobileMedia) {
      if (idMobileMedia == 0) {
        this.mobileMediasControl.shift();
      } else {
        this.mobileMediasControl.splice(idMobileMedia, 1);
      }
    },
    addQuestionario() {
      if (this.viewQuestions === false) {
        this.viewQuestions = true;
      }
    },
    deleteQuestionario() {
      this.questionsControl = [];
      this.viewQuestions = false;
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
    async deleteQuestion(idQuestion) {
      if (this.questionsControl[idQuestion].url) {
        await axios.delete(this.questionsControl[idQuestion].url, {
          auth: {
            username: "admin",
            password: "admin"
          }
        });
      }
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
    async deleteAlternative(idQuestion, idAlternative) {
      if (
        this.questionsControl[idQuestion].answersAlternatives[idAlternative].url
      ) {
        await axios.delete(
          this.questionsControl[idQuestion].answersAlternatives[idAlternative]
            .url,
          {
            auth: {
              username: "admin",
              password: "admin"
            }
          }
        );
      }
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
        if (this.viewQuestions) {
          if (this.questionsControl.length > 0) {
            var vm = this;
            var aux = 1;
            for (var i = 0; i < this.questionsControl.length; i++) {
              if (aux === 1) {
                if (this.questionsControl[i].typeQuestion === 1) {
                  if (
                    this.questionsControl[i].answersAlternatives.length === 0
                  ) {
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
                    if (
                      this.questionsControl[i].answersAlternatives[j].isTrue
                    ) {
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
              var auxNumberQuestions = this.questionsControl.length;
              await this.postQuestions();
              this.questionsControl = [];
              await this.$emit("instrucclose", auxNumberQuestions);
            }
          } else {
            this.dialog_alert = true;
          }
        } else {
          await this.postOnlyInstruc();
          await this.resetVariables();
          this.questionsControl = [];
          await this.$emit("instrucclose");
        }
      }
    },
    resetVariables() {
      this.questionsControl = [];
      this.colaborativeName = "";
      this.memberAmount = "";
      this.colaborativeDescription = "";
      this.viewQuestions = false;
    },
    async reset() {
      await this.$emit("instrucclose");
      await this.resetVariables();
      this.questionsControl = [];
      await this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>
