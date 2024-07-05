<template>
    <div class="container-data">
        <form>
            <div class="row header">
                <div class="col-lg-6">
                    <label class="form-label bold-500 title">Adicionar produto</label>
                </div>
                <div class="col-lg-6 status">
                    <label class="switch"><input type="checkbox" v-model="itemData.active"><span class="slider round"></span></label>
                </div>
            </div>
            <hr class="hr-title">
            <div class="row">
                <div class="col-lg-6 d-grid">
                    <label class="form-label bold-500" for="name">Nome</label>
                </div>    
            </div>    
            <div class="row">
                <div class="col-lg-6 d-grid">
                    <input type="text" class="form-control mb-2" id="name" v-model="itemData.name" placeholder="Ex: Hamburguer">
                    <p class="mb-0 required-alert" v-show="invalid.name">*Campo obrigatório</p>
                </div>
                <div class="col-lg-6">
                    <div class="input-group mb-1">
                        <span class="input-group-text bold-500 block-1">Preço por unidade</span>
                        <span class="input-group-text block-2">R$</span>
                        <input type="text" class="form-control block-3" placeholder="Ex. 20,00" v-model="itemData.price">
                    </div>
                    <p class="mb-0 required-alert" v-show="invalid.price">*Campo obrigatório</p>
                </div>
            </div>
            <div class="row mt-1">
                <div class="col-lg-4 d-grid">
                    <div class="mb-3">
                        <label for="image" class="form-label bold-500">Adicionar imagem</label>
                        <div class="inputfile-box">
                            <input type="file" id="file" class="inputfile" accept="image/*" @change="onFileChange">
                            <label for="file">
                                <span class="file-box">
                                    <p>{{ imageName.trim() !== '' ? imageName : "Adicionar imagem" }}</p>
                                </span>
                                <span class="file-button" v-if="typeof itemData.image == 'string' && itemData.image !== ''">
                                    <img :src="itemData.image">
                                </span>
                                <span class="file-button" v-else>
                                    <img src="~@/assets/img/img.svg">
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="col-lg-8 d-grid">
                    <label for="description" class="bold-500 ">Descrição do produto</label>
                    <div class="form-floating">
                        <textarea class="form-control item-description" placeholder="Leave a comment here" id="description" v-model="itemData.description"></textarea>
                        <label for="description">Ex: Hamburger de 200g com pão australiano.</label>
                    </div>
                </div>
            </div>
            <div class="row mt-1">
                <div class="col-lg-12 d-grid">
                    <div class="accordion" id="accordionCategory">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingOne">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCategory" aria-expanded="false" aria-controls="collapseCategory">
                                <span class="bold-500 ml-1">Categoria</span> <span>(opcional)</span>
                            </button>
                            </h2>
                            <div id="collapseCategory" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionCategory">
                            <div class="accordion-body">
                                <span class="hint mt-0 pt-0">Selecione a categoria apropriada para o item que você está adicionando ao seu cardápio.</span>
                                <div class="row mt-0">
                                    <div class="col-lg-9 d-grid">
                                        <select class="form-select" v-model="selectCategory">
                                            <option value="">Selecione uma categoria</option>
                                            <option v-for="(category, index) in allCategories" :key="index" :value="category">{{ category }}</option>
                                        </select>
                                    </div>
                                    <div class="col-lg-3 d-grid">
                                        <button @click.prevent="addCategory()" type="submit" class="btn btn-save">
                                            <span class="add-item add-inline add-black ml-1"></span> Adicionar
                                        </button>
                                    </div>
                                </div>
                                <div v-if="(typeof categories == 'object' && Object.keys(categories).length > 0)" class="mt-4 mb-2">
                                    <span class="ml-1">Categorias adicionadas:</span>
                                    <span  v-for="(category, index) in categories" :key="index" class="btn-round input-base edit-button bold-500 ml-1">{{ category.name }}</span>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-4">
                <div class="col-lg-12 d-grid">
                    <div class="accordion" id="accordionComplement">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingOne">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseComplement" aria-expanded="false" aria-controls="collapseComplement">
                                <span class="bold-500 ml-1">Compelemento</span> <span>(opcional)</span>
                            </button>
                            </h2>
                            <div id="collapseComplement" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionComplement">
                            <div class="accordion-body">
                                <span class="hint mt-0 pt-0">Selecione o complemento apropriado para o item que você está adicionando ao seu cardápio.</span>
                                <div class="row mt-0">
                                    <div class="col-lg-9 d-grid">
                                        <select class="form-select" v-model="selectComplement">
                                            <option value="">Adicionar complemento</option>
                                            <option v-for="(complement, index) in allComplement" :key="index" :value="complement">{{ complement }}</option>
                                        </select>
                                    </div>
                                    <div class="col-lg-3 d-grid">
                                        <button @click.prevent="addComplement()" type="submit" class="btn btn-save">
                                            <span class="add-item add-inline add-black ml-1"></span> Adicionar
                                        </button>
                                    </div>
                                </div>
                                <div v-if="(typeof itemData.complement == 'object' && Object.keys(itemData.complement).length > 0)" class="mt-4 mb-2">
                                    <span class="ml-1">Complementos adicionadas:</span>
                                    <span  v-for="(complement, index) in itemData.complement" :key="index" class="btn-round input-base edit-button bold-500 ml-1">{{ complement.name }}</span>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div class="row mt-4">
            <div class="offset-lg-8 col-lg-2 d-grid gap-2">
                <button @click.prevent="$emit('closeModal')" type="submit" class="btn btn-cancel">Cancelar</button>
            </div>
            <div class="col-lg-2 d-grid gap-2">
                <button @click.prevent="save()" type="submit" class="btn btn-save">Salvar</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FormItem",
        data() {
            return {
                imageName: "",
                selectCategory: "",
                selectComplement: "",
                categories: [],
                invalid: {
                    name: false,
                    price: false
                },
                itemData: {
                    id: "",
                    active: true,
                    name: "",
                    price: "",
                    image: "",
                    description: "",
                    complement: []
                }
            }            
        },
        props: {
            setCategory: String,
            allCategories: Object,
            allComplement: Object,
            itemEditData: Object
        },
        methods: {
            selectTab(tab) {
                this.selectedTab = tab;
            },
            addCategory() {
                if (this.selectCategory !== "") {
                    let index = this.categories.findIndex(data => data.name == this.selectCategory);
                    if(index < 0) {
                        this.categories.push({name: this.selectCategory, active: true});
                    } 
                    this.selectCategory = ""
                }
            },
            addComplement() {
                if (this.selectComplement !== "") {
                    let index = this.itemData.complement.findIndex(data => data.name == this.selectComplement);
                    if(index < 0) {
                        this.itemData.complement.push({name: this.selectComplement, active: true});
                    } 
                    this.selectComplement = ""
                }
            },
            onFileChange(e) {
                var files = e.target.files || e.dataTransfer.files;
                if (!files.length)
                    return;
                this.createImage(files[0]);
            },
            createImage(file) {
                this.imageName = file.name;
                var image = new Image();
                var reader = new FileReader();
                var vm = this;
                reader.onload = (e) => {
                    vm.image = e.target.result;
                    this.itemData.image = vm.image;
                };
                reader.readAsDataURL(file);                
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
                if (this.valid(this.itemData)) {
                    this.$emit('saveItem', this.itemData, this.categories);
                    this.$emit('closeModal');
                }
            }
        },
        emits: ["saveItem", "closeModal"],
        mounted() {
            if (this.setCategory !== "") {
                this.categories.push({name: this.setCategory, active: true});
            }
            if (typeof this.itemEditData == "object" && typeof this.itemEditData.name == "string") {
                this.itemData.id = this.itemEditData.id;
                this.itemData.idAdd = this.itemEditData.idAdd;
                this.itemData.active = this.itemEditData.active;
                this.itemData.name = this.itemEditData.name;
                this.itemData.price = this.itemEditData.price;
                this.itemData.image = this.itemEditData.image;
                this.itemData.description = this.itemEditData.description;
                this.itemData.complement = this.itemEditData.complement;
            }
            if (typeof this.itemEditData.cross == "boolean") {
                this.itemData.cross = this.itemEditData.cross;
            }
            if (typeof this.itemEditData.idAdd == "number") {
                this.itemData.idAdd = this.itemEditData.idAdd;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .modal-body .container-data {
        min-width: 900px;
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

    .accordion-button:not(.collapsed) {
        background-color: transparent;
        border: none !important;
        color: $black-secondary;
        box-shadow: none;
    }

    .accordion-body {
        padding-top: 0;
    }

</style>