<template>
    <form>
        <div class="mb-2">
            <label for="trade" class="form-label">Nome do restaurante</label>
            <input type="text" class="form-control" id="trade" v-model="dataCompany.trade">
        </div>
        <div class="mb-2">
            <label for="company" class="form-label">Razão social</label>
            <input type="text" class="form-control" id="company" v-model="dataCompany.company">
        </div>
        <div class="mb-2">
            <label for="registrationNumber" class="form-label">CNPJ</label>
            <input type="text" class="form-control" id="registrationNumber" v-model="dataCompany.registrationNumber">
        </div>
        <hr>
        <h3>Endereço</h3>
        <div class="row mb-2">
            <div class="col-lg-4">
                <label for="postalCode" class="form-label">CEP</label>
                <input type="text" class="form-control" id="postalCode" v-model="dataCompany.postalCode">
            </div>
            <div class="col-lg-8">
                <label for="neighborhood" class="form-label">Bairro</label>
                <input type="text" class="form-control" id="neighborhood" v-model="dataCompany.neighborhood">
            </div>
        </div>

        <div class="row mb-2">
            <div class="col-lg-8">
                <label for="address" class="form-label">Rua</label>
                <input type="text" class="form-control" id="address" v-model="dataCompany.address">
            </div>
            <div class="col-lg-4">
                <label for="number" class="form-label">Número</label>
                <input type="text" class="form-control" id="number" v-model="dataCompany.number">
            </div>
        </div>

        <div class="row mb-2">
            <div class="col-lg-8">
                <label for="city" class="form-label">Cidade</label>
                <input type="text" class="form-control" id="city" v-model="dataCompany.city">
            </div>
            <div class="col-lg-4">
                <label for="state" class="form-label">Estado</label>
                <input type="text" class="form-control" id="state" v-model="dataCompany.state">
            </div>
        </div>

        <div class="row mt-4 mb-1">
            <div class="col-lg-6 d-grid gap-2">
                <button @click.prevent="$emit('closeModal')" type="button" class="btn btn-cancel" >Cancelar</button>
            </div>
            <div class="col-lg-6 d-grid gap-2">
                <button @click.prevent="saveCompany" type="submit" class="btn btn-save">Salvar</button>
            </div>
        </div>
    </form>
</template>

<script>
    export default {
        name: "FormCompany",
        data() {
            return {
                dataCompany: []
            } 
        },
        methods: {
            saveCompany() {
                this.$emit('saveModal', this.dataCompany);
                this.$emit('closeModal');
            }        
        },
        emits: ["closeModal", "saveModal"],
        props: {
            company: Object
        },
        mounted() {
            this.dataCompany = { ...this.company };
        }
    };
</script>

<style scoped>
    .modal-container form {
        width: 500px !important;
    }
</style>