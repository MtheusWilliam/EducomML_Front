<template>
  <v-row>
    <!--Panel do Domínio-->
    <v-expansion-panels v-model="vModelPanelDomain" multiple readonly>
      <v-expansion-panel
        v-for="(item, i) in 1"
        :key="i"
        :id="dominio.url.split('/')[3] + dominio.idknowledgedomain"
      >
        <v-expansion-panel-header color="#666666" style="color:white; height: 55px;">
          <!--HEADER DO DOMÍNIO-->
          <v-row>
            <v-col class="d-flex align-center" style="height:100%;">
              <v-avatar color="white" size="40" class="mr-2">
                <span class="black--text" style="font-size:1.2em;">DM</span>
              </v-avatar>
              <div style="vertical-align:middle;" class="mt-3">
                <p>
                  <strong
                    v-if="dominio_data.nameknowledgedomain.length <= 40"
                    style="font-size:1.2em;"
                  >{{ dominio_data.nameknowledgedomain }}</strong>
                  <strong
                    v-else
                    style="font-size:1.2em;"
                  >{{ dominio_data.nameknowledgedomain.slice(0, 40) }}...</strong>
                  <br />
                  <span
                    style="font-size:0.9em;"
                    v-if="
                      dominio_data.subtitle &&
                        dominio_data.subtitle.length <= 40
                    "
                  >{{ dominio_data.subtitle }}</span>
                  <span
                    style="font-size:0.9em;"
                    v-if="
                      dominio_data.subtitle && dominio_data.subtitle.length > 40
                    "
                  >{{ dominio_data.subtitle.slice(0, 40) }}...</span>
                </p>
              </div>
            </v-col>
            <v-col cols="4" class="d-flex align-center justify-end">
              <div class="d-flex justify-end mr-1 align-center">
                <!--Menu para criação de elementos instrucionais do Domínio-->

                <v-menu
                  top="top"
                  width="300px"
                  origin="center center"
                  :offset-y="true"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn icon="icon" color="white" dark="dark" v-on="on">
                      <v-icon>mdi-text-box-plus-outline</v-icon>
                    </v-btn>
                  </template>

                  <InstrucMenuFiles
                    @instrucdialogoption="instrucOpenFileDialog"
                    :instrucOptionCall="dominio"
                    :instrucType="'dominio'"
                  />
                </v-menu>

                <!-- Menu para criação de arquivos-->
                <v-menu
                  top="top"
                  width="300px"
                  origin="center center"
                  :offset-y="true"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn icon="icon" color="white" dark="dark" v-on="on">
                      <v-icon>mdi-apps</v-icon>
                    </v-btn>
                  </template>

                  <MenuFiles
                    @dialogoption="openFileDialog"
                    :optionCall="dominio"
                    :type="'dominio'"
                  />
                </v-menu>

                <!--Formulario para adição do módulo-->
                <v-dialog v-model="dialog_modulo" persistent="persistent" max-width="600px">
                  <template v-slot:activator="{ on }">
                    <v-btn icon="icon" color="white" v-on="on">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>

                  <ModuloDialog
                    :module="modulo"
                    @close_or_save="close_or_save_modulo"
                    :domain="dominio"
                    :dialog="dialog_modulo"
                  />
                </v-dialog>

                <!--Formulario para edição do domínio-->
                <v-dialog v-model="dialog_dominio" persistent="persistent" max-width="600px">
                  <template v-slot:activator="{ on }">
                    <v-btn icon="icon" color="white" v-on="on">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <!--Formulario para criação de módulo-->
                  <DominioDialog
                    @close_or_save="close_or_save_dominio"
                    @dominio_data="setDomainVariables"
                    :domain="dominio_data"
                    :dialog="dialog_dominio"
                  />
                </v-dialog>
                <!-- Ícone para criação de modelo didático-->
                <v-menu
                  top="top"
                  width="350px"
                  origin="center center"
                  :offset-y="true"
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn icon="icon" color="white" dark="dark" v-on="on">
                      <v-icon>mdi-book-open</v-icon>
                    </v-btn>
                  </template>

                  <DidaticMenuFiles @didaticdialogoption="openDidaticDialog" />
                </v-menu>

                <!--Ícone para gerar arquivo apk-->
                <v-btn icon="icon" color="white" dark>
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
                <!--Formulario para criação de submódulo-->
                <v-dialog v-model="dialog_submodulo" persistent="persistent" max-width="600px">
                  <SubModuloDialog
                    :submodule="submodulo"
                    :module="modulo"
                    @close_or_save="close_or_save_submodulo"
                    :domain="dominio"
                    :dialog="dialog_submodulo"
                  />
                </v-dialog>
                <!--Formulario para criação de conceito-->
                <v-dialog
                  v-model="dialog_conceito"
                  style="overflow-y: hidden;"
                  persistent="persistent"
                  max-width="755px"
                >
                  <ConceitoDialog
                    :concept="conceito"
                    :module="modulo"
                    @close_or_save="close_or_save_conceito"
                    @openDidaticDialog="openDidaticDialog"
                    :domain="dominio"
                    :dialog="dialog_conceito"
                  />
                </v-dialog>
                <!--FORMULARIOS PARA CRIAÇÃO DE ARQUIVOS-->
                <!--Formulario para criação de imagem-->
                <v-dialog v-model="dialog_imagem" persistent="persistent" max-width="800px">
                  <ImageDialog
                    @close="dialogclose"
                    :optionCall="objectFile"
                    :type="type"
                    :domain="dominio"
                    :dialog="dialog_imagem"
                    :mobilemedia="mobilemedia"
                  />
                </v-dialog>
                <!--Formulario para criação de video-->
                <v-dialog v-model="dialog_video" persistent="persistent" max-width="800px">
                  <VideoDialog
                    @close="dialogclose"
                    :optionCall="objectFile"
                    :type="type"
                    :domain="dominio"
                    :dialog="dialog_video"
                    :mobilemedia="mobilemedia"
                  />
                </v-dialog>
                <!--Formulario para criação de audio-->
                <v-dialog v-model="dialog_audio" persistent="persistent" max-width="800px">
                  <AudioDialog
                    @close="dialogclose"
                    :optionCall="objectFile"
                    :type="type"
                    :domain="dominio"
                    :dialog="dialog_audio"
                    :mobilemedia="mobilemedia"
                  />
                </v-dialog>
                <!--Formulario para criação de texto-->
                <v-dialog v-model="dialog_texto" persistent="persistent" max-width="800px">
                  <TextDialog
                    @close="dialogclose"
                    :optionCall="objectFile"
                    :type="type"
                    :domain="dominio"
                    :dialog="dialog_texto"
                    :mobilemedia="mobilemedia"
                  />
                </v-dialog>
                <!--Formulario para criação de link-->
                <v-dialog v-model="dialog_link" persistent="persistent" max-width="800px">
                  <LinkDialog
                    @close="dialogclose"
                    :optionCall="objectFile"
                    :type="type"
                    :domain="dominio"
                    :dialog="dialog_link"
                    :mobilemedia="mobilemedia"
                  />
                </v-dialog>

                <!--FORMULARIOS PARA CRIAÇÃO DE ITENS DE INFORMAÇÃO -->
                <!--Formulario para criação de procedimento -->
                <v-dialog v-model="dialog_procedure" persistent="persistent" max-width="800px">
                  <ProcedureDialog
                    @procedureclose="dialogclose"
                    :dialog="dialog_procedure"
                    :procedure="procedimento"
                    :concept="conceito"
                    :module="modulo"
                    :domain="dominio"
                  />
                </v-dialog>

                <!--FORMULARIOS PARA CRIAÇÃO DE ELEMENTOS INSTRUCIONAIS -->
                <!--Formulario para criação de exercício e avaliação -->
                <v-dialog v-model="dialog_avaliacao" persistent="persistent" max-width="1100px">
                  <AvaliacaoDialog
                    @instrucclose="instrucdialogclose"
                    :instrucOptionCall="instrucObjectFile"
                    :instrucType="instrucType"
                    :instrucValueType="instrucValueType"
                    :domain="dominio"
                    :dialog="dialog_avaliacao"
                    :instructionalelement="elementoinstrucional"
                  />
                </v-dialog>
                <!--Formulario para criação de atividade colaborativa -->
                <v-dialog
                  v-model="dialog_atividadecolaborativa"
                  persistent="persistent"
                  max-width="1100px"
                >
                  <AtividadeColaborativaDialog
                    @instrucclose="instrucdialogclose"
                    :instrucOptionCall="instrucObjectFile"
                    :instrucType="instrucType"
                    :domain="dominio"
                    :dialog="dialog_atividadecolaborativa"
                    :instructionalelement="elementoinstrucional"
                  />
                </v-dialog>
                <!--Formulario para edição do modelo didático -->
                <v-dialog v-model="dialog_visible" persistent="persistent" max-width="1000px">
                  <VisibleDialog
                    :domain="dominio"
                    :dialog="dialog_visible"
                    @openDidaticDialog="openDidaticDialog"
                    @close_or_save="visibleClose"
                  />
                </v-dialog>

                <!--Formulario para edição dos parâmetros de avaliação -->
                <v-dialog v-model="dialog_assessment" persistent="persistent" max-width="1000px">
                  <AssessmentParameterDialog
                    :domain="dominio"
                    :dialog="dialog_assessment"
                    @close_or_save="assessmentClose"
                  />
                </v-dialog>

                <!--Formulario para edição dos conhecimentos prévios -->
                <v-dialog v-model="dialog_prior" persistent="persistent" max-width="1000px">
                  <PriorKnowledgeDialog
                    :domain="dominio"
                    :dialog="dialog_prior"
                    @close_or_save="priorClose"
                  />
                </v-dialog>

                <!--Formulario para edição dos conhecimentos prévios para o conceito-->
                <v-dialog v-model="dialog_priorConcept" persistent="persistent" max-width="1000px">
                  <PriorKnowledgeDialogConcept
                    :domain="dominio"
                    :module="modulo"
                    :concept="conceito"
                    :dialog="dialog_priorConcept"
                    @close_or_save="priorCloseConcept"
                  />
                </v-dialog>

                <!--Formulário para criação de exemplo-->
                <v-dialog v-model="dialog_exemplo" persistent="persistent" max-width="1200px">
                  <ExemploDialog
                    @instrucclose="instrucdialogclose"
                    :instrucOptionCall="instrucObjectFile"
                    :instrucType="instrucType"
                    :domain="dominio"
                    :dialog="dialog_exemplo"
                    :instructionalelement="elementoinstrucional"
                  />
                </v-dialog>
              </div>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <!--FIM DO HEADER DO DOMÍNIO-->
        <v-expansion-panel-content color="#EFEEEC">
          <!--CONTENT DO DOMÍNIO-->
          <!-- PANELS DOS ARQUIVOS/MOBILEMEDIAS DO DOMÍNIO-->
          <v-expansion-panels
            v-model="vModelPanelMobilemediasDomain"
            multiple
            :readonly="readonly_control"
          >
            <v-expansion-panel
              v-for="(mobilemedia, imobilemedia) in dominio.mobilemedias"
              :key="imobilemedia"
              class="mt-2 mb-2"
              :id="mobilemedia.url.split('/')[3] + mobilemedia.idmobilemedia"
            >
              <v-expansion-panel-header color="#A5A5A5" style="color:white; height: 55px;">
                <v-row>
                  <v-col class="d-flex align-center" style="height:100%;">
                    <div style="vertical-align:middle;" class="mt-3">
                      <p>
                        <v-icon color="white" large>
                          {{
                          fileTypesIcon[
                          mobilemedia.fk_idmediatype.split("/")[4] - 1
                          ]
                          }}
                        </v-icon>
                        {{
                        mobilemediaTypeLabel[
                        parseInt(
                        mobilemedia.fk_idmediatype.split("/")[4] - 1
                        )
                        ]
                        }}
                      </p>
                    </div>
                  </v-col>
                  <v-col cols="4" class="d-flex align-center justify-end">
                    <div class="d-flex justify-end mr-1 align-center">
                      <!--Formulario para edição do arquivo/mobilemedia-->
                      <v-btn
                        icon="icon"
                        color="white"
                        @click="
                          readonly_control = true;
                          setmobilemedia(mobilemedia, dominio, 'dominio');
                        "
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <!--Função para excluir arquivo/mobilemedia-->
                      <v-btn
                        icon="icon"
                        color="white"
                        @click="
                          readonly_control = true;
                          auxElementDelete = mobilemedia;
                          alertDelete = true;
                        "
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>

              <v-expansion-panel-content>
                <br />
                <span v-if="mobilemedia.urllink">{{ mobilemedia.urllink }}</span>
                <span v-if="mobilemedia.textfull" style="white-space: pre-line">
                  <strong>Texto completo:</strong>
                  <br />
                  {{ mobilemedia.textfull }}
                  <br />
                </span>

                <span v-if="mobilemedia.textshort" style="white-space: pre-line">
                  <strong>Texto resumido:</strong>
                  <br />
                  {{ mobilemedia.textshort }}
                </span>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <!-- FIM DOS PANELS DOS ARQUIVOS DO DOMÍNIO-->
          <!--LISTAGEM DOS ELEMENTOS INSTRUCIONAIS DO DOMÍNIO-->
          <v-expansion-panels
            v-model="vModelPanelInstrucsDomain"
            multiple
            :readonly="readonly_control"
          >
            <v-expansion-panel
              v-for="(instrucelement,
              iinstrucelement) in dominio.instructionalelements"
              :key="iinstrucelement"
              class="mt-2 mb-2"
              :id="
                instrucelement.url.split('/')[3] +
                  instrucelement.idinstructionalelement
              "
            >
              <v-expansion-panel-header color="#A5A5A5" style="color:white; height: 55px;">
                <v-row>
                  <v-col class="d-flex align-center" style="height:100%;">
                    <div style="vertical-align:middle;" class="mt-3">
                      <p>
                        <v-icon color="white" large>
                          {{
                          instrucTypesIcon[
                          instrucelement.fk_instructionalelementtype.split(
                          "/"
                          )[4] - 1
                          ]
                          }}
                        </v-icon>
                        <span v-if="instrucelement.label.length <= 40">{{ instrucelement.label }}</span>
                        <span v-else>{{ instrucelement.label.slice(0, 40) }}...</span>
                      </p>
                    </div>
                  </v-col>
                  <v-col cols="4" class="d-flex align-center justify-end">
                    <div class="d-flex justify-end mr-1 align-center">
                      <!--Formulario para edição dos ELEMENTOS INSTRUCIONAIS do DOMÍNIO-->
                      <v-btn
                        icon="icon"
                        color="white"
                        @click="
                          readonly_control = true;
                          setinstructionalelement(
                            instrucelement,
                            dominio,
                            'dominio'
                          );
                        "
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <!--Função para excluir ELEMENTOS INSTRUCIONAIS do DOMÍNIO-->
                      <v-btn
                        icon="icon"
                        color="white"
                        @click="
                          readonly_control = true;
                          auxElementDelete = instrucelement;
                          alertDelete = true;
                        "
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>

              <v-expansion-panel-content class="mt-2">
                <!-- Conteúdo mostrado caso o elemento instrucional seja de tipo Exemplo e contenha mobilemedias do tipo Texto e Url-->
                <div
                  v-if="instrucelement.fk_instructionalelementtype.split(
                          '/'
                          )[4] == 4"
                >
                  <div v-for="(mobile, imobile) in instrucelement.mobilemedias" :key="imobile">
                    <span v-if="mobile.urllink">
                      <strong>Link:</strong>
                      <br />
                    </span>
                    <span v-if="mobile.urllink">{{ mobile.urllink }}</span>
                    <span v-if="mobile.textfull" style="white-space: pre-line">
                      <strong>Texto completo:</strong>
                      <br />
                      {{mobile.textfull}}
                      <br />
                    </span>

                    <span v-if="mobile.textshort" style="white-space: pre-line">
                      <strong>Texto resumido:</strong>
                      <br />
                      {{mobile.textshort}}
                    </span>
                    <hr v-if="mobile.urllink || mobile.textshort || mobilemedia.textfull" />
                  </div>
                </div>

                <!-- Conteúdo mostrado caso o elemento instrucional seja de tipo Atividade Colaborativa, Avaliação ou Exercício-->
                <span
                  v-if="instrucelement.fk_instructionalelementtype.split(
                          '/'
                          )[4] == 3"
                >
                  <strong>Descrição da atividade</strong>
                  <br />
                  {{instrucelement.description}}
                </span>
                <hr
                  v-if="instrucelement.fk_instructionalelementtype.split('/')[4] == 3 && instrucelement.questions.length > 0"
                />
                <span
                  v-if="instrucelement.fk_instructionalelementtype.split('/')[4] !== 4 && instrucelement.questions.length > 0"
                >
                  <strong>Questões:</strong>
                  <br />
                </span>
                <hr
                  class="mb-4"
                  v-if="instrucelement.fk_instructionalelementtype.split('/')[4] !== 4 && instrucelement.questions.length > 0"
                />
                <div v-for="(question, iquestion) in instrucelement.questions" :key="iquestion">
                  <span>
                    <strong>{{question.orderquestion + 1}}) {{question.descriptionquestion}}</strong>
                  </span>
                  <p
                    v-if="question.typequestion.split(
                          '/'
                          )[4] == 1"
                  >
                    <span
                      class="ml-3"
                      v-for="(answer, ianswer) in question.answersalternatives"
                      :key="ianswer"
                    >
                      {{answer.idobjanswer}}) {{answer.answers}}
                      <br />
                    </span>
                  </p>
                  <p v-else>
                    <span>{{question.resolutionquestion[0].correctanswer}}</span>
                  </p>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <!-- FIM DA LISTAGEM DOS ELEMENTOS INSTRUCIONAIS DO DOMÍNIO-->
          <!--Panels dos Módulos-->
          <v-expansion-panels v-model="vModelPanelModules" multiple :readonly="readonly_control">
            <v-expansion-panel
              v-for="(modulo, imodulo) in getNotSubmodules(dominio)"
              :key="imodulo"
              class="mt-2 mb-2"
              :id="modulo.url.split('/')[3] + modulo.idmodule"
            >
              <v-expansion-panel-header color="#2F4F4F" style="color:white; height: 55px;">
                <!--HEADER DO MÓDULO-->
                <v-row>
                  <v-col class="d-flex align-center" style="height:100%;">
                    <v-avatar color="white" size="40" class="mr-2">
                      <span class="black--text" style="font-size:1.2em;">MD</span>
                    </v-avatar>
                    <div style="vertical-align:middle;" class="mt-3">
                      <p>
                        <strong
                          v-if="modulo.namemodule.length <= 40"
                          style="font-size:1.2em;"
                        >{{ modulo.namemodule }}</strong>
                        <strong
                          v-else
                          style="font-size:1.2em;"
                        >{{ modulo.namemodule.slice(0, 40) }}...</strong>
                        <br />
                        <span
                          style="font-size:0.9em;"
                          v-if="modulo.subtitle && modulo.subtitle.length <= 40"
                        >{{ modulo.subtitle }}</span>
                        <span
                          style="font-size:0.9em;"
                          v-if="modulo.subtitle && modulo.subtitle.length > 40"
                        >{{ modulo.subtitle.slice(0, 40) }}...</span>
                      </p>
                    </div>
                  </v-col>
                  <v-col cols="4" class="d-flex align-center justify-end">
                    <div class="d-flex justify-end mr-1 align-center">
                      <!--Menu para criação de elementos instrucionais do Módulo-->
                      <v-menu
                        top="top"
                        width="300px"
                        origin="center center"
                        :offset-y="true"
                        transition="scale-transition"
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn icon="icon" color="white" dark="dark" v-on="on">
                            <v-icon>mdi-text-box-plus-outline</v-icon>
                          </v-btn>
                        </template>

                        <InstrucMenuFiles
                          @instrucdialogoption="instrucOpenFileDialog"
                          :instrucOptionCall="modulo"
                          :instrucType="'modulo'"
                        />
                      </v-menu>

                      <!-- Menu para criação de arquivos-->
                      <v-menu
                        top="top"
                        width="300px"
                        origin="center center"
                        :offset-y="true"
                        transition="scale-transition"
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn icon="icon" color="white" dark="dark" v-on="on">
                            <v-icon>mdi-apps</v-icon>
                          </v-btn>
                        </template>

                        <MenuFiles
                          @dialogoption="openFileDialog"
                          :optionCall="modulo"
                          :type="'modulo'"
                        />
                      </v-menu>
                      <!--Formulario para adição de submódulo ou conceitos-->
                      <v-menu
                        top="top"
                        width="300px"
                        origin="center center"
                        :offset-y="true"
                        transition="scale-transition"
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn icon="icon" color="white" dark="dark" v-on="on">
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </template>

                        <v-list>
                          <v-list-item
                            @click="
                              setmodulo(modulo);
                              dialog_conceito = true;
                            "
                          >
                            <v-list-item-title>Conceito</v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            @click="
                              setmodulo(modulo);
                              dialog_submodulo = true;
                            "
                          >
                            <v-list-item-title>Submódulo</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                      <!--Formulario para edição do modulo-->
                      <v-btn
                        icon="icon"
                        color="white"
                        @click="
                          readonly_control = true;
                          dialog_modulo = true;
                          setmodulo(modulo);
                        "
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <!--Função para excluir módulo-->
                      <v-btn
                        icon="icon"
                        color="white"
                        @click="
                          readonly_control = true;
                          auxElementDelete = modulo;
                          alertDelete = true;
                        "
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <!--FIM DO HEADER DO MÓDULO-->

              <v-expansion-panel-content>
                <!--CONTENT DO MÓDULO-->
                <!-- PANELS DOS ARQUIVOS DOS MÓDULOS-->
                <v-expansion-panels
                  v-model="vModelPanelArray[imodulo].mobilemedias"
                  multiple
                  :readonly="readonly_control"
                >
                  <v-expansion-panel
                    v-for="(mobilemedia, imobilemedia) in modulo.mobilemedias"
                    :key="imobilemedia"
                    class="mt-2 mb-2"
                    :id="
                      mobilemedia.url.split('/')[3] + mobilemedia.idmobilemedia
                    "
                  >
                    <v-expansion-panel-header color="#A5A5A5" style="color:white; height: 55px;">
                      <v-row>
                        <v-col class="d-flex align-center" style="height:100%;">
                          <div style="vertical-align:middle;" class="mt-3">
                            <p>
                              <v-icon color="white" large>
                                {{
                                fileTypesIcon[
                                mobilemedia.fk_idmediatype.split("/")[4] - 1
                                ]
                                }}
                              </v-icon>
                              {{
                              mobilemediaTypeLabel[
                              parseInt(
                              mobilemedia.fk_idmediatype.split("/")[4] - 1
                              )
                              ]
                              }}
                            </p>
                          </div>
                        </v-col>
                        <v-col cols="4" class="d-flex align-center justify-end">
                          <div class="d-flex justify-end mr-1 align-center">
                            <!--Formulario para edição do arquivo/mobilemedia-->
                            <v-btn
                              icon="icon"
                              color="white"
                              @click="
                                readonly_control = true;
                                setmobilemedia(mobilemedia, modulo, 'modulo');
                              "
                            >
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <!--Função para excluir arquivo/mobilemedia-->
                            <v-btn
                              icon="icon"
                              color="white"
                              @click="
                                readonly_control = true;
                                auxElementDelete = mobilemedia;
                                alertDelete = true;
                              "
                            >
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </div>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                      <br />
                      <span v-if="mobilemedia.urllink">{{ mobilemedia.urllink }}</span>
                      <span v-if="mobilemedia.textfull" style="white-space: pre-line">
                        <strong>Texto completo:</strong>
                        <br />
                        {{ mobilemedia.textfull }}
                        <br />
                      </span>

                      <span v-if="mobilemedia.textshort" style="white-space: pre-line">
                        <strong>Texto resumido:</strong>
                        <br />
                        {{ mobilemedia.textshort }}
                      </span>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <!-- FIM DOS PANELS DOS ARQUIVOS DOS MÓDULOS-->
                <!--LISTAGEM DOS ELEMENTOS INSTRUCIONAIS DOS MÓDULOS-->
                <v-expansion-panels
                  v-model="vModelPanelArray[imodulo].elementosinstrucionais"
                  multiple
                  :readonly="readonly_control"
                >
                  <v-expansion-panel
                    v-for="(instrucelement,
                    iinstrucelement) in modulo.instructionalelements"
                    :key="iinstrucelement"
                    class="mt-2 mb-2"
                    :id="
                      instrucelement.url.split('/')[3] +
                        instrucelement.idinstructionalelement
                    "
                  >
                    <v-expansion-panel-header color="#A5A5A5" style="color:white; height: 55px;">
                      <v-row>
                        <v-col class="d-flex align-center" style="height:100%;">
                          <div style="vertical-align:middle;" class="mt-3">
                            <p>
                              <v-icon color="white" large>
                                {{
                                instrucTypesIcon[
                                instrucelement.fk_instructionalelementtype.split(
                                "/"
                                )[4] - 1
                                ]
                                }}
                              </v-icon>
                              <span
                                v-if="instrucelement.label.length <= 40"
                              >{{ instrucelement.label }}</span>
                              <span v-else>{{ instrucelement.label.slice(0, 40) }}...</span>
                            </p>
                          </div>
                        </v-col>
                        <v-col cols="4" class="d-flex align-center justify-end">
                          <div class="d-flex justify-end mr-1 align-center">
                            <!--Formulario para edição dos ELEMENTOS INSTRUCIONAIS DOS MÓDULOS-->
                            <v-btn
                              icon="icon"
                              color="white"
                              @click="
                                readonly_control = true;
                                setinstructionalelement(
                                  instrucelement,
                                  modulo,
                                  'modulo'
                                );
                              "
                            >
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <!--Função para excluir ELEMENTOS INSTRUCIONAIS DOS MÓDULOS-->
                            <v-btn
                              icon="icon"
                              color="white"
                              @click="
                                readonly_control = true;
                                auxElementDelete = instrucelement;
                                alertDelete = true;
                              "
                            >
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </div>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content class="mt-2">
                      <span
                        v-if="instrucelement.fk_instructionalelementtype.split(
                          '/'
                          )[4] == 3"
                      >
                        <strong>Descrição da atividade</strong>
                        <br />
                        {{instrucelement.description}}
                      </span>
                      <hr
                        v-if="instrucelement.fk_instructionalelementtype.split(
                          '/'
                          )[4] == 3"
                      />
                      <span
                        v-if="instrucelement.fk_instructionalelementtype.split('/')[4] !== 4 && instrucelement.questions.length > 0"
                      >
                        <strong>Questões:</strong>
                        <br />
                      </span>
                      <hr class="mb-4" />
                      <div
                        v-for="(question, iquestion) in instrucelement.questions"
                        :key="iquestion"
                      >
                        <span>
                          <strong>{{question.orderquestion + 1}}) {{question.descriptionquestion}}</strong>
                        </span>
                        <p
                          v-if="question.typequestion.split(
                          '/'
                          )[4] == 1"
                        >
                          <span
                            class="ml-3"
                            v-for="(answer, ianswer) in question.answersalternatives"
                            :key="ianswer"
                          >{{answer.idobjanswer}}) {{answer.answers}}</span>
                        </p>
                        <p v-else>
                          <span>{{question.descriptionquestion[0].correctanswer}}</span>
                        </p>
                      </div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <!-- FIM DA LISTAGEM DOS ELEMENTOS INSTRUCIONAIS DOS MÓDULOS-->
                <!--Panels dos SubMódulos-->
                <v-expansion-panels
                  v-model="vModelPanelArray[imodulo].submodulos"
                  multiple
                  :readonly="readonly_control"
                >
                  <v-expansion-panel
                    v-for="(submodulo, isubmodulo) in modulo.submodules"
                    :key="isubmodulo"
                    class="mt-2 mb-2"
                    :id="submodulo.url.split('/')[3] + submodulo.idmodule"
                  >
                    <v-expansion-panel-header color="#5F9EA0" style="color:white; height: 55px;">
                      <!--HEADER DO SUBMÓDULO-->
                      <v-row>
                        <v-col class="d-flex align-center" style="height:100%;">
                          <v-avatar color="white" size="38" class="mr-2">
                            <span class="black--text" style="font-size:1.2em;">SM</span>
                          </v-avatar>
                          <div style="vertical-align:middle;" class="mt-3">
                            <p>
                              <strong
                                v-if="submodulo.namemodule <= 40"
                                style="font-size:1.2em;"
                              >{{ submodulo.namemodule }}</strong>
                              <strong v-else style="font-size:1.2em;">{{ submodulo.namemodule }}</strong>
                              <br />
                              <span
                                style="font-size:0.9em;"
                                v-if="
                                  submodulo.subtitle &&
                                    submodulo.subtitle.length <= 40
                                "
                              >{{ submodulo.subtitle }}</span>
                              <span
                                style="font-size:0.9em;"
                                v-if="
                                  submodulo.subtitle &&
                                    submodulo.subtitle.length > 40
                                "
                              >{{ submodulo.subtitle }}</span>
                            </p>
                          </div>
                        </v-col>
                        <v-col cols="4" class="d-flex align-center justify-end">
                          <div class="d-flex justify-end mr-1 align-center">
                            <!--Menu para criação de elementos instrucionais do SubMódulo-->
                            <v-menu
                              top="top"
                              width="300px"
                              origin="center center"
                              :offset-y="true"
                              transition="scale-transition"
                            >
                              <template v-slot:activator="{ on }">
                                <v-btn icon="icon" color="white" dark="dark" v-on="on">
                                  <v-icon>mdi-text-box-plus-outline</v-icon>
                                </v-btn>
                              </template>

                              <InstrucMenuFiles
                                @instrucdialogoption="instrucOpenFileDialog"
                                :instrucOptionCall="submodulo"
                                :instrucType="'modulo'"
                              />
                            </v-menu>
                            <!-- Menu para criação de arquivos-->
                            <v-menu
                              top="top"
                              width="300px"
                              origin="center center"
                              :offset-y="true"
                              transition="scale-transition"
                            >
                              <template v-slot:activator="{ on }">
                                <v-btn icon="icon" color="white" dark="dark" v-on="on">
                                  <v-icon>mdi-apps</v-icon>
                                </v-btn>
                              </template>

                              <MenuFiles
                                @dialogoption="openFileDialog"
                                :optionCall="submodulo"
                                :type="'modulo'"
                              />
                            </v-menu>
                            <!--Formulario para adição de conceito-->
                            <v-btn
                              icon="icon"
                              color="white"
                              @click="
                                setmodulo(submodulo);
                                dialog_conceito = true;
                              "
                            >
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>

                            <!--Formulario para edição do submodulo-->
                            <v-btn
                              icon="icon"
                              color="white"
                              @click="
                                readonly_control = true;
                                setsubmodulo(submodulo);
                                dialog_submodulo = true;
                              "
                            >
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <!--Função para excluir submódulo-->
                            <v-btn
                              icon="icon"
                              color="white"
                              @click="
                                readonly_control = true;
                                auxElementDelete = submodulo;
                                alertDelete = true;
                              "
                            >
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </div>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>
                    <!--FIM DO HEADER DO SUBMÓDULO-->

                    <v-expansion-panel-content>
                      <!--CONTENT DO SUBMODULO-->
                      <!--LISTAGEM DOS ARQUIVOS DOS SUBMÓULOS-->
                      <v-expansion-panels
                        v-model="vModelPanelArray[imodulo].submodulos[isubmodulo].mobilemedias"
                        multiple
                        :readonly="readonly_control"
                      >
                        <v-expansion-panel
                          v-for="(mobilemedia,
                          imobilemedia) in submodulo.mobilemedias"
                          :key="imobilemedia"
                          class="mt-2 mb-2"
                          :id="
                            mobilemedia.url.split('/')[3] +
                              mobilemedia.idmobilemedia
                          "
                        >
                          <v-expansion-panel-header
                            color="#A5A5A5"
                            style="color:white; height: 55px;"
                          >
                            <v-row>
                              <v-col class="d-flex align-center" style="height:100%;">
                                <div style="vertical-align:middle;" class="mt-3">
                                  <p>
                                    <v-icon color="white" large>
                                      {{
                                      fileTypesIcon[
                                      mobilemedia.fk_idmediatype.split(
                                      "/"
                                      )[4] - 1
                                      ]
                                      }}
                                    </v-icon>
                                    {{
                                    mobilemediaTypeLabel[
                                    parseInt(
                                    mobilemedia.fk_idmediatype.split(
                                    "/"
                                    )[4] - 1
                                    )
                                    ]
                                    }}
                                  </p>
                                </div>
                              </v-col>
                              <v-col cols="4" class="d-flex align-center justify-end">
                                <div class="d-flex justify-end mr-1 align-center">
                                  <!--Formulario para edição do arquivo/mobilemedia-->
                                  <v-btn
                                    icon="icon"
                                    color="white"
                                    @click="
                                      readonly_control = true;
                                      setmobilemedia(
                                        mobilemedia,
                                        submodulo,
                                        'submodulo'
                                      );
                                    "
                                  >
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-btn>
                                  <!--Função para excluir arquivo/mobilemedia-->
                                  <v-btn
                                    icon="icon"
                                    color="white"
                                    @click="
                                      readonly_control = true;
                                      auxElementDelete = mobilemedia;
                                      alertDelete = true;
                                    "
                                  >
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </div>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-header>

                          <v-expansion-panel-content>
                            <br />
                            <span v-if="mobilemedia.urllink">{{ mobilemedia.urllink }}</span>
                            <span v-if="mobilemedia.textfull" style="white-space: pre-line">
                              <strong>Texto completo:</strong>
                              <br />
                              {{ mobilemedia.textfull }}
                              <br />
                            </span>

                            <span v-if="mobilemedia.textshort" style="white-space: pre-line">
                              <strong>Texto resumido:</strong>
                              <br />
                              {{ mobilemedia.textshort }}
                            </span>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                      <!--FIM DA LISTAGEM DOS ARQUIVOS DOS SUBMÓULOS-->
                      <!--LISTAGEM DOS ELEMENTOS INSTRUCIONAIS DOS SUBMÓULOS-->
                      <v-expansion-panels
                        v-model="vModelPanelArray[imodulo].submodulos[isubmodulo].elementosinstrucionais"
                        multiple
                        :readonly="readonly_control"
                      >
                        <v-expansion-panel
                          v-for="(instrucelement,
                          iinstrucelement) in submodulo.instructionalelements"
                          :key="iinstrucelement"
                          class="mt-2 mb-2"
                          :id="
                            instrucelement.url.split('/')[3] +
                              instrucelement.idinstructionalelement
                          "
                        >
                          <v-expansion-panel-header
                            color="#A5A5A5"
                            style="color:white; height: 55px;"
                          >
                            <v-row>
                              <v-col class="d-flex align-center" style="height:100%;">
                                <div style="vertical-align:middle;" class="mt-3">
                                  <p>
                                    <v-icon color="white" large>
                                      {{
                                      instrucTypesIcon[
                                      instrucelement.fk_instructionalelementtype.split(
                                      "/"
                                      )[4] - 1
                                      ]
                                      }}
                                    </v-icon>
                                    <span
                                      v-if="instrucelement.label.length <= 40"
                                    >{{ instrucelement.label }}</span>
                                    <span v-else>{{ instrucelement.label.slice(0, 40) }}...</span>
                                  </p>
                                </div>
                              </v-col>
                              <v-col cols="4" class="d-flex align-center justify-end">
                                <div class="d-flex justify-end mr-1 align-center">
                                  <!--Formulario para edição dos ELEMENTOS INSTRUCIONAIS DOS SUBMÓULOS-->
                                  <v-btn
                                    icon="icon"
                                    color="white"
                                    @click="
                                      readonly_control = true;
                                      setinstructionalelement(
                                        instrucelement,
                                        submodulo,
                                        'submodulo'
                                      );
                                    "
                                  >
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-btn>
                                  <!--Função para excluir ELEMENTOS INSTRUCIONAIS DOS SUBMÓULOS-->
                                  <v-btn
                                    icon="icon"
                                    color="white"
                                    @click="
                                      readonly_control = true;
                                      auxElementDelete = instrucelement;
                                      alertDelete = true;
                                    "
                                  >
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </div>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-header>

                          <v-expansion-panel-content class="mt-2">
                            <span
                              v-if="instrucelement.fk_instructionalelementtype.split(
                          '/'
                          )[4] == 3"
                            >
                              <strong>Descrição da atividade</strong>
                              <br />
                              {{instrucelement.description}}
                            </span>
                            <hr
                              v-if="instrucelement.fk_instructionalelementtype.split(
                          '/'
                          )[4] == 3"
                            />
                            <span
                              v-if="instrucelement.fk_instructionalelementtype.split('/')[4] !== 4 && instrucelement.questions.length > 0"
                            >
                              <strong>Questões:</strong>
                              <br />
                            </span>
                            <hr class="mb-4" />
                            <div
                              v-for="(question, iquestion) in instrucelement.questions"
                              :key="iquestion"
                            >
                              <span>
                                <strong>{{question.orderquestion + 1}}) {{question.descriptionquestion}}</strong>
                              </span>
                              <p
                                v-if="question.typequestion.split(
                          '/'
                          )[4] == 1"
                              >
                                <span
                                  class="ml-3"
                                  v-for="(answer, ianswer) in question.answersalternatives"
                                  :key="ianswer"
                                >{{answer.idobjanswer}}) {{answer.answers}}</span>
                              </p>
                              <p v-else>
                                <span>{{question.descriptionquestion[0].correctanswer}}</span>
                              </p>
                            </div>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                      <!-- FIM DA LISTAGEM DOS ELEMENTOS INSTRUCIONAIS DOS SUBMÓULOS-->
                      <!--Panels dos conceitos adicionados dentro de submódulos-->
                      <v-expansion-panels
                        v-model="vModelPanelArray[imodulo].submodulos[isubmodulo].conceitos"
                        multiple
                        :readonly="readonly_control"
                      >
                        <v-expansion-panel
                          v-for="(conceito,
                          iconceitosubmodulo) in submodulo.concepts"
                          :key="iconceitosubmodulo"
                          class="mt-2 mb-2"
                          :id="conceito.url.split('/')[3] + conceito.idconcept"
                        >
                          <v-expansion-panel-header
                            color="#778899"
                            style="color:white; height: 55px;"
                          >
                            <!--HEADER DOS CONCEITOS DOS SUBMÓDULOS-->
                            <v-row>
                              <v-col class="d-flex align-center" style="width: 100%;">
                                <v-avatar color="white" size="38" class="mr-2">
                                  <span class="black--text" style="font-size:1.2em;">CC</span>
                                </v-avatar>
                                <div style="vertical-align:middle;">
                                  <p class="mt-3">
                                    <span
                                      v-if="conceito.nameconcept.length <= 40"
                                      style="font-size:1.2em;"
                                    >
                                      <strong>{{ conceito.nameconcept }}</strong>
                                    </span>
                                    <span v-else style="font-size:1.2em;">
                                      <strong>
                                        {{
                                        conceito.nameconcept.slice(0, 40)
                                        }}
                                      </strong>...
                                    </span>
                                  </p>
                                </div>
                              </v-col>
                              <v-col cols="4" class="d-flex justify-end mr-1">
                                <div style="vertical-align:middle;">
                                  <!--Menu para criação de elementos instrucionais dos conceitos adicionados dentro de submódulos-->
                                  <v-menu
                                    top="top"
                                    width="300px"
                                    origin="center center"
                                    :offset-y="true"
                                    transition="scale-transition"
                                  >
                                    <template v-slot:activator="{ on }">
                                      <v-btn icon="icon" color="white" dark="dark" v-on="on">
                                        <v-icon>mdi-text-box-plus-outline</v-icon>
                                      </v-btn>
                                    </template>

                                    <InstrucMenuFiles
                                      @instrucdialogoption="
                                        instrucOpenFileDialog
                                      "
                                      :instrucOptionCall="conceito"
                                      :instrucType="'conceito'"
                                    />
                                  </v-menu>

                                  <!-- Menu para criação de arquivos dos conceitos adicionados dentro de submódulos-->
                                  <v-menu
                                    top="top"
                                    width="300px"
                                    origin="center center"
                                    :offset-y="true"
                                    transition="scale-transition"
                                  >
                                    <template v-slot:activator="{ on }">
                                      <v-btn icon="icon" color="white" dark="dark" v-on="on">
                                        <v-icon>mdi-apps</v-icon>
                                      </v-btn>
                                    </template>

                                    <MenuFiles
                                      @dialogoption="openFileDialog"
                                      :optionCall="conceito"
                                      :type="'conceito'"
                                    />
                                  </v-menu>
                                  <!--Formulario para adição de itens de informação dos conceitos adicionados dentro de submódulos-->
                                  <v-menu
                                    top="top"
                                    width="300px"
                                    origin="center center"
                                    :offset-y="true"
                                    transition="scale-transition"
                                  >
                                    <template v-slot:activator="{ on }">
                                      <v-btn icon="icon" color="white" dark="dark" v-on="on">
                                        <v-icon>mdi-plus</v-icon>
                                      </v-btn>
                                    </template>
                                    <v-list>
                                      <v-list-item
                                        @click="
                                          setconceito(conceito, modulo);
                                          dialog_procedure = true;
                                        "
                                      >
                                        <v-list-item-title>Procedimento</v-list-item-title>
                                      </v-list-item>
                                    </v-list>
                                  </v-menu>
                                  <!--Formulario para edição dos conceitos adicionados dentro de submódulos-->
                                  <v-btn
                                    icon="icon"
                                    color="white"
                                    @click="
                                      readonly_control = true;
                                      setconceito(conceito, submodulo);
                                      dialog_conceito = true;
                                    "
                                  >
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-btn>
                                  <!--Função para excluir conceito-->
                                  <v-btn
                                    icon="icon"
                                    color="white"
                                    @click="
                                      readonly_control = true;
                                      auxElementDelete = conceito;
                                      alertDelete = true;
                                    "
                                  >
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </div>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-header>
                          <!--FIM DO HEADER DOS CONCEITOS DOS SUBMÓDULOS-->

                          <v-expansion-panel-content>
                            <!--INÍCIO DO CONTENT DOS CONCEITOS DOS SUBMÓDULOS-->
                            <!-- Listagem dos relacionamentos dos conceitos adicionados dentro de submódulos -->
                            <h3
                              class="mt-2"
                              v-if="conceito.sourceconcept.length > 0"
                            >Relacionamentos:</h3>
                            <v-simple-table v-if="conceito.sourceconcept.length > 0">
                              <template v-slot:default>
                                <thead>
                                  <tr>
                                    <th class="text-left">Conceito Alvo</th>
                                    <th class="text-left">Nome da Relação</th>
                                    <th class="text-left">Tipo da Relação</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="relacao in conceito.sourceconcept" :key="relacao.url">
                                    <td>
                                      {{
                                      findNameTarget(
                                      submodulo.concepts,
                                      relacao
                                      )
                                      }}
                                    </td>
                                    <td>{{ relacao.namereference }}</td>
                                    <td>
                                      {{
                                      findTipoRelation(
                                      relacao.fk_referencetype
                                      )
                                      }}
                                    </td>
                                  </tr>
                                </tbody>
                              </template>
                            </v-simple-table>
                            <!-- Listagem dos arquivos dos conceitos DOS SUBMÓDULOS-->
                            <v-expansion-panels
                              v-model="vModelPanelArray[imodulo].submodulos[isubmodulo].conceitos[iconceitosubmodulo].mobilemedias"
                              multiple
                              :readonly="readonly_control"
                            >
                              <v-expansion-panel
                                v-for="(mobilemedia,
                                imobilemedia) in mobileMediasInformationItem(
                                  conceito
                                )"
                                :key="imobilemedia"
                                class="mt-2 mb-2"
                                :id="
                                  mobilemedia.url.split('/')[3] +
                                    mobilemedia.idmobilemedia
                                "
                              >
                                <!--LISTAGEM DOS ARQUIVOS DOS CONCEITOS DOS SUBMODULOS -->
                                <v-expansion-panel-header
                                  color="#A5A5A5"
                                  style="color:white; height: 55px;"
                                >
                                  <v-row>
                                    <v-col class="d-flex align-center" style="height:100%;">
                                      <div style="vertical-align:middle;" class="mt-3">
                                        <p>
                                          <v-icon color="white" large>
                                            {{
                                            fileTypesIcon[
                                            mobilemedia.fk_idmediatype.split(
                                            "/"
                                            )[4] - 1
                                            ]
                                            }}
                                          </v-icon>
                                          {{
                                          mobilemediaTypeLabel[
                                          parseInt(
                                          mobilemedia.fk_idmediatype.split(
                                          "/"
                                          )[4] - 1
                                          )
                                          ]
                                          }}
                                        </p>
                                      </div>
                                    </v-col>
                                    <v-col cols="4" class="d-flex align-center justify-end">
                                      <div class="d-flex justify-end mr-1 align-center">
                                        <!--Formulario para edição do arquivo/mobilemedia-->
                                        <v-btn
                                          icon="icon"
                                          color="white"
                                          @click="
                                            readonly_control = true;
                                            setmobilemedia(
                                              mobilemedia,
                                              conceito,
                                              'conceito'
                                            );
                                          "
                                        >
                                          <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                        <!--Função para excluir arquivo/mobilemedia-->
                                        <v-btn
                                          icon="icon"
                                          color="white"
                                          @click="
                                            readonly_control = true;
                                            auxElementDelete = mobilemedia;
                                            alertDelete = true;
                                          "
                                        >
                                          <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                      </div>
                                    </v-col>
                                  </v-row>
                                </v-expansion-panel-header>

                                <v-expansion-panel-content>
                                  <br />
                                  <span v-if="mobilemedia.urllink">{{ mobilemedia.urllink }}</span>
                                  <span v-if="mobilemedia.textfull" style="white-space: pre-line">
                                    <strong>Texto completo:</strong>
                                    <br />
                                    {{mobilemedia.textfull}}
                                    <br />
                                  </span>

                                  <span v-if="mobilemedia.textshort" style="white-space: pre-line">
                                    <strong>Texto resumido:</strong>
                                    <br />
                                    {{mobilemedia.textshort}}
                                  </span>
                                </v-expansion-panel-content>
                              </v-expansion-panel>
                            </v-expansion-panels>
                            <!--FIM DA LISTAGEM DOS ARQUIVOS DOS CONCEITOS DOS SUBMODULOS -->
                            <!--LISTAGEM DOS PROCEDURES DOS CONCEITOS DOS SUBMÓDULOS-->
                            <v-expansion-panels
                              v-model="vModelPanelArray[imodulo].submodulos[isubmodulo].conceitos[iconceitosubmodulo].procedimentos"
                              multiple
                              :readonly="readonly_control"
                            >
                              <v-expansion-panel
                                v-for="(procedure,
                                iprocedure) in proceduresUnderConcept(conceito)"
                                :key="iprocedure"
                                class="mt-2 mb-2"
                                :id="
                                  procedure.url.split('/')[3] +
                                    procedure.idinformationitem
                                "
                              >
                                <v-expansion-panel-header
                                  color="#A5A5A5"
                                  style="color:white; height: 55px;"
                                >
                                  <v-row>
                                    <v-col>
                                      <p class="mt-3">
                                        <v-icon color="white" large>mdi-format-list-bulleted</v-icon>
                                        {{ procedure.nameinformationitem }}
                                      </p>
                                    </v-col>
                                    <v-col cols="4" class="d-flex justify-end mr-1">
                                      <!--Formulario para edição do procedure-->
                                      <v-btn
                                        class="mt-2"
                                        icon="icon"
                                        color="white"
                                        @click="
                                          readonly_control = true;
                                          setprocedimento(
                                            procedure,
                                            conceito,
                                            submodulo
                                          );
                                          dialog_procedure = true;
                                        "
                                      >
                                        <v-icon>mdi-pencil</v-icon>
                                      </v-btn>
                                      <!--Função para excluir arquivo/mobilemedia-->
                                      <v-btn
                                        class="mt-2"
                                        icon="icon"
                                        color="white"
                                        @click="
                                          readonly_control = true;
                                          auxElementDelete = procedure;
                                          alertDelete = true;
                                        "
                                      >
                                        <v-icon>mdi-delete</v-icon>
                                      </v-btn>
                                    </v-col>
                                  </v-row>
                                </v-expansion-panel-header>

                                <v-expansion-panel-content>
                                  <v-row
                                    class="mt-2 ml-1"
                                  >{{ procedure.descriptioninformationitem }}</v-row>
                                  <!--LISTAGEM DAS FASES DOS PROCEDURES DOS CONCEITOS DOS SUBMÓDULOS-->
                                  <h3 class="mt-2">Fases do procedimento:</h3>
                                  <v-simple-table>
                                    <template v-slot:default>
                                      <thead>
                                        <tr>
                                          <th class="text-left" style="width:160px;">Ordem da fase</th>
                                          <th class="text-left">Descrição</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr
                                          v-for="fase in procedure.phaseprocedures"
                                          :key="fase.url"
                                        >
                                          <td>{{ fase.order }}</td>
                                          <td>{{ fase.description }}</td>
                                        </tr>
                                      </tbody>
                                    </template>
                                  </v-simple-table>
                                  <!--FIM DA LISTAGEM DAS FASES DOS PROCEDURES DOS CONCEITOS DOS SUBMÓDULOS-->
                                </v-expansion-panel-content>
                              </v-expansion-panel>
                            </v-expansion-panels>
                            <!-- FIM DA LISTAGEM DOS PROCEDURES DOS CONCEITOS DOS SUBMÓDULOS -->
                            <!--LISTAGEM DOS ELEMENTOS INSTRUCIONAIS DOS CONCEITOS DOS SUBMÓDULOS-->
                            <v-expansion-panels
                              v-model="vModelPanelArray[imodulo].submodulos[isubmodulo].conceitos[iconceitosubmodulo].elementosinstrucionais"
                              multiple
                              :readonly="readonly_control"
                            >
                              <v-expansion-panel
                                v-for="(instrucelement,
                                iinstrucelement) in conceito.instructionalelements"
                                :key="iinstrucelement"
                                class="mt-2 mb-2"
                                :id="
                                  instrucelement.url.split('/')[3] +
                                    instrucelement.idinstructionalelement
                                "
                              >
                                <v-expansion-panel-header
                                  color="#A5A5A5"
                                  style="color:white; height: 55px;"
                                >
                                  <v-row>
                                    <v-col class="d-flex align-center" style="height:100%;">
                                      <div style="vertical-align:middle;" class="mt-3">
                                        <p>
                                          <v-icon color="white" large>
                                            {{
                                            instrucTypesIcon[
                                            instrucelement.fk_instructionalelementtype.split(
                                            "/"
                                            )[4] - 1
                                            ]
                                            }}
                                          </v-icon>
                                          <span
                                            v-if="
                                              instrucelement.label.length <= 40
                                            "
                                          >{{ instrucelement.label }}</span>
                                          <span v-else>
                                            {{
                                            instrucelement.label.slice(0, 40)
                                            }}...
                                          </span>
                                        </p>
                                      </div>
                                    </v-col>
                                    <v-col cols="4" class="d-flex align-center justify-end">
                                      <div class="d-flex justify-end mr-1 align-center">
                                        <!--Formulario para edição dos ELEMENTOS INSTRUCIONAIS  DOS CONCEITOS DOS SUBMÓDULOS-->
                                        <v-btn
                                          icon="icon"
                                          color="white"
                                          @click="
                                            readonly_control = true;
                                            setinstructionalelement(
                                              instrucelement,
                                              conceito,
                                              'conceito'
                                            );
                                          "
                                        >
                                          <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                        <!--Função para excluir ELEMENTOS INSTRUCIONAIS  DOS CONCEITOS DOS SUBMÓDULOS-->
                                        <v-btn
                                          icon="icon"
                                          color="white"
                                          @click="
                                            readonly_control = true;
                                            auxElementDelete = instrucelement;
                                            alertDelete = true;
                                          "
                                        >
                                          <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                      </div>
                                    </v-col>
                                  </v-row>
                                </v-expansion-panel-header>

                                <v-expansion-panel-content class="mt-2">
                                  <span
                                    v-if="instrucelement.fk_instructionalelementtype.split(
                          '/'
                          )[4] == 3"
                                  >
                                    <strong>Descrição da atividade</strong>
                                    <br />
                                    {{instrucelement.description}}
                                  </span>
                                  <hr
                                    v-if="instrucelement.fk_instructionalelementtype.split(
                          '/'
                          )[4] == 3"
                                  />
                                  <span
                                    v-if="instrucelement.fk_instructionalelementtype.split('/')[4] !== 4 && instrucelement.questions.length > 0"
                                  >
                                    <strong>Questões:</strong>
                                    <br />
                                  </span>
                                  <hr class="mb-4" />
                                  <div
                                    v-for="(question, iquestion) in instrucelement.questions"
                                    :key="iquestion"
                                  >
                                    <span>
                                      <strong>{{question.orderquestion + 1}}) {{question.descriptionquestion}}</strong>
                                    </span>
                                    <p
                                      v-if="question.typequestion.split(
                          '/'
                          )[4] == 1"
                                    >
                                      <span
                                        class="ml-3"
                                        v-for="(answer, ianswer) in question.answersalternatives"
                                        :key="ianswer"
                                      >{{answer.idobjanswer}}) {{answer.answers}}</span>
                                    </p>
                                    <p v-else>
                                      <span>{{question.descriptionquestion[0].correctanswer}}</span>
                                    </p>
                                  </div>
                                </v-expansion-panel-content>
                              </v-expansion-panel>
                            </v-expansion-panels>
                            <!-- FIM DA LISTAGEM DOS ELEMENTOS INSTRUCIONAIS DOS CONCEITOS DOS SUBMÓDULOS-->
                          </v-expansion-panel-content>
                          <!--FIM DO CONTENT DOS CONCEITOS DOS SUBMÓDULOS-->
                        </v-expansion-panel>
                      </v-expansion-panels>

                      <!--FIM DO CONTENT PANELS DOS SUBMÓDULOS-->
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>

                <!-- Panels dos Conceitos dos Módulos-->
                <v-expansion-panels
                  v-model="vModelPanelArray[imodulo].conceitos"
                  multiple
                  :readonly="readonly_control"
                >
                  <v-expansion-panel
                    v-for="(conceito, iconceitomodulo) in modulo.concepts"
                    :key="iconceitomodulo"
                    class="mt-2 mb-2"
                    :id="conceito.url.split('/')[3] + conceito.idconcept"
                  >
                    <v-expansion-panel-header color="#778899" style="color:white; height: 55px;">
                      <!--HEADER DOS CONCEITOS DOS MÓDULOS-->
                      <v-row>
                        <v-col class="d-flex align-center" style="width: 100%;">
                          <v-avatar color="white" size="38" class="mr-2">
                            <span class="black--text" style="font-size:1.2em;">CC</span>
                          </v-avatar>
                          <div style="vertical-align:middle;">
                            <p class="mt-3">
                              <span
                                v-if="conceito.nameconcept.length <= 40"
                                style="font-size:1.2em;"
                              >
                                <strong>{{ conceito.nameconcept }}</strong>
                              </span>
                              <span v-else style="font-size:1.2em;">
                                <strong>
                                  {{
                                  conceito.nameconcept.slice(0, 40)
                                  }}
                                </strong>...
                              </span>
                            </p>
                          </div>
                        </v-col>
                        <v-col cols="4" class="d-flex justify-end mr-1">
                          <div style="vertical-align:middle;">
                            <!--Menu para criação de elementos instrucionais dos conceitos adicionados dentro de submódulos-->
                            <v-menu
                              top="top"
                              width="300px"
                              origin="center center"
                              :offset-y="true"
                              transition="scale-transition"
                            >
                              <template v-slot:activator="{ on }">
                                <v-btn icon="icon" color="white" dark="dark" v-on="on">
                                  <v-icon>mdi-text-box-plus-outline</v-icon>
                                </v-btn>
                              </template>

                              <InstrucMenuFiles
                                @instrucdialogoption="instrucOpenFileDialog"
                                :instrucOptionCall="conceito"
                                :instrucType="'conceito'"
                              />
                            </v-menu>
                            <!-- Menu para criação de arquivos dos conceitos dos modulos-->
                            <v-menu
                              top="top"
                              width="300px"
                              origin="center center"
                              :offset-y="true"
                              transition="scale-transition"
                            >
                              <template v-slot:activator="{ on }">
                                <v-btn icon="icon" color="white" dark="dark" v-on="on">
                                  <v-icon>mdi-apps</v-icon>
                                </v-btn>
                              </template>

                              <MenuFiles
                                @dialogoption="openFileDialog"
                                :optionCall="conceito"
                                :type="'conceito'"
                              />
                            </v-menu>
                            <!--Formulario para adição de itens de informação dos conceitos dos modulos-->
                            <v-menu
                              top="top"
                              width="300px"
                              origin="center center"
                              :offset-y="true"
                              transition="scale-transition"
                            >
                              <template v-slot:activator="{ on }">
                                <v-btn icon="icon" color="white" dark="dark" v-on="on">
                                  <v-icon>mdi-plus</v-icon>
                                </v-btn>
                              </template>

                              <v-list>
                                <v-list-item
                                  @click="
                                    setconceito(conceito, modulo);
                                    dialog_procedure = true;
                                  "
                                >
                                  <v-list-item-title>Procedimento</v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                            <!--Formulario para edição do conceito-->
                            <v-btn
                              icon="icon"
                              color="white"
                              @click="
                                readonly_control = true;
                                setconceito(conceito, modulo);
                                dialog_conceito = true;
                              "
                            >
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <!--Função para excluir conceito-->
                            <v-btn
                              icon="icon"
                              color="white"
                              @click="
                                readonly_control = true;
                                auxElementDelete = conceito;
                                alertDelete = true;
                              "
                            >
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </div>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>
                    <!--FIM DO HEADER DOS CONCEITOS DOS MÓDULOS-->

                    <v-expansion-panel-content>
                      <!-- Listagem dos relacionamentos do conceito dos módulos -->
                      <h3 class="mt-2" v-if="conceito.sourceconcept.length > 0">Relacionamentos:</h3>
                      <v-simple-table v-if="conceito.sourceconcept.length > 0">
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">Conceito Alvo</th>
                              <th class="text-left">Nome da Relação</th>
                              <th class="text-left">Tipo da Relação</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="relacao in conceito.sourceconcept" :key="relacao.url">
                              <td>{{ findNameTarget(modulo.concepts, relacao) }}</td>
                              <td>{{ relacao.namereference }}</td>
                              <td>{{ findTipoRelation(relacao.fk_referencetype) }}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>

                      <!--LISTAGEM DOS ARQUIVOS DOS CONCEITOS DOS MÓDULOS-->
                      <v-expansion-panels
                        v-model="vModelPanelArray[imodulo].conceitos[iconceitomodulo].mobilemedias"
                        multiple
                        :readonly="readonly_control"
                      >
                        <v-expansion-panel
                          v-for="(mobilemedia,
                          imobilemedia) in mobileMediasInformationItem(
                            conceito
                          )"
                          :key="imobilemedia"
                          class="mt-2 mb-2"
                          :id="
                            mobilemedia.url.split('/')[3] +
                              mobilemedia.idmobilemedia
                          "
                        >
                          <v-expansion-panel-header
                            color="#A5A5A5"
                            style="color:white; height: 55px;"
                          >
                            <v-row>
                              <v-col class="d-flex align-center" style="height:100%;">
                                <div style="vertical-align:middle;" class="mt-3">
                                  <p>
                                    <v-icon color="white" large>
                                      {{
                                      fileTypesIcon[
                                      mobilemedia.fk_idmediatype.split(
                                      "/"
                                      )[4] - 1
                                      ]
                                      }}
                                    </v-icon>
                                    {{
                                    mobilemediaTypeLabel[
                                    parseInt(
                                    mobilemedia.fk_idmediatype.split(
                                    "/"
                                    )[4] - 1
                                    )
                                    ]
                                    }}
                                  </p>
                                </div>
                              </v-col>
                              <v-col cols="4" class="d-flex align-center justify-end">
                                <div class="d-flex justify-end mr-1 align-center">
                                  <!--Formulario para edição do arquivo/mobilemedia-->
                                  <v-btn
                                    icon="icon"
                                    color="white"
                                    @click="
                                      readonly_control = true;
                                      setmobilemedia(
                                        mobilemedia,
                                        conceito,
                                        'conceito'
                                      );
                                    "
                                  >
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-btn>
                                  <!--Função para excluir arquivo/mobilemedia-->
                                  <v-btn
                                    icon="icon"
                                    color="white"
                                    @click="
                                      readonly_control = true;
                                      auxElementDelete = mobilemedia;
                                      alertDelete = true;
                                    "
                                  >
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </div>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-header>

                          <v-expansion-panel-content>
                            <br />
                            <span v-if="mobilemedia.urllink">{{ mobilemedia.urllink }}</span>
                            <span v-if="mobilemedia.textfull" style="white-space: pre-line">
                              <strong>Texto completo:</strong>
                              <br />
                              {{ mobilemedia.textfull }}
                              <br />
                            </span>

                            <span v-if="mobilemedia.textshort" style="white-space: pre-line">
                              <strong>Texto resumido:</strong>
                              <br />
                              {{ mobilemedia.textshort }}
                            </span>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                      <!-- FIM DA LISTAGEM DOS ARQUIVOS DOS CONCEITOS DOS MÓDULOS -->

                      <!--LISTAGEM DOS PROCEDURES DOS CONCEITOS DOS MÓDULOS-->
                      <v-expansion-panels
                        v-model="vModelPanelArray[imodulo].conceitos[iconceitomodulo].procedimentos"
                        multiple
                        :readonly="readonly_control"
                      >
                        <v-expansion-panel
                          v-for="(procedure,
                          iprocedure) in proceduresUnderConcept(conceito)"
                          :key="iprocedure"
                          class="mt-2 mb-2"
                          :id="
                            procedure.url.split('/')[3] +
                              procedure.idinformationitem
                          "
                        >
                          <v-expansion-panel-header
                            color="#A5A5A5"
                            style="color:white; height: 55px;"
                          >
                            <v-row>
                              <v-col>
                                <p class="mt-3">
                                  <v-icon color="white" large>mdi-format-list-bulleted</v-icon>
                                  {{ procedure.nameinformationitem }}
                                </p>
                              </v-col>
                              <v-col cols="4" class="d-flex justify-end mr-1">
                                <!--Formulario para edição do procedure-->
                                <v-btn
                                  class="mt-2"
                                  icon="icon"
                                  color="white"
                                  @click="
                                    readonly_control = true;
                                    setprocedimento(
                                      procedure,
                                      conceito,
                                      modulo
                                    );
                                    dialog_procedure = true;
                                  "
                                >
                                  <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <!--Função para excluir arquivo/mobilemedia-->
                                <v-btn
                                  class="mt-2"
                                  icon="icon"
                                  color="white"
                                  @click="
                                    readonly_control = true;
                                    auxElementDelete = procedure;
                                    alertDelete = true;
                                  "
                                >
                                  <v-icon>mdi-delete</v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-header>

                          <v-expansion-panel-content>
                            <v-row class="mt-2 ml-1">{{ procedure.descriptioninformationitem }}</v-row>

                            <!--LISTAGEM DAS FASES DOS PROCEDURES DOS CONCEITOS DOS MÓDULOS-->
                            <h3 class="mt-2">Fases do procedimento:</h3>
                            <v-simple-table>
                              <template v-slot:default>
                                <thead>
                                  <tr>
                                    <th class="text-left" style="width:160px;">Ordem da fase</th>
                                    <th class="text-left">Descrição</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="fase in procedure.phaseprocedures" :key="fase.url">
                                    <td>{{ fase.order }}</td>
                                    <td>{{ fase.description }}</td>
                                  </tr>
                                </tbody>
                              </template>
                            </v-simple-table>
                            <!--FIM DA LISTAGEM DAS FASES DOS PROCEDURES DOS CONCEITOS DOS MÓDULOS-->
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                      <!-- FIM DA LISTAGEM DOS PROCEDURES DOS CONCEITOS DOS MÓDULOS -->
                      <!--LISTAGEM DOS ELEMENTOS INSTRUCIONAIS DOS CONCEITOS DOS MÓDULOS-->
                      <v-expansion-panels
                        v-model="vModelPanelArray[imodulo].conceitos[iconceitomodulo].elementosinstrucionais"
                        multiple
                        :readonly="readonly_control"
                      >
                        <v-expansion-panel
                          v-for="(instrucelement,
                          iinstrucelement) in conceito.instructionalelements"
                          :key="iinstrucelement"
                          class="mt-2 mb-2"
                          :id="
                            instrucelement.url.split('/')[3] +
                              instrucelement.idinstructionalelement
                          "
                        >
                          <v-expansion-panel-header
                            color="#A5A5A5"
                            style="color:white; height: 55px;"
                          >
                            <v-row>
                              <v-col class="d-flex align-center" style="height:100%;">
                                <div style="vertical-align:middle;" class="mt-3">
                                  <p>
                                    <v-icon color="white" large>
                                      {{
                                      instrucTypesIcon[
                                      instrucelement.fk_instructionalelementtype.split(
                                      "/"
                                      )[4] - 1
                                      ]
                                      }}
                                    </v-icon>
                                    <span
                                      v-if="instrucelement.label.length <= 40"
                                    >{{ instrucelement.label }}</span>
                                    <span v-else>{{ instrucelement.label.slice(0, 40) }}...</span>
                                  </p>
                                </div>
                              </v-col>
                              <v-col cols="4" class="d-flex align-center justify-end">
                                <div class="d-flex justify-end mr-1 align-center">
                                  <!--Formulario para edição dos ELEMENTOS INSTRUCIONAIS DOS CONCEITOS DOS MÓDULOS-->
                                  <v-btn
                                    icon="icon"
                                    color="white"
                                    @click="
                                      readonly_control = true;
                                      setinstructionalelement(
                                        instrucelement,
                                        conceito,
                                        'conceito'
                                      );
                                    "
                                  >
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-btn>
                                  <!--Função para excluir ELEMENTOS INSTRUCIONAIS DOS CONCEITOS DOS MÓDULOS-->
                                  <v-btn
                                    icon="icon"
                                    color="white"
                                    @click="
                                      readonly_control = true;
                                      auxElementDelete = instrucelement;
                                      alertDelete = true;
                                    "
                                  >
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </div>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-header>

                          <v-expansion-panel-content class="mt-2">
                            <span
                              v-if="instrucelement.fk_instructionalelementtype.split(
                          '/'
                          )[4] == 3"
                            >
                              <strong>Descrição da atividade</strong>
                              <br />
                              {{instrucelement.description}}
                            </span>
                            <hr
                              v-if="instrucelement.fk_instructionalelementtype.split(
                          '/'
                          )[4] == 3"
                            />
                            <span
                              v-if="instrucelement.fk_instructionalelementtype.split('/')[4] !== 4 && instrucelement.questions.length > 0"
                            >
                              <strong>Questões:</strong>
                              <br />
                            </span>
                            <hr class="mb-4" />
                            <div
                              v-for="(question, iquestion) in instrucelement.questions"
                              :key="iquestion"
                            >
                              <span>
                                <strong>{{question.orderquestion + 1}}) {{question.descriptionquestion}}</strong>
                              </span>
                              <p
                                v-if="question.typequestion.split(
                          '/'
                          )[4] == 1"
                              >
                                <span
                                  class="ml-3"
                                  v-for="(answer, ianswer) in question.answersalternatives"
                                  :key="ianswer"
                                >{{answer.idobjanswer}}) {{answer.answers}}</span>
                              </p>
                              <p v-else>
                                <span>{{question.descriptionquestion[0].correctanswer}}</span>
                              </p>
                            </div>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                      <!-- FIM DA LISTAGEM DOS ELEMENTOS INSTRUCIONAIS  DOS CONCEITOS DOS MÓDULOS-->
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <!-- FIM DOS PANELS DOS CONCEITOS DOS MÓDULOS-->
              </v-expansion-panel-content>
              <!--FIM DO CONTENT DO MÓDULO-->
            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-content>
        <!--FIM DO CONTENT DO DOMÍNIO-->
      </v-expansion-panel>
    </v-expansion-panels>
    <div class="text-center">
      <v-dialog v-model="alertDelete" width="500" persistent="persistent">
        <v-card>
          <v-card-title class="headline red" primary-title style="color:white;">ALERTA!</v-card-title>
          <v-card-text
            class="mt-3"
            style="font-size: 1.3em;"
          >Tem certeza que deseja apagar esse elemento?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="primary" @click="deleteelemento(auxElementDelete)">Sim</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              dark
              @click="
                auxElementDelete = '';
                alertDelete = false;
              "
            >Não</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="text-center">
      <v-dialog v-model="dialogLoading" max-width="290" persistent="persistent">
        <v-card color="primary" dark>
          <v-card-text style="color:white;">
            <v-row class="pt-2 pb-3">
              <br />
              <v-spacer></v-spacer>
              <span style="font-size: 1.3em; color:white;">{{ dialogLoadingMessage }}</span>
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
  </v-row>
</template>

<script>
import DominioDialog from "./concept_model/DominioDialog";
import ModuloDialog from "./concept_model/ModuloDialog";
import SubModuloDialog from "./concept_model/SubModuloDialog";
import ConceitoDialog from "./concept_model/ConceitoDialog";
import ImageDialog from "./instructional_model/ImageDialog";
import VideoDialog from "./instructional_model/VideoDialog";
import AudioDialog from "./instructional_model/AudioDialog";
import TextDialog from "./instructional_model/TextDialog";
import LinkDialog from "./instructional_model/LinkDialog";
import MenuFiles from "./MenuFiles";
import ProcedureDialog from "./instructional_model/ProcedureDialog";
import InstrucMenuFiles from "./InstrucMenuFiles";
import AvaliacaoDialog from "./instructional_model/AvaliacaoDialog";
import AtividadeColaborativaDialog from "./instructional_model/AtividadeColaborativaDialog";
import ExemploDialog from "./instructional_model/ExemploDialog";
import DidaticMenuFiles from "./DidaticMenuFiles";
import VisibleDialog from "./didatic_model/VisibleDialog";
import PriorKnowledgeDialog from "./didatic_model/PriorKnowledgeDialog";
import PriorKnowledgeDialogConcept from "./didatic_model/PriorKnowledgeDialogConcept";
import AssessmentParameterDialog from "./didatic_model/AssessmentParameterDialog";
import firebase from "firebase/app";
import Api from "@/services/Api";
export default {
  name: "Panels",
  components: {
    ModuloDialog,
    DominioDialog,
    SubModuloDialog,
    ConceitoDialog,
    ImageDialog,
    VideoDialog,
    AudioDialog,
    TextDialog,
    LinkDialog,
    MenuFiles,
    ProcedureDialog,
    InstrucMenuFiles,
    AvaliacaoDialog,
    AtividadeColaborativaDialog,
    ExemploDialog,
    DidaticMenuFiles,
    VisibleDialog,
    PriorKnowledgeDialog,
    PriorKnowledgeDialogConcept,
    AssessmentParameterDialog,
  },
  props: [
    "dominio",
    "objectTreeView",
    "dialog_knowledgedomain",
    "dialog_module",
    "dialog_submodule",
    "dialog_concept",
    "dialog_proceduretree",
    "dialog_mobilemediatree",
    "dialog_elementoinstrucionaltree",
    "dialog_instructionalelementtree",
    "elementToScroll",
  ],
  data: () => ({
    dialogLoading: false,
    dialogLoadingMessage: "Carregando o domínio",
    dialogLoadingMessages: [
      "Carregando o domínio",
      "Salvando o elemento",
      "Excluindo o elemento",
      "Carregando informações do modelo didático",
    ],
    readonly_control: false,
    vModelPanelDomain: [0],
    vModelPanelArray: [],
    vModelPanelModules: [],
    vModelPanelMobilemediasDomain: [],
    vModelPanelInstrucsDomain: [],
    itemsMenuNewModulo: [
      {
        type: "Conceito",
      },
      {
        type: "Submódulo",
      },
    ],
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
    enableOpenPanels: 0,
    disableBtnDidatic: true,
    auxElementDelete: "",
    alertDelete: false,
    objectFile: {},
    type: "",
    instrucObjectFile: {},
    instrucType: "",
    instrucValueType: "",
    modulo: "",
    submodulo: "",
    conceito: "",
    mobilemedia: "",
    procedimento: "",
    elementoinstrucional: "",
    dialog_modulo: false,
    dialog_submodulo: false,
    dialog_conceito: false,
    dialog_dominio: false,
    dialog_imagem: false,
    dialog_video: false,
    dialog_audio: false,
    dialog_texto: false,
    dialog_link: false,
    dialog_procedure: false,
    dialog_avaliacao: false,
    dialog_atividadecolaborativa: false,
    dialog_exemplo: false,
    dialog_visible: false,
    dialog_assessment: false,
    dialog_prior: false,
    dialog_priorConcept: false,
    select: null,
    checkbox: false,
    /*ATRIBUTOS DO DOMINIO*/
    dominio_data: {},
  }),
  mounted: function () {
    var vm = this;
    this.dialogLoading = true;
    setTimeout(function () {
      vm.dialogLoading = false;
    }, 2000);
  },
  watch: {
    dominio: function () {
      this.setDomainVariables(this.dominio);
      this.getVModelsPanelsArrays(this.dominio);
      if (this.dominio.modules.length > 0) {
        this.disableBtnDidatic = false;
      } else {
        this.disableBtnDidatic = true;
      }
    },
    dialog_knowledgedomain: function () {
      if (this.dialog_knowledgedomain === true) {
        this.dialog_dominio = this.dialog_knowledgedomain;
      }
    },
    dialog_module: function () {
      if (this.dialog_module === true) {
        var vm = this;
        this.dialog_modulo = this.dialog_module;
        Api()
          .patch(this.objectTreeView.url, {})
          .then(function (resposta) {
            vm.modulo = resposta.data;
          });
      }
    },
    dialog_submodule: function () {
      if (this.dialog_submodule === true) {
        var vm = this;
        this.dialog_submodulo = this.dialog_submodule;
        Api()
          .patch(
            this.objectTreeView.url.substr(
              0,
              this.objectTreeView.url.length - 3
            ),
            {}
          )
          .then(function (resposta) {
            vm.submodulo = resposta.data;
          });
      }
    },
    dialog_concept: function () {
      if (this.dialog_concept === true) {
        var vm = this;
        this.dialog_conceito = this.dialog_concept;
        Api()
          .patch(this.objectTreeView.url, {})
          .then(function (resposta) {
            vm.conceito = resposta.data;
            Api()
              .patch(resposta.data.fk_idmodule, {})
              .then(function (resposta2) {
                vm.modulo = resposta2.data;
              });
          });
      }
    },
    dialog_proceduretree: function () {
      if (this.dialog_proceduretree === true) {
        var vm = this;
        this.dialog_procedure = this.dialog_proceduretree;
        Api()
          .patch(this.objectTreeView.url, {})
          .then(function (resposta) {
            vm.procedimento = resposta.data;
            Api()
              .patch(resposta.data.fk_idconcept, {})
              .then(function (resposta2) {
                vm.conceito = resposta2.data;
                Api()
                  .patch(resposta2.data.fk_idmodule, {})
                  .then(function (resposta3) {
                    vm.modulo = resposta3.data;
                  });
              });
          });
      }
    },
    dialog_mobilemediatree: function () {
      if (this.dialog_mobilemediatree === true) {
        var vm = this;
        Api()
          .patch(this.objectTreeView.url, {})
          .then(function (resposta) {
            if (resposta.data.fk_idknowledgedomain) {
              vm.setmobilemedia(resposta.data, vm.dominio, "dominio");
            } else if (resposta.data.fk_module) {
              Api()
                .patch(resposta.data.fk_module, {})
                .then(function (resposta2) {
                  vm.setmobilemedia(resposta.data, resposta2.data, "modulo");
                });
            } else if (resposta.data.fk_idconcept) {
              Api()
                .patch(resposta.data.fk_idconcept, {})
                .then(function (resposta2) {
                  vm.setmobilemedia(resposta.data, resposta2.data, "conceito");
                });
            }
          });
      }
    },
    dialog_instructionalelementtree: function () {
      if (this.dialog_instructionalelementtree === true) {
        var vm = this;
        Api()
          .patch(this.objectTreeView.url, {})
          .then(function (resposta) {
            if (resposta.data.fk_idknowledgedomain) {
              vm.setinstructionalelement(resposta.data, vm.dominio, "dominio");
            } else if (resposta.data.fk_module) {
              Api()
                .patch(resposta.data.fk_module, {})
                .then(function (resposta2) {
                  vm.setinstructionalelement(
                    resposta.data,
                    resposta2.data,
                    "modulo"
                  );
                });
            } else if (resposta.data.fk_idconcept) {
              Api()
                .patch(resposta.data.fk_idconcept, {})
                .then(function (resposta2) {
                  vm.setinstructionalelement(
                    resposta.data,
                    resposta2.data,
                    "conceito"
                  );
                });
            }
          });
      }
    },
    elementToScroll: function () {
      //Função criada para inserir key do panel do elemento acionado pela treeview dentro de seu respectivo v-model panel
      //Após isso é acionado um scroll movendo a tela até a posição do elemento
      if (this.elementToScroll) {
        var auxQuerySelector =
          "#" +
          this.elementToScroll.url.split("/")[3] +
          this.elementToScroll.url.split("/")[4];
        if (this.elementToScroll.type === "module") {
          this.vModelPanelModules.push(this.elementToScroll.indexPanel);
        } else if (this.elementToScroll.type === "submodule") {
          this.vModelPanelArray.push(this.elementToScroll.fatherObj.modulo);
          this.vModelPanelArray[
            this.elementToScroll.fatherObj.modulo
          ].submodulos.push(this.elementToScroll.indexPanel);
        } else if (this.elementToScroll.type === "concept") {
          if (this.elementToScroll.panelFather === "module") {
            this.vModelPanelModules.push(this.elementToScroll.fatherObj.modulo);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].conceitos.push(this.elementToScroll.indexPanel);
          } else if (this.elementToScroll.panelFather === "submodule") {
            this.vvModelPanelModules.push(
              this.elementToScroll.fatherObj.modulo
            );
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].submodulos.push(this.elementToScroll.fatherObj.submodulo);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].submodulos[
              this.elementToScroll.fatherObj.submodulo
            ].conceitos.push(this.elementToScroll.indexPanel);
          }
        } else if (this.elementToScroll.type === "mobilemedia") {
          if (this.elementToScroll.panelFather === "domain") {
            this.vModelPanelMobilemediasDomain.push(
              this.elementToScroll.indexPanel
            );
          } else if (this.elementToScroll.panelFather === "module") {
            this.vModelPanelModules.push(this.elementToScroll.fatherObj.modulo);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].mobilemedias.push(this.elementToScroll.indexPanel);
          } else if (this.elementToScroll.panelFather === "submodule") {
            this.vModelPanelModules.push(this.elementToScroll.fatherObj.modulo);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].submodulos.push(this.elementToScroll.fatherObj.submodulo);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].submodulos[
              this.elementToScroll.fatherObj.submodulo
            ].mobilemedias.push(this.elementToScroll.indexPanel);
          } else if (this.elementToScroll.panelFather === "conceptmodule") {
            this.vModelPanelModules.push(this.elementToScroll.fatherObj.modulo);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].conceitos[
              this.elementToScroll.fatherObj.conceito
            ].mobilemedias.push(this.elementToScroll.indexPanel);
          } else if (this.elementToScroll.panelFather === "conceptsubmodule") {
            this.vModelPanelModules.push(this.elementToScroll.fatherObj.modulo);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].submodulos.push(this.elementToScroll.fatherObj.submodulo);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].submodulos[this.elementToScroll.fatherObj.submodulo].conceitos[
              this.elementToScroll.fatherObj.conceito
            ].mobilemedias.push(this.elementToScroll.indexPanel);
          }
        } else if (this.elementToScroll.type === "instructionalelement") {
          if (this.elementToScroll.panelFather === "domain") {
            this.vModelPanelInstrucsDomain.push(
              this.elementToScroll.indexPanel
            );
          } else if (this.elementToScroll.panelFather === "module") {
            this.vModelPanelModules.push(this.elementToScroll.fatherObj.modulo);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].elementosinstrucionais.push(this.elementToScroll.indexPanel);
          } else if (this.elementToScroll.panelFather === "submodule") {
            this.vModelPanelModules.push(this.elementToScroll.fatherObj.modulo);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].submodulos.push(this.elementToScroll.fatherObj.submodulo);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].submodulos[
              this.elementToScroll.fatherObj.submodulo
            ].elementosinstrucionais.push(this.elementToScroll.indexPanel);
          } else if (this.elementToScroll.panelFather === "conceptmodule") {
            this.vModelPanelModules.push(this.elementToScroll.fatherObj.modulo);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].conceitos.push(this.elementToScroll.fatherObj.conceito);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].conceitos[
              this.elementToScroll.fatherObj.conceito
            ].elementosinstrucionais.push(this.elementToScroll.indexPanel);
          } else if (this.elementToScroll.panelFather === "conceptsubmodule") {
            this.vModelPanelModules.push(this.elementToScroll.fatherObj.modulo);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].submodulos.push(this.elementToScroll.fatherObj.submodulo);

            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].submodulos[
              this.elementToScroll.fatherObj.submodulo
            ].conceitos.push(this.elementToScroll.fatherObj.conceito);

            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].submodulos[this.elementToScroll.fatherObj.submodulo].conceitos[
              this.elementToScroll.fatherObj.conceito
            ].elementosinstrucionais.push(this.elementToScroll.indexPanel);
          }
        } else if (this.elementToScroll.type === "informationitem") {
          if (this.elementToScroll.panelFather === "conceptmodule") {
            this.vModelPanelArray.push(this.elementToScroll.fatherObj.modulo);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].conceitos.push(this.elementToScroll.fatherObj.conceito);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].conceitos[
              this.elementToScroll.fatherObj.conceito
            ].procedimentos.push(this.elementToScroll.indexPanel);
          } else if (this.elementToScroll.panelFather === "conceptsubmodule") {
            this.vModelPanelArray.push(this.elementToScroll.fatherObj.modulo);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].submodulos.push(this.elementToScroll.fatherObj.submodulo);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].submodulos[
              this.elementToScroll.fatherObj.submodulo
            ].conceitos.push(this.elementToScroll.fatherObj.conceito);
            this.vModelPanelArray[
              this.elementToScroll.fatherObj.modulo
            ].submodulos[this.elementToScroll.fatherObj.submodulo].conceitos[
              this.elementToScroll.fatherObj.conceito
            ].procedimentos.push(this.elementToScroll.indexPanel);
          }
        }
        this.$vuetify.goTo(auxQuerySelector, {
          duration: 1000,
          offset: 0,
          easing: "easeInOutCubic",
        });
      }
    },
  },
  computed: {
    nomeDominioPanel: function () {
      return this.domainName;
    },
  },
  methods: {
    addVModelsPanels(panelType, element, fatherType, father) {
      var index = "";
      if (panelType === "modulo") {
        this.vModelPanelArray.push({
          submodulos: [],
          conceitos: [],
          mobilemedias: [],
          elementosinstrucionais: [],
        });
      } else if (panelType === "submodulo") {
        index = this.vModelPanelArray.findIndex(
          (x) => x.url === element.fk_idmodule
        );
        this.vModelPanelArray[index].submodulos.push({
          url: element.url,
          conceitos: [],
          mobilemedias: [],
          elementosinstrucionais: [],
        });
      } else if (panelType === "conceito") {
        if (fatherType === "submodulo") {
          index = this.vModelPanelArray.findIndex(
            (x) => x.url === father.fk_idmodule
          );
          var index2 = this.vModelPanelArray[index].submodulos.findIndex(
            (x) => x.url === father.url
          );
          this.vModelPanelArray[index].submodulos[index2].conceitos.push({
            url: element.url,
            conceitos: [],
            mobilemedias: [],
            elementosinstrucionais: [],
          });
        } else if (fatherType === "modulo") {
          index = this.vModelPanelArray.findIndex(
            (x) => x.url === element.fk_idmodule
          );
          this.vModelPanelArray[index].conceitos.push({
            url: element.url,
            conceitos: [],
            mobilemedias: [],
            elementosinstrucionais: [],
          });
        }
      }
    },
    getVModelsPanelsArrays(dominio) {
      //Função para criação de arrays dos v-models de todos os panels
      var auxmodulo = -1;
      dominio.modules.forEach((modulo) => {
        if (modulo.fk_idmodule === null) {
          auxmodulo++;
          this.vModelPanelArray.push({
            url: modulo.url,
            submodulos: [],
            conceitos: [],
            mobilemedias: [],
            elementosinstrucionais: [],
          });
          modulo.submodules.forEach((submodulo, isubmodulo) => {
            this.vModelPanelArray[auxmodulo].submodulos.push({
              url: submodulo.url,
              conceitos: [],
              mobilemedias: [],
              elementosinstrucionais: [],
            });
            submodulo.concepts.forEach((conceito) => {
              this.vModelPanelArray[auxmodulo].submodulos[
                isubmodulo
              ].conceitos.push({
                url: conceito.url,
                procedimentos: [],
                mobilemedias: [],
                elementosinstrucionais: [],
              });
            });
          });
          modulo.concepts.forEach((conceito) => {
            this.vModelPanelArray[auxmodulo].conceitos.push({
              url: conceito.url,
              procedimentos: [],
              mobilemedias: [],
              elementosinstrucionais: [],
            });
          });
        }
      });
    },
    validate() {
      if (
        this.domainName &&
        this.domainContentTitle &&
        this.domainAuthorsName
      ) {
        this.putDominio();
        this.dialog_dominio = false;
      }
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    reset() {
      this.dialog_dominio = false;
      this.setDomainVariables();
    },
    setDomainVariables(dominio_data) {
      this.dominio_data = dominio_data;
      this.$emit("dominio_data", this.dominio_data);
    },
    getDominio() {
      this.readonly_control = false;
      this.dialogLoading = true;
      var vm = this;
      Api()
        .patch(
          "/knowledgedomain/" + this.dominio_data.idknowledgedomain + "/",
          {}
        )
        .then(function (resposta) {
          vm.setDomainVariables(resposta.data);
          vm.dialogLoading = false;
        });
    },
    close_or_save_dominio() {
      this.readonly_control = false;
      this.dialog_dominio = !this.dialog_dominio;
      this.controlTreeView("dominio");
    },
    setmodulo(value) {
      this.modulo = value;
    },
    setsubmodulo(value) {
      this.submodulo = value;
    },
    setconceito(value, value2) {
      this.modulo = value2;
      this.conceito = value;
    },
    setprocedimento(value, value2, value3) {
      this.procedimento = value;
      this.conceito = value2;
      this.modulo = value3;
    },
    setmobilemedia(valueMobileMedia, valueOptionCall, valueType) {
      this.mobilemedia = valueMobileMedia;
      this.objectFile = valueOptionCall;
      this.type = valueType;
      if (
        valueMobileMedia.fk_idmediatype ===
        Api().defaults.baseURL + `mediatype/1/`
      ) {
        this.dialog_imagem = true;
      } else if (
        valueMobileMedia.fk_idmediatype ===
        Api().defaults.baseURL + `mediatype/2/`
      ) {
        this.dialog_video = true;
      } else if (
        valueMobileMedia.fk_idmediatype ===
        Api().defaults.baseURL + `mediatype/3/`
      ) {
        this.dialog_audio = true;
      } else if (
        valueMobileMedia.fk_idmediatype ===
        Api().defaults.baseURL + `mediatype/4/`
      ) {
        this.dialog_texto = true;
      } else if (
        valueMobileMedia.fk_idmediatype ===
        Api().defaults.baseURL + `mediatype/5/`
      ) {
        this.dialog_link = true;
      }
    },
    setinstructionalelement(
      valueInstructionalElement,
      instrucValueOptionCall,
      instrucType
    ) {
      this.elementoinstrucional = valueInstructionalElement;
      this.instrucObjectFile = instrucValueOptionCall;
      this.instrucType = instrucType;
      this.instrucValueType = valueInstructionalElement.fk_instructionalelementtype.split(
        "/"
      )[4];
      if (
        valueInstructionalElement.fk_instructionalelementtype ===
        Api().defaults.baseURL + `instrucelementtype/1/`
      ) {
        this.dialog_avaliacao = true;
      } else if (
        valueInstructionalElement.fk_instructionalelementtype ===
        Api().defaults.baseURL + `instrucelementtype/2/`
      ) {
        this.dialog_avaliacao = true;
      } else if (
        valueInstructionalElement.fk_instructionalelementtype ===
        Api().defaults.baseURL + `instrucelementtype/3/`
      ) {
        this.dialog_atividadecolaborativa = true;
      } else if (
        valueInstructionalElement.fk_instructionalelementtype ===
        Api().defaults.baseURL + `instrucelementtype/4/`
      ) {
        this.dialog_exemplo = true;
      }
    },
    close_or_save_modulo(value) {
      this.readonly_control = false;
      this.dialogLoadingMessage = this.dialogLoadingMessages[1];
      var vm = this;
      if (value === "save") {
        vm.getDominio();
        this.addVModelsPanels("modulo");
        this.dialog_modulo = false;
      } else if (value === "close") {
        this.dialog_modulo = false;
      }
      this.modulo = "";
      this.controlTreeView("modulo");
    },
    close_or_save_submodulo(value, newSubModulo) {
      this.readonly_control = false;
      this.dialogLoadingMessage = this.dialogLoadingMessages[1];
      var vm = this;
      if (value === "save") {
        vm.getDominio();
        this.addVModelsPanels("submodulo", newSubModulo);
        this.dialog_submodulo = false;
      } else if (value === "close") {
        this.dialog_submodulo = false;
      }
      this.modulo = "";
      this.submodulo = "";
      this.controlTreeView("submodulo");
    },
    close_or_save_conceito(value, newConceito, fatherType, father) {
      this.readonly_control = false;
      this.dialogLoadingMessage = this.dialogLoadingMessages[1];
      var vm = this;
      if (value === "save") {
        vm.getDominio();
        this.addVModelsPanels("conceito", newConceito, fatherType, father);
        this.dialog_conceito = false;
      } else if (value === "close") {
        this.dialog_conceito = false;
      }
      this.conceito = "";
      this.modulo = "";
      this.controlTreeView("conceito");
    },
    async deleteelemento(value) {
      if (value.url.split("/")[3] === "module" && value.fk_idmodule === null) {
        for (var i = this.vModelPanelArray.length - 1; i >= 0; --i) {
          if (this.vModelPanelArray[i].url === value.url) {
            this.vModelPanelArray.splice(i, 1);
          }
        }
      } else if (
        value.url.split("/")[3] === "module" &&
        value.fk_idmodule !== null
      ) {
        for (i = this.vModelPanelArray.length - 1; i >= 0; --i) {
          for (
            var j = this.vModelPanelArray[i].submodulos.length - 1;
            j >= 0;
            j--
          ) {
            if (this.vModelPanelArray[i].submodulos[j].url === value.url) {
              this.vModelPanelArray[i].submodulos.splice(i, 1);
            }
          }
        }
      } else if (value.url.split("/")[3] === "concept") {
        for (i = this.vModelPanelArray.length - 1; i >= 0; --i) {
          for (
            j = this.vModelPanelArray[i].submodulos.length - 1;
            j >= 0;
            j--
          ) {
            if (this.vModelPanelArray[i].submodulos[j].url === value.url) {
              this.vModelPanelArray[i].submodulos.splice(i, 1);
            }
            for (
              var k = this.vModelPanelArray[i].conceitos.length - 1;
              k >= 0;
              k--
            ) {
              if (
                this.vModelPanelArray[i].submodulos[j].conceitos[k].url ===
                value.url
              ) {
                this.vModelPanelArray[i].submodulos[j].conceitos.splice(k, 1);
              }
            }
          }
          for (k = this.vModelPanelArray[i].conceitos.length - 1; k >= 0; k--) {
            if (this.vModelPanelArray[i].conceitos[k].url === value.url) {
              this.vModelPanelArray[i].conceitos.splice(k, 1);
            }
          }
        }
      }
      this.dialogLoadingMessage = this.dialogLoadingMessages[2];
      var vm = this;
      if (
        value.fk_idmediatype === Api().defaults.baseURL + `mediatype/1/` ||
        value.fk_idmediatype === Api().defaults.baseURL + `mediatype/2/` ||
        value.fk_idmediatype === Api().defaults.baseURL + `mediatype/3/`
      ) {
        if (value.path !== null && value.url.search("mobilemedia") === 22) {
          await firebase.storage().ref().child(value.path).delete();
        }
      }
      await Api()
        .delete(value.url)
        .then(function () {
          vm.getDominio();
          vm.alertDelete = false;
          vm.auxElementDelete = "";
        });
    },
    controlTreeView(value) {
      this.readonly_control = false;
      this.$emit("close", value);
    },
    findNameTarget(conceitos, relacao) {
      var targetconcept = relacao.targetconcept;
      var conceptSelect = conceitos.find(function (conceitofinded) {
        return conceitofinded.url === targetconcept;
      });
      return conceptSelect.nameconcept;
    },
    findTipoRelation(typeUrl) {
      if (typeUrl.split("/")[4] == "1") {
        return "typeOf";
      } else if (typeUrl.split("/")[4] == "2") {
        return "partOf";
      }
    },
    openFileDialog(value) {
      if (value.name === "Imagem") {
        this.dialog_imagem = true;
      } else if (value.name === "Audio") {
        this.dialog_audio = true;
      } else if (value.name === "Video") {
        this.dialog_video = true;
      } else if (value.name === "Texto") {
        this.dialog_texto = true;
      } else if (value.name === "Link") {
        this.dialog_link = true;
      }
      this.objectFile = value.optionCall;
      this.type = value.type;
    },
    async dialogclose(value, rounds) {
      this.readonly_control = false;
      this.dialogLoadingMessage = this.dialogLoadingMessages[1];
      var vm = this;
      this.dialog_imagem = false;
      this.dialog_audio = false;
      this.dialog_video = false;
      this.dialog_texto = false;
      this.dialog_link = false;
      this.dialog_procedure = false;
      this.conceito = "";
      this.modulo = "";
      this.submodulo = "";
      this.mobilemedia = "";
      this.procedimento = "";
      this.objectFile = "";
      this.type = "";
      if (value === "save") {
        this.controlTreeView("procedimento");
        this.controlTreeView("mobilemedia");
        await this.$nextTick(function () {
          vm.getDominio();
        }, 3 + rounds);
        if (rounds) {
          await setTimeout(function () {
            vm.getDominio();
          }, 1200);
        }
      }
    },
    instrucOpenFileDialog(value) {
      if (value.name === "Exercício") {
        this.dialog_avaliacao = true;
      } else if (value.name === "Avaliação") {
        this.dialog_avaliacao = true;
      } else if (value.name === "Atividade Colaborativa") {
        this.dialog_atividadecolaborativa = true;
      } else if (value.name === "Exemplo") {
        this.dialog_exemplo = true;
      }
      this.instrucObjectFile = value.optionCall;
      this.instrucType = value.type;
      this.instrucValueType = value.valueType;
    },
    async instrucdialogclose(value, numberQuestions) {
      this.readonly_control = false;
      this.dialogLoadingMessage = this.dialogLoadingMessages[1];
      var vm = this;
      this.dialog_avaliacao = false;
      this.dialog_atividadecolaborativa = false;
      this.dialog_exemplo = false;
      this.conceito = "";
      this.modulo = "";
      this.submodulo = "";
      this.elementoinstrucional = "";
      this.instrucObjectFile = "";
      this.instrucType = "";
      this.instrucValueType = "";
      if (value === "save") {
        this.controlTreeView("elementoinstrucional");
        await setTimeout(function () {
          vm.getDominio();
        }, 1200);
        if (numberQuestions > 5) {
          await setTimeout(function () {
            vm.getDominio();
          }, 1500);
        }
        if (numberQuestions > 10) {
          await setTimeout(function () {
            vm.getDominio();
          }, 1800);
        }
      }
    },
    getNotSubmodules(domain) {
      var modulesfinded = "";
      function checkModules(modulo) {
        return modulo.fk_idmodule === null;
      }
      if (typeof domain.modules !== "undefined" && domain.modules.length > 0) {
        modulesfinded = domain.modules.filter(checkModules);
      }
      return modulesfinded;
    },
    proceduresUnderConcept(concept) {
      function checkProcedure(proc) {
        return (
          proc.fk_informationitemtype ===
          Api().defaults.baseURL + "informationitemtype/4/"
        );
      }
      var proceduresfinded = concept.informationitems.filter(checkProcedure);
      return proceduresfinded;
    },
    mobileMediasInformationItem(concept) {
      var mobilesfinded = [];
      concept.informationitems.forEach((info) => {
        if (
          info.fk_informationitemtype !==
          Api().defaults.baseURL + "informationitemtype/4/"
        ) {
          info.mobilemedias.forEach((mob) => {
            mobilesfinded.push(mob);
          });
        }
      });
      return mobilesfinded;
    },
    async visibleClose(value) {
      this.readonly_control = false;
      var vm = this;
      this.dialog_visible = false;
      if (value === "save") {
        await setTimeout(function () {
          vm.getDominio();
        }, 2000);
      }
    },
    openDidaticDialog(value) {
      if (value.type === 1) {
        this.dialog_visible = true;
      } else if (value.type === 2) {
        this.dialog_assessment = true;
      } else if (value.type === 3) {
        this.dialog_prior = true;
      } else if (value.type === 4) {
        this.dialog_priorConcept = true;
      }
    },
    async assessmentClose(value) {
      this.readonly_control = false;
      var vm = this;
      this.dialog_assessment = false;
      if (value === "save") {
        await setTimeout(function () {
          vm.getDominio();
        }, 2000);
      }
    },
    async priorClose(value) {
      this.readonly_control = false;
      var vm = this;
      this.dialog_prior = false;
      if (value === "save") {
        await setTimeout(function () {
          vm.getDominio();
        }, 2000);
      }
    },
    async priorCloseConcept(value) {
      this.readonly_control = false;
      var vm = this;
      this.dialog_priorConcept = false;
      if (value === "save") {
        await setTimeout(function () {
          vm.getDominio();
        }, 2000);
      }
    },
    saveDominio() {
      console.log("");
    },
  },
};
</script>

<style></style>