<template>
    <div class="container-form">
        <form>
            <h2 class="text-center bold-700">Financeiro</h2>
            <p class="text-center mb-4 bold-400">Etapa {{ currentStep }} de {{ countSteps }}</p>
            <div class="form-data">
                <div class="finance-data">
                    <h3 class="bold-500 mb-4">Repasses e Pagamentos</h3>
                    <p>Na Prattu, trabalhamos em parceria com o Asaas, plataforma financeira que será responsável por realizar todos os repasses e pagamentos ao seu estabelecimento.</p>
                    <p>Importante: <span class="bold-500">O cadastro no Asaas é obrigatório</span> para que você possa receber os pagamentos e repasses. Todas as informações inseridas durante o cadastro na Prattu serão automaticamente transferidas para a criação da sua conta no Asaas.</p>
                </div>
                <div class="row mt-4">
                    <div class="col-6 d-grid">
                        <button @click.prevent="cancel()" type="button" class="btn btn-cancel">Voltar</button>
                    </div>
                    <div class="col-6 d-grid">
                        <button @click.prevent="save()" type="submit" class="btn btn-save">Próximo</button>
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
        async save() {
            this.$emit('nextStep');
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
