<template>
    <div class="container-form">
        <form>
            <h2 class="text-center bold-700">Informações do estabelecimento</h2>
            <p class="text-center mb-4 bold-400">Etapa {{ currentStep }} de {{ countSteps }}</p>
            <div class="form-data">
                <div class="row">
                    <div class="col">
                        <input type="text" class="form-control mt-3" v-model="dataCompany.registrationNumber" placeholder="Cnpj">
                        <p class="mb-0 required-alert" v-show="invalid.registrationNumber">*Campo obrigatório</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <input type="text" class="form-control mt-3" v-model="dataCompany.company" placeholder="Razão social">
                        <p class="mb-0 required-alert" v-show="invalid.company">*Campo obrigatório</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <input type="text" class="form-control mt-3" v-model="dataCompany.trade" placeholder="Nome da loja">
                        <p class="mb-0 required-alert" v-show="invalid.trade">*Campo obrigatório</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                        <input type="text" class="form-control mt-3" v-model="dataCompany.postalCode" placeholder="Cep">
                    </div>
                    <div class="col-8">
                        <input type="text" class="form-control mt-3" v-model="dataCompany.neighborhood" placeholder="Bairro">
                    </div>
                </div>
                <div class="row">
                    <div class="col-9">
                        <input type="text" class="form-control mt-3" v-model="dataCompany.address" placeholder="Endereço">
                    </div>
                    <div class="col-3">
                        <input type="text" class="form-control mt-3" v-model="dataCompany.number" placeholder="Número">
                    </div>
                </div>
                <div class="row">
                    <div class="col-9">
                        <input type="text" class="form-control mt-3" v-model="dataCompany.city" placeholder="Cidade">
                    </div>
                    <div class="col-3">
                        <input type="text" class="form-control mt-3" v-model="dataCompany.state" placeholder="Estado">
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <input type="text" class="form-control mt-3" v-model="dataCompany.complement" placeholder="Complemento">
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <input type="text" class="form-control mt-3" v-model="dataCompany.phone" placeholder="Telefone">
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <select class="form-select mt-3" v-model="dataCompany.category">
                            <option value="">Categoria do restaurante</option>
                            <option v-for="(category, index) in allCategories" :key="index" :value="category">{{ category }}</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <select class="form-select mt-3" v-model="dataCompany.revenue">
                            <option value="">Faturamento mensal</option>
                            <option v-for="(revenue, index) in allRevenue" :key="index" :value="revenue">{{ revenue }}</option>
                        </select>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-6 d-grid">
                        <button @click.prevent="cancel()" type="button" class="btn btn-cancel" >Voltar</button>
                    </div>
                    <div class="col-6 d-grid">
                        <button @click.prevent="save()" type="submit" class="btn btn-save">Próximo</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "FormCompany",
        data() {
            return {
                allCategories: [
                    "Doceria",
                    "Japonesa",
                    "Árabe",
                    "Hamburgueria",
                    "Italiana",
                    "Brasileira",
                    "Sorveteria",
                    "Vegetariana"
                ],
                allRevenue: [
                    "R$0 - R$10.000",
                    "R$10.001 - R$ 100.000", 
                    "R$100.001 - R$500.000", 
                    "R$500.001 - R$1M", 
                    "+R$1M"
                ],
                invalid: {
                    registrationNumber: false,
                    company: false,
                    trade: false
                },
                dataCompany: {
                    registrationNumber: "",
                    company: "",
                    trade: "",
                    postalCode: "",
                    neighborhood: "",
                    address: "",
                    city: "",
                    state: "",
                    state: "",
                    state: "",
                    complement: "",
                    phone: "",
                    category: "",
                    revenue: ""
                }
            }            
        },
        props: {
            currentStep: Number,
            countSteps: Number
        },
        methods: {
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
                if (this.valid(this.dataCompany)) {
                    this.$emit('nextStep');
                } 
            },
            cancel() {
                this.$emit('backStep');
            }
        },
        emits: ["nextStep"]
    };
</script>

<style lang="scss" scoped>
    .container-form {
        max-width: 550px;
        margin: auto;
        padding: 0;
        min-height: calc(100vh - 130px);
        display: grid;
        place-items: center;
    }
    .container-form form {
        min-width: 550px;
        padding: 0;
    }
    .form-data {
        background-color: $white-primary;
        padding: 30px;
        border-radius: 16px;
    }
    .container-form h2 {
        font-size: 24px;
    }
    .container-form h3 {
        font-size: 20px;
        margin-bottom: 15px;
    }
    .mt-3 {
        margin-top: 12px !important;
    }
</style>