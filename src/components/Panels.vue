<template>
  <v-row>
    <!--Panel do Domínio-->
    <v-expansion-panels>
      <v-expansion-panel v-for="(item,i) in 1" :key="i">
        <v-expansion-panel-header color="#666666" style="color:white;">
          <!--HEADER DO DOMÍNIO-->
          <v-row>
            <v-col cols="9">
              <p>
                [Dominio]
                {{ dominio_data.nameknowledgedomain }}
              </p>
            </v-col>
            <v-col cols="3">
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
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>

                <MenuFiles @dialogoption="openFileDialog" :optionCall="dominio" :type="'dominio'" />
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
                    <v-icon>mdi-view-headline</v-icon>
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

              <!--Formulario para criação de submódulo-->
              <v-dialog v-model="dialog_submodulo" persistent="persistent" max-width="600px">
                <SubModuloDialog
                  :submodule="submodulo"
                  :module="modulo"
                  @close_or_save="close_or_save_submodulo "
                  :domain="dominio"
                  :dialog="dialog_submodulo"
                />
              </v-dialog>
              <!--Formulario para criação de conceito-->
              <v-dialog
                style="overflow-y:hidden; overflow-x:hidden;"
                v-model="dialog_conceito"
                persistent="persistent"
                max-width="745px"
                max-height="530px"
              >
                <ConceitoDialog
                  :concept="conceito"
                  :module="modulo"
                  @close_or_save="close_or_save_conceito"
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
                  @close="dialogclose"
                  :dialog="dialog_procedure"
                  :procedure="procedimento"
                  :concept="conceito"
                  :module="modulo"
                />
              </v-dialog>

              <!--FORMULARIOS PARA CRIAÇÃO DE ELEMENTOS INSTRUCIONAIS -->
              <!--Formulario para criação de exercício e avaliação -->
              <v-dialog v-model="dialog_avaliacao" persistent="persistent" max-width="1000px">
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
                max-width="1000px"
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
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <!--FIM DO HEADER DO DOMÍNIO-->
        <v-expansion-panel-content>
          <!--CONTENT DO DOMÍNIO-->
          {{ dominio_data.subtitle }}
          <!-- PANELS DOS ARQUIVOS/MOBILEMEDIAS DO DOMÍNIO-->
          <v-expansion-panels
            v-for="(mobilemedia) in dominio.mobilemedias"
            :key="mobilemedia.url"
            class="mt-2 mb-2"
          >
            <v-expansion-panel>
              <v-expansion-panel-header color="#A5A5A5" style="color:white;">
                <v-row>
                  <v-col cols="9">
                    <p>
                      <v-icon
                        color="white"
                        large
                      >{{fileTypesIcon[(mobilemedia.fk_idmediatype).split("/")[4]-1]}}</v-icon>
                      {{((mobilemedia.fk_idmediatype).split("/")[4]-1) > 2 ? (((mobilemedia.fk_idmediatype).split("/")[4]-1) > 3 ? mobilemedia.urllink : mobilemedia.textshort) : mobilemedia.namefile }}
                    </p>
                  </v-col>
                  <v-col cols="3">
                    <!--Formulario para edição do arquivo/mobilemedia-->
                    <v-btn
                      icon="icon"
                      color="white"
                      @click="setmobilemedia(mobilemedia, dominio, 'dominio')"
                    >
                      <v-icon>mdi-view-headline</v-icon>
                    </v-btn>
                    <!--Função para excluir arquivo/mobilemedia-->
                    <v-btn icon="icon" color="white" @click="deleteelemento(mobilemedia)">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>

              <v-expansion-panel-content></v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <!-- FIM DOS PANELS DOS ARQUIVOS DO DOMÍNIO-->
          <!--LISTAGEM DOS ELEMENTOS INSTRUCIONAIS DO DOMÍNIO-->
          <v-expansion-panels
            v-for="(instrucelement) in instrucElementsSearch(dominio)"
            :key="instrucelement.url"
            class="mt-2 mb-2"
          >
            <v-expansion-panel>
              <v-expansion-panel-header color="#A5A5A5" style="color:white;">
                <v-row>
                  <v-col cols="9">
                    <p>[Elemento Instrucional] {{instrucelement.label}}</p>
                  </v-col>
                  <v-col cols="3">
                    <!--Formulario para edição dos ELEMENTOS INSTRUCIONAIS do DOMÍNIO-->
                    <v-btn
                      icon="icon"
                      color="white"
                      @click="setinstructionalelement(instrucelement, dominio, 'dominio')"
                    >
                      <v-icon>mdi-view-headline</v-icon>
                    </v-btn>
                    <!--Função para excluir ELEMENTOS INSTRUCIONAIS do DOMÍNIO-->
                    <v-btn icon="icon" color="white" @click="deleteelemento(instrucelement)">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>

              <v-expansion-panel-content></v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <!-- FIM DA LISTAGEM DOS ELEMENTOS INSTRUCIONAIS DO DOMÍNIO-->
          <!--Panels dos Módulos-->
          <v-expansion-panels
            v-for="(modulo) in dominio_data.modules"
            :key="modulo.url"
            class="mt-2 mb-2"
          >
            <v-expansion-panel v-if="modulo.fk_idmodule === null">
              <v-expansion-panel-header color="#7FD15E" style="color:white;">
                <!--HEADER DO MÓDULO-->
                <v-row>
                  <v-col cols="9">
                    <p>
                      [Modulo]
                      {{ modulo.namemodule }}
                    </p>
                  </v-col>
                  <v-col cols="3">
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
                          <v-icon>mdi-dots-horizontal</v-icon>
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
                        <v-list-item @click="setmodulo(modulo);dialog_conceito=true">
                          <v-list-item-title>Conceito</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="setmodulo(modulo);dialog_submodulo=true">
                          <v-list-item-title>Submódulo</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                    <!--Formulario para edição do modulo-->
                    <v-btn icon="icon" color="white" @click="setmodulo(modulo);dialog_modulo=true">
                      <v-icon>mdi-view-headline</v-icon>
                    </v-btn>
                    <!--Função para excluir módulo-->
                    <v-btn icon="icon" color="white" @click="deleteelemento(modulo)">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <!--FIM DO HEADER DO MÓDULO-->

              <v-expansion-panel-content>
                <!--CONTENT DO MÓDULO-->
                {{ modulo.subtitle }}
                <!-- PANELS DOS ARQUIVOS DOS MÓDULOS-->
                <v-expansion-panels
                  v-for="(mobilemedia) in modulo.mobilemedias"
                  :key="mobilemedia.url"
                  class="mt-2 mb-2"
                >
                  <v-expansion-panel>
                    <v-expansion-panel-header color="#A5A5A5" style="color:white;">
                      <v-row>
                        <v-col cols="9">
                          <p>
                            <v-icon
                              color="white"
                              large
                            >{{fileTypesIcon[(mobilemedia.fk_idmediatype).split("/")[4]-1]}}</v-icon>
                            {{((mobilemedia.fk_idmediatype).split("/")[4]-1) > 2 ? (((mobilemedia.fk_idmediatype).split("/")[4]-1) > 3 ? mobilemedia.urllink : mobilemedia.textshort) : mobilemedia.namefile }}
                          </p>
                        </v-col>
                        <v-col cols="3">
                          <!--Formulario para edição do arquivo/mobilemedia-->
                          <v-btn
                            icon="icon"
                            color="white"
                            @click="setmobilemedia(mobilemedia, modulo, 'modulo')"
                          >
                            <v-icon>mdi-view-headline</v-icon>
                          </v-btn>
                          <!--Função para excluir arquivo/mobilemedia-->
                          <v-btn icon="icon" color="white" @click="deleteelemento(mobilemedia)">
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content></v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <!-- FIM DOS PANELS DOS ARQUIVOS DOS MÓDULOS-->
                <!--LISTAGEM DOS ELEMENTOS INSTRUCIONAIS DOS MÓDULOS-->
                <v-expansion-panels
                  v-for="(instrucelement) in instrucElementsSearch(modulo)"
                  :key="instrucelement.url"
                  class="mt-2 mb-2"
                >
                  <v-expansion-panel>
                    <v-expansion-panel-header color="#A5A5A5" style="color:white;">
                      <v-row>
                        <v-col cols="9">
                          <p>[Elemento Instrucional] {{instrucelement.label}}</p>
                        </v-col>
                        <v-col cols="3">
                          <!--Formulario para edição do ELEMENTOS INSTRUCIONAIS do módulo-->
                          <v-btn
                            icon="icon"
                            color="white"
                            @click="setinstructionalelement(instrucelement, modulo, 'modulo')"
                          >
                            <v-icon>mdi-view-headline</v-icon>
                          </v-btn>
                          <!--Função para excluir ELEMENTOS INSTRUCIONAIS do módulo-->
                          <v-btn icon="icon" color="white" @click="deleteelemento(instrucelement)">
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content></v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <!-- FIM DA LISTAGEM DOS ELEMENTOS INSTRUCIONAIS DOS MÓDULOS-->
                <!--Panels dos SubMódulos-->
                <v-expansion-panels
                  v-for="(submodulo) in modulo.submodules"
                  :key="submodulo.url"
                  class="mt-2 mb-2"
                >
                  <v-expansion-panel>
                    <v-expansion-panel-header color="#71CB97" style="color:white;">
                      <!--HEADER DO SUBMÓDULO-->
                      <v-row>
                        <v-col cols="9">
                          <p>
                            [Submodulo]
                            {{ submodulo.namemodule }}
                          </p>
                        </v-col>
                        <v-col cols="3">
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
                                <v-icon>mdi-dots-horizontal</v-icon>
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
                            @click="setmodulo(submodulo);dialog_conceito=true"
                          >
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>

                          <!--Formulario para edição do submodulo-->
                          <v-btn
                            icon="icon"
                            color="white"
                            @click="setsubmodulo(submodulo);dialog_submodulo=true"
                          >
                            <v-icon>mdi-view-headline</v-icon>
                          </v-btn>
                          <!--Função para excluir submódulo-->
                          <v-btn icon="icon" color="white" @click="deleteelemento(submodulo)">
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>
                    <!--FIM DO HEADER DO SUBMÓDULO-->

                    <v-expansion-panel-content>
                      <!--CONTENT DO SUBMODULO-->
                      {{ submodulo.subtitle }}
                      <!--LISTAGEM DOS ARQUIVOS DOS SUBMÓULOS-->
                      <v-expansion-panels
                        v-for="(mobilemedia) in submodulo.mobilemedias"
                        :key="mobilemedia.url"
                        class="mt-2 mb-2"
                      >
                        <v-expansion-panel>
                          <v-expansion-panel-header color="#A5A5A5" style="color:white;">
                            <v-row>
                              <v-col cols="9">
                                <p>
                                  <v-icon
                                    color="white"
                                    large
                                  >{{fileTypesIcon[(mobilemedia.fk_idmediatype).split("/")[4]-1]}}</v-icon>
                                  {{((mobilemedia.fk_idmediatype).split("/")[4]-1) > 2 ? (((mobilemedia.fk_idmediatype).split("/")[4]-1) > 3 ? mobilemedia.urllink : mobilemedia.textshort) : mobilemedia.namefile }}
                                </p>
                              </v-col>
                              <v-col cols="3">
                                <!--Formulario para edição do arquivo/mobilemedia-->
                                <v-btn
                                  icon="icon"
                                  color="white"
                                  @click="setmobilemedia(mobilemedia, submodulo, 'modulo')"
                                >
                                  <v-icon>mdi-view-headline</v-icon>
                                </v-btn>
                                <!--Função para excluir arquivo/mobilemedia-->
                                <v-btn
                                  icon="icon"
                                  color="white"
                                  @click="deleteelemento(mobilemedia)"
                                >
                                  <v-icon>mdi-close</v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-header>

                          <v-expansion-panel-content></v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                      <!--FIM DA LISTAGEM DOS ARQUIVOS DOS SUBMÓULOS-->
                      <!--LISTAGEM DOS ELEMENTOS INSTRUCIONAIS DOS SUBMÓULOS-->
                      <v-expansion-panels
                        v-for="(instrucelement) in instrucElementsSearch(submodulo)"
                        :key="instrucelement.url"
                        class="mt-2 mb-2"
                      >
                        <v-expansion-panel>
                          <v-expansion-panel-header color="#A5A5A5" style="color:white;">
                            <v-row>
                              <v-col cols="9">
                                <p>[Elemento Instrucional] {{instrucelement.label}}</p>
                              </v-col>
                              <v-col cols="3">
                                <!--Formulario para edição do ELEMENTOS INSTRUCIONAIS do SUBMODULO-->
                                <v-btn
                                  icon="icon"
                                  color="white"
                                  @click="setinstructionalelement(instrucelement, submodulo, 'modulo')"
                                >
                                  <v-icon>mdi-view-headline</v-icon>
                                </v-btn>
                                <!--Função para excluir ELEMENTOS INSTRUCIONAIS do SUBMODULO-->
                                <v-btn
                                  icon="icon"
                                  color="white"
                                  @click="deleteelemento(instrucelement)"
                                >
                                  <v-icon>mdi-close</v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-header>

                          <v-expansion-panel-content></v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                      <!-- FIM DA LISTAGEM DOS ELEMENTOS INSTRUCIONAIS DOS SUBMÓULOS-->
                      <!--Panels dos conceitos adicionados dentro de submódulos-->
                      <v-expansion-panels
                        v-for="(conceito) in submodulo.concepts"
                        :key="conceito.url"
                        class="mt-2 mb-2"
                      >
                        <v-expansion-panel>
                          <v-expansion-panel-header color="#3B83FF" style="color:white;">
                            <!--HEADER DOS CONCEITOS DOS SUBMÓDULOS-->
                            <v-row>
                              <v-col cols="9">
                                <p>
                                  [Conceito]
                                  {{ conceito.nameconcept }}
                                </p>
                              </v-col>
                              <v-col cols="3">
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
                                      <v-icon>mdi-dots-horizontal</v-icon>
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
                                      @click="setconceito(conceito, modulo);dialog_procedure=true"
                                    >
                                      <v-list-item-title>Procedimento</v-list-item-title>
                                    </v-list-item>
                                  </v-list>
                                </v-menu>
                                <!--Formulario para edição dos conceitos adicionados dentro de submódulos-->
                                <v-btn
                                  icon="icon"
                                  color="white"
                                  @click="setconceito(conceito, submodulo);dialog_conceito=true"
                                >
                                  <v-icon>mdi-view-headline</v-icon>
                                </v-btn>
                                <!--Função para excluir conceito-->
                                <v-btn icon="icon" color="white" @click="deleteelemento(conceito)">
                                  <v-icon>mdi-close</v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-header>
                          <!--FIM DO HEADER DOS CONCEITOS DOS SUBMÓDULOS-->

                          <v-expansion-panel-content>
                            <!--INÍCIO DO CONTENT DOS CONCEITOS DOS SUBMÓDULOS-->
                            <p>Relacionamentos:</p>
                            <!-- Listagem dos relacionamentos dos conceitos adicionados dentro de submódulos -->
                            <h3 class="mt-2">Relacionamentos:</h3>
                            <v-simple-table>
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
                                    <td>{{findNameTarget(modulo.concepts, relacao)}}</td>
                                    <td>{{relacao.namereference}}</td>
                                    <td>{{findTipoRelation(relacao.fk_referencetype)}}</td>
                                  </tr>
                                </tbody>
                              </template>
                            </v-simple-table>
                            <!-- Listagem dos arquivos dos conceitos DOS SUBMÓDULOS-->
                            <v-expansion-panels
                              v-for="(mobilemedia) in conceito.mobilemedias"
                              :key="mobilemedia.url"
                              class="mt-2 mb-2"
                            >
                              <v-expansion-panel>
                                <!--LISTAGEM DOS ARQUIVOS DOS CONCEITOS DOS SUBMODULOS -->
                                <v-expansion-panel-header color="#A5A5A5" style="color:white;">
                                  <!--HEADER DOS ARQUIVOS DOS CONCEITOS DOS SUBMODULOS-->
                                  <v-row>
                                    <v-col cols="9">
                                      <p>
                                        <v-icon
                                          color="white"
                                          large
                                        >{{fileTypesIcon[(mobilemedia.fk_idmediatype).split("/")[4]-1]}}</v-icon>
                                        {{((mobilemedia.fk_idmediatype).split("/")[4]-1) > 2 ? (((mobilemedia.fk_idmediatype).split("/")[4]-1) > 3 ? mobilemedia.urllink : mobilemedia.textshort) : mobilemedia.namefile }}
                                      </p>
                                    </v-col>
                                    <v-col cols="3">
                                      <!--Formulario para edição do arquivo/mobilemedia dos conceitos adicionados dentro de submódulos-->
                                      <v-btn
                                        icon="icon"
                                        color="white"
                                        @click="setmobilemedia(mobilemedia, conceito, 'conceito')"
                                      >
                                        <v-icon>mdi-view-headline</v-icon>
                                      </v-btn>
                                      <!--Função para excluir arquivo/mobilemedia dos conceitos adicionados dentro de submódulos-->
                                      <v-btn
                                        icon="icon"
                                        color="white"
                                        @click="deleteelemento(mobilemedia)"
                                      >
                                        <v-icon>mdi-close</v-icon>
                                      </v-btn>
                                    </v-col>
                                  </v-row>
                                </v-expansion-panel-header>

                                <v-expansion-panel-content></v-expansion-panel-content>
                              </v-expansion-panel>
                            </v-expansion-panels>
                            <!--FIM DA LISTAGEM DOS ARQUIVOS DOS CONCEITOS DOS SUBMODULOS -->
                            <!--LISTAGEM DOS PROCEDURES DOS CONCEITOS DOS SUBMÓDULOS-->
                            <v-expansion-panels
                              v-for="(procedure) in proceduresUnderConcept(conceito)"
                              :key="procedure.url"
                              class="mt-2 mb-2"
                            >
                              <v-expansion-panel>
                                <v-expansion-panel-header color="#A5A5A5" style="color:white;">
                                  <v-row>
                                    <v-col cols="9">
                                      <p>[Procedimento] {{procedure.nameinformationitem}}</p>
                                    </v-col>
                                    <v-col cols="3">
                                      <!--Formulario para edição do procedure-->
                                      <v-btn
                                        icon="icon"
                                        color="white"
                                        @click="setprocedimento(procedure, conceito, submodulo); dialog_procedure=true"
                                      >
                                        <v-icon>mdi-view-headline</v-icon>
                                      </v-btn>
                                      <!--Função para excluir arquivo/mobilemedia-->
                                      <v-btn
                                        icon="icon"
                                        color="white"
                                        @click="deleteelemento(procedure)"
                                      >
                                        <v-icon>mdi-close</v-icon>
                                      </v-btn>
                                    </v-col>
                                  </v-row>
                                </v-expansion-panel-header>

                                <v-expansion-panel-content>
                                  <p class="mt-2">{{procedure.descriptioninformationitem}}</p>
                                  <!--LISTAGEM DAS FASES DOS PROCEDURES DOS CONCEITOS DOS SUBMÓDULOS-->
                                  <h3 class="mt-2">Fases do procedimento:</h3>
                                  <v-simple-table>
                                    <template v-slot:default>
                                      <thead>
                                        <tr>
                                          <th
                                            class="text-left"
                                            style="margin-right:-20px"
                                          >Ordem da fase</th>
                                          <th class="text-left">Descrição</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr
                                          v-for="fase in procedure.phaseprocedures"
                                          :key="fase.url"
                                        >
                                          <td style="margin-right:-20px">{{fase.order}}</td>
                                          <td>{{fase.description}}</td>
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
                              v-for="(instrucelement) in instrucElementsSearch(conceito)"
                              :key="instrucelement.url"
                              class="mt-2 mb-2"
                            >
                              <v-expansion-panel>
                                <v-expansion-panel-header color="#A5A5A5" style="color:white;">
                                  <v-row>
                                    <v-col cols="9">
                                      <p>[Elemento Instrucional] {{instrucelement.label}}</p>
                                    </v-col>
                                    <v-col cols="3">
                                      <!--Formulario para edição do ELEMENTOS INSTRUCIONAIS DOS CONCEITOS DOS SUBMÓDULOS-->
                                      <v-btn
                                        icon="icon"
                                        color="white"
                                        @click="setinstructionalelement(instrucelement, conceito, 'conceito')"
                                      >
                                        <v-icon>mdi-view-headline</v-icon>
                                      </v-btn>
                                      <!--Função para excluir ELEMENTOS INSTRUCIONAIS DOS CONCEITOS DOS SUBMÓDULOS-->
                                      <v-btn
                                        icon="icon"
                                        color="white"
                                        @click="deleteelemento(instrucelement)"
                                      >
                                        <v-icon>mdi-close</v-icon>
                                      </v-btn>
                                    </v-col>
                                  </v-row>
                                </v-expansion-panel-header>

                                <v-expansion-panel-content></v-expansion-panel-content>
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
                  v-for="(conceito) in modulo.concepts"
                  :key="conceito.url"
                  class="mt-2 mb-2"
                >
                  <v-expansion-panel>
                    <v-expansion-panel-header color="#3B83FF" style="color:white;">
                      <!--HEADER DOS CONCEITOS DOS MÓDULOS-->
                      <v-row>
                        <v-col cols="9">
                          <p>
                            [Conceito]
                            {{ conceito.nameconcept }}
                          </p>
                        </v-col>
                        <v-col cols="3">
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
                                <v-icon>mdi-dots-horizontal</v-icon>
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
                                @click="setconceito(conceito, modulo);dialog_procedure=true"
                              >
                                <v-list-item-title>Procedimento</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                          <!--Formulario para edição do conceito-->
                          <v-btn
                            icon="icon"
                            color="white"
                            @click="setconceito(conceito, modulo);dialog_conceito=true"
                          >
                            <v-icon>mdi-view-headline</v-icon>
                          </v-btn>
                          <!--Função para excluir conceito-->
                          <v-btn icon="icon" color="white" @click="deleteelemento(conceito)">
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>
                    <!--FIM DO HEADER DOS CONCEITOS DOS MÓDULOS-->

                    <v-expansion-panel-content>
                      <!-- Listagem dos relacionamentos do conceito dos módulos -->
                      <h3 class="mt-2">Relacionamentos:</h3>
                      <v-simple-table>
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
                              <td>{{findNameTarget(modulo.concepts, relacao)}}</td>
                              <td>{{relacao.namereference}}</td>
                              <td>{{findTipoRelation(relacao.fk_referencetype)}}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>

                      <!--LISTAGEM DOS ARQUIVOS DOS CONCEITOS DOS MÓDULOS-->
                      <v-expansion-panels
                        v-for="(mobilemedia) in conceito.mobilemedias"
                        :key="mobilemedia.url"
                        class="mt-2 mb-2"
                      >
                        <v-expansion-panel>
                          <v-expansion-panel-header color="#A5A5A5" style="color:white;">
                            <v-row>
                              <v-col cols="9">
                                <p>
                                  <v-icon
                                    color="white"
                                    large
                                  >{{fileTypesIcon[(mobilemedia.fk_idmediatype).split("/")[4]-1]}}</v-icon>
                                  {{((mobilemedia.fk_idmediatype).split("/")[4]-1) > 2 ? (((mobilemedia.fk_idmediatype).split("/")[4]-1) > 3 ? mobilemedia.urllink : mobilemedia.textshort) : mobilemedia.namefile }}
                                </p>
                              </v-col>
                              <v-col cols="3">
                                <!--Formulario para edição do arquivo/mobilemedia-->
                                <v-btn
                                  icon="icon"
                                  color="white"
                                  @click="setmobilemedia(mobilemedia, conceito, 'conceito')"
                                >
                                  <v-icon>mdi-view-headline</v-icon>
                                </v-btn>
                                <!--Função para excluir arquivo/mobilemedia-->
                                <v-btn
                                  icon="icon"
                                  color="white"
                                  @click="deleteelemento(mobilemedia)"
                                >
                                  <v-icon>mdi-close</v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-header>

                          <v-expansion-panel-content></v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                      <!-- FIM DA LISTAGEM DOS ARQUIVOS DOS CONCEITOS DOS MÓDULOS -->

                      <!--LISTAGEM DOS PROCEDURES DOS CONCEITOS DOS MÓDULOS-->
                      <v-expansion-panels
                        v-for="(procedure) in proceduresUnderConcept(conceito)"
                        :key="procedure.url"
                        class="mt-2 mb-2"
                      >
                        <v-expansion-panel>
                          <v-expansion-panel-header color="#A5A5A5" style="color:white;">
                            <v-row>
                              <v-col cols="9">
                                <p>[Procedimento] {{procedure.nameinformationitem}}</p>
                              </v-col>
                              <v-col cols="3">
                                <!--Formulario para edição do procedure-->
                                <v-btn
                                  icon="icon"
                                  color="white"
                                  @click="setprocedimento(procedure, conceito, modulo); dialog_procedure=true"
                                >
                                  <v-icon>mdi-view-headline</v-icon>
                                </v-btn>
                                <!--Função para excluir arquivo/mobilemedia-->
                                <v-btn icon="icon" color="white" @click="deleteelemento(procedure)">
                                  <v-icon>mdi-close</v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-header>

                          <v-expansion-panel-content>
                            <p>{{procedure.descriptioninformationitem}}</p>
                            <!--LISTAGEM DAS FASES DOS PROCEDURES DOS CONCEITOS DOS MÓDULOS-->
                            <h3 class="mt-2">Fases do procedimento:</h3>
                            <v-simple-table>
                              <template v-slot:default>
                                <thead>
                                  <tr>
                                    <th class="text-left">Ordem da fase</th>
                                    <th class="text-left">Descrição</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="fase in procedure.phaseprocedures" :key="fase.url">
                                    <td>{{fase.order}}</td>
                                    <td>{{fase.description}}</td>
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
                        v-for="(instrucelement) in instrucElementsSearch(conceito)"
                        :key="instrucelement.url"
                        class="mt-2 mb-2"
                      >
                        <v-expansion-panel>
                          <v-expansion-panel-header color="#A5A5A5" style="color:white;">
                            <v-row>
                              <v-col cols="9">
                                <p>[Elemento Instrucional] {{instrucelement.label}}</p>
                              </v-col>
                              <v-col cols="3">
                                <!--Formulario para edição do ELEMENTOS INSTRUCIONAIS DOS CONCEITOS DOS MÓDULOS-->
                                <v-btn
                                  icon="icon"
                                  color="white"
                                  @click="setinstructionalelement(instrucelement, conceito, 'conceito')"
                                >
                                  <v-icon>mdi-view-headline</v-icon>
                                </v-btn>
                                <!--Função para excluir ELEMENTOS INSTRUCIONAIS DOS CONCEITOS DOS MÓDULOS-->
                                <v-btn
                                  icon="icon"
                                  color="white"
                                  @click="deleteelemento(instrucelement)"
                                >
                                  <v-icon>mdi-close</v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-header>

                          <v-expansion-panel-content></v-expansion-panel-content>
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

import firebase from "firebase/app";
import axios from "axios";
import Cookie from "js-cookie";
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
    AtividadeColaborativaDialog
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
    "dialog_instructionalelementtree"
  ],
  data: () => ({
    itemsMenuNewModulo: [
      {
        type: "Conceito"
      },
      {
        type: "Submódulo"
      }
    ],
    fileTypesIcon: [
      "mdi-file-image",
      "mdi-file-video",
      "mdi-file-music",
      "mdi-file-document",
      "mdi-link-variant"
    ],
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
    select: null,
    checkbox: false,
    /*ATRIBUTOS DO DOMINIO*/
    dominio_data: {}
  }),

  watch: {
    dominio: function() {
      this.setDomainVariables(this.dominio);
    },
    dialog_knowledgedomain: function() {
      if (this.dialog_knowledgedomain === true) {
        this.dialog_dominio = this.dialog_knowledgedomain;
      }
    },
    dialog_module: function() {
      if (this.dialog_module === true) {
        var vm = this;
        var csrftoken = Cookie.get("csrftoken");
        var headers = {
          "X-CSRFTOKEN": csrftoken
        };
        this.dialog_modulo = this.dialog_module;
        axios
          .patch(
            this.objectTreeView.url,
            {
              headers: headers
            },
            {
              auth: {
                username: "admin",
                password: "admin"
              }
            }
          )
          .then(function(resposta) {
            vm.modulo = resposta.data;
          });
      }
    },
    dialog_submodule: function() {
      if (this.dialog_submodule === true) {
        var vm = this;
        var csrftoken = Cookie.get("csrftoken");
        var headers = {
          "X-CSRFTOKEN": csrftoken
        };
        this.dialog_submodulo = this.dialog_submodule;
        axios
          .patch(
            this.objectTreeView.url.substr(
              0,
              this.objectTreeView.url.length - 3
            ),
            {
              headers: headers
            },
            {
              auth: {
                username: "admin",
                password: "admin"
              }
            }
          )
          .then(function(resposta) {
            vm.submodulo = resposta.data;
          });
      }
    },
    dialog_concept: function() {
      if (this.dialog_concept === true) {
        var vm = this;
        var csrftoken = Cookie.get("csrftoken");
        var headers = {
          "X-CSRFTOKEN": csrftoken
        };
        this.dialog_conceito = this.dialog_concept;
        axios
          .patch(
            this.objectTreeView.url,
            {
              headers: headers
            },
            {
              auth: {
                username: "admin",
                password: "admin"
              }
            }
          )
          .then(function(resposta) {
            vm.conceito = resposta.data;
            axios
              .patch(
                resposta.data.fk_idmodule,
                {
                  headers: headers
                },
                {
                  auth: {
                    username: "admin",
                    password: "admin"
                  }
                }
              )
              .then(function(resposta2) {
                vm.modulo = resposta2.data;
              });
          });
      }
    },
    dialog_proceduretree: function() {
      if (this.dialog_proceduretree === true) {
        var vm = this;
        var csrftoken = Cookie.get("csrftoken");
        var headers = {
          "X-CSRFTOKEN": csrftoken
        };
        this.dialog_procedure = this.dialog_proceduretree;
        axios
          .patch(
            this.objectTreeView.url,
            {
              headers: headers
            },
            {
              auth: {
                username: "admin",
                password: "admin"
              }
            }
          )
          .then(function(resposta) {
            vm.procedimento = resposta.data;
            axios
              .patch(
                resposta.data.fk_idconcept,
                {
                  headers: headers
                },
                {
                  auth: {
                    username: "admin",
                    password: "admin"
                  }
                }
              )
              .then(function(resposta2) {
                vm.conceito = resposta2.data;
                axios
                  .patch(
                    resposta2.data.fk_idmodule,
                    {
                      headers: headers
                    },
                    {
                      auth: {
                        username: "admin",
                        password: "admin"
                      }
                    }
                  )
                  .then(function(resposta3) {
                    vm.modulo = resposta3.data;
                  });
              });
          });
      }
    },
    dialog_mobilemediatree: function() {
      if (this.dialog_mobilemediatree === true) {
        var vm = this;
        var csrftoken = Cookie.get("csrftoken");
        var headers = {
          "X-CSRFTOKEN": csrftoken
        };
        axios
          .patch(
            this.objectTreeView.url,
            {
              headers: headers
            },
            {
              auth: {
                username: "admin",
                password: "admin"
              }
            }
          )
          .then(function(resposta) {
            if (resposta.data.fk_idknowledgedomain) {
              vm.setmobilemedia(resposta.data, vm.dominio, "dominio");
            } else if (resposta.data.fk_module) {
              axios
                .patch(
                  resposta.data.fk_module,
                  {
                    headers: headers
                  },
                  {
                    auth: {
                      username: "admin",
                      password: "admin"
                    }
                  }
                )
                .then(function(resposta2) {
                  vm.setmobilemedia(resposta.data, resposta2.data, "modulo");
                });
            } else if (resposta.data.fk_idconcept) {
              axios
                .patch(
                  resposta.data.fk_idconcept,
                  {
                    headers: headers
                  },
                  {
                    auth: {
                      username: "admin",
                      password: "admin"
                    }
                  }
                )
                .then(function(resposta2) {
                  vm.setmobilemedia(resposta.data, resposta2.data, "conceito");
                });
            }
          });
      }
    },
    dialog_instructionalelementtree: function() {
      if (this.dialog_instructionalelementtree === true) {
        var vm = this;
        var csrftoken = Cookie.get("csrftoken");
        var headers = {
          "X-CSRFTOKEN": csrftoken
        };
        axios
          .patch(
            this.objectTreeView.url,
            {
              headers: headers
            },
            {
              auth: {
                username: "admin",
                password: "admin"
              }
            }
          )
          .then(function(resposta) {
            if (resposta.data.fk_idknowledgedomain) {
              vm.setinstructionalelement(resposta.data, vm.dominio, "dominio");
            } else if (resposta.data.fk_module) {
              axios
                .patch(
                  resposta.data.fk_module,
                  {
                    headers: headers
                  },
                  {
                    auth: {
                      username: "admin",
                      password: "admin"
                    }
                  }
                )
                .then(function(resposta2) {
                  vm.setinstructionalelement(
                    resposta.data,
                    resposta2.data,
                    "modulo"
                  );
                });
            } else if (resposta.data.fk_idconcept) {
              axios
                .patch(
                  resposta.data.fk_idconcept,
                  {
                    headers: headers
                  },
                  {
                    auth: {
                      username: "admin",
                      password: "admin"
                    }
                  }
                )
                .then(function(resposta2) {
                  vm.setinstructionalelement(
                    resposta.data,
                    resposta2.data,
                    "conceito"
                  );
                });
            }
          });
      }
    }
  },
  computed: {
    nomeDominioPanel: function() {
      return this.domainName;
    }
  },
  methods: {
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
      var vm = this;
      var csrftoken = Cookie.get("csrftoken");
      var headers = {
        "X-CSRFTOKEN": csrftoken
      };
      axios
        .patch(
          "http://127.0.0.1:8000/knowledgedomain/" +
            this.dominio_data.idknowledgedomain +
            "/",
          {
            headers: headers
          },
          {
            auth: {
              username: "admin",
              password: "admin"
            }
          }
        )
        .then(function(resposta) {
          vm.setDomainVariables(resposta.data);
        });
    },

    close_or_save_dominio() {
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
        valueMobileMedia.fk_idmediatype === `http://127.0.0.1:8000/mediatype/1/`
      ) {
        this.dialog_imagem = true;
      } else if (
        valueMobileMedia.fk_idmediatype === `http://127.0.0.1:8000/mediatype/2/`
      ) {
        this.dialog_video = true;
      } else if (
        valueMobileMedia.fk_idmediatype === `http://127.0.0.1:8000/mediatype/3/`
      ) {
        this.dialog_audio = true;
      } else if (
        valueMobileMedia.fk_idmediatype === `http://127.0.0.1:8000/mediatype/4/`
      ) {
        this.dialog_texto = true;
      } else if (
        valueMobileMedia.fk_idmediatype === `http://127.0.0.1:8000/mediatype/5/`
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
        `http://127.0.0.1:8000/instrucelementtype/1/`
      ) {
        this.dialog_avaliacao = true;
      } else if (
        valueInstructionalElement.fk_instructionalelementtype ===
        `http://127.0.0.1:8000/instrucelementtype/2/`
      ) {
        this.dialog_avaliacao = true;
      } else if (
        valueInstructionalElement.fk_instructionalelementtype ===
        `http://127.0.0.1:8000/instrucelementtype/3/`
      ) {
        this.dialog_atividadecolaborativa = true;
      }
    },
    close_or_save_modulo(value) {
      var vm = this;
      if (value === "save") {
        vm.getDominio();
        this.dialog_modulo = false;
      } else if (value === "close") {
        this.dialog_modulo = false;
      }
      this.modulo = "";
      this.controlTreeView("modulo");
    },
    close_or_save_submodulo(value) {
      var vm = this;
      if (value === "save") {
        vm.getDominio();
        this.dialog_submodulo = false;
      } else if (value === "close") {
        this.dialog_submodulo = false;
      }
      this.modulo = "";
      this.submodulo = "";
      this.controlTreeView("submodulo");
    },
    close_or_save_conceito(value) {
      var vm = this;
      if (value === "save") {
        vm.getDominio();
        this.dialog_conceito = false;
      } else if (value === "close") {
        this.dialog_conceito = false;
      }
      this.conceito = "";
      this.modulo = "";
      this.controlTreeView("conceito");
    },
    async deleteelemento(value) {
      var vm = this;
      if (
        value.fk_idmediatype === `http://127.0.0.1:8000/mediatype/1/` ||
        value.fk_idmediatype === `http://127.0.0.1:8000/mediatype/2/` ||
        value.fk_idmediatype === `http://127.0.0.1:8000/mediatype/3/`
      ) {
        if (value.path !== null && value.url.search("mobilemedia") === 22) {
          await firebase
            .storage()
            .ref()
            .child(value.path)
            .delete();
        }
      }
      await axios.delete(value.url, {
        auth: {
          username: "admin",
          password: "admin"
        }
      });
      await vm.getDominio();
    },

    controlTreeView(value) {
      this.$emit("close", value);
    },

    findNameTarget(conceitos, relacao) {
      var targetconcept = relacao.targetconcept;
      var conceptSelect = conceitos.find(function(conceitofinded) {
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
    async dialogclose(rounds) {
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

      this.controlTreeView("procedimento");
      this.controlTreeView("mobilemedia");

      await this.$nextTick(function() {
        vm.getDominio();
      }, 3 + rounds);
      if (rounds > 5) {
        await setTimeout(function() {
          vm.getDominio();
        }, 600);
      }
    },
    instrucOpenFileDialog(value) {
      if (value.name === "Exercício") {
        this.dialog_avaliacao = true;
      } else if (value.name === "Avaliação") {
        this.dialog_avaliacao = true;
      } else if (value.name === "Atividade Colaborativa") {
        this.dialog_atividadecolaborativa = true;
      }
      this.instrucObjectFile = value.optionCall;
      this.instrucType = value.type;
      this.instrucValueType = value.valueType;
    },
    async instrucdialogclose(numberQuestions) {
      var vm = this;
      this.dialog_avaliacao = false;
      this.dialog_atividadecolaborativa = false;
      this.conceito = "";
      this.modulo = "";
      this.submodulo = "";
      this.elementoinstrucional = "";
      this.instrucObjectFile = "";
      this.instrucType = "";
      this.instrucValueType = "";

      this.controlTreeView("elementoinstrucional");

      await setTimeout(function() {
        vm.getDominio();
      }, 1200);
      if (numberQuestions > 5) {
        await setTimeout(function() {
          vm.getDominio();
        }, 1500);
      }
      if (numberQuestions > 10) {
        await setTimeout(function() {
          vm.getDominio();
        }, 1800);
      }
    },
    proceduresUnderConcept(concept) {
      function checkProcedure(proc) {
        return (
          proc.fk_informationitemtype ===
          "http://127.0.0.1:8000/informationitemtype/4/"
        );
      }

      var proceduresfinded = concept.informationitems.filter(checkProcedure);

      return proceduresfinded;
    },
    instrucElementsSearch(element) {
      function checkInstrucElements(instruc) {
        return (
          instruc.fk_instructionalelementtype ===
            "http://127.0.0.1:8000/instrucelementtype/1/" ||
          instruc.fk_instructionalelementtype ===
            "http://127.0.0.1:8000/instrucelementtype/2/" ||
          instruc.fk_instructionalelementtype ===
            "http://127.0.0.1:8000/instrucelementtype/3/"
        );
      }
      if (element !== "") {
        var instrucsfinded = element.instructionalelements.filter(
          checkInstrucElements
        );
        return instrucsfinded;
      } else {
        return [];
      }
    }
  }
};
</script>

<style></style>
