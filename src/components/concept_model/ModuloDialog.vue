<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:#63B0B0; color:white;">
        <span class="headline">
          <p v-if="module">Edite o módulo selecionado.</p>
          <p v-else>Defina o módulo do domínio do conhecimento.</p>
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="moduloTitle"
            :counter="100"
            :rules="moduloTitleRules"
            label="Título do módulo"
            required
          ></v-text-field>

          <v-text-field
            v-model="moduloSubtitle"
            label="Subtítulo do módulo"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" height="49" dark large @click="reset">
          Cancelar
          <v-icon dark right>mdi-close</v-icon>
        </v-btn>
        <v-btn color="success" height="49" dark large @click="validate">
          Salvar
          <v-icon dark right>mdi-content-save</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
  import Api from "@/services/Api";
  export default {
    name: "ModuloDialog",
    props: ["domain", "module", "dialog"],
    data: () => ({
      valid: true,
      moduloTitle: "",
      moduloTitleRules: [
        (v) => !!v || "É necessário descrever o título do submódulo",
        (v) =>
          (v && v.length <= 100) ||
          "O título do módulo deve ter no máximo 100 caracteres",
      ],
      moduloSubtitle: "",
      select: null,
      newItems: [],
      checkbox: false,
      modulos: "",
    }),
    watch: {
      dialog: function() {
        this.getModulo();
      },
      module: function() {
        this.$refs.form.reset();
        this.getModulo();
      },
    },
    mounted: function() {
      this.getModulo();
      this.$refs.form.resetValidation();
    },
    methods: {
      getModulo() {
        var vm = this;
        this.$nextTick(function() {
          vm.moduloTitle = vm.module.namemodule;
          vm.moduloSubtitle = vm.module.subtitle;
        });
      },
      async postModulo() {
        // var vm = this;
        await Api()
          .post(
            `/module/`,
            {
              fkidmodule: null,
              namemodule: this.moduloTitle,
              subtitle: this.moduloSubtitle,
              idknowledgedomain: this.domain.url,
            },
            { auth: { username: "admin", password: "admin" } }
          )
          .then(function(/*resposta*/) {
            /*vm.moduloTitle = resposta.data.namemodule;
          vm.subTitle = resposta.data.subtitle;*/
          });
      },
      async putModulo() {
        var vm = this;
        await Api()
          .put(
            "/module/" + this.module.idmodule + "/",
            {
              fk_idmodule: null,
              namemodule: this.moduloTitle,
              subtitle: this.moduloSubtitle,
              idknowledgedomain: this.domain.url,
            },
            { auth: { username: "admin", password: "admin" } }
          )
          .then(function(resposta) {
            vm.moduloTitle = resposta.data.namemodule;
            vm.moduloSubtitle = resposta.data.subtitle;
          });
      },
      async validate() {
        if (this.$refs.form.validate()) {
          this.$refs.form.validate();
          if (this.module === "") {
            await this.postModulo();
          } else {
            await this.putModulo();
          }
          this.$emit("close_or_save", "save");
        }
        this.$refs.form.reset();
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
