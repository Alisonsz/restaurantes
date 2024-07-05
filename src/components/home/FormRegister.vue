<template>
    <div class="container-form">
        <div class="row register">
            <div class="col-lg-6"></div>
            <div class="col-lg-6">
                <form>
                    <div class="form-data">
                        <h2 class=" bold-700">Olá!</h2>
                        <h2 class=" bold-700">Estamos felizes em ter você aqui :)</h2>
                        <hr>
                        <h3 class="form-label bold-700">Criar conta</h3>
                        <input type="text" class="form-control mt-2" v-model="accountData.name" placeholder="Nome completo">
                        <p class="mb-0 required-alert" v-show="invalid.name">*Campo obrigatório</p>
                        <input type="email" class="form-control mt-2" v-model="accountData.email" placeholder="E-mail">
                        <p class="mb-0 required-alert" v-show="invalid.email">*Campo obrigatório</p>
                        <input type="tel" class="form-control mt-2" v-model="accountData.phone" placeholder="Celular">
                        <p class="mb-0 required-alert" v-show="invalid.phone">*Campo obrigatório</p>
                        <input type="password" class="form-control mt-2" v-model="accountData.password" placeholder="Senha">
                        <p class="mb-0 required-alert" v-show="invalid.password">*Campo obrigatório</p>
                        <input type="password" class="form-control mt-2" v-model="confirmPassword" placeholder="Confirme a senha">
                        <p class="mb-0 required-alert" v-show="invalidConfirmPassword">*As senhas devem ser iguais</p>
                        <div class="form-checkx mt-2">
                            <input class="form-check-input ml-1" type="checkbox" id="termsAndConditions" v-model="termsAndConditions">
                            <label class="form-check-label" for="termsAndConditions">Li e concordo com os <a href="#">termos e condições</a></label>
                        </div>
                        <p class="mb-0 required-alert" v-show="invalidTermsAndConditions">*É preciso aceitar os termos e condições</p>
                        <div class="d-grid mt-4">
                            <button @click.prevent="save()" type="submit" class="btn btn-save">Criar conta</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FormRegister",
        data() {
            return {
                confirmPassword: "",
                invalidConfirmPassword: false,
                termsAndConditions: false,
                invalidTermsAndConditions: false,
                invalid: {
                    name: false,
                    email: false,
                    phone: false,
                    password: false
                },
                accountData: {
                    name: "",
                    email: "",
                    phone: "",
                    password: ""
                }
            }            
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
                    if (this.accountData.password !== this.confirmPassword) {
                        this.invalidConfirmPassword = true;
                    } else {
                        this.invalidConfirmPassword = false;
                        if (!this.termsAndConditions) {
                            this.invalidTermsAndConditions = true;
                        } else {
                            this.$emit('saveAccount', this.allCategories);
                        }
                    }
                } 
            }
        },
        emits: ["saveAccount"]
    };
</script>

<style lang="scss" scoped>
    .container-form {
        height: max-content;
        min-height: calc(100vh - 70px);
        margin: auto;
        padding: 0;
        border-radius: 0;
    }
    .container-form form {
        min-height: calc(100vh - 70px);
        padding: 20px 0;
        display: grid;
        place-items: center;
    }
    .container-form .form-data {
        padding: 40px 30px;
        border-radius: 16px;
        background-color: $gray-bg;
        min-width: 470px;
        
    }
    .container-form input {
        background-color: $white-primary !important;
    }
    .container-form input[type='checkbox'] {
        border-radius: 3px !important;
        height: 18px !important;
    }
    .container-form input[type='checkbox']:checked {
        background-color: $light-green !important;
    }
    .container-form h2 {
        font-size: 22px;
    }
    .container-form h3 {
        font-size: 18px;
        margin-bottom: 15px;
    }
    .container-data {
        background-color: transparent !important;
    }
    hr {
        margin: 20px 0;
    }
    .mt-2 {
        margin-top: 12px !important;
    }
</style>