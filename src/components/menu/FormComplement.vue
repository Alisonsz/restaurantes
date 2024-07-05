<template>
    <div class="container-data">
        <form>  
            <div class="row">
                <div class="col-lg-12 d-grid">
                    <label class="form-label bold-500 mb-1">Nome</label>
                    <input type="text" class="form-control" v-model="dataComplement.name" placeholder="Ex: Hamburguer">
                    <p class="mb-0 mt-1 required-alert" v-show="invalid.name">*Campo obrigatório</p>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-lg-6 d-grid">
                    <div class="w-full search-input">
                        <label class="form-label bold-500 mb-1">Adicionar item</label>
                        <input type="text" class="form-control" placeholder="Digite..." v-model="productTerm">
                        <ul v-if="searchProducts.length" class="w-full rounded search-list" role="list">
                            <li v-for="(product, index) in searchProducts" :key="index">
                                <span>{{ product.name }}</span> <span role="button" class="add-item add-right add-on" @click="selectProduct(product), productTerm=''"></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="mt-3 pointer">
                <span role="button" @click="showModalFormItem = true">
                    <span class="add-item add-inline add-black ml-1"></span> Clique aqui para criar e adicionar um novo item
                </span>
            </div>
            <div v-if="(typeof dataComplement.items === 'object' && Object.keys(dataComplement.items).length)">
                <draggable v-model="dataComplement.items" tag="div">
                    <template #item="{ element: item, index }">
                        <div class="list-item accordion mt-3" :id="('accordion-'+index)">
                            <div class="accordion-item">
                                <h2 class="accordion-header" :id="'heading-'+index">
                                    <span>
                                        <span class="add-item add-inline icon-drag ml-1"></span> {{ item.name }}
                                    </span>
                                    <span class="item-actions">
                                        <span class="item-price" @click.prevent="">R$ 
                                            <span v-if="item.price">{{ item.price }}</span>
                                            <span v-else>0,00</span>
                                        </span>
                                        <div class="dropdown">
                                            <span class="dropdown-toggle add-item add-inline icon-options ml-1" data-bs-toggle="dropdown" aria-expanded="false"></span>
                                            <ul class="dropdown-menu">
                                                <li><a class="dropdown-item" href="#" @click="showModalFormItem = true, editItem(index)">Editar</a></li>
                                                <li><a class="dropdown-item" href="#" @click="removeItem(index)">Excluir</a></li>
                                                <li><a class="dropdown-item" href="#" @click="showModalFormAddItem = true, addItem(index)">Adicionar complemento</a></li>
                                            </ul>
                                        </div>
                                    </span>
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="('#item-'+index)" aria-expanded="false" :aria-controls="('item-'+index)"></button>
                                </h2>
                                <div :id="('item-'+index)" class="accordion-collapse collapse" :aria-labelledby="'heading-'+index" :data-bs-parent="('#item-'+index)">
                                    <div class="accordion-body">
                                        <div v-if="(typeof item.items === 'object') && Object.keys(item.items).length">
                                            <draggable v-model="item.items" tag="div">
                                                <template #item="{ element: subitem, i }">
                                                    <h2 class="accordion-header mt-2 list-subitem">
                                                        <span>
                                                            <span class="add-item add-inline icon-drag ml-1"></span> {{ subitem.name }}
                                                        </span>
                                                        <span class="item-actions">
                                                            <div class="dropdown">
                                                                <span class="dropdown-toggle add-item add-inline icon-options ml-1" data-bs-toggle="dropdown" aria-expanded="false"></span>
                                                                <ul class="dropdown-menu">
                                                                    <li><a class="dropdown-item" href="#" @click="showModalFormItem = true, editItem(i)">Editar</a></li>
                                                                    <li><a class="dropdown-item" href="#" @click="removeItem(i)">Excluir</a></li>
                                                                </ul>
                                                            </div>
                                                        </span>
                                                    </h2>
                                                </template>
                                            </draggable>
                                        </div>
                                        <div class="bold-500" v-else>
                                            <span class="mt-3 mb-3">Não há subitens cadastrados.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </draggable>
            </div>
            <div class="rules">
                <h2>Regras de uso</h2>
                <p class="hint">Defina as regras de seleção de complementos para os seus clientes.</p>
                <hr>
                <p class="text">
                    A seleção de pelo menos um item é obrigatória?
                    <label class="switch-yn ml-1">
                        <input type="checkbox" v-model="dataComplement.selectOne">
                        <span class="slider round"></span>
                    </label>
                </p>
                <p class="text">
                    Até quantos itens diferentes o usuário pode selecionar?
                </p>
                <input type="number" class="form-control number" v-model="dataComplement.selectNumber">
                <p class="text">
                    O usuário pode selecionar um item mais de uma vez?
                    <label class="switch-yn ml-1">
                        <input type="checkbox" v-model="dataComplement.selectMore">
                        <span class="slider round"></span>
                    </label>
                </p>
                <div v-show="dataComplement.selectMore">
                    <p class="text">
                        Até quantas vezes?
                    </p>
                    <input type="number" class="form-control number" v-model="dataComplement.moreNumber">
                </div>
            </div>
        </form>
        <div class="row mb-3 mt-4 modal-footer">
            <div class="offset-lg-8 col-lg-2 d-grid gap-2">
                <button @click.prevent="$emit('closeModal')" type="submit" class="btn btn-cancel">Cancelar</button>
            </div>
            <div class="col-lg-2 d-grid gap-2">
                <button @click.prevent="save()" type="submit" class="btn btn-save">Salvar</button>
            </div>
        </div>
        <Teleport to="body">
            <ModalFormAddItem :show="showModalFormAddItem" @close="showModalFormAddItem = false">
                <template #header>Adicionar item</template>
                <template #body>
                    <FormAddItem @close-modal="showModalFormAddItem= false" @new-item="showModalFormItem = true" @search-item="showModalFormSearchItem = true"/>
                </template>
            </ModalFormAddItem>
            <ModalFormSearchItem :show="showModalFormSearchItem" @close="showModalFormSearchItem = false">
                <template #header>Buscar item</template>
                <template #body>
                    <FormSearchItem @close-modal="showModalFormSearchItem= false" @save-item="saveItem" :idAdd="itemEditData.idAdd"/>
                </template>
            </ModalFormSearchItem>
            <ModalFormItem :show="showModalFormItem" @close="showModalFormItem = false">
                <template #header>Novo item</template>
                <template #body>
                    <FormItem @close-modal="showModalFormItem= false" @save-item="saveItem" :itemEditData="itemEditData"/>
                </template>
            </ModalFormItem>
        </Teleport>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import draggable from 'vuedraggable';
    import ModalFormAddItem from "../ModalBase.vue"
    import ModalFormSearchItem from "../ModalBase.vue"
    import ModalFormItem from "../ModalBase.vue";
</script>

<script>
    import {ref, computed} from 'vue';
    import FormAddItem from "./FormAddItem.vue"
    import FormSearchItem from "./FormSearchItem.vue"
    import FormItem from "./FormItem.vue";

    let showModalFormAddItem = ref(false)
    let showModalFormSearchItem = ref(false)
    let showModalFormItem = ref(false);

    let productList = ref('');

    const productTerm = ref('');
    const searchProducts = computed(() => {
        if (productTerm.value === '') {
            return [];
        }
        let matches = 0;
        return productList.filter(product => {
            if (product.name.toLowerCase().includes(productTerm.value.toLowerCase()) && matches < 10) {
                matches++;
                return product;
            }
        });
    });

    export default {
        name: "FormComplement",
        setup() {
            return {
                productList,
                productTerm,
                searchProducts
            }
        },
        data() {
            return {
                itemEditData: [],
                invalid: {
                    name: false
                },
                dataComplement: {
                    name: "",
                    active: true,
                    items: [],
                    selectOne: true,
                    selectNumber: 1,
                    selectMore: false,
                    moreNumber: 1
                }
            }            
        },
        props: {
            complementEditData: Object,
            allComplement: Object,
            dataMenu: Object
        },
        components: {
            FormAddItem,
            FormSearchItem,
            FormItem
        },
        methods: {
            orderList(dataList) {
                return dataList.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
            },
            selectProduct(selectedProduct) {
                if (!this.dataComplement.items.some(product => product.name.toLowerCase() === selectedProduct.name.toLowerCase())) {
                    this.dataComplement.items.push(selectedProduct);
                }
            },
            saveItem(itemData) {
                if (typeof itemData === "object") {
                    if (typeof itemData.id == "number") {
                        this.dataComplement.items[itemData.id] = itemData;
                    } else if (typeof itemData.idAdd == "number") {
                        if (typeof this.dataComplement.items[itemData.idAdd]["items"] === "object") {
                            this.dataComplement.items[itemData.idAdd].items.push(itemData); 
                        } else {
                            this.dataComplement.items[itemData.idAdd].items = [itemData];
                        }
                    } else {
                        this.dataComplement.items.push(itemData);
                        productList.push(itemData);
                    }
                    this.itemEditData.id = "";
                    this.itemEditData.idAdd = "";
                }
                productList = this.orderList(productList);
            },
            selectItem (index, cross) {
                if (typeof index == "number") {
                    this.itemEditData = this.allItems[index];
                    this.itemEditData['id'] = index;
                    this.itemEditData['cross'] = cross;
                } else {
                    this.itemEditData = {cross: cross}; 
                }
            },
            editItem(index) {
                if (typeof index == "number") {
                    this.itemEditData = this.dataComplement.items[index];
                    this.itemEditData.id = index;
                }
            },
            addItem(index) {
                if (typeof index == "number") {
                    this.itemEditData = [];
                    this.itemEditData.idAdd = index;
                }
            },
            removeItem (index) {
                if (typeof index == "number") {
                    this.dataComplement.items.splice(index,1); 
                }
            },
            valid(data) {
                let count = 0;
                let isvalid = true;
                for (const field in this.invalid) {
                    count++;
                    if (this.invalid.hasOwnProperty(field)) {
                        if (typeof data[field] === "string" && data[field] === "") {
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
                if (this.valid(this.dataComplement)) {
                    this.$emit('saveComplement', this.dataComplement);
                    this.$emit('closeModal');
                }
            }
        },
        emits: ["saveComplement", "closeModal"],
        created() {
            productList = [
                {name: "Granola", price: "2,50"},
                {name: "Banana", price: "1,50"},
                {name: "Morango", price: "2,50"},
                {name: "Leite condensado", price: "3,50"},
                {name: "Paçoca", price: "1,50"},
                {name: "Nutella", price: "5,50"},
                {name: "Coco ralado", price: "2,50"},
                {name: "Leite zero lactose", price: "2,50"},
                {name: "Kiwi", price: "5,50"},
                {name: "Amendoim", price: "1,50"},
                {name: "Castanha do Pará", price: "2,20"},
                {name: "Leite em pó", price: "2,50"},
                {name: "Doce de Leite", price: "2,40"},
                {name: "Mel", price: "2,50"},
                {name: "Granulado de chocolate", price: "2,70"},
                {name: "Goiabada", price: "1,20"},
                {name: "Leite desnatado", price: "2,50"},
                {name: "Bis", price: "1,50"},
                {name: "Frutas vermelhas", price: "3,10"},
                {name: "Brigadeiro", price: "2,50"}
            ];
        }, 
        mounted() {
            productList = this.orderList(productList);

            if (typeof this.complementEditData == "object" && typeof this.complementEditData.name == "string") {
                this.dataComplement.id = this.complementEditData.id;
                this.dataComplement.name = this.complementEditData.name;
                this.dataComplement.active = this.complementEditData.active;
                this.dataComplement.items = this.complementEditData.items;
                this.dataComplement.selectOne = this.complementEditData.selectOne;
                this.dataComplement.selectNumber = this.complementEditData.selectNumber;
                this.dataComplement.selectMore = this.complementEditData.selectMore;
                this.dataComplement.moreNumber = this.complementEditData.moreNumber;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .modal-body .container-data {
        width: 600px;
        padding: 0 !important;
    }

    .header {
        .title {
            margin-top: 10px;
        }
        .status label{
            margin-top: 5px;
            float: right;
        }
    }

    .hr-title {
        margin-top: 15px;
    }

    .input-group {
        .block-1 {
            border-color: $gray-line;
            padding-top: 8px;
            background-color: $white-primary;
        }
        .block-2 {
            background-color: $gray-line;
        }
        .block-3 {
            border-radius: 0 9px 9px 0 !important;
        }

    } 

    .form-floating {
        margin-top: -12px;
    }

    .item-description {
        height: 80px;
    }

    .rules {
        border: 1px solid $gray-line;
        border-radius: 9px !important;
        margin-top: 20px;
        padding: 15px;
        h2 {
            font-size: 20px;
            font-weight: 500;
            margin-bottom: 2px
        }
        .hint {
            margin: 5px 0;
        }
        hr {
            margin: 5px 0 20px 0;
        }
        p.text {
            font-size: 16px;
            font-weight: 500;
            margin: 16px 0 0 0;
        }
        input.number {
            width: 50px;
            margin-top: 5px;
        }
    }

    .accordion-button:not(.collapsed) {
        background-color: transparent;
        border: none !important;
        color: $black-secondary;
        box-shadow: none;
    }


    .accordion-header {
        position: relative;
        font-size: 16px;
        height: 45px;
        font-weight: 400;
        padding-top: 13px;
        padding-left: 16px;
    }

    .accordion-button {
        position: absolute;
        top: 0;
        right: 3px;
        width: 40px;
        padding-left: 8px;
        background-color: transparent;
    }

    .accordion-header .icon-drag {
        margin-top: -5px;
    }

    .accordion-header .item-price {
        padding: 6px 14px;
        margin-right: 15px;
        border-radius: 4px;
        position: relative;
        top: 1px;
        position: absolute;
        top: 7px;
        right: 75px;
    }

    .accordion-header .icon-options {
        background-size: 26px 26px;
        height: 26px;
        width: 26px;
        position: absolute;
        top: 8px;
        right: 38px;
    }

    .accordion-body {
        padding-top: 0;
    }

    .item-actions .dropdown {
        position: absolute;
        right: 0;
        top: 0;
    }

    .item-actions .dropdown-toggle::after {
        display: none;
    }

    .item-actions .dropdown li {
        border-top: 1px solid $gray-line;
        padding-top: 10px;
        padding-bottom: 10px;
        list-style: none;
    }

    .item-actions .dropdown li:first-child {
        border-top: none !important;
    }

    .dropdown-menu {
        padding: 2px 15px;
    }

    .list-item .accordion-item {
        background-color: $gray-bg;
    }

    .list-item .accordion-header .item-price {
        background-color: $white-primary;
    }

    .list-subitem {
        background-color: $white-primary;
    }

    .list-subitem .item-price {
        background-color: $gray-bg;
    }
</style>