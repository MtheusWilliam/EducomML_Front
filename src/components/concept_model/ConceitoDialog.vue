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
                    <v-text-field v-model="conceptName" :counter="25" :rules="conceptNameRules" label="Nome do conceito" required class="mt-2 mb-4"></v-text-field>
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
                                    <v-select :class="alert" v-model="relationForControl[i].conceptSelect" :items="targetconcepts" :rules="[v => !!v || 'Conceito é requerido']" label="Conceito" style="margin:0px;" required></v-select>
                                </v-col>
                                <v-col>
                                    <v-text-field v-model="relationForControl[i].relacaoName" counter="15" label="Nome da Relação" style="margin:0px;"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-select :class="alert" v-model="relationForControl[i].relacaoType" :items="relacaoTypes" :rules="[v => !!v || 'O tipo do conceito é requerido']" label="Tipo da Relação" style="margin:0px;" required></v-select>
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
        alert: "",
        auxSelectTeste: "",
        auxConceito: "",
        relationForControl: [],
        valid: true,
        targetconcepts: [],
        conceptSelect: [""],
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
        module: function () {
            this.targetconcepts = [];
            if (this.module.concepts) {
                this.module.concepts.forEach(element => {
                    this.targetconcepts.push({
                        text: element.nameconcept,
                        value: element
                    });
                });
            }
            if (this.concept !== "") {

                this.concept.targetconcept.forEach(element => {


                    var conceptSelect = this.targetconcepts.find(function(conceito){
                        console.log(conceito);
                        return conceito.value.url === element.targetconcept
                    });

                    var type = "";

                    console.log("ll", this.concept.targetconcept);
                    console.log("carlll", this.concept.sourceconcept);
                    if(element.fk_referencetype.split("/")[4] == '1'){
                      type = "typeOf";
                    }else{
                      type = "partOf";
                    }

                    this.relationForControl.push({
                        conceptSelect: conceptSelect,
                        relacaoName: element.namereference,
                        relacaoType: type,
                        url: element.url
                    });
                });
            }
        }
    },
    methods: {
        async postConceito() {
            var vm = this;
            await axios
                .post(
                    `http://localhost:8000/concept/`, {
                        nameconcept: this.conceptName,
                        fk_idknowledgedomain: this.domain.url,
                        fk_idmodule: this.module.url
                    }, {
                        auth: {
                            username: "admin",
                            password: "admin"
                        }
                    }
                )
                .then(function (resposta) {
                    vm.auxConceito = resposta.data.url;
                    console.log(vm.auxConceito)
                });
        },
        async postRelacoes() {
            var i;
            for (i = 0; i < this.relationForControl.length; i++) {
                var auxReferencia = 0;
                if (this.relationForControl[i].relacaoType == "typeOf") {
                    auxReferencia = 1;
                } else if (this.relationForControl[i].relacaoType == "partOf") {
                    auxReferencia = 2;
                }
                console.log("relation",this.relationForControl[i]);
                console.log("relation",this.auxConceito);

                await axios.post(
                    `http://localhost:8000/reference/`, {
                        namereference: this.relationForControl[i].relacaoName,
                        sourceconcept: this.auxConceito,
                        targetconcept: this.relationForControl[i].conceptSelect.url,
                        fk_referencetype: `http://localhost:8000/referencetype/` + auxReferencia + "/"
                    }, {
                        auth: {
                            username: "admin",
                            password: "admin"
                        }
                    }
                );
            }
        },
        putConceito() {
            axios.put(
                "http://127.0.0.1:8000/concept/" + this.concept.idconcept + "/", {
                    nameconcept: this.conceptName,
                    fk_idknowledgedomain: this.domain.url,
                    fk_idmodule: this.module.url
                }, {
                    auth: {
                        username: "admin",
                        password: "admin"
                    }
                }
            );
        },
        putRelacoes() {
            var i;
            for (i = 0; i < this.relationForControl.length; i++) {
                var auxReferencia = 0;
                if (this.relationForControl[i].relacaoType == "typeOf") {
                    auxReferencia = 1;
                } else if (this.relationForControl[i].relacaoType == "partOf") {
                    auxReferencia = 2;
                }

                axios.put(
                        this.relationForControl[i].url, {
                        namereference: this.relationForControl[i].relacaoName,
                        sourceconcept: this.auxConceito,
                        targetconcept: this.relationForControl[i].conceptSelect.url,
                        fk_referencetype: `http://localhost:8000/referencetype/` + auxReferencia + "/"
                    }, {
                        auth: {
                            username: "admin",
                            password: "admin"
                        }
                    }
                );
            }
        },
        async validate() {
            if (this.$refs.form.validate()) {
                this.$refs.form.validate();
                if (this.concept === "") {
                    await this.postConceito();
                    await this.postRelacoes();
                }else{
                await this.putConceito();
                await this.putRelacoes();
                }
                this.$refs.form.reset();
                this.$emit("close_or_save", "save");
            }
        },
        reset() {
            this.$refs.form.reset();
            this.relationForControl = [];
            this.$emit("close_or_save", "close");
        },
        resetValidation() {
            this.$refs.form.resetValidation();
        },
        addRelacao() {
            this.relationForControl.push({
                conceptSelect: null,
                relacaoName: null,
                relacaoType: null,
                url: null
            });
        },
        deletaRelacao(idRelacao) {
            if (idRelacao == 0) {
                this.relationForControl.shift();
            } else {
                this.relationForControl.splice(idRelacao, 1);
            }
        }
    }
};
</script>
