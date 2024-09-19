<template>
    <div class="container-form">
        <form>
            <div class="form-data">
                <div class="start-data">
                    <h2 class="text-center bold-700 title">Começar a receber pedidos</h2>
                    <p>Antes de começar a receber pedidos, vamos garantir que seu perfil esteja completo e pronto para conquistar novos clientes.</p>
                    <p>Para isso, precisamos preencher suas informações nas seguintes páginas:</p>
                    <span>- Horário de funcionamento</span>
                    <span>- Tempo de preparação</span>
                    <span>- Perfil</span>
                    <span>- Cardápio</span>
                    <span>- Configurações da conta</span>
                </div>
                <div class="row mt-4">
                    <div class="col d-grid">
                        <button @click.prevent="save()" type="submit" class="btn btn-save">Começar</button>
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
    name: "Start",
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
.title {
    border-bottom: 1px solid $gray-line;
    padding-bottom: 10px;
    margin-bottom: 25px;
}
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
.start-data p {
    padding-bottom: 5px;
}
.start-data span {
    display: block;
    font-size: 16px;
}
</style>