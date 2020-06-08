<template>
<v-container class="pa-0">
    <v-card>
        <v-card-title style="background-color:#63B0B0; color:white;">
            <span class="headline">
                <p>Importe seu áudio.</p>
            </span>
        </v-card-title>
        <v-card-text>
            <v-row v-if="type==='conceito'">

                <v-col cols="4">
                    <label for="infoItemClassesSelect">Classifique o item de informação</label>
                    <v-select id="infoItemClassesSelect" class="mt-5" v-model="infoClasse" :items="infoItemClasses" label="Classe" style="margin:0px;"></v-select>
                </v-col>

                <v-col cols="4">
                    <label for="infoItemLevelsSelect">Qual o nível de dificuldade deste conteúdo?</label>
                    <v-select id="infoItemLevelsSelect" v-model="infoLevel" :items="infoItemLevels" label="Nível" style="margin:0px;"></v-select>
                </v-col>
                <v-col cols="4">
                    <label for="infoItemLearningStylesSelect">Qual o estilo de aprendizado deste conteúdo?</label>
                    <v-select id="infoItemLearningStylesSelect" v-model="infoLearning" :items="infoItemLearningStyles" label="Nível" style="margin:0px;"></v-select>
                </v-col>
            </v-row>
            <v-spacer></v-spacer>
            <v-file-input label="UPLOAD AUDIO" filled v-model="audioObject" accept="audio/*" prepend-icon="mdi-file-music"></v-file-input>
            <v-spacer></v-spacer>
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
import * as firebase from "firebase/app";
import axios from "axios";

export default {
    name: "AudioDialog",
    props: ["optionCall", "type", "domain"],
    data: () => ({
        valid: true,
        infoClasse: "",
        infoLevel: "",
        infoLearning: "",
        infoItemClasses: ["Conceito", "Princípio", "Fato"],
        infoItemLevels: ["0 - Inicial", "1 - Fácil", "2 - Médio", "3 - Difícil"],
        infoItemLearningStyles: ["Visual", "Textual"],
        infoResume: "",
        audioObject: {}
    }),
    methods: {
        reset() {
            this.$emit("close");
        },
        async postMobileMedia() {
            var vm = this;
            var path = Date.now().toString();
            await firebase.storage().ref().child(vm.domain.idknowledgedomain.toString()).child(path).put(vm.audioObject);
            var mobilemedia = {
                label: this.imagemDescription,
                fk_idmediatype: "http://localhost:8000/mediatype/2/",
                difficultyLevel: null,
                learningStyle: null,
                path: vm.domain.idknowledgedomain.toString() + "/" + path,
                namefile: this.audioObject.name,
                resolution: null,
                description: null,
                time: null,
                textfull: null,
                textshort: null,
                urllink: null
            };
            console.log(iteminfo);
            if (this.type === "conceito") {
                var iteminfo = {
                    nameinformationitem: "audio_" + vm.audioObject.name,
                    fk_informationitemtype: `http://127.0.0.1:8000/informationitemtype/` + (vm.infoClasse + 1) + "/",
                    fk_idconcept: this.optionCall.url
                };
            }
            console.log(iteminfo);
            if (this.type === "dominio") {
                Object.assign(mobilemedia, {
                    fk_idknowledgedomain: this.optionCall.url
                });
            } else if (this.type === "modulo") {
                Object.assign(mobilemedia, {
                    fk_module: this.optionCall.url
                });
            } else if (this.type === "conceito") {
                Object.assign(mobilemedia, {
                    fk_concept: this.optionCall.url
                });
            }

            if (this.type === "conceito") {
                await axios
                    .post(`http://127.0.0.1:8000/informationitem/`, iteminfo, {
                        auth: {
                            username: "admin",
                            password: "admin"
                        }
                    })
                    .then(function (resposta) {
                        Object.assign(mobilemedia, {
                            fk_informationitem: resposta.data.url
                        });
                        axios
                            .post(`http://localhost:8000/mobilemedia/`, mobilemedia, {
                                auth: {
                                    username: "admin",
                                    password: "admin"
                                }
                            })
                            .then(function ( /*resposta*/ ) {
                                /*vm.moduloTitle = resposta.data.namemodule;
                                    vm.subTitle = resposta.data.subtitle;*/
                            });
                    });
            } else if (this.type === "dominio" || this.type === "modulo") {
                await axios
                    .post(`http://localhost:8000/mobilemedia/`, mobilemedia, {
                        auth: {
                            username: "admin",
                            password: "admin"
                        }
                    })
                    .then(function ( /*resposta*/ ) {
                        /*vm.moduloTitle = resposta.data.namemodule;
                                vm.subTitle = resposta.data.subtitle;*/
                    });

            }
        },
        async validate() {
            var vm = this;
            this.infoClasse = this.infoItemClasses.findIndex(function (value) {
                return value === vm.infoClasse;
            });
            this.infoLevel = this.infoItemLevels.findIndex(function (value) {
                return value === vm.infoLevel;
            });
            this.infoLearning = this.infoItemLearningStyles.findIndex(function (
                value
            ) {
                return value === vm.infoLearning;
            });
            await this.postMobileMedia();

            this.$emit("close");
        }
    }
};
</script>
