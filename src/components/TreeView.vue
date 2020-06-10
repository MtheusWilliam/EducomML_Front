<template>
  <v-container>
    <div class="ml-4">
      <v-app-bar color="#63B0B0" dense dark>
        <v-spacer />
        <v-toolbar-title>Modelo Conceitual</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-app-bar>
    </div>
    <v-treeview open-all @update:active="test" :items="treeData" activatable></v-treeview>
  </v-container>
</template>

<script>
export default {
  name: "TreeView",
  props: ["dominio"],
  data: () => ({
    treeData: [],
    elementTypes: {
      dominio: "Domínio",
      modulo: "Módulo",
      subModulo: "SubMódulo",
      conceito: "Conceito"
    }
  }),
  methods: {
    test(value) {
      if (value.length) {
        if (value[0].split("/")[5] === "sub") {
          this.$emit("type", { type: "submodulo", url: value[0] });
        } else {
          this.$emit("type", { type: value[0].split("/")[3], url: value[0] });
        }
      }
    },
    setDomainVariables() {
      this.treeData = [];
      var indexmodulo = 0;
      this.treeData.push({
        id: this.dominio.url,
        name: "[DOMINIO] " + this.dominio.nameknowledgedomain,
        children: []
      });
      if (this.dominio.mobilemedias.length) {
        this.dominio.mobilemedias.forEach(mobilemedia => {
          this.treeData[0].children.push({
            id: mobilemedia.url,
            name: "[MOBILEMEDIA] " + mobilemedia.label
          });
        });
      }

      if (Array.isArray(this.dominio.modules) && this.dominio.modules.length) {
        this.dominio.modules.forEach(modulo => {
          if (modulo.fk_idmodule === null) {
            this.treeData[0].children.push({
              id: modulo.url,
              name: "[MODULO] " + modulo.namemodule,
              children: []
            });

            if (modulo.mobilemedias.length) {
              modulo.mobilemedias.forEach(mobilemedia => {
                this.treeData[0].children[indexmodulo].children.push({
                  id: mobilemedia.url,
                  name: "[MOBILEMEDIA] " + mobilemedia.label
                });
              });
            }

            if (modulo.submodules.length) {
              var indexsubmodulo = 0;
              modulo.submodules.forEach(submodulo => {
                this.treeData[0].children[indexmodulo].children.push({
                  id: submodulo.url + "sub",
                  name: "[SUBMODULO] " + submodulo.namemodule,
                  children: []
                });

                if (submodulo.mobilemedias.length) {
                  submodulo.mobilemedias.forEach(mobilemedia => {
                    this.treeData[0].children[indexmodulo].children[
                      indexsubmodulo
                    ].children.push({
                      id: mobilemedia.url,
                      name: "[MOBILEMEDIA] " + mobilemedia.label
                    });
                  });
                }

                if (submodulo.concepts.length) {
                  var indexconceito = 0;
                  submodulo.concepts.forEach(conceito => {
                    this.treeData[0].children[indexmodulo].children[
                      indexsubmodulo
                    ].children.push({
                      id: conceito.url,
                      name: "[CONCEITO] " + conceito.nameconcept,
                      children: []
                    });

                    if (conceito.mobilemedias.length) {
                      conceito.mobilemedias.forEach(mobilemedia => {
                        this.treeData[0].children[indexmodulo].children[
                          indexsubmodulo
                        ].children[indexconceito].children.push({
                          id: mobilemedia.url,
                          name: "[MOBILEMEDIA] " + mobilemedia.label
                        });
                      });
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
                            name:
                              "[PROCEDIMENTO] " + procedure.nameinformationitem
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
              var indexconceito = 0;
              modulo.concepts.forEach(conceito => {
                this.treeData[0].children[indexmodulo].children.push({
                  id: conceito.url,
                  name: "[CONCEITO] " + conceito.nameconcept,
                  children: []
                });

                if (conceito.mobilemedias.length) {
                  conceito.mobilemedias.forEach(mobilemedia => {
                    this.treeData[0].children[indexmodulo].children[
                      indexconceito
                    ].children.push({
                      id: mobilemedia.url,
                      name: "[MOBILEMEDIA] " + mobilemedia.label
                    });
                  });
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
                        name: "[PROCEDIMENTO] " + procedure.nameinformationitem
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
