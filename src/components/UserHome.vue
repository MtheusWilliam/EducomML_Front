<template>
  <v-row>
    <!-- MENU DO USUÁRIO -->
    <v-navigation-drawer
      class="ml-6 mt-3 mr-3"
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
      color="#B19114"
      dark
    >
      <ListDomain :domains="filteredDomains" @emitDomains="setSearch" />
    </v-navigation-drawer>
    <!-- FORM DO DOMÍNIO -->
    <v-col class="mr-6">
      <v-row>
        <v-app-bar color="#B19114" style="width:100%;">
          <v-toolbar-title style="font-size:1.4em; color:white;">Domínios</v-toolbar-title>
        </v-app-bar>
        <v-container>
          <v-row v-if="filteredDomains.length > 0" class="mb-6">
            <v-spacer></v-spacer>
            <v-col cols="4" v-for="(dominio, i) in filteredDomains" :key="i">
              <v-card>
                <v-img
                  class="white--text align-end"
                  height="200px"
                  :style="'background-color: ' + domainColors[i]"
                >
                  <v-card-title>{{ dominio.nameknowledgedomain }}</v-card-title>
                </v-img>

                <v-card-subtitle class="pb-0 mb-6" style="color:black;">{{ dominio.subtitle }}</v-card-subtitle>

                <v-card-actions>
                  <v-btn color="red" dark @click="getAlertDelete(dominio.url)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="putDominio(dominio.idknowledgedomain)">
                    Editar
                    <v-icon class="ml-2" small>mdi-pencil</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
          <v-row v-else>
            <v-spacer></v-spacer>
            <h3 class="pt-8 pb-12">Você não tem nenhum domínio atualmente...</h3>
            <v-spacer></v-spacer>
          </v-row>

          <v-row>
            <v-dialog v-model="dialog" persistent max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn
                  class="mx-auto"
                  width="50%"
                  x-large
                  color="primary"
                  dark
                  v-on="on"
                >Criar Novo Domínio</v-btn>
              </template>

              <v-card>
                <v-card-title style="background-color:#63B0B0; color:white;">
                  <span class="headline">
                    <p>Defina o domínio do conhecimento a ser modelado</p>
                  </span>
                </v-card-title>
                <v-card-text>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                      v-model="nameknowledgedomain"
                      :counter="100"
                      :rules="nameknowledgedomainRules"
                      label="Dominío modelado"
                      required
                    ></v-text-field>

                    <v-text-field v-model="subtitle" label="Subítulo para o conteúdo modelado"></v-text-field>
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
            </v-dialog>
          </v-row>
        </v-container>
      </v-row>
    </v-col>
    <div class="text-center">
      <v-dialog v-model="alertDelete" width="500" persistent="persistent">
        <v-card>
          <v-card-title class="headline red" primary-title style="color:white;">ALERTA!</v-card-title>
          <v-card-text
            class="mt-3"
            style="font-size: 1.3em;"
          >Tem certeza que deseja apagar esse domínio?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="primary" @click="deleteDominio(auxUrlDomain)">Sim</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              dark
              @click="
                auxUrlDomain = '';
                alertDelete = false;
              "
            >Não</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="text-center">
      <v-dialog v-model="dialogLoading" max-width="290" persistent="persistent">
        <v-card color="primary" dark>
          <v-card-text style="color:white;">
            <v-row class="pt-2 pb-3">
              <br />
              <v-spacer></v-spacer>
              <span style="font-size: 1.3em; color:white;">Carregando seus domínios</span>
              <v-spacer></v-spacer>
            </v-row>
            <v-row>
              <v-spacer></v-spacer>
              <v-progress-circular indeterminate color="white" class="mb-0"></v-progress-circular>
              <v-spacer></v-spacer>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </v-row>
</template>

<script>
import Api from "@/services/Api";
import ListDomain from "@/components/ListDomain";

export default {
  name: "UserHome",
  components: {
    ListDomain,
  },
  data: () => ({
    search: "",
    valid: true,
    dialog: false,
    dialogLoading: false,
    lastversion: "versao_teste",
    alertDelete: false,
    auxUrlDomain: "",
    idDomain: 0,
    domainColors: [],
    cardColorsPalette: [
      "#DEB887",
      "#D2B48C",
      "#BC8F8F",
      "#F4A460",
      "#DAA520",
      "#CD853F",
      "#D2691E",
      "#8B4513",
      "#A0522D",
      "#A52A2A",
      "#800000",
    ],
    userName: "",
    nameknowledgedomain: "",
    nameknowledgedomainRules: [
      (v) => !!v || "É necessário descrever o nome do domínio modelado",
      (v) =>
        (v && v.length <= 100) ||
        "Nome do domínio deve ter no máximo 100 caracteres",
    ],
    subtitle: "",
    dominios: [],
    drawer: true,
    items: [
      { title: "Home", icon: "mdi-home-city" },
      { title: "My Account", icon: "mdi-account" },
      { title: "Users", icon: "mdi-account-group-outline" },
    ],
    mini: false,
  }),
  mounted: function () {
    this.getDominios();
  },
  computed: {
    filteredDomains() {
      var temp = this.dominios.filter((domain) => {
        return (
          domain.nameknowledgedomain
            .toLowerCase()
            .indexOf(this.search.toLowerCase()) > -1
        );
      });
      return temp;
    },
  },
  methods: {
    async getDominios() {
      this.dialogLoading = true;
      var vm = this;

      var response = await Api().post("userId/", {
        username: this.$store.state.username,
      });

      await Api()
        .get(response.data.url)
        .then((response2) => {
          vm.dominios = response2.data.knowledgedomains;
          vm.userName = response2.data.username;
          vm.dialogLoading = false;
          vm.getDomainCardColors();
        });
    },
    putDominio(idDomain) {
      this.$store.dispatch("getActualKnowledge", idDomain);
      this.$router.push({
        name: "create",
        params: {
          idDomain: idDomain,
        },
      });
    },
    getAlertDelete(urlDomain) {
      this.auxUrlDomain = urlDomain;
      this.alertDelete = true;
    },
    async deleteDominio() {
      var vm = this;

      await Api()
        .delete(this.auxUrlDomain)
        .then(function () {
          vm.getDominios();
          vm.alertDelete = false;
          vm.auxUrlDomain = "";
        });
    },
    async postDominio() {
      var vm = this;

      await Api()
        .post("userId/", {
          username: this.$store.state.username,
        })
        .then(async (response) => {
          await Api()
            .post(`/knowledgedomain/`, {
              nameknowledgedomain: this.nameknowledgedomain,
              subtitle: this.subtitle,
              lastversion: this.lastversion,
              fk_iduser: response.data.url,
            })
            .then(function (resposta) {
              vm.idDomain = resposta.data.idknowledgedomain;
              vm.$store.dispatch(
                "getActualKnowledge",
                resposta.data.idknowledgedomain
              );
              vm.$router.push({
                name: "create",
                params: {
                  idDomain: resposta.data.idknowledgedomain,
                },
              });
            });
        });
    },
    getDomainCardColors() {
      if (this.dominios.length > 0) {
        for (var i = 0; i < this.dominios.length; i++) {
          var randomElement = this.cardColorsPalette[
            Math.floor(Math.random() * this.cardColorsPalette.length)
          ];
          this.domainColors.push(randomElement);
        }
      }
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.$refs.form.validate();
        this.postDominio();
      }
    },
    reset() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    setSearch(s) {
      this.search = s;
    },
  },
};
</script>

<style></style>
