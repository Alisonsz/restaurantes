<template>
    <div>
        <div class="row mb-3 mt-3">
            <div class="col-6"></div>
            <div class="col-6 create-new text-end">
                <button @click="showModalFormCategory = true" type="button" class="btn btn-green new-category">
                    <span class="add-item add-inline add-black ml-1"></span> Adicionar categoria
                </button>
            </div>
        </div>
        <div class="pb-4">
            <div class="row mt-4 mb-0">
                <div class="col-6">
                    <p class="bold-500 mb-0 pb-0">Nome da categoria</p>
                </div>
                <div class="col-6 create-new text-end">
                    <p class="bold-500 mb-0 pb-0">Cardápios</p>
                </div>
            </div>
            <div v-if="Object.keys(allCategories).length === 0">
                <hr><p class="mt-4">Você ainda não adicionou nenhuma categoria ao seu cardápio. Comece agora para atrair cada vez mais clientes!</p>
            </div>
            <div class="table-data" v-for="(category, index) in allCategories" :key="index">
                <hr>
                <div class="row mt-4 mb-0">
                    <div class="col-6">
                        <p class="mb-0 pb-0">{{ category.category }}</p>
                    </div>
                    <div class="col-6 create-new text-end">
                        <span class="mb-0 pb-0 btn-round input-base" v-for="(menu, i) in category.menus" :key="i">{{ menu.name }}</span>
                    </div>
                </div>
            </div>
        </div>
        <Teleport to="body">
            <ModalFormCategory :show="showModalFormCategory" @close="showModalFormCategory = false">
                <template #header>Nova categoria</template>
                <template #body>
                    <FormCategory @close-modal="showModalFormCategory= false" @save-category="saveCategory" :dataMenu="allMenus"/>
                </template>
            </ModalFormCategory>
        </Teleport>
    </div>
</template>

<script setup>
    import { ref } from 'vue'

    import ModalFormCategory from "../ModalBase.vue"
    const showModalFormCategory = ref(false)
</script>

<script>
    import FormCategory from "./FormCategory.vue"

    export default {
        name: "NavCategories",
        data() {
            return {
                allCategories: [],
                allMenus: [
                    {name: "Cardápio Árabe", id: 1},
                    {name: "Cardápio Japonês", id: 2},
                    {name: "Cardápio Italiano", id: 3},
                    {name: "Cardápio de Saladas", id: 4}
                ]
            }            
        },
        methods: {
            searchCategory(term) {
                for (let i = 0; i < Object.keys(this.allCategories).length; i++) {
                    if (this.allCategories[i].category === term) {
                        return i;
                    }
                }
                return -1;
            },
            saveCategory(categoryData) {
                if (typeof categoryData.categoryName === "string" && categoryData.categoryName.trim() !== "" && typeof categoryData.selectedMenu === "object") {
                    if (!this.allCategories.some(category => category.category.toLowerCase() === categoryData.categoryName.trim().toLowerCase())) {
                        this.allCategories.push({
                            category: categoryData.categoryName.trim(), 
                            menus: categoryData.selectedMenu
                        });
                    } else {
                        categoryData.selectedMenu.filter((menu) => {
                            if (!this.allCategories[this.searchCategory(categoryData.categoryName.trim())].menus.includes(menu)) {
                                this.allCategories[this.searchCategory(categoryData.categoryName.trim())].menus.push(menu);
                            }
                        });
                    }
                }
            }
        },
        components: {
            FormCategory
        },
        props: {
            dataMenu: Object
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
</style>