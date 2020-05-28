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
    <v-treeview open-all :active="active" @update:active="test" :items="treeData" activatable></v-treeview>
</v-container>
</template>

<script>
export default {
    name: "TreeView",
    props: ["dominio"],
    data: () => ({
        treeData: [],
        active: [],
        elementTypes: {
            dominio: "Domínio",
            modulo: "Módulo",
            subModulo: "SubMódulo",
            conceito: "Conceito"
        },
    }),
    mounted() {
        var vm = this;
        setTimeout(function () {
            vm.setDomainVariables();
        }, 700);
    },
    methods: {
        test(value) {
            console.log('TEST', value);
        },
        setDomainVariables() {
            this.treeData = [];
            var indexmodulo = 0;
            this.treeData.push({
                id: this.dominio.idknowledgedomain,
                name: "[DOMINIO] " + this.dominio.nameknowledgedomain,
                children: []
            })
            if (this.dominio.modules.length) {
                this.dominio.modules.forEach(modulo => {

                    if (modulo.fk_idmodule === null) {
                        console.log("treedata:", this.treeData);
                        this.treeData[0].children.push({
                            id: modulo.idmodule+","+Object.getOwnPropertyNames(modulo)[1],
                            name: "[MODULO] " + modulo.namemodule,
                            children: []
                        })

                        if (modulo.submodules.length) {
                            var indexsubmodulo = 0;
                            modulo.submodules.forEach(submodulo => {
                                console.log("treedata:", this.treeData);
                                this.treeData[0].children[indexmodulo].children.push({
                                    id: submodulo.idmodule+","+Object.getOwnPropertyNames(submodulo)[1],
                                    name: "[SUBMODULO] " + submodulo.namemodule,
                                    children: []
                                })

                                if (submodulo.concepts.length) {
                                    submodulo.concepts.forEach(conceito => {
                                        console.log("treedata:", this.treeData);
                                        this.treeData[0].children[indexmodulo].children[indexsubmodulo].children.push({
                                            id: conceito.idconcept+","+Object.getOwnPropertyNames(conceito)[1],
                                            name: "[CONCEITO] " + conceito.nameconcept
                                        })
                                    });

                                }
                                indexsubmodulo++;
                            });

                        }
                        if (modulo.concepts.length) {
                            modulo.concepts.forEach(conceito => {
                                console.log("treedata:", this.treeData);
                                this.treeData[0].children[indexmodulo].children.push({
                                    id: conceito.idconcept+","+Object.getOwnPropertyNames(conceito)[1],
                                    name: "[CONCEITO] " + conceito.nameconcept
                                })
                            });
                        }

                        indexmodulo++;
                    }

                });
            }

        },
    },
    watch: {
        dominio: function (newVal, oldVal) {
            this.setDomainVariables();
            console.log('Prop changed: ', newVal, ' | was: ', oldVal);
        }
    }
};
</script>
