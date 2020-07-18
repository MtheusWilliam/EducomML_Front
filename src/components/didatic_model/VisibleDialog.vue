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
            open-all
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
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row
            v-for="(assessment, i) in assessmentControl"
            :key="i"
            style="margin-bottom: -20px;"
          >
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
            <v-col cols="3">
              <v-select
                v-model="assessmentControl[i].typeThreshold"
                :items="typesThreshold"
                :rules="[v => !!v || 'O tipo do conceito é requerido']"
                label="Tipo de Threshold"
                style="margin:0px;"
                required
              ></v-select>
            </v-col>
            <v-col cols="2">
              <v-select
                style="margin-top: -1px;"
                v-model="assessmentControl[i].valueType"
                :items="valueTypes"
                :rules="[v => !!v || 'O tipo de dado é requerido']"
                label="Tipo de Dado"
                required
              ></v-select>
              <v-text-field
                style="margin-top: -1px; margin-bottom: -10px;"
                v-if="assessmentControl[i].valueType==='Single'"
                v-model="assessmentControl[i].single.threshold"
                label="Valor"
                :suffix=" assessmentControl[i].typeThreshold===1 ? '%' : ''"
                required
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
                <v-col cols="4"></v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="assessmentControl[i].ranges[idRange].namerange"
                    counter="15"
                    label="Nome do range"
                    style="margin:0px;"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    v-model="assessmentControl[i].ranges[idRange].initialvalue"
                    label="Valor inicial"
                    style="margin:0px;"
                    type="number"
                    :suffix=" assessmentControl[i].typeThreshold===1 ? '%' : ''"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    v-model="assessmentControl[i].ranges[idRange].limitvalue"
                    label="Valor Limite"
                    style="margin:0px;"
                    type="number"
                    :suffix=" assessmentControl[i].typeThreshold===1 ? '%' : ''"
                    required
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
          <v-row>
            <h3 class="mt-5">Conhecimentos prioritários</h3>
            <v-btn icon="icon" class="mb-1">
              <v-icon
                large
                class="mt-9 ml-2"
                color="primary"
                @click="addPriorKnowledge()"
              >mdi-plus-box</v-icon>
            </v-btn>
          </v-row>
          <v-row
            v-for="(prior, idPrior) in priorControl"
            :key="idPrior"
            style="margin-bottom: -25px;"
          >
            <v-col cols="4">
              <v-select
                v-model="priorControl[idPrior].fk_idconcept"
                :items="conceptsPrior"
                :rules="[v => !!v || 'Necessário informar o conceito prioritário']"
                label="Conceito Prioritário"
                style="margin:0px;"
                required
              ></v-select>
            </v-col>
            <v-col cols="3">
              <v-text-field
                style="margin-top: -1px; margin-bottom: -10px;"
                :rules="[v => !!v || 'Necessário informar identificador da prioridade']"
                v-model="priorControl[idPrior].namepriorknowledge"
                label="Identificador da prioridade"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-select
                v-model="priorControl[idPrior].priorlevel"
                :items="priorLevels"
                :rules="[v => !!v || 'Necessário informar o nível de prioridade']"
                label="Nível de prioridade"
                style="margin:0px;"
                required
              ></v-select>
            </v-col>
            <v-col cols="1">
              <v-btn icon="icon" class="mt-4">
                <v-icon
                  large
                  class="mb-1"
                  color="red"
                  @click="deletaPriorKnowledge(idPrior)"
                >mdi-minus-box</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
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
    <div class="text-center">
      <v-dialog v-model="dialogError" width="500">
        <v-card>
          <v-card-title class="headline red" primary-title style="color:white;">ALERTA!</v-card-title>
          <v-card-text class="mt-3" style="font-size: 1.3em;">{{messageError}}</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialogError = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="text-center">
      <v-dialog v-model="dialogLoading" max-width="890" persistent="persistent">
        <v-card color="primary" dark>
          <v-card-text style="color:white;">
            <v-row class="pt-2 pb-3">
              <br />
              <v-spacer></v-spacer>
              <span style="font-size: 1.3em; color:white;">Carregando informações do modelo didático</span>
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
    dialogLoading: false,
    treeData: [],
    selection: [],
    elementData: [],
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
    conceptsPrior: [],
    priorControl: [],
    priorLevels: [
      {
        text: "Obrigatório",
        value: 1
      },
      {
        text: "Desejável",
        value: 2
      }
    ],
    dialogError: false,
    messageError: "",
    newItems: [],
    checkbox: true
  }),
  watch: {
    domain: async function() {
      this.assessmentControl = [];
      this.priorControl = [];
      if (this.domain) {
        this.treeData = [];
        this.selection = [];
        await this.getAssessments();
        await this.setDomainVariables();
      }
    },
    assessmentControl: function() {
      this.assessmentControl.forEach(assess => {
        if (assess.valueType === "Single") {
          assess.ranges.forEach(range => {
            if (range.url) {
              this.deletaSingle(range.url);
            }
          });
          assess.ranges = [];
        } else if (assess.valueType === "Range") {
          if (assess.single.url) {
            this.deletaSingle(assess.single.url);
            assess.single.url = "";
          }
          assess.single.threshold = "";
        }
      });
    }
  },
  mounted: async function() {
    this.assessmentControl = [];
    this.priorControl = [];
    if (this.domain) {
      this.treeData = [];
      this.selection = [];
      await this.getAssessments();
      await this.setDomainVariables();
    }
  },
  methods: {
    getAssessments() {
      // var vm = this;
      if (this.domain) {
        if (this.domain.assessmentparameter.length > 0) {
          var assess = {
            typeThreshold: parseInt(
              this.domain.assessmentparameter[0].typethreshold.split("/")[4]
            ),
            scopo: parseInt(
              this.domain.assessmentparameter[0].scopo.split("/")[4]
            ),
            fk_element: this.domain.assessmentparameter[0].fk_idknowledgedomain,
            valueType: "",
            single: {
              threshold: "",
              url: ""
            },
            ranges: [],
            url: this.domain.assessmentparameter[0].url
          };
          if (this.domain.assessmentparameter[0].single.length > 0) {
            assess.valueType = "Single";
            assess.single.threshold = this.domain.assessmentparameter[0].single[0].threshold;
            assess.single.url = this.domain.assessmentparameter[0].single[0].url;
          } else if (this.domain.assessmentparameter[0].ranges.length > 0) {
            assess.valueType = "Range";
            this.domain.assessmentparameter[0].ranges.forEach(range => {
              assess.ranges.push({
                namerange: range.namerange,
                initialvalue: range.initialvalue,
                limitvalue: range.limitvalue,
                url: range.url
              });
            });
          }
          this.assessmentControl.push(assess);
        }
        if (this.domain.modules) {
          this.domain.modules.forEach(module => {
            if (module.assessmentparameter.length > 0) {
              var assess = {
                typeThreshold: parseInt(
                  module.assessmentparameter[0].typethreshold.split("/")[4]
                ),
                scopo: parseInt(
                  module.assessmentparameter[0].scopo.split("/")[4]
                ),
                fk_element: module.url,
                valueType: "",
                single: {
                  threshold: "",
                  url: ""
                },
                ranges: [],
                url: module.assessmentparameter[0].url
              };
              if (module.assessmentparameter[0].single.length > 0) {
                assess.valueType = "Single";
                assess.single.threshold =
                  module.assessmentparameter[0].single[0].threshold;
                assess.single.url = module.assessmentparameter[0].single[0].url;
              } else if (module.assessmentparameter[0].ranges.length > 0) {
                assess.valueType = "Range";
                module.assessmentparameter[0].ranges.forEach(range => {
                  assess.ranges.push({
                    namerange: range.namerange,
                    initialvalue: range.initialvalue,
                    limitvalue: range.limitvalue,
                    url: range.url
                  });
                });
              }
              this.assessmentControl.push(assess);
            }
            if (module.concepts) {
              module.concepts.forEach(moduleConcept => {
                if (moduleConcept.assessmentparameter.length > 0) {
                  var assess = {
                    typeThreshold: parseInt(
                      moduleConcept.assessmentparameter[0].typethreshold.split(
                        "/"
                      )[4]
                    ),
                    scopo: parseInt(
                      moduleConcept.assessmentparameter[0].scopo.split("/")[4]
                    ),
                    fk_element: moduleConcept.url,
                    valueType: "",
                    single: {
                      threshold: "",
                      url: ""
                    },
                    ranges: [],
                    url: moduleConcept.assessmentparameter[0].url
                  };
                  if (moduleConcept.assessmentparameter[0].single.length > 0) {
                    assess.valueType = "Single";
                    assess.single.threshold =
                      moduleConcept.assessmentparameter[0].single[0].threshold;
                    assess.single.url =
                      moduleConcept.assessmentparameter[0].single[0].url;
                  } else if (
                    moduleConcept.assessmentparameter[0].ranges.length > 0
                  ) {
                    assess.valueType = "Range";
                    moduleConcept.assessmentparameter[0].ranges.forEach(
                      range => {
                        assess.ranges.push({
                          namerange: range.namerange,
                          initialvalue: range.initialvalue,
                          limitvalue: range.limitvalue,
                          url: range.url
                        });
                      }
                    );
                  }
                  this.assessmentControl.push(assess);
                }
                if (moduleConcept.priorknowledge.length > 0) {
                  this.priorControl.push({
                    namepriorknowledge:
                      moduleConcept.priorknowledge[0].namepriorknowledge,
                    priorlevel: parseInt(
                      moduleConcept.priorknowledge[0].priorlevel.split("/")[4]
                    ),
                    fk_idconcept: moduleConcept.priorknowledge[0].fk_idconcept,
                    url: moduleConcept.priorknowledge[0].url
                  });
                }
              });
            }
            if (module.submodules) {
              module.submodules.forEach(submodule => {
                if (submodule.assessmentparameter.length > 0) {
                  var assess = {
                    typeThreshold: parseInt(
                      submodule.assessmentparameter[0].typethreshold.split(
                        "/"
                      )[4]
                    ),
                    scopo: parseInt(
                      submodule.assessmentparameter[0].scopo.split("/")[4]
                    ),
                    fk_element: submodule.url,
                    valueType: "",
                    single: {
                      threshold: "",
                      url: ""
                    },
                    ranges: [],
                    url: submodule.assessmentparameter[0].url
                  };
                  if (submodule.assessmentparameter[0].single.length > 0) {
                    assess.valueType = "Single";
                    assess.single.threshold =
                      submodule.assessmentparameter[0].single[0].threshold;
                    assess.single.url =
                      submodule.assessmentparameter[0].single[0].url;
                  } else if (
                    submodule.assessmentparameter[0].ranges.length > 0
                  ) {
                    assess.valueType = "Range";
                    submodule.assessmentparameter[0].ranges.forEach(range => {
                      assess.ranges.push({
                        namerange: range.namerange,
                        initialvalue: range.initialvalue,
                        limitvalue: range.limitvalue,
                        url: range.url
                      });
                    });
                  }
                  this.assessmentControl.push(assess);
                }
                if (submodule.concepts) {
                  submodule.concepts.forEach(submoduleConcept => {
                    if (submoduleConcept.assessmentparameter.length > 0) {
                      var assess = {
                        typeThreshold: parseInt(
                          submoduleConcept.assessmentparameter[0].typethreshold.split(
                            "/"
                          )[4]
                        ),
                        scopo: parseInt(
                          submoduleConcept.assessmentparameter[0].scopo.split(
                            "/"
                          )[4]
                        ),
                        fk_element: submoduleConcept.url,
                        valueType: "",
                        single: {
                          threshold: "",
                          url: ""
                        },
                        ranges: [],
                        url: submoduleConcept.assessmentparameter[0].url
                      };
                      if (
                        submoduleConcept.assessmentparameter[0].single.length >
                        0
                      ) {
                        assess.valueType = "Single";
                        assess.single.threshold =
                          submoduleConcept.assessmentparameter[0].single[0].threshold;
                        assess.single.url =
                          submoduleConcept.assessmentparameter[0].single[0].url;
                      } else if (
                        submoduleConcept.assessmentparameter[0].ranges.length >
                        0
                      ) {
                        assess.valueType = "Range";
                        submoduleConcept.assessmentparameter[0].ranges.forEach(
                          range => {
                            assess.ranges.push({
                              namerange: range.namerange,
                              initialvalue: range.initialvalue,
                              limitvalue: range.limitvalue,
                              url: range.url
                            });
                          }
                        );
                      }
                      this.assessmentControl.push(assess);
                    }
                    if (submoduleConcept.priorknowledge.length > 0) {
                      this.priorControl.push({
                        namepriorknowledge:
                          submoduleConcept.priorknowledge[0].namepriorknowledge,
                        priorlevel: parseInt(
                          submoduleConcept.priorknowledge[0].priorlevel.split(
                            "/"
                          )[4]
                        ),
                        fk_idconcept:
                          submoduleConcept.priorknowledge[0].fk_idconcept,
                        url: submoduleConcept.priorknowledge[0].url
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }
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
                    this.conceptsPrior.push({
                      text: object.name,
                      value: object.id
                    });

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
                this.conceptsPrior.push({
                  text: object.name,
                  value: object.id
                });
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
        if (assessment.fk_element.split("/")[3] === "knowledgedomain") {
          auxAssessment.fk_idknowledgedomain = assessment.fk_element;
        } else if (assessment.fk_element.split("/")[3] === "module") {
          auxAssessment.fk_idmodule = assessment.fk_element;
        } else if (assessment.fk_element.split("/")[3] === "concept") {
          auxAssessment.fk_idconcept = assessment.fk_element;
        }

        if (assessment.url) {
          await this.axios
            .put(assessment.url, auxAssessment, header)
            .then(async function(resposta) {
              if (assessment.valueType === "Single") {
                if (assessment.ranges) {
                  assessment.ranges.forEach(range => {
                    if (range.url) {
                      vm.axios.delete(range.url, header);
                    }
                  });
                }
                await vm.axios.put(
                  assessment.single.url,
                  {
                    fk_idassessmentparameter: resposta.data.url,
                    threshold: assessment.single.threshold
                  },
                  header
                );
              } else if (assessment.valueType === "Range") {
                if (assessment.single.url) {
                  vm.axios.delete(assessment.single.url, header);
                }
                assessment.ranges.forEach(async range => {
                  if (range.url) {
                    await vm.axios.put(
                      range.url,
                      {
                        namerange: range.namerange,
                        fk_idassessmentparameter: resposta.data.url,
                        initialvalue: range.initialvalue,
                        limitvalue: range.limitvalue
                      },
                      header
                    );
                  } else {
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
                  }
                });
              }
            });
        } else {
          await this.axios
            .post(
              "http://127.0.0.1:8000/assessmentparameter/",
              auxAssessment,
              header
            )
            .then(async function(resposta) {
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
            });
        }
      });
    },
    async postPriorKnowledges() {
      var vm = this;
      var header = await this.$store.dispatch("getHeader");
      await this.priorControl.forEach(async prior => {
        if (prior.url) {
          await vm.axios.put(
            prior.url,
            {
              namepriorknowledge: prior.namepriorknowledge,
              priorlevel:
                `http://127.0.0.1:8000/priorlevel/` + prior.priorlevel + `/`,
              fk_idconcept: prior.fk_idconcept
            },
            header
          );
        } else {
          await vm.axios.post(
            `http://127.0.0.1:8000/priorknowledge/`,
            {
              namepriorknowledge: prior.namepriorknowledge,
              priorlevel:
                `http://127.0.0.1:8000/priorlevel/` + prior.priorlevel + `/`,
              fk_idconcept: prior.fk_idconcept
            },
            header
          );
        }
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
      if (this.assessmentControl[idAssessment].ranges[idRange].url) {
        var header = await this.$store.dispatch("getHeader");
        this.axios.delete(
          this.assessmentControl[idAssessment].ranges[idRange].url,
          header
        );
      }
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
      if (this.assessmentControl[idAssessment].url !== null) {
        var header = await this.$store.dispatch("getHeader");
        await this.axios.delete(
          this.assessmentControl[idAssessment].url,
          header
        );
      }
      if (idAssessment == 0) {
        this.assessmentControl.shift();
      } else {
        this.assessmentControl.splice(idAssessment, 1);
      }
    },
    async deletaSingle(urlSingle) {
      var header = await this.$store.dispatch("getHeader");
      await this.axios.delete(urlSingle, header);
    },
    addPriorKnowledge() {
      this.priorControl.push({
        namepriorknowledge: "",
        priorlevel: "",
        fk_idconcept: "",
        url: ""
      });
    },
    async deletaPriorKnowledge(idPrior) {
      if (this.priorControl[idPrior].url) {
        var header = await this.$store.dispatch("getHeader");
        await this.axios.delete(this.priorControl[idPrior].url, header);
      }
      if (idPrior == 0) {
        this.priorControl.shift();
      } else {
        this.priorControl.splice(idPrior, 1);
      }
    },
    async validate() {
      if (this.$refs.form.validate()) {
        var auxLoopValidation = 1;
        for (var i = 0; i < this.assessmentControl.length; i++) {
          for (var j = 0; j < this.assessmentControl.length; j++) {
            if (
              this.assessmentControl[i].fk_element ===
                this.assessmentControl[j].fk_element &&
              i !== j
            ) {
              auxLoopValidation = 0;
              this.messageError =
                "Não pode existir mais de um parâmetro de avaliação para o mesmo elemento. Verifique os parâmetros de avaliação " +
                (j + 1) +
                " e " +
                (i + 1) +
                ".";
              this.dialogError = true;
              break;
            }
          }
        }
        if (auxLoopValidation === 1) {
          for (var m = 0; m < this.priorControl.length; m++) {
            for (var n = 0; n < this.priorControl.length; n++) {
              if (
                this.priorControl[m].fk_idconcept ===
                  this.priorControl[n].fk_idconcept &&
                m !== n
              ) {
                auxLoopValidation = 0;
                this.messageError =
                  "Não é possível definir um conhecimento prioritário mais de uma vez. Verifique os conhecimentos prioritários " +
                  (n + 1) +
                  " e " +
                  (m + 1) +
                  ".";
                this.dialogError = true;
                break;
              }
            }
          }
        }
        if (auxLoopValidation === 1) {
          await this.postAssessment();
          await this.postPriorKnowledges();
          await this.putVisible();
          await this.resetVariables();
        }
      }
    },
    reset() {
      this.$emit("close_or_save", "close");
      this.assessmentControl = [];
      this.priorControl = [];
    },
    resetVariables() {
      this.assessmentControl = [];
      this.priorControl = [];
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>