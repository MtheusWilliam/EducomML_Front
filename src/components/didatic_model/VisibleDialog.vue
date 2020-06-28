<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:purple; color:white;">
        <span class="headline">
          <p>Insira as informações equivalentes ao modelo didático.</p>
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-treeview
            @update:active="test"
            v-model="selection"
            :selection-type="'independent'"
            :items="treeData"
            return-object
            selectable
          ></v-treeview>
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
  </v-container>
</template>

<script>
import axios from "axios";
import Cookie from "js-cookie";
export default {
  name: "VisibleDialog",
  props: ["dominio", "dialog"],
  data: () => ({
    valid: true,
    treeData: [],
    selection: [],
    newItems: [],
    checkbox: true
  }),
  watch: {
    dialog: function() {
      if (this.dominio) {
        this.setDomainVariables();
      }
    }
  },
  methods: {
    async validate() {
      console.log("selection", this.selection);
      console.log("treeData", this.treeData);
      this.putVisible();
    },
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
      if (this.dominio.mobilemedias.length) {
        this.dominio.mobilemedias.forEach(mobilemedia => {
          var object = {
            id: mobilemedia.url,
            name: "[MOBILEMEDIA] " + mobilemedia.label,
            visible: mobilemedia.visible
          };
          this.treeData.push(object);
          if (object.visible) {
            this.selection.push(object);
          }
          indexmodulo++;
        });
      }
      if (this.dominio.instructionalelements.length) {
        this.dominio.instructionalelements.forEach(instructionalelement => {
          if (
            instructionalelement.fk_instructionalelementtype.split("/")[4] !== 4
          ) {
            var object = {
              id: instructionalelement.url,
              name: "[INSTRUCTIONAL ELEMENT] " + instructionalelement.label,
              visible: instructionalelement.visible
            };
            this.treeData.push(object);
            if (object.visible) {
              this.selection.push(object);
            }
            indexmodulo++;
          }
        });
      }
      if (Array.isArray(this.dominio.modules) && this.dominio.modules.length) {
        this.dominio.modules.forEach(modulo => {
          if (modulo.fk_idmodule === null) {
            var indexsubmodulo = 0;
            var object = {
              id: modulo.url,
              name: "[MODULO] " + modulo.namemodule,
              visible: modulo.visible,
              children: []
            };
            this.treeData.push(object);
            if (object.visible) {
              this.selection.push(object);
            }
            if (modulo.mobilemedias.length) {
              modulo.mobilemedias.forEach(mobilemedia => {
                var object = {
                  id: mobilemedia.url,
                  name: "[MOBILEMEDIA] " + mobilemedia.label,
                  visible: mobilemedia.visible
                };
                this.treeData[indexmodulo].children.push(object);
                if (object.visible) {
                  this.selection.push(object);
                }
                indexsubmodulo++;
              });
            }

            if (modulo.instructionalelements.length) {
              modulo.instructionalelements.forEach(instructionalelement => {
                if (
                  instructionalelement.fk_instructionalelementtype.split(
                    "/"
                  )[4] !== 4
                ) {
                  var object = {
                    id: instructionalelement.url,
                    name:
                      "[INSTRUCTIONAL ELEMENT] " + instructionalelement.label,
                    visible: instructionalelement.visible
                  };
                  this.treeData[indexmodulo].children.push(object);
                  if (object.visible) {
                    this.selection.push(object);
                  }
                  indexsubmodulo++;
                }
              });
            }

            if (modulo.submodules.length) {
              var indexconceito = 0;
              modulo.submodules.forEach(submodulo => {
                var object = {
                  id: submodulo.url,
                  name: "[SUBMODULO] " + submodulo.namemodule,
                  visible: submodulo.visible,
                  children: []
                };
                this.treeData[indexmodulo].children.push(object);
                if (object.visible) {
                  this.selection.push(object);
                }

                if (submodulo.mobilemedias.length) {
                  submodulo.mobilemedias.forEach(mobilemedia => {
                    var object = {
                      id: mobilemedia.url,
                      name: "[MOBILEMEDIA] " + mobilemedia.label,
                      visible: mobilemedia.visible
                    };
                    this.treeData[indexmodulo].children[
                      indexsubmodulo
                    ].children.push(object);
                    if (object.visible) {
                      this.selection.push(object);
                    }
                    indexconceito++;
                  });
                }

                if (submodulo.instructionalelements.length) {
                  submodulo.instructionalelements.forEach(
                    instructionalelement => {
                      var object = {
                        id: instructionalelement.url,
                        name:
                          "[INSTRUCTIONAL ELEMENT] " +
                          instructionalelement.label,
                        visible: instructionalelement.visible
                      };
                      this.treeData[indexmodulo].children[
                        indexsubmodulo
                      ].children.push(object);
                      if (object.visible) {
                        this.selection.push(object);
                      }
                      indexconceito++;
                    }
                  );
                }

                if (submodulo.concepts.length) {
                  submodulo.concepts.forEach(conceito => {
                    var object = {
                      id: conceito.url,
                      name: "[CONCEITO] " + conceito.nameconcept,
                      visible: conceito.visible,
                      children: []
                    };
                    this.treeData[indexmodulo].children[
                      indexsubmodulo
                    ].children.push(object);
                    if (object.visible) {
                      this.selection.push(object);
                    }

                    if (conceito.mobilemedias.length) {
                      conceito.mobilemedias.forEach(mobilemedia => {
                        var object = {
                          id: mobilemedia.url,
                          name: "[MOBILEMEDIA] " + mobilemedia.label,
                          visible: mobilemedia.visible
                        };
                        this.treeData[indexmodulo].children[
                          indexsubmodulo
                        ].children[indexconceito].children.push(object);
                        if (object.visible) {
                          this.selection.push(object);
                        }
                      });
                    }

                    if (conceito.instructionalelements.length) {
                      conceito.instructionalelements.forEach(
                        instructionalelement => {
                          var object = {
                            id: instructionalelement.url,
                            name:
                              "[INSTRUCTIONAL ELEMENT] " +
                              instructionalelement.label,
                            visible: instructionalelement.visible
                          };
                          this.treeData[indexmodulo].children[
                            indexsubmodulo
                          ].children[indexconceito].children.push(object);
                          if (object.visible) {
                            this.selection.push(object);
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
                          var object = {
                            id: procedure.url,
                            name:
                              "[PROCEDIMENTO] " + procedure.nameinformationitem,
                            visible: procedure.visible
                          };
                          this.treeData[indexmodulo].children[
                            indexsubmodulo
                          ].children[indexconceito].children.push(object);
                          if (object.visible) {
                            this.selection.push(object);
                          }
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
                var object = {
                  id: conceito.url,
                  name: "[CONCEITO] " + conceito.nameconcept,
                  visible: conceito.visible,
                  children: []
                };
                this.treeData[indexmodulo].children.push(object);
                if (object.visible) {
                  this.selection.push(object);
                }

                if (conceito.mobilemedias.length) {
                  conceito.mobilemedias.forEach(mobilemedia => {
                    var object = {
                      id: mobilemedia.url,
                      name: "[MOBILEMEDIA] " + mobilemedia.label,
                      visible: mobilemedia.visible
                    };
                    this.treeData[indexmodulo].children[
                      indexconceito
                    ].children.push(object);
                    if (object.visible) {
                      this.selection.push(object);
                    }
                  });
                }

                if (conceito.instructionalelements.length) {
                  conceito.instructionalelements.forEach(
                    instructionalelement => {
                      var object = {
                        id: instructionalelement.url,
                        name:
                          "[INSTRUCTIONAL ELEMENT] " +
                          instructionalelement.label,
                        visible: instructionalelement.visible
                      };
                      this.treeData[indexmodulo].children[
                        indexconceito
                      ].children.push(object);
                      if (object.visible) {
                        this.selection.push(object);
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
                      var object = {
                        id: procedure.url,
                        name: "[PROCEDIMENTO] " + procedure.nameinformationitem,
                        visible: procedure.visible
                      };
                      this.treeData[indexmodulo].children[
                        indexconceito
                      ].children.push(object);
                      if (object.visible) {
                        this.selection.push(object);
                      }
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
    },
    putVisible() {
      console.log("oi");
      this.treeData.forEach(element => {
        if (
          !this.selection.find(findElement => findElement.id === element.id)
        ) {
          var csrftoken = Cookie.get("csrftoken");
          var headers = {
            "X-CSRFTOKEN": csrftoken
          };
          axios
            .patch(
              element.id,
              { headers: headers },
              {
                auth: {
                  username: "admin",
                  password: "admin"
                }
              }
            )
            .then(async function(resposta) {
              var aux = resposta.data;
              await Object.keys(aux).forEach(atributo => {
                if (Array.isArray(aux[atributo])) {
                  delete aux[atributo];
                } else if (atributo === "url") {
                  delete aux[atributo];
                } else if (atributo[0] + atributo[1] === "id") {
                  delete aux[atributo];
                } else if (atributo === "visible") {
                  aux.visible = false;
                }
              });
              await axios.put(element.id, aux, {
                auth: {
                  username: "admin",
                  password: "admin"
                }
              });
            });
        }
        if (Array.isArray(element.children) && element.children.length) {
          element.children.forEach(element2 => {
            if (
              !this.selection.find(
                findElement2 => findElement2.id === element2.id
              )
            ) {
              var csrftoken = Cookie.get("csrftoken");
              var headers = {
                "X-CSRFTOKEN": csrftoken
              };
              axios
                .patch(
                  element2.id,
                  { headers: headers },
                  {
                    auth: {
                      username: "admin",
                      password: "admin"
                    }
                  }
                )
                .then(async function(resposta) {
                  var aux = resposta.data;
                  await Object.keys(aux).forEach(atributo => {
                    if (Array.isArray(aux[atributo])) {
                      delete aux[atributo];
                    } else if (atributo === "url") {
                      delete aux[atributo];
                    } else if (atributo[0] + atributo[1] === "id") {
                      delete aux[atributo];
                    } else if (atributo === "visible") {
                      aux.visible = false;
                    }
                  });

                  await axios.put(element2.id, aux, {
                    auth: {
                      username: "admin",
                      password: "admin"
                    }
                  });
                });
            }

            if (Array.isArray(element2.children) && element2.children.length) {
              element2.children.forEach(element3 => {
                if (
                  !this.selection.find(
                    findElement3 => findElement3.id === element3.id
                  )
                ) {
                  var csrftoken = Cookie.get("csrftoken");
                  var headers = {
                    "X-CSRFTOKEN": csrftoken
                  };
                  axios
                    .patch(
                      element3.id,
                      { headers: headers },
                      {
                        auth: {
                          username: "admin",
                          password: "admin"
                        }
                      }
                    )
                    .then(async function(resposta) {
                      var aux = resposta.data;
                      await Object.keys(aux).forEach(atributo => {
                        if (Array.isArray(aux[atributo])) {
                          delete aux[atributo];
                        } else if (atributo === "url") {
                          delete aux[atributo];
                        } else if (atributo[0] + atributo[1] === "id") {
                          delete aux[atributo];
                        } else if (atributo === "visible") {
                          aux.visible = false;
                        }
                      });
                      await axios.put(element3.id, aux, {
                        auth: {
                          username: "admin",
                          password: "admin"
                        }
                      });
                    });
                }

                if (
                  Array.isArray(element3.children) &&
                  element3.children.length
                ) {
                  element3.children.forEach(element4 => {
                    if (
                      !this.selection.find(
                        findElement4 => findElement4.id === element4.id
                      )
                    ) {
                      var csrftoken = Cookie.get("csrftoken");
                      var headers = {
                        "X-CSRFTOKEN": csrftoken
                      };
                      axios
                        .patch(
                          element4.id,
                          { headers: headers },
                          {
                            auth: {
                              username: "admin",
                              password: "admin"
                            }
                          }
                        )
                        .then(async function(resposta) {
                          var aux = resposta.data;
                          await Object.keys(aux).forEach(atributo => {
                            if (Array.isArray(aux[atributo])) {
                              delete aux[atributo];
                            } else if (atributo === "url") {
                              delete aux[atributo];
                            } else if (atributo[0] + atributo[1] === "id") {
                              delete aux[atributo];
                            } else if (atributo === "visible") {
                              aux.visible = false;
                            }
                          });
                          await axios.put(
                            element4.id,
                            {
                              aux
                            },
                            {
                              auth: {
                                username: "admin",
                                password: "admin"
                              }
                            }
                          );
                        });
                    }
                  });
                }
              });
            }
          });
        }
      });
    },
    reset() {
      this.$emit("close_or_save", "close");
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>