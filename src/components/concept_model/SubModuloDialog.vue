<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:#63B0B0; color:white;">
        <span class="headline">
          <p v-if="submodule">Edite o submódulo selecionado.</p>
          <p v-else>Defina o submódulo do domínio do conhecimento.</p>
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation="lazy-validation">
          <v-text-field
            v-model="subModuloTitle"
            :rules="subModuloTitleRules"
            label="Título do submódulo"
            required="required"
          ></v-text-field>

          <v-text-field v-model="subModuloSubtitle" label="Subtítulo do submódulo"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" height="49" dark="dark" large="large" @click="reset">
          Cancelar
          <v-icon dark="dark" right="right">mdi-close</v-icon>
        </v-btn>
        <v-btn color="success" height="49" dark="dark" large="large" @click="validate">
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
  name: "SubModuloDialog",
  props: ["domain", "module", "submodule", "dialog"],
  data: () => ({
    valid: true,
    newModuloUrl: "",
    subModuloTitle: "",
    subModuloTitleRules: [
      (v) => !!v || "É necessário descrever o título do submódulo",
      (v) =>
        (v && v.length <= 40) ||
        "O título do módulo deve ter no máximo 40 caracteres",
    ],
    subModuloSubtitle: "",
    select: null,
    checkbox: false,
    modulos: "",
  }),
  watch: {
    dialog: function () {
      this.getSubModulo();
    },
    submodule: function () {
      this.getSubModulo();
    },
  },
  mounted: function () {
    this.getSubModulo();
    this.$refs.form.resetValidation();
  },
  methods: {
    getSubModulo() {
      var vm = this;
      this.$nextTick(function () {
        vm.subModuloTitle = vm.submodule.namemodule;
        vm.subModuloSubtitle = vm.submodule.subtitle;
      });
    },
    async postSubModulo() {
      await Api()
        .post(`/module/`, {
          fk_idmodule: this.module.url,
          namemodule: this.subModuloTitle,
          subtitle: this.subModuloSubtitle,
          idknowledgedomain: this.domain.url,
        })
        .then(function (resposta) {
          this.newModuloUrl = resposta.data;
        });
    },
    async putSubModulo() {
      await Api().put("/module/" + this.submodule.idmodule + "/", {
        fk_idmodule: this.module.url,
        namemodule: this.subModuloTitle,
        subtitle: this.subModuloSubtitle,
        idknowledgedomain: this.domain.url,
      });
    },
    async validate() {
      if (this.$refs.form.validate()) {
        this.$refs.form.validate();
        if (this.submodule === "") {
          await this.postSubModulo();
        } else {
          await this.putSubModulo();
        }
        await this.$emit("close_or_save", "save", this.newModuloUrl);
        await this.$refs.form.reset();
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
