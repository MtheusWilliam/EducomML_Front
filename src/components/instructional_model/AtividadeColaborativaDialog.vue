<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:#63B0B0; color:white;">
        <v-col cols="8">
          <span class="headline">
            <p>Descreva a atividade colaborativa a ser criada.</p>
          </span>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="4" class="pl-11" style="margin-right: -16px;">
          <v-btn color="red" dark large @click="reset()" class="ml-2 mb-3">
            Close
            <v-icon dark right>mdi-close</v-icon>
          </v-btn>
          <v-btn color="success" dark large @click="validate()" class="ml-2 mb-3">
            Save
            <v-icon dark right>mdi-content-save</v-icon>
          </v-btn>
        </v-col>
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
              <v-row v-if="mobilemedia.type === 1">
                <v-spacer></v-spacer>
                <v-file-input
                  style="width: 165px;"
                  label="UPLOAD IMAGE"
                  filled
                  @change="atualizaMeta"
                  v-model="mobilemedia.object"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                ></v-file-input>
                <v-btn icon="icon" class="mt-2 ml-3">
                  <v-icon x-large color="red" @click="deleteMobileMedia(i)">mdi-minus-box</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
              </v-row>
              <v-row v-if="mobilemedia.type === 2">
                <v-spacer></v-spacer>
                <v-file-input
                  style="width: 165px;"
                  label="UPLOAD VIDEO"
                  filled
                  @change="atualizaMeta"
                  v-model="mobilemedia.object"
                  accept="video/*"
                  prepend-icon="mdi-video"
                ></v-file-input>
                <v-btn icon="icon" class="mt-2 ml-3">
                  <v-icon x-large color="red" @click="deleteMobileMedia(i)">mdi-minus-box</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
              </v-row>
              <v-row v-if="mobilemedia.type === 3">
                <v-spacer></v-spacer>
                <v-file-input
                  style="width: 165px;"
                  label="UPLOAD AUDIO"
                  filled
                  v-model="mobilemedia.object"
                  accept="audio/*"
                  prepend-icon="mdi-file-music"
                ></v-file-input>
                <v-btn icon="icon" class="mt-2 ml-3">
                  <v-icon x-large color="red" @click="deleteMobileMedia(i)">mdi-minus-box</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
              </v-row>
              <v-row v-if="mobilemedia.type === 5" class="mb-2">
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="mobilemedia.object"
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
                <v-col cols="10" style="background-color:grey;color:white;" class="mt-5">
                  <h3>Questão {{i+1}}</h3>
                </v-col>
                <v-col cols="2" style="paddin-left:-20px; margin-left:-30px;">
                  <v-menu
                    top="top"
                    width="300px"
                    origin="center center"
                    :offset-y="true"
                    transition="scale-transition"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on" class="ml-11">
                        <v-icon class="mt-6" x-large color="primary">mdi-plus-box</v-icon>
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item
                        v-for="(itemType, idItemType) in itemsMobileMedia"
                        :key="idItemType"
                        @click="addMobileMediaQuestion(i, idItemType+1)"
                      >
                        <v-icon x-large color="blue">{{itemType.icon}}</v-icon>
                        <v-list-item-title style="font-size: 1.2em; color:#2196F3;" class="ml-1">
                          <strong>{{itemType.name}}</strong>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <v-btn icon @click="deleteQuestion(i)" class="ml-4">
                    <v-icon class="mt-6" x-large color="red">mdi-close-box</v-icon>
                  </v-btn>
                </v-col>
                <v-row>
                  <v-col cols>
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
                  v-if="questionsControl[i].mobileMedias.length > 0"
                  style="display: block; width: 100%; margin-top:-20px;"
                >
                  <v-col cols="12">
                    <div
                      v-for="(mobilemedia, idmobile) in questionsControl[i].mobileMedias"
                      :key="idmobile"
                    >
                      <v-row v-if="mobilemedia.type === 1">
                        <v-spacer></v-spacer>
                        <v-file-input
                          style="width: 165px;"
                          label="UPLOAD IMAGE"
                          filled
                          @change="atualizaMetaQuestions"
                          v-model="mobilemedia.object"
                          accept="image/*"
                          prepend-icon="mdi-camera"
                        ></v-file-input>
                        <v-btn icon="icon" class="mt-2 ml-3">
                          <v-icon
                            x-large
                            color="red"
                            @click="deleteMobileMediaQuestion(i, idmobile)"
                          >mdi-minus-box</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                      </v-row>
                      <v-row v-if="mobilemedia.type === 2">
                        <v-spacer></v-spacer>
                        <v-file-input
                          style="width: 165px;"
                          label="UPLOAD VIDEO"
                          filled
                          @change="atualizaMetaQuestions"
                          v-model="mobilemedia.object"
                          accept="video/*"
                          prepend-icon="mdi-video"
                        ></v-file-input>
                        <v-btn icon="icon" class="mt-2 ml-3">
                          <v-icon
                            x-large
                            color="red"
                            @click="deleteMobileMediaQuestion(i, idmobile)"
                          >mdi-minus-box</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                      </v-row>
                      <v-row v-if="mobilemedia.type === 3">
                        <v-spacer></v-spacer>
                        <v-file-input
                          style="width: 165px;"
                          label="UPLOAD AUDIO"
                          filled
                          v-model="mobilemedia.object"
                          accept="audio/*"
                          prepend-icon="mdi-file-music"
                        ></v-file-input>
                        <v-btn icon="icon" class="mt-2 ml-3">
                          <v-icon
                            x-large
                            color="red"
                            @click="deleteMobileMediaQuestion(i, idmobile)"
                          >mdi-minus-box</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                      </v-row>
                      <v-row v-if="mobilemedia.type === 5" class="mb-2">
                        <v-spacer></v-spacer>
                        <v-text-field
                          v-model="mobilemedia.object"
                          :rules="linkUrlRules"
                          label="Url"
                          required
                        ></v-text-field>
                        <v-btn icon="icon" class="mt-2 ml-3">
                          <v-icon
                            x-large
                            color="red"
                            @click="deleteMobileMediaQuestion(i, idmobile)"
                          >mdi-minus-box</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                      </v-row>
                    </div>
                  </v-col>
                </div>

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
        <v-menu
          v-if="questionsControl.length > 0"
          top="top"
          width="300px"
          origin="center center"
          :offset-y="true"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" color="primary" height="49">
              <strong>Adicionar Questão</strong>
              <v-icon class="ml-2" large color="white">mdi-plus-box</v-icon>
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
import * as firebase from "firebase";
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
    i: 0,
    auxGetSrc: [],
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
    dialog: async function() {
      this.getColaborative();
    }
  },
  mounted: function() {
    this.getColaborative();
    this.$refs.form.resetValidation();
  },
  methods: {
    async getColaborative() {
      if (this.instructionalelement) {
        var vm = this;
        this.$nextTick(function() {
          this.colaborativeName = this.instructionalelement.label;
          this.colaborativeDescription = this.instructionalelement.description;
          this.memberAmount = parseInt(this.instructionalelement.memberamount);
        });
        this.questionsControl = [];
        this.mobileMediasControl = [];
        if (this.instructionalelement.mobilemedias.length > 0) {
          await this.instructionalelement.mobilemedias.forEach(async function(
            elementMobile,
            indexMobile
          ) {
            if (elementMobile.fk_idmediatype.split("/")[4] === "1") {
              vm.getSrcImage(
                indexMobile,
                elementMobile.path,
                elementMobile.namefile
              );
              await vm.mobileMediasControl.push({
                type: parseInt(elementMobile.fk_idmediatype.split("/")[4]),
                object: null,
                resolution: elementMobile.resolution,
                path: elementMobile.path,
                namefile: elementMobile.namefile,
                url: elementMobile.url
              });
            } else if (elementMobile.fk_idmediatype.split("/")[4] === "2") {
              vm.getSrcVideo(
                indexMobile,
                elementMobile.path,
                elementMobile.namefile
              );
              await vm.mobileMediasControl.push({
                type: parseInt(elementMobile.fk_idmediatype.split("/")[4]),
                object: null,
                resolution: elementMobile.resolution,
                time: elementMobile.time,
                path: elementMobile.path,
                namefile: elementMobile.namefile,
                url: elementMobile.url
              });
            } else if (elementMobile.fk_idmediatype.split("/")[4] === "3") {
              vm.getSrcAudio(
                indexMobile,
                elementMobile.path,
                elementMobile.namefile
              );
              await vm.mobileMediasControl.push({
                type: parseInt(elementMobile.fk_idmediatype.split("/")[4]),
                object: null,
                path: elementMobile.path,
                namefile: elementMobile.namefile,
                url: elementMobile.url
              });
            } else if (elementMobile.fk_idmediatype.split("/")[4] === "5") {
              await vm.mobileMediasControl.push({
                type: parseInt(elementMobile.fk_idmediatype.split("/")[4]),
                object: elementMobile.urllink,
                url: elementMobile.url
              });
            }
          });
        }
        if (this.instructionalelement.questions.length > 0) {
          this.viewQuestions = true;
          await this.instructionalelement.questions.forEach(async function(
            elementQuestion,
            indexQuestion
          ) {
            if (
              elementQuestion.typequestion ===
              `http://127.0.0.1:8000/questiontype/1/`
            ) {
              await vm.questionsControl.push({
                typeQuestion: parseInt(
                  elementQuestion.typequestion.split("/")[4]
                ),
                descriptionQuestion: elementQuestion.descriptionquestion,
                answersAlternatives: [],
                mobileMedias: [],
                url: elementQuestion.url
              });
              await elementQuestion.answersalternatives.forEach(async function(
                elementAlternative
              ) {
                await vm.questionsControl[
                  indexQuestion
                ].answersAlternatives.push({
                  isTrue: elementAlternative.istrue,
                  answers: elementAlternative.answers,
                  url: elementAlternative.url
                });
              });
            } else if (
              elementQuestion.typequestion ===
              `http://127.0.0.1:8000/questiontype/2/`
            ) {
              await vm.questionsControl.push({
                typeQuestion: parseInt(
                  elementQuestion.typequestion.split("/")[4]
                ),
                descriptionQuestion: elementQuestion.descriptionquestion,
                correctAnswer:
                  elementQuestion.resolutionquestion[0].correctanswer,
                mobileMedias: [],
                url: elementQuestion.url,
                urlCorrectAnswer: elementQuestion.resolutionquestion[0].url
              });
            }
            if (elementQuestion.mobilemedias) {
              await elementQuestion.mobilemedias.forEach(async function(
                elementMobile,
                indexMobile
              ) {
                if (elementMobile.fk_idmediatype.split("/")[4] === "1") {
                  vm.getSrcImageQuestions(
                    indexQuestion,
                    indexMobile,
                    elementMobile.path,
                    elementMobile.namefile
                  );
                  await vm.questionsControl[indexQuestion].mobileMedias.push({
                    type: parseInt(elementMobile.fk_idmediatype.split("/")[4]),
                    object: null,
                    resolution: elementMobile.resolution,
                    path: elementMobile.path,
                    namefile: elementMobile.namefile,
                    url: elementMobile.url
                  });
                } else if (elementMobile.fk_idmediatype.split("/")[4] === "2") {
                  vm.getSrcVideoQuestions(
                    indexQuestion,
                    indexMobile,
                    elementMobile.path,
                    elementMobile.namefile
                  );
                  await vm.questionsControl[indexQuestion].mobileMedias.push({
                    type: parseInt(elementMobile.fk_idmediatype.split("/")[4]),
                    object: null,
                    resolution: elementMobile.resolution,
                    time: elementMobile.time,
                    path: elementMobile.path,
                    namefile: elementMobile.namefile,
                    url: elementMobile.url
                  });
                } else if (elementMobile.fk_idmediatype.split("/")[4] === "3") {
                  vm.getSrcAudioQuestions(
                    indexQuestion,
                    indexMobile,
                    elementMobile.path,
                    elementMobile.namefile
                  );
                  await vm.questionsControl[indexQuestion].mobileMedias.push({
                    type: parseInt(elementMobile.fk_idmediatype.split("/")[4]),
                    object: null,
                    path: elementMobile.path,
                    namefile: elementMobile.namefile,
                    url: elementMobile.url
                  });
                } else if (elementMobile.fk_idmediatype.split("/")[4] === "5") {
                  await vm.questionsControl[indexQuestion].mobileMedias.push({
                    type: parseInt(elementMobile.fk_idmediatype.split("/")[4]),
                    object: elementMobile.urllink,
                    url: elementMobile.url
                  });
                }
              });
            }
          });
          vm.viewQuestions = true;
        }
      } else {
        this.questionsControl = [];
        this.mobileMediasControl = [];
        this.resetValidation();
        this.viewQuestions = false;
        this.resetVariables();
      }
    },
    /* FUNÇÃO PARA SALVAR ATIVIDADE COLABORATIVA QUE TENHA QUESTÕES */
    async postQuestions() {
      var instructionalelement = {
        label: this.colaborativeName,
        fk_instructionalelementtype: `http://127.0.0.1:8000/instrucelementtype/3/`,
        memberamount: this.memberAmount,
        description: this.colaborativeDescription
      };
      var vm = this;
      var auxPath = "";
      if (this.mobileMediasControl) {
        this.mobileMediasControl.forEach(async mobilemedia => {
          if (mobilemedia.url) {
            if (mobilemedia.type !== 5) {
              firebase
                .storage()
                .ref()
                .child(mobilemedia.path)
                .put(mobilemedia.object);
            }
          } else {
              auxPath =
                vm.domain.idknowledgedomain.toString() +
                "/" +
                (await setTimeout(async function() {
                  await Date.now().toString();
                }, 1));
              if (mobilemedia.type !== 5) {
                firebase
                  .storage()
                  .ref()
                  .child(auxPath)
                  .put(mobilemedia.object);

                mobilemedia.path = auxPath;
              }
            }
        });
      }
      var auxPathQuestions = "";
      this.questionsControl.forEach(async function(question) {
        if (question.mobileMedias) {
          await question.mobileMedias.forEach(mobilemedia => {
            if (mobilemedia.url) {
              if (mobilemedia.type !== 5) {
                firebase
                  .storage()
                  .ref()
                  .child(mobilemedia.path)
                  .put(mobilemedia.object);
              }
            } else {
              setTimeout(function() {
                auxPathQuestions =
                  vm.domain.idknowledgedomain.toString() +
                  "/" +
                  Date.now().toString();
                if (mobilemedia.type !== 5) {
                  firebase
                    .storage()
                    .ref()
                    .child(auxPathQuestions)
                    .put(mobilemedia.object);

                  mobilemedia.path = auxPathQuestions;
                }
              }, 37);
            }
          });
        }
      });

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
            if (vm.mobileMediasControl) {
              var i = 0;
              await vm.mobileMediasControl.forEach(async function(
                mobilemedia,
                indexmobile
              ) {
                /* DANDO PUT NOS MOBILEMEDIAS QUE POSSUEM URL*/
                if (mobilemedia.url) {
                  if (mobilemedia.type === 1) {
                    await axios.put(
                      mobilemedia.url,
                      {
                        label: "Imagem " + (indexmobile + 1),
                        fk_idmediatype:
                          "http://localhost:8000/mediatype/" +
                          mobilemedia.type +
                          "/",
                        path: mobilemedia.path,
                        resolution: mobilemedia.resolution,
                        namefile: mobilemedia.namefile,
                        description:
                          "Imagem " +
                          (indexmobile + 1) +
                          " " +
                          resposta.data.label,
                        time: null,
                        textfull: null,
                        textshort: null,
                        urllink: null,
                        difficultyLevel: null,
                        learningStyle: null,
                        fk_idinstructionalelement: resposta.data.url
                      },
                      {
                        auth: {
                          username: "admin",
                          password: "admin"
                        }
                      }
                    );
                  } else if (mobilemedia.type === 2) {
                    await axios.put(
                      mobilemedia.url,
                      {
                        label: "Video " + (indexmobile + 1),
                        fk_idmediatype:
                          "http://localhost:8000/mediatype/" +
                          mobilemedia.type +
                          "/",
                        path: mobilemedia.path,
                        resolution: mobilemedia.resolution,
                        namefile: mobilemedia.namefile,
                        description: null,
                        time: mobilemedia.time,
                        textfull: null,
                        textshort: null,
                        urllink: null,
                        difficultyLevel: null,
                        learningStyle: null,
                        fk_idinstructionalelement: resposta.data.url
                      },
                      {
                        auth: {
                          username: "admin",
                          password: "admin"
                        }
                      }
                    );
                  } else if (mobilemedia.type === 3) {
                    await axios.put(
                      mobilemedia.url,
                      {
                        label: "Audio " + (indexmobile + 1),
                        fk_idmediatype:
                          "http://localhost:8000/mediatype/" +
                          mobilemedia.type +
                          "/",
                        path: mobilemedia.path,
                        resolution: null,
                        namefile: mobilemedia.namefile,
                        description: null,
                        time: null,
                        textfull: null,
                        textshort: null,
                        urllink: null,
                        difficultyLevel: null,
                        learningStyle: null,
                        fk_idinstructionalelement: resposta.data.url
                      },
                      {
                        auth: {
                          username: "admin",
                          password: "admin"
                        }
                      }
                    );
                  } else if (mobilemedia.type === 5) {
                    await axios.put(
                      mobilemedia.url,
                      {
                        label: "Link " + (indexmobile + 1),
                        fk_idmediatype:
                          "http://localhost:8000/mediatype/" +
                          mobilemedia.type +
                          "/",
                        path: null,
                        resolution: null,
                        namefile: null,
                        description: null,
                        time: null,
                        textfull: null,
                        textshort: null,
                        urllink: mobilemedia.object,
                        difficultyLevel: null,
                        learningStyle: null,
                        fk_idinstructionalelement: resposta.data.url
                      },
                      {
                        auth: {
                          username: "admin",
                          password: "admin"
                        }
                      }
                    );
                  }
                } else {
                  /* DANDO POST NOS MOBILEMEDIAS QUE NÃO POSSUEM URL*/
                  if (mobilemedia.type === 1) {
                    await axios.post(
                      `http://localhost:8000/mobilemedia/`,
                      {
                        label: "Imagem " + (indexmobile + 1),
                        fk_idmediatype:
                          "http://localhost:8000/mediatype/" +
                          mobilemedia.type +
                          "/",
                        path: mobilemedia.path,
                        resolution: mobilemedia.resolution,
                        namefile: mobilemedia.path.split("/")[1],
                        description:
                          "Imagem " +
                          (indexmobile + 1) +
                          " " +
                          resposta.data.label,
                        time: null,
                        textfull: null,
                        textshort: null,
                        urllink: null,
                        difficultyLevel: null,
                        learningStyle: null,
                        fk_idinstructionalelement: resposta.data.url
                      },
                      {
                        auth: {
                          username: "admin",
                          password: "admin"
                        }
                      }
                    );
                  } else if (mobilemedia.type === 2) {
                    console.log("i", i);
                    await axios.post(
                      `http://localhost:8000/mobilemedia/`,
                      {
                        label: "Video " + (indexmobile + 1),
                        fk_idmediatype:
                          "http://localhost:8000/mediatype/" +
                          mobilemedia.type +
                          "/",
                        path: mobilemedia.path,
                        resolution: mobilemedia.resolution,
                        namefile: mobilemedia.path.split("/")[1],
                        description: null,
                        time: mobilemedia.time,
                        textfull: null,
                        textshort: null,
                        urllink: null,
                        difficultyLevel: null,
                        learningStyle: null,
                        fk_idinstructionalelement: resposta.data.url
                      },
                      {
                        auth: {
                          username: "admin",
                          password: "admin"
                        }
                      }
                    );
                  } else if (mobilemedia.type === 3) {
                    await axios.post(
                      `http://localhost:8000/mobilemedia/`,
                      {
                        label: "Audio " + (indexmobile + 1),
                        fk_idmediatype:
                          "http://localhost:8000/mediatype/" +
                          mobilemedia.type +
                          "/",
                        path: mobilemedia.path,
                        resolution: null,
                        namefile: mobilemedia.path.split("/")[1],
                        description: null,
                        time: null,
                        textfull: null,
                        textshort: null,
                        urllink: null,
                        difficultyLevel: null,
                        learningStyle: null,
                        fk_idinstructionalelement: resposta.data.url
                      },
                      {
                        auth: {
                          username: "admin",
                          password: "admin"
                        }
                      }
                    );
                  } else if (mobilemedia.type === 5) {
                    await axios.post(
                      `http://localhost:8000/mobilemedia/`,
                      {
                        label: "Link " + (indexmobile + 1),
                        fk_idmediatype:
                          "http://localhost:8000/mediatype/" +
                          mobilemedia.type +
                          "/",
                        path: null,
                        resolution: null,
                        namefile: null,
                        description: null,
                        time: null,
                        textfull: null,
                        textshort: null,
                        urllink: mobilemedia.object,
                        difficultyLevel: null,
                        learningStyle: null,
                        fk_idinstructionalelement: resposta.data.url
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
              });
            }

            await vm.questionsControl.forEach(async function(
              elementQuestion,
              indexQuestion
            ) {
              /*DANDO PUT NAS QUESTÕES COM URL*/
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
                    /*DANDO PUT NOS MOBILEMEDIAS DAS QUESTÕES COM URL*/

                    await elementQuestion.mobileMedias.forEach(async function(
                      elementMobile,
                      indexMobile
                    ) {
                      if (elementMobile.url) {
                        if (elementMobile.type === 1) {
                          await axios.put(
                            elementMobile.url,
                            {
                              label: "Imagem " + (indexMobile + 1),
                              fk_idmediatype:
                                "http://localhost:8000/mediatype/" +
                                elementMobile.type +
                                "/",
                              path: elementMobile.path,
                              resolution: elementMobile.resolution,
                              namefile: elementMobile.namefile,
                              description:
                                "Imagem " +
                                (indexMobile + 1) +
                                " Questão" +
                                resposta2.data.orderquestion,
                              time: null,
                              textfull: null,
                              textshort: null,
                              urllink: null,
                              difficultyLevel: null,
                              learningStyle: null,
                              fk_idquestion: resposta2.data.url
                            },
                            {
                              auth: {
                                username: "admin",
                                password: "admin"
                              }
                            }
                          );
                        } else if (elementMobile.type === 2) {
                          await axios.put(
                            elementMobile.url,
                            {
                              label: "Video " + (indexMobile + 1),
                              fk_idmediatype:
                                "http://localhost:8000/mediatype/" +
                                elementMobile.type +
                                "/",
                              path: elementMobile.path,
                              resolution: elementMobile.resolution,
                              namefile: elementMobile.namefile,
                              description: null,
                              time: elementMobile.time,
                              textfull: null,
                              textshort: null,
                              urllink: null,
                              difficultyLevel: null,
                              learningStyle: null,
                              fk_idquestion: resposta2.data.url
                            },
                            {
                              auth: {
                                username: "admin",
                                password: "admin"
                              }
                            }
                          );
                        } else if (elementMobile.type === 3) {
                          await axios.put(
                            elementMobile.url,
                            {
                              label: "Audio " + (indexMobile + 1),
                              fk_idmediatype:
                                "http://localhost:8000/mediatype/" +
                                elementMobile.type +
                                "/",
                              path: elementMobile.path,
                              resolution: null,
                              namefile: elementMobile.namefile,
                              description: null,
                              time: null,
                              textfull: null,
                              textshort: null,
                              urllink: null,
                              difficultyLevel: null,
                              learningStyle: null,
                              fk_idquestion: resposta2.data.url
                            },
                            {
                              auth: {
                                username: "admin",
                                password: "admin"
                              }
                            }
                          );
                        } else if (elementMobile.type === 5) {
                          await axios.put(
                            elementMobile.url,
                            {
                              label: "Link " + (indexMobile + 1) + vm.i++ * 0,
                              fk_idmediatype:
                                "http://localhost:8000/mediatype/" +
                                elementMobile.type +
                                "/",
                              path: null,
                              resolution: null,
                              namefile: null,
                              description: null,
                              time: null,
                              textfull: null,
                              textshort: null,
                              urllink: elementMobile.object,
                              difficultyLevel: null,
                              learningStyle: null,
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
                      } else {
                        if (elementMobile.type === 1) {
                          await axios.post(
                            `http://localhost:8000/mobilemedia/`,
                            {
                              label: "Imagem " + (indexMobile + 1),
                              fk_idmediatype:
                                "http://localhost:8000/mediatype/" +
                                elementMobile.type +
                                "/",
                              path: elementMobile.path,
                              resolution: elementMobile.resolution,
                              namefile: elementMobile.path.split("/")[1],
                              description:
                                "Imagem " +
                                (indexMobile + 1) +
                                " Questão" +
                                resposta2.data.orderquestion,
                              time: null,
                              textfull: null,
                              textshort: null,
                              urllink: null,
                              difficultyLevel: null,
                              learningStyle: null,
                              fk_idquestion: resposta2.data.url
                            },
                            {
                              auth: {
                                username: "admin",
                                password: "admin"
                              }
                            }
                          );
                        } else if (elementMobile.type === 2) {
                          await axios.post(
                            `http://localhost:8000/mobilemedia/`,
                            {
                              label: "Video " + (indexMobile + 1),
                              fk_idmediatype:
                                "http://localhost:8000/mediatype/" +
                                elementMobile.type +
                                "/",
                              path: elementMobile.path,
                              resolution: elementMobile.resolution,
                              namefile: elementMobile.path.split("/")[1],
                              description: null,
                              time: elementMobile.time,
                              textfull: null,
                              textshort: null,
                              urllink: null,
                              difficultyLevel: null,
                              learningStyle: null,
                              fk_idquestion: resposta2.data.url
                            },
                            {
                              auth: {
                                username: "admin",
                                password: "admin"
                              }
                            }
                          );
                        } else if (elementMobile.type === 3) {
                          await axios.post(
                            `http://localhost:8000/mobilemedia/`,
                            {
                              label: "Audio " + (indexMobile + 1),
                              fk_idmediatype:
                                "http://localhost:8000/mediatype/" +
                                elementMobile.type +
                                "/",
                              path: elementMobile.path,
                              resolution: null,
                              namefile: elementMobile.path.split("/")[1],
                              description: null,
                              time: null,
                              textfull: null,
                              textshort: null,
                              urllink: null,
                              difficultyLevel: null,
                              learningStyle: null,
                              fk_idquestion: resposta2.data.url
                            },
                            {
                              auth: {
                                username: "admin",
                                password: "admin"
                              }
                            }
                          );
                        } else if (elementMobile.type === 5) {
                          await axios.post(
                            `http://localhost:8000/mobilemedia/`,
                            {
                              label: "Link " + (indexMobile + 1) + vm.i++ * 0,
                              fk_idmediatype:
                                "http://localhost:8000/mediatype/" +
                                elementMobile.type +
                                "/",
                              path: null,
                              resolution: null,
                              namefile: null,
                              description: null,
                              time: null,
                              textfull: null,
                              textshort: null,
                              urllink: elementMobile.object,
                              difficultyLevel: null,
                              learningStyle: null,
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
                      }
                    });

                    if (elementQuestion.typeQuestion === 1) {
                      await elementQuestion.answersAlternatives.forEach(
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
                      await elementQuestion.answersAlternatives.forEach(
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
        /* CÓDIGO PARA CRIAÇÃO DA ATIVIDADE COLABORATIVA */
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
            if (vm.mobileMediasControl) {
              /* INSERÇÃO DOS MOBILEMEDIAS DA ATIVIDADE COLABORATIVA */
              await vm.mobileMediasControl.forEach(async function(
                mobilemedia,
                indexmobile
              ) {
                if (mobilemedia.type === 1) {
                  await axios.post(
                    `http://localhost:8000/mobilemedia/`,
                    {
                      label: "Imagem " + (indexmobile + 1),
                      fk_idmediatype:
                        "http://localhost:8000/mediatype/" +
                        mobilemedia.type +
                        "/",
                      path: mobilemedia.path,
                      resolution: mobilemedia.resolution,
                      namefile: mobilemedia.path.split("/")[1],
                      description:
                        "Imagem " +
                        (indexmobile + 1) +
                        " " +
                        resposta.data.label,
                      time: null,
                      textfull: null,
                      textshort: null,
                      urllink: null,
                      difficultyLevel: null,
                      learningStyle: null,
                      fk_idinstructionalelement: resposta.data.url
                    },
                    {
                      auth: {
                        username: "admin",
                        password: "admin"
                      }
                    }
                  );
                } else if (mobilemedia.type === 2) {
                  await axios.post(
                    `http://localhost:8000/mobilemedia/`,
                    {
                      label: "Video " + (indexmobile + 1),
                      fk_idmediatype:
                        "http://localhost:8000/mediatype/" +
                        mobilemedia.type +
                        "/",
                      path: mobilemedia.path,
                      resolution: mobilemedia.resolution,
                      namefile: mobilemedia.path.split("/")[1],
                      description: null,
                      time: mobilemedia.time,
                      textfull: null,
                      textshort: null,
                      urllink: null,
                      difficultyLevel: null,
                      learningStyle: null,
                      fk_idinstructionalelement: resposta.data.url
                    },
                    {
                      auth: {
                        username: "admin",
                        password: "admin"
                      }
                    }
                  );
                } else if (mobilemedia.type === 3) {
                  await axios.post(
                    `http://localhost:8000/mobilemedia/`,
                    {
                      label: "Audio " + (indexmobile + 1),
                      fk_idmediatype:
                        "http://localhost:8000/mediatype/" +
                        mobilemedia.type +
                        "/",
                      path: mobilemedia.path,
                      resolution: null,
                      namefile: mobilemedia.path.split("/")[1],
                      description: null,
                      time: null,
                      textfull: null,
                      textshort: null,
                      urllink: null,
                      difficultyLevel: null,
                      learningStyle: null,
                      fk_idinstructionalelement: resposta.data.url
                    },
                    {
                      auth: {
                        username: "admin",
                        password: "admin"
                      }
                    }
                  );
                } else if (mobilemedia.type === 5) {
                  await axios.post(
                    `http://localhost:8000/mobilemedia/`,
                    {
                      label: "Link " + (indexmobile + 1),
                      fk_idmediatype:
                        "http://localhost:8000/mediatype/" +
                        mobilemedia.type +
                        "/",
                      path: null,
                      resolution: null,
                      namefile: null,
                      description: null,
                      time: null,
                      textfull: null,
                      textshort: null,
                      urllink: mobilemedia.object,
                      difficultyLevel: null,
                      learningStyle: null,
                      fk_idinstructionalelement: resposta.data.url
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
            await vm.questionsControl.forEach(async function(
              elementQuestion,
              indexQuestion
            ) {
              /* INSERÇÃO DAS QUESTÕES DA ATIVIDADE COLABORATIVA */
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
                  /* INSERÇÃO DOS MOBILEMEDIAS DAS QUESTÕES DA ATIVIDADE COLABORATIVA */
                  await elementQuestion.mobileMedias.forEach(async function(
                    elementMobile,
                    indexMobile
                  ) {
                    if (elementMobile.type === 1) {
                      await axios.post(
                        `http://localhost:8000/mobilemedia/`,
                        {
                          label: "Imagem " + (indexMobile + 1),
                          fk_idmediatype:
                            "http://localhost:8000/mediatype/" +
                            elementMobile.type +
                            "/",
                          path: elementMobile.path,
                          resolution: elementMobile.resolution,
                          namefile: elementMobile.path.split("/")[1],
                          description:
                            "Imagem " +
                            (indexMobile + 1) +
                            " Questão" +
                            resposta2.data.orderquestion,
                          time: null,
                          textfull: null,
                          textshort: null,
                          urllink: null,
                          difficultyLevel: null,
                          learningStyle: null,
                          fk_idquestion: resposta2.data.url
                        },
                        {
                          auth: {
                            username: "admin",
                            password: "admin"
                          }
                        }
                      );
                    } else if (elementMobile.type === 2) {
                      await axios.post(
                        `http://localhost:8000/mobilemedia/`,
                        {
                          label: "Video " + (indexMobile + 1),
                          fk_idmediatype:
                            "http://localhost:8000/mediatype/" +
                            elementMobile.type +
                            "/",
                          path: elementMobile.path,
                          resolution: elementMobile.resolution,
                          namefile: elementMobile.path.split("/")[1],
                          description: null,
                          time: elementMobile.time,
                          textfull: null,
                          textshort: null,
                          urllink: null,
                          difficultyLevel: null,
                          learningStyle: null,
                          fk_idquestion: resposta2.data.url
                        },
                        {
                          auth: {
                            username: "admin",
                            password: "admin"
                          }
                        }
                      );
                    } else if (elementMobile.type === 3) {
                      await axios.post(
                        `http://localhost:8000/mobilemedia/`,
                        {
                          label: "Audio " + (indexMobile + 1),
                          fk_idmediatype:
                            "http://localhost:8000/mediatype/" +
                            elementMobile.type +
                            "/",
                          path: elementMobile.path,
                          resolution: null,
                          namefile: elementMobile.path.split("/")[1],
                          description: null,
                          time: null,
                          textfull: null,
                          textshort: null,
                          urllink: null,
                          difficultyLevel: null,
                          learningStyle: null,
                          fk_idquestion: resposta2.data.url
                        },
                        {
                          auth: {
                            username: "admin",
                            password: "admin"
                          }
                        }
                      );
                    } else if (elementMobile.type === 5) {
                      await axios.post(
                        `http://localhost:8000/mobilemedia/`,
                        {
                          label: "Link " + (indexMobile + 1) + vm.i++ * 0,
                          fk_idmediatype:
                            "http://localhost:8000/mediatype/" +
                            elementMobile.type +
                            "/",
                          path: null,
                          resolution: null,
                          namefile: null,
                          description: null,
                          time: null,
                          textfull: null,
                          textshort: null,
                          urllink: elementMobile.object,
                          difficultyLevel: null,
                          learningStyle: null,
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
                  if (elementQuestion.typeQuestion === 1) {
                    /* INSERÇÃO DAS ALTERNATIVAS DAS QUESTÕES DA ATIVIDADE COLABORATIVA */
                    await elementQuestion.answersAlternatives.forEach(
                      async function(elementAlternative, indexAlternative) {
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
                      }
                    );
                  } else if (elementQuestion.typeQuestion === 2) {
                    /* INSERÇÃO DA RESPOSTA DAS QUESTÕES DA ATIVIDADE COLABORATIVA */
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
          type: mobileMediaType,
          object: null,
          resolution: null,
          path: null,
          namefile: null,
          url: null
        });
      } else if (mobileMediaType === 2) {
        this.mobileMediasControl.push({
          type: mobileMediaType,
          object: null,
          resolution: null,
          time: null,
          path: null,
          namefile: null,
          url: null
        });
      } else if (mobileMediaType === 3) {
        this.mobileMediasControl.push({
          type: mobileMediaType,
          object: null,
          path: null,
          namefile: null,
          url: null
        });
      } else if (mobileMediaType === 4) {
        this.mobileMediasControl.push({
          type: mobileMediaType + 1,
          object: null,
          url: null
        });
      }
    },
    async deleteMobileMedia(idMobileMedia) {
      if (this.mobileMediasControl[idMobileMedia].url) {
        if (this.mobileMediasControl[idMobileMedia].type !== 5) {
          await firebase
            .storage()
            .ref()
            .child(this.mobileMediasControl[idMobileMedia].path)
            .delete();
        }
        await axios.delete(this.mobileMediasControl[idMobileMedia].url, {
          auth: {
            username: "admin",
            password: "admin"
          }
        });
      }
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
    async deleteQuestionario() {
      await this.questionsControl.forEach(async question => {
        if (question.url) {
          await axios.delete(question.url, {
            auth: {
              username: "admin",
              password: "admin"
            }
          });
        }
      });
      this.questionsControl = [];
      this.viewQuestions = false;
    },
    addQuestion(questionType) {
      if (questionType === 1) {
        this.questionsControl.push({
          typeQuestion: questionType,
          descriptionQuestion: null,
          answersAlternatives: [],
          mobileMedias: [],
          url: null
        });
      } else if (questionType === 2) {
        this.questionsControl.push({
          typeQuestion: questionType,
          descriptionQuestion: null,
          correctAnswer: null,
          mobileMedias: [],
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
    addMobileMediaQuestion(idQuestion, mobileMediaType) {
      if (mobileMediaType === 1) {
        this.questionsControl[idQuestion].mobileMedias.push({
          type: mobileMediaType,
          object: null,
          resolution: null,
          path: null,
          namefile: null,
          url: null
        });
      } else if (mobileMediaType === 2) {
        this.questionsControl[idQuestion].mobileMedias.push({
          type: mobileMediaType,
          object: null,
          resolution: null,
          time: null,
          path: null,
          namefile: null,
          url: null
        });
      } else if (mobileMediaType === 3) {
        this.questionsControl[idQuestion].mobileMedias.push({
          type: mobileMediaType,
          object: null,
          path: null,
          namefile: null,
          url: null
        });
      } else if (mobileMediaType === 4) {
        this.questionsControl[idQuestion].mobileMedias.push({
          type: mobileMediaType + 1,
          object: null,
          url: null
        });
      }
    },
    async deleteMobileMediaQuestion(idQuestion, idMobileMedia) {
      if (this.questionsControl[idQuestion].mobileMedias[idMobileMedia].url) {
        if (
          this.questionsControl[idQuestion].mobileMedias[idMobileMedia].type !==
          5
        ) {
          await firebase
            .storage()
            .ref()
            .child(
              this.questionsControl[idQuestion].mobileMedias[idMobileMedia].path
            )
            .delete();
        }
        await axios.delete(
          this.questionsControl[idQuestion].mobileMedias[idMobileMedia].url,
          {
            auth: {
              username: "admin",
              password: "admin"
            }
          }
        );
      }
      if (idMobileMedia == 0) {
        this.questionsControl[idQuestion].mobileMedias.shift();
      } else {
        this.questionsControl[idQuestion].mobileMedias.splice(idMobileMedia, 1);
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
              await this.resetVariables();
              this.questionsControl = [];
              this.mobileMediasControl = [];
              await this.$emit("instrucclose", auxNumberQuestions);
            }
          } else {
            this.dialog_alert = true;
          }
        } else {
          await this.postQuestions();
          await this.resetVariables();
          await this.$emit("instrucclose");
        }
      }
    },
    resetVariables() {
      this.i = 0;
      this.auxGetSrc = [];
      this.auxGetSrcQuestions = [];
      this.questionsControl = [];
      this.mobileMediasControl = [];
      this.colaborativeName = "";
      this.memberAmount = "";
      this.colaborativeDescription = "";
      this.viewQuestions = false;
    },
    async reset() {
      await this.$emit("instrucclose");
      await this.resetVariables();
      this.questionsControl = [];
      this.mobileMediasControl = [];
      await this.$refs.form.reset();
    },
    atualizaObj(file, indexMobile) {
      this.mobileMediasControl[indexMobile].object = file;
    },
    atualizaMeta() {
      if (this.mobileMediasControl.length > 0) {
        this.mobileMediasControl.forEach(mobilemedia => {
          if (mobilemedia.object && !mobilemedia.url) {
            if (mobilemedia.type === 1) {
              var img = new Image();
              img.src = URL.createObjectURL(mobilemedia.object);
              img.onload = function() {
                mobilemedia.resolution = img.width + "X" + img.height;
              };
            } else if (mobilemedia.type === 2) {
              var video = document.createElement("video");
              var source = document.createElement("source");
              source.setAttribute(
                "src",
                URL.createObjectURL(mobilemedia.object)
              );
              video.appendChild(source);
              video.oncanplay = function() {
                mobilemedia.resolution =
                  video.videoWidth + "X" + video.videoHeight;
                mobilemedia.time = video.duration;
              };
            }
          }
        });
      }
    },
    async getSrcImage(indexMobile, path, namefile) {
      /*var obj = {};*/
      if (path) {
        var vm = this;
        await firebase
          .storage()
          .ref(path)
          .getDownloadURL()
          .then(function(url) {
            /*vm.viewImageSrc = url;*/
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = function() {
              var blob = xhr.response;
              var file = new File([blob], namefile, {
                type: blob.type
              });
              // vm.auxGetSrc.push(file);
              vm.atualizaObj(file, indexMobile);
            };
            xhr.open("GET", url);
            xhr.send();
          });
      }
    },
    async getSrcVideo(indexMobile, path, namefile) {
      /*var obj = {};*/
      if (path) {
        var vm = this;
        await firebase
          .storage()
          .ref(path)
          .getDownloadURL()
          .then(function(url) {
            /*vm.viewVideoSrc = url;*/
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = function() {
              var blob = xhr.response;
              var file = new File([blob], namefile, {
                type: blob.type
              });
              // vm.auxGetSrc.push(file);
              vm.atualizaObj(file, indexMobile);
            };
            xhr.open("GET", url);
            xhr.send();
          });
      }
    },
    async getSrcAudio(indexMobile, path, namefile) {
      /*var obj = {};*/
      if (path) {
        var vm = this;
        await firebase
          .storage()
          .ref(path)
          .getDownloadURL()
          .then(function(url) {
            /*vm.viewAudioSrc = url;*/
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = function() {
              var blob = xhr.response;
              var file = new File([blob], namefile, {
                type: blob.type
              });
              // vm.auxGetSrc.push(file);
              vm.atualizaObj(file, indexMobile);
            };
            xhr.open("GET", url);
            xhr.send();
          });
      }
    },
    atualizaMetaQuestions() {
      if (this.questionsControl.length > 0) {
        this.questionsControl.forEach(question => {
          if (question.mobileMedias) {
            question.mobileMedias.forEach(mobilemedia => {
              if (mobilemedia.object && !mobilemedia.url) {
                if (mobilemedia.type === 1) {
                  var img = new Image();
                  img.src = URL.createObjectURL(mobilemedia.object);
                  img.onload = function() {
                    mobilemedia.resolution = img.width + "X" + img.height;
                  };
                } else if (mobilemedia.type === 2) {
                  var video = document.createElement("video");
                  var source = document.createElement("source");
                  source.setAttribute(
                    "src",
                    URL.createObjectURL(mobilemedia.object)
                  );
                  video.appendChild(source);
                  video.oncanplay = function() {
                    mobilemedia.resolution =
                      video.videoWidth + "X" + video.videoHeight;
                    mobilemedia.time = video.duration;
                  };
                }
              }
            });
          }
        });
      }
    },
    atualizaObjQuestions(file, indexQuestion, indexMobile) {
      this.questionsControl[indexQuestion].mobileMedias[
        indexMobile
      ].object = file;
    },
    async getSrcImageQuestions(indexQuestion, indexMobile, path, namefile) {
      /*var obj = {};*/
      if (path) {
        var vm = this;
        await firebase
          .storage()
          .ref(path)
          .getDownloadURL()
          .then(function(url) {
            /*vm.viewImageSrc = url;*/
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = function() {
              var blob = xhr.response;
              var file = new File([blob], namefile, {
                type: blob.type
              });
              /*vm.auxGetSrcQuestions.push(file);*/
              vm.atualizaObjQuestions(file, indexQuestion, indexMobile);
            };
            xhr.open("GET", url);
            xhr.send();
          });
      }
    },
    async getSrcVideoQuestions(indexQuestion, indexMobile, path, namefile) {
      /*var obj = {};*/
      if (path) {
        var vm = this;
        await firebase
          .storage()
          .ref(path)
          .getDownloadURL()
          .then(function(url) {
            /*vm.viewVideoSrc = url;*/
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = function() {
              var blob = xhr.response;
              var file = new File([blob], namefile, {
                type: blob.type
              });
              // vm.auxGetSrcQuestions.push(file);
              vm.atualizaObjQuestions(file, indexQuestion, indexMobile);
            };
            xhr.open("GET", url);
            xhr.send();
          });
      }
    },
    async getSrcAudioQuestions(indexQuestion, indexMobile, path, namefile) {
      /*var obj = {};*/
      if (path) {
        var vm = this;
        await firebase
          .storage()
          .ref(path)
          .getDownloadURL()
          .then(function(url) {
            /*vm.viewAudioSrc = url;*/
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = function() {
              var blob = xhr.response;
              var file = new File([blob], namefile, {
                type: blob.type
              });
              // vm.auxGetSrcQuestions.push(file);
              vm.atualizaObjQuestions(file, indexQuestion, indexMobile);
            };
            xhr.open("GET", url);
            xhr.send();
          });
      }
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>
