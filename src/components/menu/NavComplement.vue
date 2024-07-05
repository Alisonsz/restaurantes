<template>
    <div>
        <div class="row mb-3 mt-3">
            <div class="col-4">
                <div class="input-group mb-3 item-filter">
                    <input type="text" class="form-control input-form" placeholder="Buscar produto" v-model="complementTerm">
                    <span class="input-group-text input-form" id="basic-addon1"><span class="add-item add-inline icon-search"></span></span>
                </div>
            </div>
            <div class="col-4">
                <select class="form-select item-order input-form" v-model="orderBy" @change="orderList">
                    <option value="">Organizar por</option>
                    <option value="name">Nome</option>
                </select>
            </div>
            <div class="col-4 create-new text-end">
                <button @click="showModalFormComplement = true" type="button" class="btn btn-green new-category">
                    <span class="add-item add-inline add-black ml-1"></span> Criar complemento
                </button>
            </div>
        </div>
        <div class="pb-4">
            <table class="table mt-3">
                <thead>
                    <tr>
                        <th scope="col"><span class="bold-500">Nome do complemento</span></th>
                        <th scope="col"><span class="bold-500">Itens utilizados</span></th>
                        <th scope="col"><span class="bold-500">Status</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(complement, index) in searchComplements" :key="index">
                        <td class="bold-400">
                            {{ complement.name }}
                        </td>
                        <td class="used-items">
                            <span v-for="(item, i) in complement.items" :key="i" class=" ml-1">{{ item.name }}</span>
                        </td>
                        <td class="item-actions">
                            <label class="switch ml-1">
                                <input type="checkbox" v-model="complement.active">
                                <span class="slider round"></span>
                            </label>
                            <button class="btn btn-round input-base edit-button" @click="showModalFormComplement = true, selectItem(index)">
                                <span class="edit-data"></span> 
                                <span class="text">Editar</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="Object.keys(allComplement).length === 0">
                <p class="mt-4">Você ainda não adicionou nenhum complemento ao seu cardápio. Comece agora para atrair cada vez mais clientes!</p>
            </div>
        </div>
        <Teleport to="body">
            <ModalFormComplement :show="showModalFormComplement" @close="showModalFormComplement = false">
                <template #header>Adicionar complemento</template>
                <template #body>
                    <FormComplement @close-modal="showModalFormComplement= false" @save-complement="saveComplement" :complementEditData="complementEditData"/>
                </template>
            </ModalFormComplement>
        </Teleport>
    </div>
</template>

<script setup>
    import { ref } from 'vue'

    import ModalFormComplement from "../ModalBase.vue"
    const showModalFormComplement = ref(false)
</script>

<script>
    import FormComplement from "./FormComplement.vue"
    import {ref, computed} from 'vue';

    let complementList = ref('');

    const complementTerm = ref('');
    const searchComplements = computed(() => {
        if (complementTerm.value === '') {
            return complementList;
        }
        return complementList.filter(complement => {
            if (complement.name.toLowerCase().includes(complementTerm.value.toLowerCase())) {
                return complement;
            }
        });
    });

    export default {
        name: "NavComplement",
        setup() {
            return {
                complementList,
                complementTerm,
                searchComplements
            }
        },
        data() {
            return {
                allComplement: [],
                complementEditData: [],
                orderBy: "",
            }            
        },
        methods: {
            saveComplement(complementData) {
                if (typeof complementData === "object") {
                    if (typeof complementData.id == "number") {
                        this.allComplement[complementData.id] = complementData;
                    } else {
                        this.allComplement.push(complementData);
                    }
                }
                this.complementEditData = [];
            },
            selectItem (index) {
                if (typeof index == "number") {
                    this.complementEditData = this.allComplement[index];
                    this.complementEditData['id'] = index;
                }
            },
            orderList() {
                switch(this.orderBy) {
                    case "name":
                        complementList = complementList.sort((a, b) => {
                            return a.name.localeCompare(b.name);
                        });
                        break;
                    case "nameasc":
                        complementList = complementList.sort((a, b) => {
                            return b.name.localeCompare(a.name);
                        });
                        break;
                }
            }
        },
        components: {
            FormComplement
        },
        props: {
            dataMenu: Object
        },
        created() {
            complementList = this.allComplement;
        }
    }
</script>

<style lang="scss" scoped>
    .create-new {
        text-align: right;
        .new-menu {
            border: 1px solid $gray-line;
            margin-right: 20px;
        }
        button {
            padding-left: 20px;
            padding-right: 20px;
        }
    }

    .table-data .input-base {
        background-color: $light-blue;
        margin-left: 10px;
        padding-top: 9px !important;
        padding-bottom: 9px !important;
        white-space: nowrap;
    }

    .item-actions {
        width: 240px;
    }

    .item-filter {
        .form-control {
            border-radius: 9px 0 0 9px !important;
        }
        .input-group-text {
            border-radius: 0 9px 9px 0 !important;
        }
        .icon-search {
            margin-top: -5px;
        }
    }

    .table thead span {
        display: block;
        padding-bottom: 10px;
    } 

    .table tbody td {
        vertical-align: middle;
        padding-top: 15px;
        padding-bottom: 15px;
    } 

    .table tbody td .switch {
        top: -3px !important;
    } 

    .used-items {
        padding-right: 50px !important;
    }

    .used-items span {
        border-right: 1px solid $gray-line;
        padding-right: 10px
    }

    .used-items span:last-child {
        border-right: none;
    }
</style>