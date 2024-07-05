<template>
    <div class="container-form">
        <form>
            <h2 class="text-center bold-700">Informações do responsável</h2>
            <p class="text-center mb-4 bold-400">Etapa {{ currentStep }} de {{ countSteps }}</p>
            <div class="form-data">
                <input type="text" class="form-control mt-3" v-model="accountData.name" placeholder="Nome completo">
                <p class="mb-0 required-alert" v-show="invalid.name">*Campo obrigatório</p>
                <input type="tel" class="form-control mt-3" v-model="accountData.identificationCode" placeholder="Cpf">
                <p class="mb-0 required-alert" v-show="invalid.identificationCode">*Campo obrigatório</p>
                <div class="d-grid mt-4">
                    <button @click.prevent="save()" type="submit" class="btn btn-save">Próximo</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "FormRegister",
        data() {
            return {
                invalid: {
                    name: false,
                    identificationCode: false
                },
                accountData: {
                    name: "",
                    identificationCode: ""
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
                if (this.valid(this.accountData)) {
                    this.$emit('nextStep', this.currentStep);
                } 
            }
        },
        emits: ["nextStep"]
    };
</script>

<style lang="scss" scoped>
    .container-form {
        max-width: 500px;
        margin: auto;
        padding: 0;
        min-height: calc(100vh - 130px);
        display: grid;
        place-items: center;
    }
    .container-form form {
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
</style>