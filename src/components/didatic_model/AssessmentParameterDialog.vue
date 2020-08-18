<template>
  <v-card>
    <v-card-title style="background-color:purple; color:white;">
      <span class="headline">
        <p>Defina as informações equivalentes aos parâmetros de avaliação.</p>
      </span>
    </v-card-title>
    <v-row class="mx-0 px-0">
      <v-row class="mx-0 px-0 pl-6">
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
          class="mx-0 px-0 pl-6"
        >
          <v-col cols="2">
            <v-select
              v-model="assessmentControl[i].scopo"
              :items="scopoTypes"
              :rules="[(v) => !!v || 'Conceito é requerido']"
              label="Scopo"
              style="margin:0px;"
              required
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="assessmentControl[i].fk_element"
              :items="elementData"
              :rules="[(v) => !!v || 'O tipo do conceito é requerido']"
              label="Elemento"
              style="margin:0px;"
              required
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="assessmentControl[i].typeThreshold"
              :items="typesThreshold"
              :rules="[(v) => !!v || 'O tipo do conceito é requerido']"
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
              :rules="[(v) => !!v || 'O tipo de dado é requerido']"
              label="Tipo de Dado"
              required
            ></v-select>
            <v-text-field
              style="margin-top: -1px; margin-bottom: -10px;"
              v-if="assessmentControl[i].valueType === 'Single'"
              v-model="assessmentControl[i].single.threshold"
              label="Valor"
              :suffix="assessmentControl[i].typeThreshold === 1 ? '%' : ''"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="2" class="mt-2">
            <v-btn icon="icon" class="mb-1" v-if="assessmentControl[i].valueType === 'Range'">
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
                  :suffix="assessmentControl[i].typeThreshold === 1 ? '%' : ''"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="assessmentControl[i].ranges[idRange].limitvalue"
                  label="Valor Limite"
                  style="margin:0px;"
                  type="number"
                  :suffix="assessmentControl[i].typeThreshold === 1 ? '%' : ''"
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
      </v-form>
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
          <v-card-title class="headline red" primary-title style="color:white;">ALERTA!</v-card-title>
          <v-card-text class="mt-3" style="font-size: 1.3em;">
            {{
            messageError
            }}
          </v-card-text>
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
  name: "AssessmentParameterDialog",
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
    valueTypes: ["Simples", "Faixa"],
    assessmentControl: [],
    dialogError: false,
    messageError: "",
    newItems: [],
    checkbox: true,
  }),
  watch: {
    domain: async function () {
      this.assessmentControl = [];
      if (this.domain) {
        await this.getAssessments();
        await this.setDomainVariables();
      }
    },
    dialog: async function () {
      this.assessmentControl = [];
      if (this.domain) {
        await this.getAssessments();
        await this.setDomainVariables();
      }
    },
    assessmentControl: function () {
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
  mounted: async function () {
    this.assessmentControl = [];
    if (this.domain) {
      await this.getAssessments();
      await this.setDomainVariables();
    }
  },
  methods: {
    setDomainVariables() {
      this.elementData.push({
        text: "[DOMINIO] " + this.domain.nameknowledgedomain,
        value: this.domain.url,
      });
      if (Array.isArray(this.domain.modules) && this.domain.modules.length) {
        this.domain.modules.forEach((modulo) => {
          if (modulo.fk_idmodule === null) {
            var object = {
              id: modulo.url,
              name: "[MODULO] " + modulo.namemodule,
              visible: modulo.visible,
              children: [],
            };
            this.elementData.push({
              text: object.name,
              value: object.id,
            });
            if (modulo.submodules.length) {
              modulo.submodules.forEach((submodulo) => {
                var object = {
                  id: submodulo.url,
                  name: "[SUBMODULO] " + submodulo.namemodule,
                  visible: submodulo.visible,
                  children: [],
                };
                this.elementData.push({
                  text: object.name,
                  value: object.id,
                });

                if (submodulo.concepts.length) {
                  submodulo.concepts.forEach((conceito) => {
                    var object = {
                      id: conceito.url,
                      name: "[CONCEITO] " + conceito.nameconcept,
                      visible: conceito.visible,
                      children: [],
                    };
                    this.elementData.push({
                      text: object.name,
                      value: object.id,
                    });
                  });
                }
              });
            }
            if (modulo.concepts.length) {
              modulo.concepts.forEach((conceito) => {
                var object = {
                  id: conceito.url,
                  name: "[CONCEITO] " + conceito.nameconcept,
                  visible: conceito.visible,
                  children: [],
                };
                this.elementData.push({
                  text: object.name,
                  value: object.id,
                });
              });
            }
          }
        });
      }
    },
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
                assess.single.url = module.assessmentparameter[0].single[0].url;
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
                    submodule.assessmentparameter[0].ranges.forEach((range) => {
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
                  });
                }
              });
            }
          });
        }
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
            .then(async function (resposta) {
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
            .then(async function (resposta) {
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
        Api().delete(this.assessmentControl[idAssessment].ranges[idRange].url);
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
          await this.postAssessment();
          await this.resetVariables();
          await this.$emit("close_or_save", "save");
        }
      }
    },
    reset() {
      this.$emit("close_or_save", "close");
      this.assessmentControl = [];
    },
    resetVariables() {
      this.assessmentControl = [];
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>
