

<template>

<v-container class="pa-0">
    <v-card>
        <v-card-title style="background-color:#63B0B0; color:white;">
            <span class="headline">
          <p>Descreva o procedimento a ser criado.</p>
        </span>
            <v-spacer></v-spacer>
            <v-menu width="300px" origin="bottom bottom" :offset-y="true" transition="scale-transition">
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" large color="primary" style="color:white;" class="mb-3">
                        <strong>Adicionar MobileMedia</strong>
                        <v-icon class="ml-2" large color="white">mdi-plus-box</v-icon>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item v-for="(item, i) in itemsMobileMedia" :key="i" @click="addMobileMedia(i + 1)">
                        <v-icon x-large color="blue">{{ item.icon }}</v-icon>
                        <v-list-item-title style="font-size: 1.2em; color:#2196F3;" class="ml-1">
                            <strong>{{ item.name }}</strong>
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation class="mt-3">
                <label class="pt-2" style="font-size:1.3em;" for="procedureNameArea">
                    <strong>Identificador do procedimento:</strong>
                </label>
                <v-text-field id="procedureNameArea" v-model="procedureName" :counter="100" :rules="procedureNameRules" required class="mt-2 mb-4"></v-text-field>
                <label class="pt-2" style="font-size:1.3em;" for="procedureDescriptionArea">
                    <strong>Escreva a descrição do procedimento:</strong>
                </label>
                <v-textarea id="procedureDescriptionArea" v-model="procedureDescription" :rules="procedureDescriptionRules" background-color="#F2F3F3" clearable clear-icon="mdi-close-circle" class="mt-2" name="input-3-1" filled auto-grow required></v-textarea>
                <div v-if="mobileMediasControl.length > 0">
                    <label class="mb-6 pt-2" style="font-size:1.3em;">
                        <strong>MobileMedias do procedimento:</strong>
                    </label>
                    <div class="mt-8"></div>
                    <div v-for="(mobilemedia, i) in mobileMediasControl" :key="i">
                        <v-row v-if="mobilemedia.type === 1">
                            <v-spacer></v-spacer>
                            <v-file-input style="width: 165px;" label="UPLOAD IMAGE" filled @change="atualizaMeta" v-model="mobilemedia.object" accept="image/*" prepend-icon="mdi-camera"></v-file-input>
                            <v-btn icon="icon" class="mt-2 ml-3">
                                <v-icon x-large color="red" @click="deleteMobileMedia(i)">mdi-minus-box</v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                        </v-row>
                        <v-row v-if="mobilemedia.type === 2">
                            <v-spacer></v-spacer>
                            <v-file-input style="width: 165px;" label="UPLOAD VIDEO" filled @change="atualizaMeta" v-model="mobilemedia.object" accept="video/*" prepend-icon="mdi-video"></v-file-input>
                            <v-btn icon="icon" class="mt-2 ml-3">
                                <v-icon x-large color="red" @click="deleteMobileMedia(i)">mdi-minus-box</v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                        </v-row>
                        <v-row v-if="mobilemedia.type === 3">
                            <v-spacer></v-spacer>
                            <v-file-input style="width: 165px;" label="UPLOAD AUDIO" filled v-model="mobilemedia.object" accept="audio/*" prepend-icon="mdi-file-music"></v-file-input>
                            <v-btn icon="icon" class="mt-2 ml-3">
                                <v-icon x-large color="red" @click="deleteMobileMedia(i)">mdi-minus-box</v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                        </v-row>
                        <v-row v-if="mobilemedia.type === 5" class="mb-2">
                            <v-spacer></v-spacer>
                            <v-text-field v-model="mobilemedia.object" :rules="linkUrlRules" label="Url" required></v-text-field>
                            <v-btn icon="icon" class="mt-2 ml-3">
                                <v-icon x-large color="red" @click="deleteMobileMedia(i)">mdi-minus-box</v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                        </v-row>
                    </div>
                </div>
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

                    <v-row v-for="(item, i) in phasesControl" :key="i">
                        <v-col cols="3" style="text-align:center; font-size: 1.8em; margin-top:10px;">{{ i + 1 }}º</v-col>
                        <v-col cols="8">
                            <v-textarea style="margin-top: -10px;" v-model="phasesControl[i].description" background-color="#F2F3F3" :rules="phasesControlRules" rows="2" clearable clear-icon="mdi-close-circle" filled auto-grow required></v-textarea>
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
                Cancelar
                <v-icon dark right>mdi-close</v-icon>
            </v-btn>
            <v-btn color="success" height="49" dark large @click="validate()">
                Salvar
                <v-icon dark right>mdi-content-save</v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
    <div class="text-center">
        <v-dialog v-model="dialog_alert" width="500">
            <v-card>
                <v-card-title class="headline red" primary-title style="color:white;">ALERTA!</v-card-title>
                <v-card-text class="mt-3" style="font-size: 1.3em;">Para criar um procedimento, é necessário criar pelo menos uma etapa.
                </v-card-text>
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

import Api from "@/services/Api";
import * as firebase from "firebase";

export default {
    name: "ProcedureDialog",
    props: ["dialog", "procedure", "concept", "module", "domain"],
    data: () => ({
        valid: true,
        dialog_alert: false,
        auxItemInfo: "",
        phasesControl: [],
        linkUrlRules: [(v) => !!v || "É necessário inserir a url do seu link"],
        phasesControlRules: [
            (v) =>
            !!v ||
            "É necessário inserir algum conteúdo nessa etapa do procedimento",
        ],
        procedureName: "",
        procedureNameRules: [
            (v) => !!v || "É necessário descrever o nome do procedimento", (v) =>
            (v && v.length <= 100) ||
            "Nome do procedimento deve ter no máximo 25 caracteres",
        ],
        procedureDescription: "",
        procedureDescriptionRules: [
            (v) =>
            !!v ||
            "É necessário inserir uma descrição do procedimento a ser inserido",
        ],
        mobileMediasControl: [],
        itemsMobileMedia: [{
            icon: "mdi-file-image",
            name: "Imagem",
        }, {
            icon: "mdi-file-video",
            name: "Video",
        }, {
            icon: "mdi-file-music",
            name: "Audio",
        }, {
            icon: "mdi-link-variant",
            name: "Link",
        }, ],
    }),
    watch: {
        dialog: function() {
            this.getProcedure();
        },
        procedure: function() {
            this.getProcedure();
        },
    },
    mounted: function() {
        this.getProcedure();
        this.$refs.form.resetValidation();
    },
    methods: {
        async getProcedure() {
                var vm = this;
                this.$nextTick(function() {
                    vm.procedureName = vm.procedure.nameinformationitem;
                    vm.procedureDescription = vm.procedure.descriptioninformationitem;
                });
                this.phasesControl = [];
                this.mobileMediasControl = [];
                if (this.procedure !== "") {
                    this.procedure.phaseprocedures.forEach((element) => {
                        this.phasesControl.push({
                            description: element.description,
                            url: element.url,
                        });
                    });

                    await this.procedure.mobilemedias.forEach(async function(
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
                                url: elementMobile.url,
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
                                url: elementMobile.url,
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
                                url: elementMobile.url,
                            });
                        } else if (elementMobile.fk_idmediatype.split("/")[4] === "5") {
                            await vm.mobileMediasControl.push({
                                type: parseInt(elementMobile.fk_idmediatype.split("/")[4]),
                                object: elementMobile.urllink,
                                url: elementMobile.url,
                            });
                        }
                    });
                }
            },
            async altera_Cria_Procedimento() {
                var vm = this;
                if (this.procedure === "") {
                    var header = await this.$store.dispatch("getHeader");
                    console.log("esposta.data.url");
                    await Api()
                        .post(
                            `/informationitem/`, {
                                nameinformationitem: this.procedureName,
                                descriptioninformationitem: this.procedureDescription,
                                fk_informationitemtype: `/informationitemtype/4/`,
                                fk_idconcept: this.concept.url,
                                visible: true,
                            },
                            header
                        )
                        .then(async function(resposta) {
                            vm.auxItemInfo = resposta.data.url;
                            var auxPath = "";
                            if (vm.mobileMediasControl) {
                                await vm.mobileMediasControl.forEach(async(mobilemedia) => {
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
                            if (vm.mobileMediasControl) {
                                var i = 0;
                                await vm.mobileMediasControl.forEach(async function(
                                    mobilemedia,
                                    indexmobile
                                ) {
                                    /* DANDO PUT NOS MOBILEMEDIAS QUE POSSUEM URL*/
                                    if (mobilemedia.url) {
                                        if (mobilemedia.type === 1) {
                                            await Api().put(
                                                mobilemedia.url, {
                                                    label: "Imagem " + (indexmobile + 1),
                                                    fk_idmediatype: "/mediatype/" +
                                                        mobilemedia.type +
                                                        "/",
                                                    path: mobilemedia.path,
                                                    resolution: mobilemedia.resolution,
                                                    namefile: mobilemedia.namefile,
                                                    description: "Imagem " +
                                                        (indexmobile + 1) +
                                                        " " +
                                                        resposta.data.label,
                                                    time: null,
                                                    textfull: null,
                                                    textshort: null,
                                                    urllink: null,
                                                    difficultyLevel: null,
                                                    learningStyle: null,
                                                    fk_informationitem: resposta.data.url,
                                                }, {
                                                    auth: {
                                                        username: "admin",
                                                        password: "admin",
                                                    },
                                                }
                                            );
                                        } else if (mobilemedia.type === 2) {
                                            await Api().put(
                                                mobilemedia.url, {
                                                    label: "Video " + (indexmobile + 1),
                                                    fk_idmediatype: "/mediatype/" +
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
                                                    fk_informationitem: resposta.data.url,
                                                }, {
                                                    auth: {
                                                        username: "admin",
                                                        password: "admin",
                                                    },
                                                }
                                            );
                                        } else if (mobilemedia.type === 3) {
                                            await Api().put(
                                                mobilemedia.url, {
                                                    label: "Audio " + (indexmobile + 1),
                                                    fk_idmediatype: "/mediatype/" +
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
                                                    fk_informationitem: resposta.data.url,
                                                }, {
                                                    auth: {
                                                        username: "admin",
                                                        password: "admin",
                                                    },
                                                }
                                            );
                                        } else if (mobilemedia.type === 5) {
                                            await Api().put(
                                                mobilemedia.url, {
                                                    label: "Link " + (indexmobile + 1),
                                                    fk_idmediatype: "/mediatype/" +
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
                                                    fk_informationitem: resposta.data.url,
                                                }, {
                                                    auth: {
                                                        username: "admin",
                                                        password: "admin",
                                                    },
                                                }
                                            );
                                        }
                                    } else {
                                        /* DANDO POST NOS MOBILEMEDIAS QUE NÃO POSSUEM URL*/
                                        console.log(mobilemedia);
                                        if (mobilemedia.type === 1) {
                                            console.log("asdfsdfsd");
                                            await Api().post(
                                                `/mobilemedia/`, {
                                                    label: "Imagem " + (indexmobile + 1),
                                                    fk_idmediatype: "/mediatype/" +
                                                        mobilemedia.type +
                                                        "/",
                                                    path: mobilemedia.path,
                                                    resolution: mobilemedia.resolution,
                                                    namefile: mobilemedia.path.split("/")[1],
                                                    description: "Imagem " +
                                                        (indexmobile + 1) +
                                                        " " +
                                                        resposta.data.label,
                                                    time: null,
                                                    textfull: null,
                                                    textshort: null,
                                                    urllink: null,
                                                    difficultyLevel: null,
                                                    learningStyle: null,
                                                    fk_informationitem: resposta.data.url,
                                                }, {
                                                    auth: {
                                                        username: "admin",
                                                        password: "admin",
                                                    },
                                                }
                                            );
                                        } else if (mobilemedia.type === 2) {
                                            console.log("i", i);
                                            await Api().post(
                                                `/mobilemedia/`, {
                                                    label: "Video " + (indexmobile + 1),
                                                    fk_idmediatype: "/mediatype/" +
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
                                                    fk_informationitem: resposta.data.url,
                                                }, {
                                                    auth: {
                                                        username: "admin",
                                                        password: "admin",
                                                    },
                                                }
                                            );
                                        } else if (mobilemedia.type === 3) {
                                            await Api().post(
                                                `/mobilemedia/`, {
                                                    label: "Audio " + (indexmobile + 1),
                                                    fk_idmediatype: "/mediatype/" +
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
                                                    fk_informationitem: resposta.data.url,
                                                }, {
                                                    auth: {
                                                        username: "admin",
                                                        password: "admin",
                                                    },
                                                }
                                            );
                                        } else if (mobilemedia.type === 5) {
                                            await Api().post(
                                                `/mobilemedia/`, {
                                                    label: "Link " + (indexmobile + 1),
                                                    fk_idmediatype: "/mediatype/" +
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
                                                    fk_informationitem: resposta.data.url,
                                                }, {
                                                    auth: {
                                                        username: "admin",
                                                        password: "admin",
                                                    },
                                                }
                                            );
                                        }
                                    }
                                });
                            }
                        });
                } else {
                    await Api()
                        .put(
                            `/informationitem/` +
                            this.procedure.idinformationitem +
                            `/`, {
                                nameinformationitem: this.procedureName,
                                descriptioninformationitem: this.procedureDescription,
                                fk_informationitemtype: `/informationitemtype/4/`,
                                fk_idconcept: this.concept.url,
                            }, {
                                auth: {
                                    username: "admin",
                                    password: "admin",
                                },
                            }
                        )
                        .then(async function(resposta) {
                            vm.auxItemInfo = resposta.data.url;
                            var auxPath = "";
                            if (vm.mobileMediasControl) {
                                await vm.mobileMediasControl.forEach(async(mobilemedia) => {
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
                            if (vm.mobileMediasControl) {
                                var i = 0;
                                await vm.mobileMediasControl.forEach(async function(
                                    mobilemedia,
                                    indexmobile
                                ) {
                                    /* DANDO PUT NOS MOBILEMEDIAS QUE POSSUEM URL*/
                                    console.log(mobilemedia);
                                    if (mobilemedia.url) {
                                        if (mobilemedia.type === 1) {
                                            await Api().put(
                                                mobilemedia.url, {
                                                    label: "Imagem " + (indexmobile + 1),
                                                    fk_idmediatype: "/mediatype/" +
                                                        mobilemedia.type +
                                                        "/",
                                                    path: mobilemedia.path,
                                                    resolution: mobilemedia.resolution,
                                                    namefile: mobilemedia.namefile,
                                                    description: "Imagem " +
                                                        (indexmobile + 1) +
                                                        " " +
                                                        resposta.data.label,
                                                    time: null,
                                                    textfull: null,
                                                    textshort: null,
                                                    urllink: null,
                                                    difficultyLevel: null,
                                                    learningStyle: null,
                                                    fk_informationitem: resposta.data.url,
                                                    visible: true,
                                                }, {
                                                    auth: {
                                                        username: "admin",
                                                        password: "admin"
                                                    }
                                                }
                                            );
                                        } else if (mobilemedia.type === 2) {
                                            await Api().put(
                                                mobilemedia.url, {
                                                    label: "Video " + (indexmobile + 1),
                                                    fk_idmediatype: "/mediatype/" +
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
                                                }, {
                                                    auth: {
                                                        username: "admin",
                                                        password: "admin"
                                                    }
                                                }
                                            );
                                        } else if (mobilemedia.type === 3) {
                                            await Api().put(
                                                mobilemedia.url, {
                                                    label: "Audio " + (indexmobile + 1),
                                                    fk_idmediatype: "/mediatype/" +
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
                                                }, {
                                                    auth: {
                                                        username: "admin",
                                                        password: "admin"
                                                    }
                                                }
                                            );
                                        } else if (mobilemedia.type === 5) {
                                            await Api().put(
                                                mobilemedia.url, {
                                                    label: "Link " + (indexmobile + 1),
                                                    fk_idmediatype: "/mediatype/" +
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
                                                }, {
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
                                            await Api().post(
                                                `/mobilemedia/`, {
                                                    label: "Imagem " + (indexmobile + 1),
                                                    fk_idmediatype: "/mediatype/" +
                                                        mobilemedia.type +
                                                        "/",
                                                    path: mobilemedia.path,
                                                    resolution: mobilemedia.resolution,
                                                    namefile: mobilemedia.path.split("/")[1],
                                                    description: "Imagem " +
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
                                                }, {
                                                    auth: {
                                                        username: "admin",
                                                        password: "admin"
                                                    }
                                                }
                                            );
                                        } else if (mobilemedia.type === 2) {
                                            console.log("i", i);
                                            await Api().post(
                                                `/mobilemedia/`, {
                                                    label: "Video " + (indexmobile + 1),
                                                    fk_idmediatype: "/mediatype/" +
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
                                                }, {
                                                    auth: {
                                                        username: "admin",
                                                        password: "admin"
                                                    }
                                                }
                                            );
                                        } else if (mobilemedia.type === 3) {
                                            await Api().post(
                                                `/mobilemedia/`, {
                                                    label: "Audio " + (indexmobile + 1),
                                                    fk_idmediatype: "/mediatype/" +
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
                                                }, {
                                                    auth: {
                                                        username: "admin",
                                                        password: "admin"
                                                    }
                                                }
                                            );
                                        } else if (mobilemedia.type === 5) {
                                            await Api().post(
                                                `/mobilemedia/`, {
                                                    label: "Link " + (indexmobile + 1),
                                                    fk_idmediatype: "/mediatype/" +
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
                                                }, {
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

                        });
                }
            },
            async altera_Cria_Fases() {
                var vm = this;
                this.phasesControl.forEach(async function(element, index) {
                    if (element.url === null) {
                        await Api().post(
                            `/phaseprocedure/`, {
                                order: index + 1,
                                description: element.description,
                                fk_informationitem: vm.auxItemInfo,
                            }, {
                                auth: {
                                    username: "admin",
                                    password: "admin",
                                },
                            }
                        );
                    } else {
                        await Api().put(
                            element.url, {
                                order: index + 1,
                                description: element.description,
                                fk_informationitem: vm.auxItemInfo,
                            }, {
                                auth: {
                                    username: "admin",
                                    password: "admin",
                                },
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
                    url: null,
                });
            },
            async deletaPhase(idPhase) {
                if (this.phasesControl[idPhase].url !== null) {
                    await Api().delete(this.phasesControl[idPhase].url, {
                        auth: {
                            username: "admin",
                            password: "admin",
                        },
                    });
                    await this.altera_Cria_Fases();
                }
                if (idPhase == 0) {
                    this.phasesControl.shift();
                } else {
                    this.phasesControl.splice(idPhase, 1);
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
                        url: null,
                    });
                } else if (mobileMediaType === 2) {
                    this.mobileMediasControl.push({
                        type: mobileMediaType,
                        object: null,
                        resolution: null,
                        time: null,
                        path: null,
                        namefile: null,
                        url: null,
                    });
                } else if (mobileMediaType === 3) {
                    this.mobileMediasControl.push({
                        type: mobileMediaType,
                        object: null,
                        path: null,
                        namefile: null,
                        url: null,
                    });
                } else if (mobileMediaType === 4) {
                    this.mobileMediasControl.push({
                        type: mobileMediaType + 1,
                        object: null,
                        url: null,
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
                    await Api().delete(this.mobileMediasControl[idMobileMedia].url, {
                        auth: {
                            username: "admin",
                            password: "admin",
                        },
                    });
                }
                if (idMobileMedia == 0) {
                    this.mobileMediasControl.shift();
                } else {
                    this.mobileMediasControl.splice(idMobileMedia, 1);
                }
            },
            atualizaMeta() {
                if (this.mobileMediasControl.length > 0) {
                    this.mobileMediasControl.forEach((mobilemedia) => {
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
            atualizaObj(file, indexMobile) {
                this.mobileMediasControl[indexMobile].object = file;
            },
    },
};

</script>
