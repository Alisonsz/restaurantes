<template>
    <div class="container-data small-data">
        <form>
            <p class="hint">Encontre um produto já cadastrado na plataforma.</p>
            <div class="row">
                <div class="col-lg-10 d-grid gap-2">
                    <div class="w-full search-input">
                        <input type="text" class="form-control" placeholder="uscar itens do cardápio" v-model="productTerm">
                            <ul v-if="searchProducts.length" class="w-full rounded search-list" role="list">
                            <li v-for="(product, index) in searchProducts" :key="index">
                                <span>{{ product.name }}</span> <span role="button" class="add-item add-right add-on" @click="$emit('saveItem', { name: product.name, price: product.price, idAdd: this.selectedId }), $emit('closeModal'), productTerm=''"></span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-lg-2 d-grid gap-2 mb-2">
                    <button @click.prevent="" type="submit" class="btn btn-save"><span class="add-item add-inline icon-search"></span></button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import {ref, computed} from 'vue';

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
        name: "FormSearchItem",
        setup() {
            return {
                productList,
                productTerm,
                searchProducts
            }
        },
        data() {
            return {
                selectedId: "",
            }            
        },
        props: {
            idAdd: Number
        },
        emits: ["saveItem", "closeModal"],
        created() {
            if (typeof this.idAdd === "number") {
                this.selectedId = this.idAdd;
            }
            productList = [
                {name: "Amendoim", price: "1,50"},
                {name: "Banana", price: "1,50"},
                {name: "Bis", price: "1,50"},
                {name: "Brigadeiro", price: "2,50"},
                {name: "Castanha do Pará", price: "2,20"},
                {name: "Coco ralado", price: "2,50"},
                {name: "Doce de Leite", price: "2,40"},
                {name: "Frutas vermelhas", price: "3,10"},
                {name: "Goiabada", price: "1,20"},
                {name: "Granola", price: "2,50"},
                {name: "Granulado de chocolate", price: "2,70"},
                {name: "Kiwi", price: "5,50"},
                {name: "Leite condensado", price: "3,50"},
                {name: "Leite desnatado", price: "2,50"},
                {name: "Leite em pó", price: "2,50"},
                {name: "Leite zero lactose", price: "2,50"},
                {name: "Mel", price: "2,50"},
                {name: "Morango", price: "2,50"},
                {name: "Nutella", price: "5,50"},
                {name: "Paçoca", price: "1,50"}
            ];
        }
    };
</script>

<style lang="scss" scoped>
    .modal-body .small-data {
        width: 400px !important;
        padding: 0 !important;
    }

    .search-list {
        position: relative !important;
        top: 5px !important;
    }
</style>