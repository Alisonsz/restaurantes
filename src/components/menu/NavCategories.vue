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
            <div v-if="allCategories.length === 0">
                <hr><p class="mt-4">Você ainda não adicionou nenhuma categoria ao seu cardápio. Comece agora para atrair cada vez mais clientes!</p>
            </div>
            <div class="table-data" v-for="(category, index) in allCategories" :key="index">
                <hr>
                <div class="row mt-4 mb-0">
                    <div class="col-6">
                        <p class="mb-0 pb-0">{{ category.name }}</p>
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
import { ref } from 'vue';
import draggable from 'vuedraggable';
import ModalFormMenu from "../ModalBase.vue";
import ModalFormCategory from "../ModalBase.vue";
import ModalFormAddItem from "../ModalBase.vue";
import ModalFormSearchItem from "../ModalBase.vue";
import ModalFormItem from "../ModalBase.vue";
import ModalFormOpeningHours from "../ModalBase.vue";

const showModalFormMenu = ref(false);
const showModalFormCategory = ref(false);
const showModalFormAddItem = ref(false);
const showModalFormSearchItem = ref(false);
const showModalFormItem = ref(false);
const showModalFormOpeningHours = ref(false);
</script>
<script>
import { mapState } from 'vuex';
import FormCategory from "./FormCategory.vue";

export default {
    name: "NavCategories",
    data() {
        return {
            showModalFormCategory: false,
        };
    },
    computed: {
        ...mapState(['menus']),
        allCategories() {
            let categoriesMap = {};

            this.menus.forEach(menu => {
                menu.categories.forEach(category => {
                    if (!categoriesMap[category.name]) {
                        categoriesMap[category.name] = {
                            name: category.name,
                            menus: []
                        };
                    }
                    categoriesMap[category.name].menus.push({ name: menu.name });
                });
            });

            console.log("Mapa de categorias construído:", categoriesMap);

            return Object.values(categoriesMap);
        },
        allMenus() {
            return this.menus.map(menu => ({
                name: menu.name,
                id: menu.id
            }));
        }
    },
    methods: {
        saveCategory(categoryData) {
            if (categoryData && categoryData.categoryName && categoryData.selectedMenu) {
                let menuIndex = this.menus.findIndex(menu => menu.name === categoryData.selectedMenu.name);
                if (menuIndex !== -1) {
                    let categoryIndex = this.menus[menuIndex].categories.findIndex(cat => cat.name.toLowerCase() === categoryData.categoryName.trim().toLowerCase());
                    if (categoryIndex === -1) {
                        this.menus[menuIndex].categories.push({
                            name: categoryData.categoryName.trim(),
                            items: []
                        });
                    }
                }
            }
        }
    },
    components: {
        FormCategory
    },
    mounted() {
        console.log("Categorias processadas (mounted):", this.allCategories);
        this.$nextTick(() => {
            console.log("Renderizou após montagem. Categorias:", this.allCategories);
        });
    },
    watch: {
        showModalFormCategory(newValue) {
            console.log("Mudança em showModalFormCategory:", newValue);
        }
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