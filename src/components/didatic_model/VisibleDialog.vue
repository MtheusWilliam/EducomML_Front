<template>
  <v-card>
    <v-card-title style="background-color:purple; color:white;">
      <span class="headline">
        <p>Defina as informações equivalentes ao modelo didático.</p>
      </span>
    </v-card-title>
    <v-row style="width : 100%">
      <v-col cols="4">
        <v-card-text>
          <v-row class="ml-2">
            <v-btn
              color="warning"
              height="40px"
              dark
              x-small
              small
              @click="deselectAll()"
            >Deselecionar tudo</v-btn>
            <v-btn
              class="ml-1"
              color="primary"
              height="40"
              dark
              small
              @click="selectAll()"
            >Selecionar tudo</v-btn>
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
      </v-col>
      <v-col cols="8">
        <v-row>
          <h3 class="mt-5">Parâmetros de avaliação</h3>
          <v-btn icon="icon" class="mb-1">
            <v-icon large class="mt-9 ml-2" color="primary" @click="addAssessment()">mdi-plus-box</v-icon>
          </v-btn>
        </v-row>
        <v-row v-for="(assessment, i) in assessmentControl" :key="i" style="margin-bottom: -20px;">
          <v-col cols="2">
            <v-select
              v-model="assessmentControl[i].scopo"
              :items="scopoTypes"
              :rules="[v => !!v || 'Conceito é requerido']"
              label="Scopo"
              style="margin:0px;"
              required
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="assessmentControl[i].fk_element"
              :items="elementData"
              :rules="[v => !!v || 'O tipo do conceito é requerido']"
              label="Elemento"
              style="margin:0px;"
              required
            ></v-select>
          </v-col>
          <v-col cols="3" v-if="assessmentControl[i].scopo===1">
            <v-select
              v-model="assessmentControl[i].typeThreshold"
              :items="typesThreshold"
              :rules="[v => !!v || 'O tipo do conceito é requerido']"
              label="Tipo de Threshold"
              style="margin:0px;"
              required
            ></v-select>
          </v-col>
          <v-col cols="2" v-if="assessmentControl[i].scopo">
            <v-select
              style="margin-top: -1px;"
              v-if="assessmentControl[i].scopo===1"
              v-model="assessmentControl[i].valueType"
              :items="valueTypes"
              :rules="[v => !!v || 'O tipo de dado é requerido']"
              label="Tipo de Dado"
              required
            ></v-select>
            <v-text-field
              style="margin-top: -1px; margin-bottom: -10px;"
              v-if="assessmentControl[i].scopo===2 || assessmentControl[i].valueType==='Single'"
              v-model="assessmentControl[i].single.threshold"
              label="Valor"
            ></v-text-field>
          </v-col>

          <v-col cols="2" class="mt-2">
            <v-btn icon="icon" class="mb-1" v-if="assessmentControl[i].valueType==='Range'">
              <v-icon large class="mb-1" color="primary" @click="addRange(i)">mdi-plus-box</v-icon>
            </v-btn>
            <v-btn icon="icon" class="mb-1">
              <v-icon large class="mb-1" color="red" @click="deletaAssessment(i)">mdi-minus-box</v-icon>
            </v-btn>
          </v-col>
          <v-row v-if="assessmentControl[i].valueType === 'Single'" style="margin-top: -40px;">
            <v-col cols="7"></v-col>
            <v-col cols="2" class="ml-10"></v-col>
          </v-row>
          <div v-else>
            <v-row
              v-for="(range, idRange) in assessment.ranges"
              :key="idRange"
              style="margin-top: -30px;"
            >
              <v-col cols="3"></v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="assessmentControl[i].ranges[idRange].namerange"
                  counter="15"
                  label="Nome do range"
                  style="margin:0px;"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="assessmentControl[i].ranges[idRange].initialvalue"
                  label="Valor inicial"
                  style="margin:0px;"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="assessmentControl[i].ranges[idRange].limitvalue"
                  label="Valor Limite"
                  style="margin:0px;"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="1">
                <v-btn icon="icon" class="mt-4">
                  <v-icon
                    large
                    class="mb-1"
                    color="red"
                    @click="deletaRange(i, idRange)"
                  >mdi-minus-box</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-row>
      </v-col>
    </v-row>
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
    elementData: [],
    selection: [],
    scopoTypes: [
      {
        text: "Avaliação",
        value: 1
      },
      {
        text: "Domínio",
        value: 2
      }
    ],
    typesThreshold: [
      {
        text: "Porcentagem",
        value: 1
      },
      {
        text: "Literal",
        value: 2
      }
    ],
    valueTypes: ["Single", "Range"],
    assessmentControl: [],
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
    },
    assessmentControl: function() {
      this.assessmentControl.forEach(assess => {
        if (assess.valueType === "Single") {
          assess.ranges = [];
        } else if (assess.valueType === "Range") {
          assess.single.threshold = "";
        }
      });
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
      this.elementData.push({
        text: "[DOMINIO] " + this.domain.nameknowledgedomain,
        value: this.domain.url
      });
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
            this.elementData.push({
              text: object.name,
              value: object.id
            });
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
                this.elementData.push({
                  text: object.name,
                  value: object.id
                });
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

                    this.elementData.push({
                      text: object.name,
                      value: object.id
                    });
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

                this.elementData.push({
                  text: object.name,
                  value: object.id
                });
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
    async postAssessment() {
      var vm = this;
      var header = await this.$store.dispatch("getHeader");
      await this.assessmentControl.forEach(async assessment => {
        var auxAssessment = {
          typethreshold:
            `http://127.0.0.1:8000/typethreshold/` +
            assessment.typeThreshold +
            `/`,
          scopo: `http://127.0.0.1:8000/scopo/` + assessment.scopo + `/`,
          fk_idknowledgedomain: null,
          fk_idmodule: null,
          fk_idconcept: null
        };
        if (assessment.scopo === 2) {
          auxAssessment.typethreshold = `http://127.0.0.1:8000/typethreshold/1/`;
        }
        if (assessment.fk_element.split("/")[3] === "knowledgedomain") {
          auxAssessment.fk_idknowledgedomain = assessment.fk_element;
        } else if (assessment.fk_element.split("/")[3] === "module") {
          auxAssessment.fk_idmodule = assessment.fk_element;
        } else if (assessment.fk_element.split("/")[3] === "concept") {
          auxAssessment.fk_idconcept = assessment.fk_element;
        }
        await this.axios
          .post(
            "http://127.0.0.1:8000/assessmentparameter/",
            auxAssessment,
            header
          )
          .then(async function(resposta) {
            if (resposta.data.scopo === `http://127.0.0.1:8000/scopo/1/`) {
              if (assessment.valueType === "Single") {
                await vm.axios.post(
                  "http://127.0.0.1:8000/single/",
                  {
                    fk_idassessmentparameter: resposta.data.url,
                    threshold: assessment.single.threshold
                  },
                  header
                );
              } else if (assessment.valueType === "Range") {
                assessment.ranges.forEach(async range => {
                  await vm.axios.post(
                    "http://127.0.0.1:8000/range/",
                    {
                      namerange: range.namerange,
                      fk_idassessmentparameter: resposta.data.url,
                      initialvalue: range.initialvalue,
                      limitvalue: range.limitvalue
                    },
                    header
                  );
                });
              }
            } else if (
              resposta.data.scopo === `http://127.0.0.1:8000/scopo/2/`
            ) {
              await vm.axios.post(
                "http://127.0.0.1:8000/single/",
                {
                  fk_idassessmentparameter: resposta.data.url,
                  threshold: assessment.single.threshold
                },
                header
              );
            }
          });
      });
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
    addRange(idAssessment) {
      this.assessmentControl[idAssessment].ranges.push({
        namerange: "",
        initialvalue: "",
        limitvalue: "",
        url: ""
      });
    },
    async deletaRange(idAssessment, idRange) {
      // if (this.assessmentControl[idAssessment].ranges[idRange].url !== null) {
      //   var header = await this.$store.dispatch("getHeader");
      //   this.axios.delete(
      //     this.assessmentControl[idAssessment].ranges[idRange].url,
      //     header
      //   );
      // }
      if (idRange == 0) {
        this.assessmentControl[idAssessment].ranges.shift();
      } else {
        this.assessmentControl[idAssessment].ranges.splice(idRange, 1);
      }
    },
    addAssessment() {
      this.assessmentControl.push({
        typeThreshold: "",
        scopo: "",
        fk_element: "",
        valueType: "",
        single: {
          threshold: "",
          url: ""
        },
        ranges: [],
        url: ""
      });
    },
    async deletaAssessment(idAssessment) {
      // if (this.assessmentControl[idAssessment].url !== null) {
      //   var header = await this.$store.dispatch("getHeader");
      //   this.axios.delete(this.assessmentControl[idAssessment].url, header);
      // }
      if (idAssessment == 0) {
        this.assessmentControl.shift();
      } else {
        this.assessmentControl.splice(idAssessment, 1);
      }
    },
    async validate() {
      await this.putVisible();
      await this.postAssessment();
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