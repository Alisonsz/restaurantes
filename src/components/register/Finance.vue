<template>
    <div class="container-form">
        <form>
            <h2 class="text-center bold-700">Financeiro</h2>
            <p class="text-center mb-4 bold-400">Etapa {{ currentStep }} de {{ countSteps }}</p>
            <div class="form-data">
                <div class="finance-data">
                    <h3 class="bold-500 mb-4">Pagamento</h3>
                    <p>Aqui na Prattu, trabalhamos com a <strong class="bold-500">Asaas</strong>, nossa parceira financeira, responsável por todos os repasses que serão feitos para o seu estabelecimento.</p>
                    <p>Assim que concluída essa primeira etapa do cadastro, você receberá um e-mail para que possa completar o cadastro na Asaas. Este e-mail conterá todas as instruções necessárias e o link para que você possa criar a senha e inserir suas informações bancárias.</p>
                    <p>Estamos aqui para ajudar em caso de dúvidas.<br> Obrigado por escolher a <span class="bold-500 text-green">Prattu</span>!</p>
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

export default {
    name: "Finance",
    components: {
        ModalBase
    },
    props: {
        currentStep: Number,
        countSteps: Number
    },
    data() {
        return {
            showModal: false,
            modalTitle: '',
            modalMessage: ''
        };
    },
    methods: {
        async createAsaasAccount() {
            try {
                const response = await axios.post('https://api.prattuapp.com.br/api/create-asaas-account', {}, {
                    headers: {
                        Authorization: `Bearer ${this.$store.state.token}`
                    }
                });
                this.modalTitle = 'Conta Asaas criada com sucesso';
                this.modalMessage = `Resposta da API: ${JSON.stringify(response.data, null, 2)}`;
            } catch (error) {
                const errorMessage = error.response?.data ? error.response.data.details : error.message;
                this.modalTitle = 'Erro ao criar conta da Asaas';
                this.modalMessage = `Erro: ${errorMessage}`;
            } finally {
                this.showModal = true;
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
</style>
