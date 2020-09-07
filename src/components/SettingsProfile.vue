<template>
  <v-row>
    <v-col style="max-width: 277px;" class="ml-4">
      <v-app-bar color="#B19114" dense dark style="height:65px; ">
        <v-toolbar-title style="font-size:1.2em; color:white;" class="mt-4">Configurações Pessoais</v-toolbar-title>
      </v-app-bar>
      <v-navigation-drawer permanent>
        <v-list-item style="height: 70px;">
          <v-list-item-content>
            <v-row>
              <v-col cols="3">
                <v-list-item-avatar>
                  <img v-bind:src="viewImageSrc" />
                </v-list-item-avatar>
              </v-col>
              <v-col cols="8" class="d-flex align-center">
                <v-list-item-title style="font-size: 0.9em;">
                  <strong>{{$store.state.username}}</strong>
                </v-list-item-title>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense nav>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            :style="item.style"
            @click="routerLink(item.link)"
          >
            <v-list-item-content>
              <v-list-item-title style="font-size: 0.9em;">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-col>
    <v-col class="mr-4" style="margin-left: -10px;">
      <v-app-bar color="#B19114" dense dark style="height:65px;">
        <v-toolbar-title style="font-size:1.4em; color:white;" class="mt-3">Perfil público</v-toolbar-title>
      </v-app-bar>
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="8">
              <v-form style="margin-bottom: -20px;">
                <v-text-field id="name" label="Nome" v-model="name" required></v-text-field>
                <v-text-field id="lastname" label="Sobrenome" v-model="lastname" required></v-text-field>
              </v-form>
            </v-col>
            <v-col cols="4">
              <label for="imagem">Foto de perfil</label>
              <v-card class="mx-auto" max-width="300">
                <v-img id="imagem" class="mt-3" v-bind:src="viewImageSrc">
                  <v-btn
                    v-if="profile_image[0]"
                    class="ml-2 mt-2"
                    color="red"
                    dark
                    @click="alertDelete = true"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-img>
                <v-card-actions>
                  <v-file-input
                    class="mt-3"
                    style="margin-bottom: -15px;"
                    label="EDITAR FOTO"
                    filled
                    v-model="imagemObject"
                    accept="image/*"
                    prepend-icon="mdi-camera"
                  ></v-file-input>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" height="49" dark large @click.prevent="submit()" class="mr-4 mb-2">
            Atualizar perfil
            <v-icon dark right>mdi-content-save</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <div class="text-center">
      <v-dialog v-model="dialogLoading" max-width="290" persistent="persistent">
        <v-card color="primary" dark>
          <v-card-text style="color:white;">
            <v-row class="pt-2 pb-3">
              <br />
              <v-spacer></v-spacer>
              <span style="font-size: 1.3em; color:white;">Salvando alterações...</span>
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
    <div class="text-center">
      <v-dialog v-model="alertDelete" width="500" persistent="persistent">
        <v-card>
          <v-card-title class="headline red" primary-title style="color:white;">ALERTA!</v-card-title>
          <v-card-text
            class="mt-3"
            style="font-size: 1.3em;"
          >Tem certeza que deseja apagar a sua atual foto de perfil?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="primary" @click="deleteProfileImage()">Sim</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              dark
              @click="
                alertDelete = false;
              "
            >Não</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-row>
</template>

<script>
import * as firebase from "firebase";
import Api from "@/services/Api";
export default {
  name: "SettingsProfile",
  data: () => ({
    search: "",
    valid: true,
    dialog: false,
    dialogLoading: false,
    lastversion: "versao_teste",
    alertDelete: false,
    id_user: "",
    url_user: "",
    name: "",
    lastname: "",
    profile_image: "",
    viewImageSrc: "",
    imagemObject: null,
    drawer: true,
    items: [
      {
        title: "Perfil",
        icon: "mdi-view-dashboard",
        style: "background-color: #f6f6f6;",
        link: "/settings/profile/",
      },
      {
        title: "Conta",
        icon: "mdi-image",
        style: "background-color: white;",
        link: "/settings/account/",
      },
      {
        title: "Senha",
        icon: "mdi-help-box",
        style: "background-color: white;",
        link: "/settings/password/",
      },
    ],
    right: null,
    mini: false,
  }),
  mounted() {
    this.getUserParameters();
  },
  watch: {
    imagemObject: function () {
      var vm = this;
      if (this.imagemObject) {
        var img = new Image();
        img.src = URL.createObjectURL(this.imagemObject);
        img.onload = function () {
          vm.viewImageSrc = img.src;
        };
      } else {
        if (typeof this.profile_image !== "undefined") {
          firebase
            .storage()
            .ref(this.profile_image[0].path)
            .getDownloadURL()
            .then(function (url) {
              vm.viewImageSrc = url;
            });
        } else {
          this.viewImageSrc =
            "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";
        }
      }
    },
  },
  methods: {
    routerLink(link) {
      this.$router.push({ path: link });
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.$refs.form.validate();
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
    getSrcImage() {
      if (typeof this.profile_image[0] !== "undefined") {
        var vm = this;
        firebase
          .storage()
          .ref(this.profile_image[0].path)
          .getDownloadURL()
          .then(function (url) {
            vm.viewImageSrc = url;
          });
      } else {
        this.viewImageSrc =
          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";
      }
    },
    async postOrPutProfileImage() {
      var vm = this;
      var path =
        "users/" +
        this.id_user.toString() +
        "/" +
        "profile_image_user_" +
        this.id_user.toString();
      await firebase
        .storage()
        .ref()
        .child(path)
        .put(this.imagemObject)
        .then(function (url) {
          console.log("foi", url);
        });
      var mobilemedia = {
        label: path.split("/")[1],
        fk_idmediatype: "/mediatype/1/",
        path: path,
        resolution: null,
        namefile: "profile_image_user_" + this.id_user.toString(),
        fk_iduser: this.url_user,
        description: null,
        time: null,
        textfull: null,
        textshort: null,
        urllink: null,
      };
      if (typeof this.profile_image[0] !== "undefined") {
        await Api()
          .put(vm.profile_image[0].url, mobilemedia)
          .then(function (resposta) {
            firebase
              .storage()
              .ref(resposta.data.path)
              .getDownloadURL()
              .then(function (url) {
                vm.$store.dispatch("getProfileImage", url);
              });
          });
      } else {
        await Api()
          .post(`/mobilemedia/`, mobilemedia)
          .then(function (resposta) {
            firebase
              .storage()
              .ref(resposta.data.path)
              .getDownloadURL()
              .then(function (url) {
                vm.$store.dispatch("getProfileImage", url);
              });
          });
      }
    },
    async submit() {
      var vm = this;
      this.dialogLoading = true;
      if (this.imagemObject) {
        await this.postOrPutProfileImage();
      }
      await this.getUser().then(async (res) => {
        await Api()
          .put(res.data.url, {
            username: "0",
            first_name: this.name,
            last_name: this.lastname,
            password: "º",
          })
          .then(() => {
            vm.dialogLoading = false;
            vm.$router.push({
              path: "/home/",
            });
          });
      });
    },
    async getUser() {
      return await Api().post("userId/", {
        username: this.$store.state.username,
      });
    },
    async getUserParameters() {
      var vm = this;
      await this.getUser().then(
        async (res) =>
          await Api()
            .get(res.data.url)
            .then((response) => {
              vm.id_user = response.data.id;
              vm.url_user = response.data.url;
              vm.name = response.data.first_name;
              vm.lastname = response.data.last_name;
              vm.profile_image = response.data.profileimage;
              vm.getSrcImage();
            })
      );
    },
    async deleteProfileImage() {
      var vm = this;
      await Api()
        .delete(this.profile_image[0].url)
        .then(function () {
          vm.viewImageSrc =
            "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";
          vm.alertDelete = false;
        });
    },
  },
};
</script>

<style></style>
