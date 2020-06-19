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

          <v-row style="margin-top: -20px;" class="mb-2">
            <v-col cols="5"></v-col>
            <v-col>
              <v-menu
                top="top"
                width="300px"
                origin="center center"
                :offset-y="true"
                transition="scale-transition"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    large
                    color="primary"
                    style="color:white; font-size: 1.2em;"
                    class="ml-9"
                  >
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
                class="ml-5"
                color="primary"
                large
                style="color:white; font-size: 1.2em;"
                @click="addQuesitonario()"
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
              <v-col cols="8">
                <v-toolbar-title style="font-size:1.2em;">
                  <strong>Lista de questões da atividade</strong>
                </v-toolbar-title>
              </v-col>
              <v-col cols="3" class="ml-9">
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
  </v-container>
</template>

<script>
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
    colaborativeName: "",
    colaborativeNameRules: [
      v => !!v || "É necessário descrever um identificador para a avaliação",
      v =>
        (v && v.length <= 25) ||
        "Nome do identificador da avaliação deve ter no máximo 25 caracteres"
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
    questionsControl: []
  }),
  methods: {
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
    addQuesitonario() {
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
    },
    async reset() {
      await this.$emit("instrucclose");
      await this.$refs.form.reset();
    }
  }
};
</script>
