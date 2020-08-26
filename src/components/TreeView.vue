<template >
  <v-container>
    <div class="ml-4">
      <v-app-bar color="#B19114" dense dark>
        <v-btn color="red" @click="teste()">teste</v-btn>
        <v-spacer />
        <v-toolbar-title v-if="auxAppbarElement === 0 && !mini">
          {{
          dominio.nameknowledgedomain
          }}
        </v-toolbar-title>
        <v-text-field
          background-color="#B19114"
          style="color:white;"
          v-if="auxAppbarElement === 1 && !mini"
          v-model="search"
          dark
          hide-details
          clearable
          clear-icon="mdi-close-circle-outline"
        ></v-text-field>
        <v-spacer></v-spacer>

        <v-btn
          icon
          v-if="auxAppbarIcon === 0 && !mini"
          @click="
            auxAppbarIcon = 1;
            auxAppbarElement = 1;
          "
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn
          icon
          v-if="auxAppbarIcon === 1 && !mini"
          @click="
            auxAppbarIcon = 0;
            auxAppbarElement = 0;
          "
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn icon @click.stop="$emit('expand')">
          <v-icon>{{mini ? "mdi-chevron-right" : "mdi-chevron-left" }}</v-icon>
        </v-btn>
      </v-app-bar>
    </div>
    <v-treeview
      v-if="!mini"
      :items="treeData"
      :search="search"
      style="color: white; font-size: 0.1px; background-color: #EFEEEC; overflow: hidden;"
      class="ml-4"
      :open="open"
      item-key="id"
    >
      <template v-slot:prepend="{ item }">
        <v-btn
          text
          @click="callScroll({ item })"
          @dblclick="callEdit({ item })"
          style=" overflow: hidden;"
        >
          <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
          <v-avatar v-else color="black" size="25" class="mr-2">
            <span class="white--text" style="font-size:0.7em; overflow: hidden;">
              {{
              item.avatar
              }}
            </span>
          </v-avatar>
          <span class="ml-1" style="text-transform: capitalize; overflow: hidden;">{{ item.name }}</span>
        </v-btn>
      </template>
    </v-treeview>
  </v-container>
</template>

<script>
import Api from "@/services/Api";

export default {
  name: "TreeView",
  props: ["dominio", "mini", ""],
  data: () => ({
    open: [],
    loading: false,
    search: null,
    stopDblclick: 0,
    auxAppbarElement: 0,
    auxAppbarIcon: 0,
    treeData: [],
    elementTypes: {
      dominio: "Domínio",
      modulo: "Módulo",
      subModulo: "SubMódulo",
      conceito: "Conceito",
    },
    fileTypesIcon: [
      "mdi-file-image",
      "mdi-file-video",
      "mdi-file-music",
      "mdi-file-document",
      "mdi-link-variant",
    ],
    instrucTypesIcon: [
      "mdi-clipboard-text",
      "mdi-clipboard-check",
      "mdi-account-switch",
      "mdi-lightbulb-outline",
    ],
    mobilemediaTypeLabel: ["Imagem", "Vídeo", "Áudio", "Texto", "Link"],
  }),
  methods: {
    callEdit(item) {
      var vm = this;
      this.stopDblclick = 1;
      if (item.item.id) {
        if (item.item.type === "SUBMODULO") {
          this.$emit("type", { type: "submodulo", url: item.item.id });
        } else {
          this.$emit("type", {
            type: item.item.id.split("/")[3],
            url: item.item.id,
          });
        }
      }
      setTimeout(function () {
        vm.stopDblclick = 0;
      }, 200);
    },
    callScroll(item) {
      var vm = this;
      setTimeout(function () {
        if (vm.stopDblclick === 0) {
          if (item.item.id) {
            if (item.item.id.split("/")[5] === "SUBMODULO") {
              vm.$emit("elementToScroll", {
                type: "submodulo",
                url: item.item.id,
              });
            } else {
              vm.$emit("elementToScroll", {
                type: item.item.id.split("/")[3],
                indexPanel: item.item.indexPanel,
                panelFather: item.item.panelFather,
                url: item.item.id,
              });
            }
          }
        }
      }, 100);
    },
    setDomainVariables() {
      this.treeData = [];

      this.treeData.push({
        id: this.dominio.url,
        name: this.dominio.nameknowledgedomain,
        type: "DOMÍNIO",
        avatar: "D",
        children: [],
      });
      this.open.push(this.dominio.url);
      if (this.dominio.mobilemedias.length) {
        this.dominio.mobilemedias.forEach((mobilemedia, imobilemedia) => {
          this.treeData[0].children.push({
            id: mobilemedia.url,
            name: this.mobilemediaTypeLabel[
              parseInt(mobilemedia.fk_idmediatype.split("/")[4] - 1)
            ],
            type: "MOBILEMEDIA",
            indexPanel: imobilemedia,
            panelFather: "domain",
            icon: this.fileTypesIcon[
              mobilemedia.fk_idmediatype.split("/")[4] - 1
            ],
          });
        });
      }
      if (this.dominio.instructionalelements.length) {
        this.dominio.instructionalelements.forEach(
          (instructionalelement, iinstructionalelement) => {
            this.treeData[0].children.push({
              id: instructionalelement.url,
              name: instructionalelement.label,
              type: "INSTRUCTIONAL ELEMENT",
              indexPanel: iinstructionalelement,
              panelFather: "domain",
              icon: this.instrucTypesIcon[
                instructionalelement.fk_instructionalelementtype.split("/")[4] -
                  1
              ],
            });
          }
        );
      }
      if (Array.isArray(this.dominio.modules) && this.dominio.modules.length) {
        this.dominio.modules.forEach((modulo, imodulo) => {
          if (modulo.fk_idmodule === null) {
            var indexsubmodulo = 0;
            this.treeData[0].children.push({
              id: modulo.url,
              name: modulo.namemodule,
              type: "MODULO",
              avatar: "M",
              indexPanel: imodulo,
              children: [],
            });
            this.open.push(modulo.url);
            if (modulo.mobilemedias.length) {
              modulo.mobilemedias.forEach((mobilemedia, imobilemedia) => {
                this.treeData[0].children[
                  this.treeData[0].children.length - 1
                ].children.push({
                  id: mobilemedia.url,
                  name: this.mobilemediaTypeLabel[
                    parseInt(mobilemedia.fk_idmediatype.split("/")[4] - 1)
                  ],
                  type: "MOBILEMEDIA",
                  indexPanel: imobilemedia,
                  panelFather: "module",
                  icon: this.fileTypesIcon[
                    mobilemedia.fk_idmediatype.split("/")[4] - 1
                  ],
                });
              });
            }

            if (modulo.instructionalelements.length) {
              modulo.instructionalelements.forEach(
                (instructionalelement, iinstructionalelement) => {
                  this.treeData[0].children[
                    this.treeData[0].children.length - 1
                  ].children.push({
                    id: instructionalelement.url,
                    name: instructionalelement.label,
                    type: "INSTRUCTIONAL ELEMENT",
                    indexPanel: iinstructionalelement,
                    panelFather: "module",
                    icon: this.instrucTypesIcon[
                      instructionalelement.fk_instructionalelementtype.split(
                        "/"
                      )[4] - 1
                    ],
                  });
                }
              );
            }

            if (modulo.submodules.length) {
              var indexconceito = 0;
              modulo.submodules.forEach((submodulo, isubmodulo) => {
                this.treeData[0].children[
                  this.treeData[0].children.length - 1
                ].children.push({
                  id: submodulo.url + "sub",
                  name: submodulo.namemodule,
                  type: "SUBMODULO",
                  avatar: "S",
                  indexPanel: isubmodulo,
                  children: [],
                });
                this.open.push(submodulo.url + "sub");
                if (submodulo.mobilemedias.length) {
                  submodulo.mobilemedias.forEach(
                    (mobilemedia, imobilemedia) => {
                      this.treeData[0].children[
                        this.treeData[0].children.length - 1
                      ].children[
                        this.treeData[0].children[
                          this.treeData[0].children.length - 1
                        ].children.length - 1
                      ].children.push({
                        id: mobilemedia.url,
                        name: this.mobilemediaTypeLabel[
                          parseInt(mobilemedia.fk_idmediatype.split("/")[4] - 1)
                        ],
                        type: "MOBILEMEDIA",
                        indexPanel: imobilemedia,
                        panelFather: "submodule",
                        icon: this.fileTypesIcon[
                          mobilemedia.fk_idmediatype.split("/")[4] - 1
                        ],
                      });
                    }
                  );
                }

                if (submodulo.instructionalelements.length) {
                  submodulo.instructionalelements.forEach(
                    (instructionalelement, iinstructionalelement) => {
                      this.treeData[0].children[
                        this.treeData[0].children.length - 1
                      ].children[
                        this.treeData[0].children[
                          this.treeData[0].children.length - 1
                        ].children.length - 1
                      ].children.push({
                        id: instructionalelement.url,
                        name: instructionalelement.label,
                        type: "INSTRUCTIONAL ELEMENT",
                        indexPanel: iinstructionalelement,
                        panelFather: "submodule",
                        icon: this.instrucTypesIcon[
                          instructionalelement.fk_instructionalelementtype.split(
                            "/"
                          )[4] - 1
                        ],
                      });
                    }
                  );
                }

                if (submodulo.concepts.length) {
                  submodulo.concepts.forEach((conceito, iconceito) => {
                    console.log("i sub", indexsubmodulo);
                    this.treeData[0].children[
                      this.treeData[0].children.length - 1
                    ].children[
                      this.treeData[0].children[
                        this.treeData[0].children.length - 1
                      ].children.length - 1
                    ].children.push({
                      id: conceito.url,
                      name: conceito.nameconcept,
                      type: "CONCEITO",
                      avatar: "C",
                      indexPanel: iconceito,
                      panelFather: "submodule",
                      children: [],
                    });
                    this.open.push(conceito.url);
                    if (conceito.informationitems.length) {
                      console.log("i cc", indexconceito);
                      conceito.informationitems.forEach((infoitem) => {
                        if (
                          infoitem.fk_informationitemtype !==
                          Api().defaults.baseURL + "informationitemtype/4/"
                        ) {
                          infoitem.mobilemedias.forEach(
                            (mobilemedia, imobilemedia) => {
                              this.treeData[0].children[
                                this.treeData[0].children.length - 1
                              ].children[
                                this.treeData[0].children[
                                  this.treeData[0].children.length - 1
                                ].children.length - 1
                              ].children[
                                this.treeData[0].children[
                                  this.treeData[0].children.length - 1
                                ].children[
                                  this.treeData[0].children[
                                    this.treeData[0].children.length - 1
                                  ].children.length - 1
                                ].children.length - 1
                              ].children.push({
                                id: mobilemedia.url,
                                name: this.mobilemediaTypeLabel[
                                  parseInt(
                                    mobilemedia.fk_idmediatype.split("/")[4] - 1
                                  )
                                ],
                                type: "MOBILEMEDIA",
                                indexPanel: imobilemedia,
                                panelFather: "conceptsubmodule",
                                icon: this.fileTypesIcon[
                                  mobilemedia.fk_idmediatype.split("/")[4] - 1
                                ],
                              });
                            }
                          );
                        }
                      });
                    }

                    if (conceito.informationitems.length) {
                      console.log("i cc", indexconceito);
                      conceito.informationitems.forEach(
                        (procedure, iprocedure) => {
                          if (
                            procedure.fk_informationitemtype ===
                            Api().defaults.baseURL + "informationitemtype/4/"
                          ) {
                            this.treeData[0].children[
                              this.treeData[0].children.length - 1
                            ].children[
                              this.treeData[0].children[
                                this.treeData[0].children.length - 1
                              ].children.length - 1
                            ].children[
                              this.treeData[0].children[
                                this.treeData[0].children.length - 1
                              ].children[
                                this.treeData[0].children[
                                  this.treeData[0].children.length - 1
                                ].children.length - 1
                              ].children.length - 1
                            ].children.push({
                              id: procedure.url,
                              name: procedure.nameinformationitem,
                              type: "PROCEDIMENTO",
                              indexPanel: iprocedure,
                              panelFather: "conceptsubmodule",
                              icon: "mdi-format-list-bulleted",
                            });
                          }
                        }
                      );
                    }

                    if (conceito.instructionalelements.length) {
                      console.log("i cc", indexconceito);
                      conceito.instructionalelements.forEach(
                        (instructionalelement, iinstructionalelement) => {
                          this.treeData[0].children[
                            this.treeData[0].children.length - 1
                          ].children[
                            this.treeData[0].children[
                              this.treeData[0].children.length - 1
                            ].children.length - 1
                          ].children[
                            this.treeData[0].children[
                              this.treeData[0].children.length - 1
                            ].children[
                              this.treeData[0].children[
                                this.treeData[0].children.length - 1
                              ].children.length - 1
                            ].children.length - 1
                          ].children.push({
                            id: instructionalelement.url,
                            name: instructionalelement.label,
                            type: "INSTRUCTIONAL ELEMENT",
                            indexPanel: iinstructionalelement,
                            panelFather: "conceptsubmodule",
                            icon: this.instrucTypesIcon[
                              instructionalelement.fk_instructionalelementtype.split(
                                "/"
                              )[4] - 1
                            ],
                          });
                        }
                      );
                    }
                  });
                }
              });
            }
            if (modulo.concepts.length) {
              if (indexsubmodulo > 0) {
                indexconceito = indexsubmodulo;
              } else {
                indexconceito = 0;
              }
              modulo.concepts.forEach((conceito, iconceito) => {
                this.treeData[0].children[
                  this.treeData[0].children.length - 1
                ].children.push({
                  id: conceito.url,
                  name: conceito.nameconcept,
                  type: "CONCEITO",
                  avatar: "C",
                  indexPanel: iconceito,
                  panelFather: "module",
                  children: [],
                });
                this.open.push(conceito.url);
                if (conceito.informationitems.length) {
                  conceito.informationitems.forEach((infoitem) => {
                    if (
                      infoitem.fk_informationitemtype !==
                      Api().defaults.baseURL + "informationitemtype/4/"
                    ) {
                      infoitem.mobilemedias.forEach(
                        (mobilemedia, imobilemedia) => {
                          this.treeData[0].children[
                            this.treeData[0].children.length - 1
                          ].children[
                            this.treeData[0].children[
                              this.treeData[0].children.length - 1
                            ].children.length - 1
                          ].children.push({
                            id: mobilemedia.url,
                            name: this.mobilemediaTypeLabel[
                              parseInt(
                                mobilemedia.fk_idmediatype.split("/")[4] - 1
                              )
                            ],
                            type: "MOBILEMEDIA",
                            indexPanel: imobilemedia,
                            panelFather: "conceptsubmodule",
                            icon: this.fileTypesIcon[
                              mobilemedia.fk_idmediatype.split("/")[4] - 1
                            ],
                          });
                        }
                      );
                    }
                  });
                }

                if (conceito.informationitems.length) {
                  conceito.informationitems.forEach((procedure, iprocedure) => {
                    if (
                      procedure.fk_informationitemtype ===
                      Api().defaults.baseURL + "informationitemtype/4/"
                    ) {
                      this.treeData[0].children[
                        this.treeData[0].children.length - 1
                      ].children[
                        this.treeData[0].children[
                          this.treeData[0].children.length - 1
                        ].children.length - 1
                      ].children.push({
                        id: procedure.url,
                        name: procedure.nameinformationitem,
                        type: "PROCEDIMENTO",
                        indexPanel: iprocedure,
                        panelFather: "conceptmodule",
                        icon: "mdi-format-list-bulleted",
                      });
                    }
                  });
                }

                if (conceito.instructionalelements.length) {
                  conceito.instructionalelements.forEach(
                    (instructionalelement, iinstructionalelement) => {
                      this.treeData[0].children[
                        this.treeData[0].children.length - 1
                      ].children[
                        this.treeData[0].children[
                          this.treeData[0].children.length - 1
                        ].children.length - 1
                      ].children.push({
                        id: instructionalelement.url,
                        name: instructionalelement.label,
                        type: "INSTRUCTIONAL ELEMENT",
                        indexPanel: iinstructionalelement,
                        panelFather: "conceptmodule",
                        icon: this.instrucTypesIcon[
                          instructionalelement.fk_instructionalelementtype.split(
                            "/"
                          )[4] - 1
                        ],
                      });
                    }
                  );
                }
              });
            }
          }
        });
      }
    },
    teste() {
      console.log("tred", this.treeData);
    },
  },
  watch: {
    dominio: function () {
      this.setDomainVariables();
    },
  },
};
</script>
