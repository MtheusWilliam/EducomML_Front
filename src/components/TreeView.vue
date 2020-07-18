<template>
  <v-container>
    <div class="ml-4">
      <v-app-bar color="#B19114" dense dark>
        <v-spacer />
        <v-toolbar-title v-if="auxAppbarElement === 0">{{dominio.nameknowledgedomain}}</v-toolbar-title>
        <v-text-field
          background-color="#B19114"
          style="color:white;"
          v-if="auxAppbarElement === 1"
          v-model="search"
          dark
          hide-details
          clearable
          clear-icon="mdi-close-circle-outline"
        ></v-text-field>
        <v-spacer></v-spacer>

        <v-btn icon v-if="auxAppbarIcon === 0" @click="auxAppbarIcon = 1; auxAppbarElement = 1">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn icon v-if="auxAppbarIcon === 1" @click="auxAppbarIcon = 0; auxAppbarElement = 0">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
    </div>
    <v-treeview :items="treeData" :search="search">
      <template v-slot:prepend="{item}">
        <v-btn text @click="callScroll({item})" @dblclick="callEdit({item})">
          <v-icon v-if="item.icon">{{item.icon}}</v-icon>
          <span v-else>[{{item.type}}]</span>
          <span class="ml-1">{{item.nome}}</span>
        </v-btn>
      </template>
    </v-treeview>
  </v-container>
</template>

<script>
export default {
  name: "TreeView",
  props: ["dominio"],
  data: () => ({
    auxAppbarElement: 0,
    auxAppbarIcon: 0,
    search: null,
    treeData: [],
    elementTypes: {
      dominio: "Domínio",
      modulo: "Módulo",
      subModulo: "SubMódulo",
      conceito: "Conceito"
    },
    fileTypesIcon: [
      "mdi-file-image",
      "mdi-file-video",
      "mdi-file-music",
      "mdi-file-document",
      "mdi-link-variant"
    ],
    instrucTypesIcon: [
      "mdi-clipboard-text",
      "mdi-clipboard-check",
      "mdi-account-switch"
    ],
    mobilemediaTypeLabel: ["Imagem", "Vídeo", "Áudio", "Texto", "Link"]
  }),
  methods: {
    callEdit(item) {
      if (item.item.id) {
        if (item.item.id.split("/")[5] === "SUBMODULO") {
          this.$emit("type", { type: "submodulo", url: item.item.id });
        } else {
          this.$emit("type", {
            type: item.item.id.split("/")[3],
            url: item.item.id
          });
        }
      }
    },
    callScroll(item) {
      if (item.item.id) {
        if (item.item.id.split("/")[5] === "SUBMODULO") {
          this.$emit("elementToScroll", {
            type: "submodulo",
            url: item.item.id
          });
        } else {
          this.$emit("elementToScroll", {
            type: item.item.id.split("/")[3],
            url: item.item.id
          });
        }
      }
    },
    setDomainVariables() {
      this.treeData = [];
      var indexmodulo = 0;
      this.treeData.push({
        id: this.dominio.url,
        nome: this.dominio.nameknowledgedomain,
        type: "DOMÍNIO",
        children: []
      });
      if (this.dominio.mobilemedias.length) {
        this.dominio.mobilemedias.forEach(mobilemedia => {
          this.treeData[0].children.push({
            id: mobilemedia.url,
            nome: this.mobilemediaTypeLabel[
              parseInt(mobilemedia.fk_idmediatype.split("/")[4] - 1)
            ],
            type: "MOBILEMEDIA",
            icon: this.fileTypesIcon[
              mobilemedia.fk_idmediatype.split("/")[4] - 1
            ]
          });
          indexmodulo++;
        });
      }
      if (this.dominio.instructionalelements.length) {
        this.dominio.instructionalelements.forEach(instructionalelement => {
          if (
            instructionalelement.fk_instructionalelementtype.split("/")[4] !==
            "4"
          ) {
            this.treeData[0].children.push({
              id: instructionalelement.url,
              nome: instructionalelement.label,
              type: "INSTRUCTIONAL ELEMENT",
              icon: this.instrucTypesIcon[
                instructionalelement.fk_instructionalelementtype.split("/")[4] -
                  1
              ]
            });
            indexmodulo++;
          }
        });
      }
      if (Array.isArray(this.dominio.modules) && this.dominio.modules.length) {
        this.dominio.modules.forEach(modulo => {
          if (modulo.fk_idmodule === null) {
            var indexsubmodulo = 0;
            this.treeData[0].children.push({
              id: modulo.url,
              nome: modulo.namemodule,
              type: "MODULO",
              children: []
            });

            if (modulo.mobilemedias.length) {
              modulo.mobilemedias.forEach(mobilemedia => {
                this.treeData[0].children[indexmodulo].children.push({
                  id: mobilemedia.url,
                  nome: this.mobilemediaTypeLabel[
                    parseInt(mobilemedia.fk_idmediatype.split("/")[4] - 1)
                  ],
                  type: "MOBILEMEDIA",
                  icon: this.fileTypesIcon[
                    mobilemedia.fk_idmediatype.split("/")[4] - 1
                  ]
                });
                indexsubmodulo++;
              });
            }

            if (modulo.instructionalelements.length) {
              modulo.instructionalelements.forEach(instructionalelement => {
                if (
                  instructionalelement.fk_instructionalelementtype.split(
                    "/"
                  )[4] !== "4"
                ) {
                  this.treeData[0].children[indexmodulo].children.push({
                    id: instructionalelement.url,
                    nome: instructionalelement.label,
                    type: "INSTRUCTIONAL ELEMENT",
                    icon: this.instrucTypesIcon[
                      instructionalelement.fk_instructionalelementtype.split(
                        "/"
                      )[4] - 1
                    ]
                  });
                  indexsubmodulo++;
                }
              });
            }

            if (modulo.submodules.length) {
              var indexconceito = 0;
              modulo.submodules.forEach(submodulo => {
                this.treeData[0].children[indexmodulo].children.push({
                  id: submodulo.url + "sub",
                  nome: submodulo.namemodule,
                  type: "SUBMODULO",
                  children: []
                });

                if (submodulo.mobilemedias.length) {
                  submodulo.mobilemedias.forEach(mobilemedia => {
                    this.treeData[0].children[indexmodulo].children[
                      indexsubmodulo
                    ].children.push({
                      id: mobilemedia.url,
                      nome: this.mobilemediaTypeLabel[
                        parseInt(mobilemedia.fk_idmediatype.split("/")[4] - 1)
                      ],
                      type: "MOBILEMEDIA",
                      icon: this.fileTypesIcon[
                        mobilemedia.fk_idmediatype.split("/")[4] - 1
                      ]
                    });
                    indexconceito++;
                  });
                }

                if (submodulo.instructionalelements.length) {
                  submodulo.instructionalelements.forEach(
                    instructionalelement => {
                      if (
                        instructionalelement.fk_instructionalelementtype.split(
                          "/"
                        )[4] !== "4"
                      ) {
                        this.treeData[0].children[indexmodulo].children[
                          indexsubmodulo
                        ].children.push({
                          id: instructionalelement.url,
                          nome: instructionalelement.label,
                          type: "INSTRUCTIONAL ELEMENT",
                          icon: this.instrucTypesIcon[
                            instructionalelement.fk_instructionalelementtype.split(
                              "/"
                            )[4] - 1
                          ]
                        });

                        indexconceito++;
                      }
                    }
                  );
                }

                if (submodulo.concepts.length) {
                  submodulo.concepts.forEach(conceito => {
                    this.treeData[0].children[indexmodulo].children[
                      indexsubmodulo
                    ].children.push({
                      id: conceito.url,
                      nome: conceito.nameconcept,
                      type: "CONCEITO",
                      children: []
                    });

                    if (conceito.mobilemedias.length) {
                      conceito.mobilemedias.forEach(mobilemedia => {
                        this.treeData[0].children[indexmodulo].children[
                          indexsubmodulo
                        ].children[indexconceito].children.push({
                          id: mobilemedia.url,
                          nome: this.mobilemediaTypeLabel[
                            parseInt(
                              mobilemedia.fk_idmediatype.split("/")[4] - 1
                            )
                          ],
                          type: "MOBILEMEDIA",
                          icon: this.fileTypesIcon[
                            mobilemedia.fk_idmediatype.split("/")[4] - 1
                          ]
                        });
                      });
                    }

                    if (conceito.instructionalelements.length) {
                      conceito.instructionalelements.forEach(
                        instructionalelement => {
                          if (
                            instructionalelement.fk_instructionalelementtype.split(
                              "/"
                            )[4] !== "4"
                          ) {
                            this.treeData[0].children[indexmodulo].children[
                              indexsubmodulo
                            ].children[indexconceito].children.push({
                              id: instructionalelement.url,
                              nome: instructionalelement.label,
                              type: "INSTRUCTIONAL ELEMENT",
                              icon: this.instrucTypesIcon[
                                instructionalelement.fk_instructionalelementtype.split(
                                  "/"
                                )[4] - 1
                              ]
                            });
                          }
                        }
                      );
                    }

                    if (conceito.informationitems.length) {
                      conceito.informationitems.forEach(procedure => {
                        if (
                          procedure.fk_informationitemtype ===
                          "http://127.0.0.1:8000/informationitemtype/4/"
                        ) {
                          this.treeData[0].children[indexmodulo].children[
                            indexsubmodulo
                          ].children[indexconceito].children.push({
                            id: procedure.url,
                            nome: procedure.nomeinformationitem,
                            type: "PROCEDIMENTO"
                          });
                        }
                      });
                    }

                    indexconceito++;
                  });
                }
                indexsubmodulo++;
              });
            }
            if (modulo.concepts.length) {
              if (indexsubmodulo > 0) {
                indexconceito = indexsubmodulo;
              } else {
                indexconceito = 0;
              }
              modulo.concepts.forEach(conceito => {
                this.treeData[0].children[indexmodulo].children.push({
                  id: conceito.url,
                  nome: conceito.nameconcept,
                  type: "CONCEITO",
                  children: []
                });
                if (conceito.mobilemedias.length) {
                  conceito.mobilemedias.forEach(mobilemedia => {
                    this.treeData[0].children[indexmodulo].children[
                      indexconceito
                    ].children.push({
                      id: mobilemedia.url,
                      nome: this.mobilemediaTypeLabel[
                        parseInt(mobilemedia.fk_idmediatype.split("/")[4] - 1)
                      ],
                      type: "MOBILEMEDIA",
                      icon: this.fileTypesIcon[
                        mobilemedia.fk_idmediatype.split("/")[4] - 1
                      ]
                    });
                  });
                }

                if (conceito.instructionalelements.length) {
                  conceito.instructionalelements.forEach(
                    instructionalelement => {
                      if (
                        instructionalelement.fk_instructionalelementtype.split(
                          "/"
                        )[4] !== "4"
                      ) {
                        this.treeData[0].children[indexmodulo].children[
                          indexconceito
                        ].children.push({
                          id: instructionalelement.url,
                          nome: instructionalelement.label,
                          type: "INSTRUCTIONAL ELEMENT",
                          icon: this.instrucTypesIcon[
                            instructionalelement.fk_instructionalelementtype.split(
                              "/"
                            )[4] - 1
                          ]
                        });
                      }
                    }
                  );
                }

                if (conceito.informationitems.length) {
                  conceito.informationitems.forEach(procedure => {
                    if (
                      procedure.fk_informationitemtype ===
                      "http://127.0.0.1:8000/informationitemtype/4/"
                    ) {
                      this.treeData[0].children[indexmodulo].children[
                        indexconceito
                      ].children.push({
                        id: procedure.url,
                        nome: procedure.nomeinformationitem,
                        type: "PROCEDIMENTO"
                      });
                    }
                  });
                }
                indexconceito++;
              });
            }
            indexmodulo++;
          }
        });
      }
    }
  },
  watch: {
    dominio: function() {
      this.setDomainVariables();
    }
  }
};
</script>
