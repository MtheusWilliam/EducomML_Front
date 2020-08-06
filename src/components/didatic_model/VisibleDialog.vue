<template>
  <v-card>
    <v-card-title style="background-color:purple; color:white;">
      <span class="headline">
        <p>Defina as informações equivalentes ao modelo didático.</p>
      </span>
    </v-card-title>
    <v-row style="width : 100%">
      <v-col cols="12">
        <v-card-text>
          <v-row class="ml-2">
            <v-btn
              color="warning"
              height="40px"
              dark
              x-small
              small
              @click="deselectAll()"
              >Deselecionar tudo</v-btn
            >
            <v-btn
              class="ml-1"
              color="primary"
              height="40"
              dark
              small
              @click="selectAll()"
              >Selecionar tudo</v-btn
            >
            <v-btn
              class="ml-1"
              color="#A5A5A5"
              height="40px"
              dark
              small
              @click="openDidaticDialog('assessment')"
              >Parâmetros de avaliação</v-btn
            >
            <v-btn
              class="ml-1"
              color="green"
              height="40"
              dark
              small
              @click="openDidaticDialog('prior')"
              >Conhecimentos Prévios</v-btn
            >
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
    </v-row>
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
    <div class="text-center">
      <v-dialog v-model="dialogError" width="500">
        <v-card>
          <v-card-title class="headline red" primary-title style="color:white;"
            >ALERTA!</v-card-title
          >
          <v-card-text class="mt-3" style="font-size: 1.3em;">{{
            messageError
          }}</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialogError = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-card>
</template>

<script>
  import Api from "@/services/Api";

  export default {
    name: "VisibleDialog",
    props: ["domain", "dialog"],
    data: () => ({
      valid: true,
      treeData: [],
      selection: [],
      elementData: [],
      scopoTypes: [
        {
          text: "Avaliação",
          value: 1,
        },
        {
          text: "Domínio",
          value: 2,
        },
      ],
      typesThreshold: [
        {
          text: "Porcentagem",
          value: 1,
        },
        {
          text: "Literal",
          value: 2,
        },
      ],
      valueTypes: ["Single", "Range"],
      assessmentControl: [],
      conceptsPrior: [],
      priorControl: [],
      priorLevels: [
        {
          text: "Obrigatório",
          value: 1,
        },
        {
          text: "Desejável",
          value: 2,
        },
      ],
      dialogError: false,
      messageError: "",
      newItems: [],
      checkbox: true,
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
        this.assessmentControl.forEach((assess) => {
          if (assess.valueType === "Single") {
            assess.ranges.forEach((range) => {
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
      },
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
              fk_element: this.domain.assessmentparameter[0]
                .fk_idknowledgedomain,
              valueType: "",
              single: {
                threshold: "",
                url: "",
              },
              ranges: [],
              url: this.domain.assessmentparameter[0].url,
            };
            if (this.domain.assessmentparameter[0].single.length > 0) {
              assess.valueType = "Single";
              assess.single.threshold = this.domain.assessmentparameter[0].single[0].threshold;
              assess.single.url = this.domain.assessmentparameter[0].single[0].url;
            } else if (this.domain.assessmentparameter[0].ranges.length > 0) {
              assess.valueType = "Range";
              this.domain.assessmentparameter[0].ranges.forEach((range) => {
                assess.ranges.push({
                  namerange: range.namerange,
                  initialvalue: range.initialvalue,
                  limitvalue: range.limitvalue,
                  url: range.url,
                });
              });
            }
            this.assessmentControl.push(assess);
          }
          if (this.domain.modules) {
            this.domain.modules.forEach((module) => {
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
                    url: "",
                  },
                  ranges: [],
                  url: module.assessmentparameter[0].url,
                };
                if (module.assessmentparameter[0].single.length > 0) {
                  assess.valueType = "Single";
                  assess.single.threshold =
                    module.assessmentparameter[0].single[0].threshold;
                  assess.single.url =
                    module.assessmentparameter[0].single[0].url;
                } else if (module.assessmentparameter[0].ranges.length > 0) {
                  assess.valueType = "Range";
                  module.assessmentparameter[0].ranges.forEach((range) => {
                    assess.ranges.push({
                      namerange: range.namerange,
                      initialvalue: range.initialvalue,
                      limitvalue: range.limitvalue,
                      url: range.url,
                    });
                  });
                }
                this.assessmentControl.push(assess);
              }
              if (module.concepts) {
                module.concepts.forEach((moduleConcept) => {
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
                        url: "",
                      },
                      ranges: [],
                      url: moduleConcept.assessmentparameter[0].url,
                    };
                    if (
                      moduleConcept.assessmentparameter[0].single.length > 0
                    ) {
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
                        (range) => {
                          assess.ranges.push({
                            namerange: range.namerange,
                            initialvalue: range.initialvalue,
                            limitvalue: range.limitvalue,
                            url: range.url,
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
                      fk_idconcept:
                        moduleConcept.priorknowledge[0].fk_idconcept,
                      url: moduleConcept.priorknowledge[0].url,
                    });
                  }
                });
              }
              if (module.submodules) {
                module.submodules.forEach((submodule) => {
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
                        url: "",
                      },
                      ranges: [],
                      url: submodule.assessmentparameter[0].url,
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
                      submodule.assessmentparameter[0].ranges.forEach(
                        (range) => {
                          assess.ranges.push({
                            namerange: range.namerange,
                            initialvalue: range.initialvalue,
                            limitvalue: range.limitvalue,
                            url: range.url,
                          });
                        }
                      );
                    }
                    this.assessmentControl.push(assess);
                  }
                  if (submodule.concepts) {
                    submodule.concepts.forEach((submoduleConcept) => {
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
                            url: "",
                          },
                          ranges: [],
                          url: submoduleConcept.assessmentparameter[0].url,
                        };
                        if (
                          submoduleConcept.assessmentparameter[0].single
                            .length > 0
                        ) {
                          assess.valueType = "Single";
                          assess.single.threshold =
                            submoduleConcept.assessmentparameter[0].single[0].threshold;
                          assess.single.url =
                            submoduleConcept.assessmentparameter[0].single[0].url;
                        } else if (
                          submoduleConcept.assessmentparameter[0].ranges
                            .length > 0
                        ) {
                          assess.valueType = "Range";
                          submoduleConcept.assessmentparameter[0].ranges.forEach(
                            (range) => {
                              assess.ranges.push({
                                namerange: range.namerange,
                                initialvalue: range.initialvalue,
                                limitvalue: range.limitvalue,
                                url: range.url,
                              });
                            }
                          );
                        }
                        this.assessmentControl.push(assess);
                      }
                      if (submoduleConcept.priorknowledge.length > 0) {
                        this.priorControl.push({
                          namepriorknowledge:
                            submoduleConcept.priorknowledge[0]
                              .namepriorknowledge,
                          priorlevel: parseInt(
                            submoduleConcept.priorknowledge[0].priorlevel.split(
                              "/"
                            )[4]
                          ),
                          fk_idconcept:
                            submoduleConcept.priorknowledge[0].fk_idconcept,
                          url: submoduleConcept.priorknowledge[0].url,
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
          value: this.domain.url,
        });
        var indexmodulo = 0;
        if (this.domain.mobilemedias.length) {
          this.domain.mobilemedias.forEach((mobilemedia) => {
            var object = {
              id: mobilemedia.url,
              name: "[MOBILEMEDIA] " + mobilemedia.label,
              visible: mobilemedia.visible,
            };
            this.treeData.push(object);
            if (object.visible) {
              this.selection.push(object);
            }
            indexmodulo++;
          });
        }
        if (this.domain.instructionalelements.length) {
          this.domain.instructionalelements.forEach((instructionalelement) => {
            if (
              instructionalelement.fk_instructionalelementtype.split("/")[4] !==
              4
            ) {
              var object = {
                id: instructionalelement.url,
                name: "[INSTRUCTIONAL ELEMENT] " + instructionalelement.label,
                visible: instructionalelement.visible,
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
          this.domain.modules.forEach((modulo) => {
            if (modulo.fk_idmodule === null) {
              var indexsubmodulo = 0;
              var object = {
                id: modulo.url,
                name: "[MODULO] " + modulo.namemodule,
                visible: modulo.visible,
                children: [],
              };
              this.treeData.push(object);
              this.elementData.push({
                text: object.name,
                value: object.id,
              });
              if (object.visible) {
                this.selection.push(object);
              }
              if (modulo.mobilemedias.length) {
                modulo.mobilemedias.forEach((mobilemedia) => {
                  var object = {
                    id: mobilemedia.url,
                    name: "[MOBILEMEDIA] " + mobilemedia.label,
                    visible: mobilemedia.visible,
                  };
                  this.treeData[indexmodulo].children.push(object);
                  if (object.visible) {
                    this.selection.push(object);
                  }
                  indexsubmodulo++;
                });
              }

              if (modulo.instructionalelements.length) {
                modulo.instructionalelements.forEach((instructionalelement) => {
                  if (
                    instructionalelement.fk_instructionalelementtype.split(
                      "/"
                    )[4] !== 4
                  ) {
                    var object = {
                      id: instructionalelement.url,
                      name:
                        "[INSTRUCTIONAL ELEMENT] " + instructionalelement.label,
                      visible: instructionalelement.visible,
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
                modulo.submodules.forEach((submodulo) => {
                  var object = {
                    id: submodulo.url,
                    name: "[SUBMODULO] " + submodulo.namemodule,
                    visible: submodulo.visible,
                    children: [],
                  };
                  this.treeData[indexmodulo].children.push(object);
                  this.elementData.push({
                    text: object.name,
                    value: object.id,
                  });
                  if (object.visible) {
                    this.selection.push(object);
                  }

                  if (submodulo.mobilemedias.length) {
                    submodulo.mobilemedias.forEach((mobilemedia) => {
                      var object = {
                        id: mobilemedia.url,
                        name: "[MOBILEMEDIA] " + mobilemedia.label,
                        visible: mobilemedia.visible,
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
                      (instructionalelement) => {
                        var object = {
                          id: instructionalelement.url,
                          name:
                            "[INSTRUCTIONAL ELEMENT] " +
                            instructionalelement.label,
                          visible: instructionalelement.visible,
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
                    submodulo.concepts.forEach((conceito) => {
                      var object = {
                        id: conceito.url,
                        name: "[CONCEITO] " + conceito.nameconcept,
                        visible: conceito.visible,
                        children: [],
                      };
                      this.treeData[indexmodulo].children[
                        indexsubmodulo
                      ].children.push(object);

                      this.elementData.push({
                        text: object.name,
                        value: object.id,
                      });
                      if (object.visible) {
                        this.selection.push(object);
                      }
                      this.conceptsPrior.push({
                        text: object.name,
                        value: object.id,
                      });

                      if (conceito.mobilemedias.length) {
                        conceito.mobilemedias.forEach((mobilemedia) => {
                          var object = {
                            id: mobilemedia.url,
                            name: "[MOBILEMEDIA] " + mobilemedia.label,
                            visible: mobilemedia.visible,
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
                          (instructionalelement) => {
                            var object = {
                              id: instructionalelement.url,
                              name:
                                "[INSTRUCTIONAL ELEMENT] " +
                                instructionalelement.label,
                              visible: instructionalelement.visible,
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
                        conceito.informationitems.forEach((procedure) => {
                          if (
                            procedure.fk_informationitemtype ===
                            "/informationitemtype/4/"
                          ) {
                            var object = {
                              id: procedure.url,
                              name:
                                "[PROCEDIMENTO] " +
                                procedure.nameinformationitem,
                              visible: procedure.visible,
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
                modulo.concepts.forEach((conceito) => {
                  var object = {
                    id: conceito.url,
                    name: "[CONCEITO] " + conceito.nameconcept,
                    visible: conceito.visible,
                    children: [],
                  };
                  this.treeData[indexmodulo].children.push(object);

                  this.elementData.push({
                    text: object.name,
                    value: object.id,
                  });
                  if (object.visible) {
                    this.selection.push(object);
                  }
                  this.conceptsPrior.push({
                    text: object.name,
                    value: object.id,
                  });
                  if (conceito.mobilemedias.length) {
                    conceito.mobilemedias.forEach((mobilemedia) => {
                      var object = {
                        id: mobilemedia.url,
                        name: "[MOBILEMEDIA] " + mobilemedia.label,
                        visible: mobilemedia.visible,
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
                      (instructionalelement) => {
                        var object = {
                          id: instructionalelement.url,
                          name:
                            "[INSTRUCTIONAL ELEMENT] " +
                            instructionalelement.label,
                          visible: instructionalelement.visible,
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
                    conceito.informationitems.forEach((procedure) => {
                      if (
                        procedure.fk_informationitemtype ===
                        "/informationitemtype/4/"
                      ) {
                        var object = {
                          id: procedure.url,
                          name:
                            "[PROCEDIMENTO] " + procedure.nameinformationitem,
                          visible: procedure.visible,
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
        await this.assessmentControl.forEach(async (assessment) => {
          var auxAssessment = {
            typethreshold: `/typethreshold/` + assessment.typeThreshold + `/`,
            scopo: `/scopo/` + assessment.scopo + `/`,
            fk_idknowledgedomain: null,
            fk_idmodule: null,
            fk_idconcept: null,
          };
          if (assessment.fk_element.split("/")[3] === "knowledgedomain") {
            auxAssessment.fk_idknowledgedomain = assessment.fk_element;
          } else if (assessment.fk_element.split("/")[3] === "module") {
            auxAssessment.fk_idmodule = assessment.fk_element;
          } else if (assessment.fk_element.split("/")[3] === "concept") {
            auxAssessment.fk_idconcept = assessment.fk_element;
          }

          if (assessment.url) {
            await Api()
              .put(assessment.url, auxAssessment)
              .then(async function(resposta) {
                if (assessment.valueType === "Single") {
                  if (assessment.ranges) {
                    assessment.ranges.forEach((range) => {
                      if (range.url) {
                        Api().delete(range.url);
                      }
                    });
                  }
                  await Api().put(assessment.single.url, {
                    fk_idassessmentparameter: resposta.data.url,
                    threshold: assessment.single.threshold,
                  });
                } else if (assessment.valueType === "Range") {
                  if (assessment.single.url) {
                    Api().delete(assessment.single.url);
                  }
                  assessment.ranges.forEach(async (range) => {
                    if (range.url) {
                      await Api().put(range.url, {
                        namerange: range.namerange,
                        fk_idassessmentparameter: resposta.data.url,
                        initialvalue: range.initialvalue,
                        limitvalue: range.limitvalue,
                      });
                    } else {
                      await Api().post("/range/", {
                        namerange: range.namerange,
                        fk_idassessmentparameter: resposta.data.url,
                        initialvalue: range.initialvalue,
                        limitvalue: range.limitvalue,
                      });
                    }
                  });
                }
              });
          } else {
            await Api()
              .post("/assessmentparameter/", auxAssessment)
              .then(async function(resposta) {
                if (assessment.valueType === "Single") {
                  await Api().post("/single/", {
                    fk_idassessmentparameter: resposta.data.url,
                    threshold: assessment.single.threshold,
                  });
                } else if (assessment.valueType === "Range") {
                  assessment.ranges.forEach(async (range) => {
                    await Api().post("/range/", {
                      namerange: range.namerange,
                      fk_idassessmentparameter: resposta.data.url,
                      initialvalue: range.initialvalue,
                      limitvalue: range.limitvalue,
                    });
                  });
                }
              });
          }
        });
      },
      async postPriorKnowledges() {
        await this.priorControl.forEach(async (prior) => {
          if (prior.url) {
            await Api().put(prior.url, {
              namepriorknowledge: prior.namepriorknowledge,
              priorlevel: `/priorlevel/` + prior.priorlevel + `/`,
              fk_idconcept: prior.fk_idconcept,
            });
          } else {
            await Api().post(`/priorknowledge/`, {
              namepriorknowledge: prior.namepriorknowledge,
              priorlevel: `/priorlevel/` + prior.priorlevel + `/`,
              fk_idconcept: prior.fk_idconcept,
            });
          }
        });
      },
      async putVisible() {
        var vm = this;

        this.treeData.forEach((element) => {
          if (
            element.visible === true &&
            !this.selection.find((findElement) => findElement.id === element.id)
          ) {
            Api()
              .patch(element.id)
              .then(async function(resposta) {
                var aux = resposta.data;
                await Object.keys(aux).forEach((atributo) => {
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
                await Api().put(element.id, aux);
              });
          } else if (
            element.visible === false &&
            this.selection.find((findElement) => findElement.id === element.id)
          ) {
            Api()
              .patch(element.id)
              .then(async function(resposta) {
                var aux = resposta.data;
                await Object.keys(aux).forEach((atributo) => {
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
                await Api().put(element.id, aux);
              });
          }
          if (Array.isArray(element.children) && element.children.length) {
            element.children.forEach((element2) => {
              if (
                element2.visible === true &&
                !this.selection.find(
                  (findElement2) => findElement2.id === element2.id
                )
              ) {
                Api()
                  .patch(element2.id)
                  .then(async function(resposta) {
                    var aux = resposta.data;
                    await Object.keys(aux).forEach((atributo) => {
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

                    await Api().put(element2.id, aux);
                  });
              } else if (
                element2.visible === false &&
                this.selection.find(
                  (findElement2) => findElement2.id === element2.id
                )
              ) {
                Api()
                  .patch(element2.id)
                  .then(async function(resposta) {
                    var aux = resposta.data;
                    await Object.keys(aux).forEach((atributo) => {
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

                    await Api().put(element2.id, aux);
                  });
              }

              if (
                Array.isArray(element2.children) &&
                element2.children.length
              ) {
                element2.children.forEach((element3) => {
                  if (
                    element3.visible === true &&
                    !this.selection.find(
                      (findElement3) => findElement3.id === element3.id
                    )
                  ) {
                    Api()
                      .patch(element3.id)
                      .then(async function(resposta) {
                        var aux = resposta.data;
                        await Object.keys(aux).forEach((atributo) => {
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
                        await Api().put(element3.id, aux);
                      });
                  } else if (
                    element3.visible === false &&
                    this.selection.find(
                      (findElement3) => findElement3.id === element3.id
                    )
                  ) {
                    Api()
                      .patch(element3.id)
                      .then(async function(resposta) {
                        var aux = resposta.data;
                        await Object.keys(aux).forEach((atributo) => {
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
                        await Api().put(element3.id, aux);
                      });
                  }

                  if (
                    Array.isArray(element3.children) &&
                    element3.children.length
                  ) {
                    element3.children.forEach((element4) => {
                      if (
                        element4.visible === true &&
                        !this.selection.find(
                          (findElement4) => findElement4.id === element4.id
                        )
                      ) {
                        Api()
                          .patch(element4.id)
                          .then(async function(resposta) {
                            var aux = resposta.data;
                            await Object.keys(aux).forEach((atributo) => {
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
                            await Api().put(element4.id, {
                              aux,
                            });
                          });
                      } else if (
                        element4.visible === false &&
                        this.selection.find(
                          (findElement4) => findElement4.id === element4.id
                        )
                      ) {
                        Api()
                          .patch(element4.id)
                          .then(async function(resposta) {
                            var aux = resposta.data;
                            await Object.keys(aux).forEach((atributo) => {
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
                            await Api().put(element4.id, {
                              aux,
                            });
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
        this.treeData.forEach((element) => {
          vm.selection.push(element);
          if (element.children) {
            element.children.forEach((element2) => {
              vm.selection.push(element2);
              if (element2.children) {
                element2.children.forEach((element3) => {
                  vm.selection.push(element3);
                  if (element3.children) {
                    element3.children.forEach((element4) => {
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
          url: "",
        });
      },
      async deletaRange(idAssessment, idRange) {
        if (this.assessmentControl[idAssessment].ranges[idRange].url) {
          Api().delete(
            this.assessmentControl[idAssessment].ranges[idRange].url
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
            url: "",
          },
          ranges: [],
          url: "",
        });
      },
      async deletaAssessment(idAssessment) {
        if (this.assessmentControl[idAssessment].url !== null) {
          await Api().delete(this.assessmentControl[idAssessment].url);
        }
        if (idAssessment == 0) {
          this.assessmentControl.shift();
        } else {
          this.assessmentControl.splice(idAssessment, 1);
        }
      },
      async deletaSingle(urlSingle) {
        await Api().delete(urlSingle);
      },
      addPriorKnowledge() {
        this.priorControl.push({
          namepriorknowledge: "",
          priorlevel: "",
          fk_idconcept: "",
          url: "",
        });
      },
      async deletaPriorKnowledge(idPrior) {
        if (this.priorControl[idPrior].url) {
          await Api().delete(this.priorControl[idPrior].url);
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
      openDidaticDialog(dialog) {
        this.$emit("openDidaticDialog", dialog);
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
      },
    },
  };
</script>
