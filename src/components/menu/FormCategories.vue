<template>
    <div class="container-data">
        <form>
            <label for="name" class="form-label bold-500">Nome das categorias</label>
            <div class="mb-3 form-control input-form" v-for="(category, index) in allCategories" :key="index">
                <span class="text">{{category.name}}</span>
                <span class="add-item add-right check-on" role="button" @click="removeCategory(index)"></span>
            </div>
            <div class="row mb-3">
                <div class="col-lg-8 d-grid gap-2">
                    <input type="text" class="form-control" v-model="categoryName">
                    <p class="mb-0 required-alert" v-show="invalidCategories">*Campo obrigatório</p>
                </div>
                <div class="col-lg-4 d-grid gap-2">
                    <button @click.prevent="addCategories()" type="submit" class="btn btn-save"><span class="add-item add-inline add-black ml-1"></span> Adicionar</button>
                </div>
            </div>
            <div class="d-grid gap-2">
                <button @click.prevent="save()" type="submit" class="btn btn-save">Salvar categorias</button>
            </div>
            <p class="text-center hint mt-4 mb-0 link" @click="$emit('skipCategories')">Adicionar novas categorias posteriormente.</p>
        </form>
    </div>
</template>

<script>
    export default {
        name: "FormCategories",
        data() {
            return {
                invalidCategories: false,
                categoryName: "",
                allCategories: []
            }            
        },
        methods: {
            addCategories() {
                if (typeof this.categoryName === "string" && this.categoryName.trim() !== "") {
                    this.allCategories.push({name: this.categoryName.trim(), items: [], active: true}); 
                    this.categoryName = "";
                    this.invalidCategories = false;
                }
            },
            removeCategory(index) {
                this.allCategories.splice(index, 1);
            },
            save() {
                if (this.allCategories.length === 0) {
                    this.invalidCategories = true;
                } else {
                    this.$emit('saveCategories', this.allCategories);
                }
            }
        },
        emits: ["skipCategories", "saveCategories"],
        props: {
            dataMenu: Object
        }
    };
</script>