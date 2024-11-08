<template>
    <div class="container-form">
        <form>
            <h2 class="text-center bold-700">E-mail para cadastro no Asaas</h2>
            <p class="text-center mb-4 bold-400">Etapa {{ currentStep }} de {{ countSteps }}</p>
            <div class="form-data">
                <div class="finance-data">
                    <p>Insira o e-mail que será utilizado para criação da sua conta no Asaas.</p>
                    <p>Importante: <span class="bold-500">você receberá um link no e-mail informado</span>. Acesse-o para concluir o cadastro no Asaas, validar suas informações e adicionar os seus dados bancários.</p>
                    <div class="form-group">
                        <input type="email" class="form-control mt-3" v-model="email" placeholder="E-mail" :readonly="sameEmail"/>
                        <span class="icon-padlock" v-if="sameEmail"></span>
                        <p class="mb-0 required-alert" v-show="invalid.email">*Campo obrigatório</p>
                    </div>
                    <div class="form-checkx mt-2">
                        <input class="form-check-input ml-1" id="sameEmail" type="checkbox" v-model="sameEmail" @change="toggleSameEmail">
                        <label class="form-check-label" for="sameEmail">Usar o mesmo e-mail de cadastro na Prattu.</label>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-6 d-grid">
                        <button @click.prevent="cancel()" type="button" class="btn btn-cancel">Voltar</button>
                    </div>
                    <div class="col-6 d-grid">
                        <button @click.prevent="createAsaasAccount()" type="submit" class="btn btn-save">Finalizar cadastro</button>
                    </div>
                </div>
            </div>
        </form>
        <ModalBase :show="showModal" @close="showModal = false">
            <template #header>
                <h3>{{ modalTitle }}</h3>
            </template>
            <template #body>
                <p>{{ modalMessage }}</p>
            </template>
            <template #footer>
                <button class="btn btn-cancel" @click="showModal = false">Voltar</button>
            </template>
        </ModalBase>
    </div>
</template>

<script>
import axios from 'axios';
import ModalBase from '@/components/ModalBase.vue';
import { useStore } from 'vuex';

export default {
    name: "Asaas",
    components: {
        ModalBase
    },
    props: {
        currentStep: Number,
        countSteps: Number
    },
    setup() {
        const v = useStore();
    },
    data() {
        return {
            showModal: false,
            modalTitle: '',
            modalMessage: '',
            sameEmail: false,
            email: '',
            invalid: {
                email: false,
            },
        };
    },
    methods: {
        async createAsaasAccount() {
            if (this.email.trim() === "") {
                this.invalid.email = true;
            } else {
                this.invalid.email = false;
                // try {
                //     const response = await axios.post('https://api.prattuapp.com.br/api/create-asaas-account', {}, {
                //         headers: {
                //             Authorization: `Bearer ${this.$store.state.token}`
                //         }
                //     });
                //     this.modalTitle = 'Conta Asaas criada com sucesso';
                //     this.modalMessage = `Resposta da API: ${JSON.stringify(response.data, null, 2)}`;
                // } catch (error) {
                //     const errorMessage = error.response?.data ? error.response.data.details : error.message;
                //     this.modalTitle = 'Erro ao criar conta da Asaas';
                //     this.modalMessage = `Erro: ${errorMessage}`;
                // } finally {
                //     this.showModal = true;
                // }
                alert("precisa ajustar o envio!");
                this.$emit('nextStep');
            }
        },
        toggleSameEmail() {
            if (this.sameEmail) {
                this.email = this.$store.state.email;
            } else {
                this.email = "";
            }
        },
        cancel() {
            this.$emit('backStep');
        }
    },
    emits: ["nextStep", "backStep"]
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
.finance-data p {
    padding-bottom: 5px;
}
.form-check-input:checked {
    background-color: $light-green;
    border-color: $light-green;
}
.form-group {
    position: relative;
}
.icon-padlock {
  text-align: center;
  width: 30px;
  height: 30px;
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-position: center center;
  margin: auto;
  display: inline-block;
  position: absolute;
  top: 5px;
  right: 5px;
  opacity: 0.2;
}
</style>
