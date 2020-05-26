<template>
    <v-container class="pa-0">
        <v-card>
            <v-card-title style="background-color:#63B0B0; color:white;">
                <span class="headline">
                    <p>Defina o domínio do conhecimento a ser modelado</p>
                </span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation="lazy-validation">
                    <v-text-field
                        v-model="domainName"
                        :counter="25"
                        :rules="domainNameRules"
                        label="Dominío modelado"
                        required="required"></v-text-field>

                    <v-text-field
                        v-model="domainContentTitle"
                        :rules="domainContentTitleRules"
                        label="Título para o conteúdo modelado"
                        required="required"
                        ref="refSubtitleDominio"></v-text-field>

                    <v-text-field
                        v-model="domainAuthorsName"
                        :rules="domainAuthorsNameRules"
                        label="Autor(es) da modelagem"
                        required="required"></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" height="49" dark="dark" large="large" @click="reset">
                    Close
                    <v-icon dark="dark" right="right">mdi-close</v-icon>
                </v-btn>
                <v-btn
                    color="success"
                    height="49"
                    dark="dark"
                    large="large"
                    @click="validate"
                    :disabled="!valid">
                    Save
                    <v-icon dark="dark" right="right">mdi-content-save</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
    import axios from "axios";
    export default {
        name: "domainDialog",
        props: ["domain"],
        data: () => ({
            domainName: "",
            domainContentTitle: "",
            domainAuthorsName: "",
            lastversion: "",
            valid: true,
            dialog_dominio: false,
            /*REGRAS PARA VALIDAÇÃO DO FORMULÁRIO DOMÍNIO*/
            domainNameRules: [
                v => !!v || "É necessário descrever o nome do domínio modelado",
                v => (v && v.length <= 25) || "Nome do domínio deve ter no máximo 25 caracteres"
            ],
            domainContentTitleRules: [
                v => !!v || "É necessário descrever o título para o conteúdo modelado",
                v => (v && v.length <= 40) || "O título do conteúdo modelado deve ter no máximo 40 caracteres"
            ],
            domainAuthorsNameRules: [
                v => !!v || "É necessário descrever o(s) autores da modelagem",
                v => (v && v.length <= 60) || "Os nomes dos autores devem ter no máximo 60 caracteres"
            ],
            domains: ""
        }),
        created() {
            this.domainName =  this.domain.nameknowledgedomain;
            this.domainContentTitle =  this.domain.subtitle;
            this.domainAuthorsName =  this.domain.author;
        },
        methods: {
            putDominio() {
                var vm = this;
                axios
                    .put(
                        "http://127.0.0.1:8000/knowledgedomain/" + this.domain.idknowledgedomain +
                                "/",
                        {
                            nameknowledgedomain: this.domainName,
                            subtitle: this.domainContentTitle,
                            lastversion: this.lastversion,
                            author: this.domainAuthorsName
                        },
                        {
                            auth: {
                                username: "admin",
                                password: "admin"
                            }
                        }
                    )
                    .then(function (resposta) {
                        vm.$emit("dominio_data", resposta.data);
                    });
            },
            validate() {
                if (this.$refs.form.validate()) {
                    this
                        .$refs
                        .form
                        .validate();
                    this.putDominio();
                    this.$emit("close_or_save", "save");
                }
            },
            reset() {
                this.$emit("close_or_save", "close");
                this
                    .$refs
                    .form
                    .reset();
            },
            resetValidation() {
                this
                    .$refs
                    .form
                    .resetValidation();
            }
        }
    };
</script>