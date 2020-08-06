<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:#63B0B0; color:white;">
        <span class="headline">
          <p>Edite o domínio selecionado.</p>
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation="lazy-validation">
          <v-text-field
            v-model="domainName"
            :counter="100"
            :rules="domainNameRules"
            label="Dominío modelado"
            required="required"
          ></v-text-field>

          <v-text-field
            v-model="domainContentTitle"
            label="Subtítulo para o conteúdo modelado"
            ref="refSubtitleDominio"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" height="49" dark="dark" large="large" @click="reset">
          Cancelar
          <v-icon dark="dark" right="right">mdi-close</v-icon>
        </v-btn>
        <v-btn
          color="success"
          height="49"
          dark="dark"
          large="large"
          @click="validate"
          :disabled="!valid"
        >
          Salvar
          <v-icon dark="dark" right="right">mdi-content-save</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
  import Api from "@/services/Api";
  export default {
    name: "domainDialog",
    props: ["domain", "dialog"],
    data: () => ({
      domainName: "",
      domainContentTitle: "",
      lastversion: "",
      valid: true,
      dialog_dominio: false,
      /*REGRAS PARA VALIDAÇÃO DO FORMULÁRIO DOMÍNIO*/
      domainNameRules: [
        (v) => !!v || "É necessário descrever o nome do domínio modelado",
        (v) =>
          (v && v.length <= 100) ||
          "Nome do domínio deve ter no máximo 100 caracteres",
      ],
      domains: "",
    }),
    mounted() {
      var vm = this;
      vm.domainName = vm.domain.nameknowledgedomain;
      vm.domainContentTitle = vm.domain.subtitle;
    },
    watch: {
      dialog: function() {
        var vm = this;
        this.$nextTick(function() {
          vm.domainName = vm.domain.nameknowledgedomain;
          vm.domainContentTitle = vm.domain.subtitle;
        });
      },
    },
    methods: {
      putDominio() {
        var vm = this;
        Api()
          .put("/knowledgedomain/" + this.domain.idknowledgedomain + "/", {
            nameknowledgedomain: this.domainName,
            subtitle: this.domainContentTitle,
            lastversion: this.lastversion,
            fk_iduser: this.domain.fk_iduser,
          })
          .then(function(resposta) {
            vm.$emit("dominio_data", resposta.data);
          });
      },
      validate() {
        if (this.$refs.form.validate()) {
          this.$refs.form.validate();
          this.putDominio();
          this.$emit("close_or_save", "save");
        }
      },
      reset() {
        this.$emit("close_or_save", "close");
        this.$refs.form.reset();
      },
      resetValidation() {
        this.$refs.form.resetValidation();
      },
    },
  };
</script>
