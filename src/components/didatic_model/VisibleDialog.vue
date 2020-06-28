<template>
  <v-container class="pa-0">
    <v-card>
      <v-card-title style="background-color:purple; color:white;">
        <span class="headline">
          <p>Defina as informações equivalentes ao modelo didático.</p>
        </span>
      </v-card-title>
      <v-card-text>
        <v-row class="mt-2 ml-3">
          <v-btn
            color="warning"
            height="40px"
            dark
            x-small
            small
            @click="deselectAll()"
            class="mr-1"
          >Deselecionar tudo</v-btn>
          <v-btn color="primary" height="40" dark small @click="selectAll()">Selecionar tudo</v-btn>
        </v-row>

        <v-treeview
          @update:active="test"
          v-model="selection"
          :selection-type="'independent'"
          :items="treeData"
          return-object
          selectable
          selected-color="success"
        ></v-treeview>
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
  props: ["domain", "dialog"],
  data: () => ({
    valid: true,
    treeData: [],
    selection: [],
    newItems: [],
    checkbox: true
  }),
  watch: {
    domain: async function() {
      if (this.domain) {
        this.treeData = [];
        this.selection = [];
        await this.setDomainVariables();
      }
    }
  },
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
      if (this.domain.mobilemedias.length) {
        this.domain.mobilemedias.forEach(mobilemedia => {
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
      if (this.domain.instructionalelements.length) {
        this.domain.instructionalelements.forEach(instructionalelement => {
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
      if (Array.isArray(this.domain.modules) && this.domain.modules.length) {
        this.domain.modules.forEach(modulo => {
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
    async putVisible() {
      var vm = this;
      var csrftoken = Cookie.get("csrftoken");
      var headers = {
        "X-CSRFTOKEN": csrftoken
      };
      this.treeData.forEach(element => {
        if (
          element.visible === true &&
          !this.selection.find(findElement => findElement.id === element.id)
        ) {
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
        } else if (
          element.visible === false &&
          this.selection.find(findElement => findElement.id === element.id)
        ) {
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
                  aux.visible = true;
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
              element2.visible === true &&
              !this.selection.find(
                findElement2 => findElement2.id === element2.id
              )
            ) {
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
            } else if (
              element2.visible === false &&
              this.selection.find(
                findElement2 => findElement2.id === element2.id
              )
            ) {
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
                      aux.visible = true;
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
                  element3.visible === true &&
                  !this.selection.find(
                    findElement3 => findElement3.id === element3.id
                  )
                ) {
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
                } else if (
                  element3.visible === false &&
                  this.selection.find(
                    findElement3 => findElement3.id === element3.id
                  )
                ) {
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
                          aux.visible = true;
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
                      element4.visible === true &&
                      !this.selection.find(
                        findElement4 => findElement4.id === element4.id
                      )
                    ) {
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
                    } else if (
                      element4.visible === false &&
                      this.selection.find(
                        findElement4 => findElement4.id === element4.id
                      )
                    ) {
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
                              aux.visible = true;
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
      await setTimeout(async function() {
        vm.$emit("close_or_save", "close");
      }, 300);
    },
    deselectAll() {
      this.selection = [];
    },
    selectAll() {
      var vm = this;
      this.selection = [];
      this.treeData.forEach(element => {
        vm.selection.push(element);
        if (element.children) {
          element.children.forEach(element2 => {
            vm.selection.push(element2);
            if (element2.children) {
              element2.children.forEach(element3 => {
                vm.selection.push(element3);
                if (element3.children) {
                  element3.children.forEach(element4 => {
                    vm.selection.push(element4);
                  });
                }
              });
            }
          });
        }
      });
    },
    async validate() {
      await this.putVisible();
    },
    reset() {
      this.$emit("close_or_save", "close");
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>