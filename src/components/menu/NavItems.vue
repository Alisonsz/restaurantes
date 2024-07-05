<template>
    <div>
        <div class="row mb-3 mt-3">
            <div class="col-4">
                <div class="input-group mb-3 item-filter">
                    <input type="text" class="form-control input-form" placeholder="Buscar produto" v-model="itemTerm">
                    <span class="input-group-text input-form" id="basic-addon1"><span class="add-item add-inline icon-search"></span></span>
                </div>
            </div>
            <div class="col-4">
                <select class="form-select item-order input-form" v-model="orderBy" @change="orderList">
                    <option value="">Organizar por</option>
                    <option value="name">Nome</option>
                    <option value="menu">Cardápio</option>
                </select>
            </div>
            <div class="col-4 create-new text-end">
                <button @click="showModalFormItem = true" type="button" class="btn btn-green new-category">
                    <span class="add-item add-inline add-black ml-1"></span> Adicionar novo item
                </button>
            </div>
        </div>
        <div class="pb-4">
            <table class="table mt-3">
                <thead>
                    <tr>
                        <th scope="col"><span class="bold-500">Nome do produto</span></th>
                        <th scope="col"><span class="bold-500">Cardápio</span></th>
                        <th scope="col"><span class="bold-500">Valor</span></th>
                        <th scope="col"><span class="bold-500">Status</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in searchItems" :key="index">
                        <td class="bold-400">
                            <img v-if="item.image !== ''" :src="item.image" class="thumb-table">
                            <img v-else src="~@/assets/img/img.svg" class="thumb-table">
                            {{ item.name }}
                        </td>
                        <td>{{ item.menu }}</td>
                        <td>{{ item.price }}</td>
                        <td class="item-actions">
                            <label class="switch ml-1">
                                <input type="checkbox" v-model="item.active">
                                <span class="slider round"></span>
                            </label>
                            <button class="btn btn-round input-base edit-button" @click="showModalFormItem = true, selectItem(index)">
                                <span class="edit-data"></span> 
                                <span class="text">Editar</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="Object.keys(allItems).length === 0">
                <p class="mt-4">Você ainda não adicionou nenhum item ao seu cardápio. Comece agora para atrair cada vez mais clientes!</p>
            </div>
        </div>
        <Teleport to="body">
            <ModalFormItem :show="showModalFormItem" @close="showModalFormItem = false">
                <template #header>Novo item</template>
                <template #body>
                    <FormItem @close-modal="showModalFormItem= false" @save-item="saveItem" :allCategories="allCategories" :allComplement="allComplement" :setCategory="''" :itemEditData="itemData"/>
                </template>
            </ModalFormItem>
        </Teleport>
    </div>
</template>

<script setup>
    import { ref } from 'vue'

    import ModalFormItem from "../ModalBase.vue"
    const showModalFormItem = ref(false)
</script>

<script>
    import FormItem from "./FormItem.vue"
    import {ref, computed} from 'vue';

    let itemList = ref('');

    const itemTerm = ref('');
    const searchItems = computed(() => {
        if (itemTerm.value === '') {
            return itemList;
        }
        return itemList.filter(item => {
            if (item.name.toLowerCase().includes(itemTerm.value.toLowerCase())) {
                return item;
            }
        });
    });

    export default {
        name: "NavItems",
        setup() {
            return {
                itemList,
                itemTerm,
                searchItems
            }
        },
        data() {
            return {
                allCategories: [],
                allComplement: [],
                itemData: [],
                allItems: [],
                orderBy: "",
            }            
        },
        methods: {
            saveItem(itemData, categoriesData) {
                if (typeof itemData === "object") {
                    if (typeof itemData.id == "number") {
                        var idItem = itemData.id;
                        this.allItems[itemData.id] = itemData;
                    } else {
                        var idItem = this.allItems.push(itemData) -1;
                    }
                }
                this.allItems[idItem]["categories"] = categoriesData;
                this.allItems[idItem]["menu"] = this.dataMenu[0].name;
                this.allItems = this.allItems;
                this.itemData = [];
                this.orderList();
            },
            selectItem (index) {
                if (typeof index == "number") {
                    this.itemData = this.allItems[index];
                    this.itemData['id'] = index;
                }
            },
            orderList() {
                switch(this.orderBy) {
                    case "name":
                        itemList = itemList.sort((a, b) => {
                            return a.name.localeCompare(b.name);
                        });
                        break;
                    case "nameasc":
                        itemList = itemList.sort((a, b) => {
                            return b.name.localeCompare(a.name);
                        });
                        break;
                    case "menu":
                        itemList = itemList.sort((a, b) => {
                            return a.menu.localeCompare(b.menu);
                        });
                        break;
                    case "menuasc":
                        itemList = itemList.sort((a, b) => {
                            return b.menu.localeCompare(a.menu);
                        });
                        break;

                }
            }
        },
        components: {
            FormItem
        },
        props: {
            dataMenu: Object
        },
        created() {
            itemList = this.allItems;
        },
        mounted() {
            var removeDuplicates = [];
            this.dataMenu.map((menu) => {
                menu.categories.map((category) => {
                    removeDuplicates.push(category.name);
                })
            });
            this.allCategories = removeDuplicates.filter((value, index, self) => {
                return self.indexOf(value) === index;
            }); 
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
</style>