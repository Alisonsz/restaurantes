<template>
    <div class="container-data">
        <form>
            <div>
                <div class="d-grid mt-2 mb-3">
                    <label for="name" class="form-label bold-500 mb-0">Nome da categoria</label>
                    <input type="text" class="form-control" id="name" v-model="categoryData.categoryName" placeholder="Ex: Prato principal">
                    <p class="mb-0 required-alert" v-show="invalid.categoryName">*Campo obrigatório</p>
                </div>
                <div class="d-grid" v-if="(typeof selectedMenuIndex !== 'number')">
                    <label for="name" class="form-label bold-500 mb-0 mt-1">Adicione a um cardápio</label>
                    <div class="autocomplete-local">
                        <input type="text" class="form-control" placeholder="Digite..." v-model="menuTerm">
                        <ul v-if="searchMenus.length" class="w-full rounded search-list" role="list">
                            <li v-for="(menu, index) in searchMenus" :key="index">
                                <span>{{ menu.name }}</span> <span role="button" class="add-item add-right add-on" @click="addMenu(menu), menuTerm=''"></span>
                            </li>
                        </ul>
                    </div>
                    <div class="search-space"></div>
                    <p class="mb-0 required-alert" v-show="invalid.selectedMenu">*Campo obrigatório</p>
                </div>
                <div class="selected-menus" v-if="(typeof selectedMenuIndex !== 'number')">
                    <span v-for="(menu, index) in categoryData.selectedMenu" :key="index">{{ menu.name }}</span>
                </div>
                <div class="d-grid mt-3">
                    <button @click.prevent="save()" type="submit" class="btn btn-save">Criar nova categoria</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import {ref, computed} from 'vue';

    let menuList = ref('');

    const menuTerm = ref('');
    const searchMenus = computed(() => {
        if (menuTerm.value === '') {
            return [];
        }
        let matches = 0;
        return menuList.filter(menu => {
            if (menu.name.toLowerCase().includes(menuTerm.value.toLowerCase()) && matches < 10) {
                matches++;
                return menu;
            }
        });
    });

    export default {
        name: "FormCategory",
        setup() {
            return {
                menuList,
                menuTerm,
                searchMenus
            }
        },
        data() {
            return {
                invalid: {
                    selectedMenu: false,
                    categoryName: false
                },
                categoryData: {
                    selectedMenu: [],
                    categoryName: ""
                }
            }            
        },
        emits: ["saveCategory", "closeModal"],
        props: {
            selectedMenuIndex: Number,
            dataMenu: Object
        },
        methods: {
            addMenu(menu) {
                if (typeof (this.categoryData.selectedMenu.find((item) => item.name === menu.name)) !== "object") {
                    this.categoryData.selectedMenu.push(menu);
                }
            },
            valid(data) {
                let count = 0;
                let isvalid = true;
                for (const field in this.invalid) {
                    count++;
                    if (this.invalid.hasOwnProperty(field)) {
                        if (
                            (typeof data[field] === "string" && data[field] === "")
                            || (typeof data[field] === "object" && Object.keys(data[field]).length === 0)
                        ) {
                            this.invalid[field] = true;
                            isvalid =  false;
                        } else {
                            this.invalid[field] = false;
                        }
                        if (count === Object.keys(this.invalid).length) {
                            return(isvalid);
                        }
                    }
                }
            },
            save() {
                if (this.valid(this.categoryData)) {
                    this.$emit('saveCategory', this.categoryData);
                    this.$emit('closeModal');
                }
            }
        },
        mounted() {
            menuList = this.dataMenu;
            if (typeof this.selectedMenuIndex === "number") {
                this.categoryData.selectedMenu.push({id: this.selectedMenuIndex});   
            }
            
        }
    };
</script>

<style lang="scss" scoped>
    .modal-body .container-data {
        width: 330px !important;
        padding: 0 !important;
    }

    .modal-container {
        min-width: 350px !important;
    }

    .autocomplete-local {
        position: absolute;
        width: 100%;
        margin-top: 28px
    }

    .autocomplete-local .search-list {
        top: 48px;
    }

    .search-space {
        margin-top: 0;
        margin-bottom: 0;
        height: 43px;
    }

    .selected-menus {
        width: 100% !important;
        padding-top: 8px;
        position: relative;
        height: auto !important;
    }

    .selected-menus span {
        white-space: nowrap;
        display: inline-block;
        background-color: $light-blue;
        margin: 0 10px 7px 0;
        font-size: 14px;
        padding: 7px 15px;
        border-radius: 20px
    }
</style>