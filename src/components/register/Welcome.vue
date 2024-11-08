<template>
    <div class="bg-smoke">
        <div class="container-form">
            <form>
                <div class="form-data">
                    <div class="welcome-data">
                        <h2 class="bold-700 title">Obaa, sejam bem-vindo(a)s à Prattu!!</h2>
                        <p>Estamos suuuper empolgados em ter vocês como parceiros!</p>
                        <p>Podemos garantir que iremos fazer de tudo (e mais um pouco!) para que o seu estabelecimento cresça e se destaque cada vez mais no mercado!</p>
                    </div>
                    <div class="row mt-4">
                        <div class="col d-grid">
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
    </div>
</template>

<script>
import axios from 'axios';
import ModalBase from '@/components/ModalBase.vue';
import { useStore } from 'vuex';

export default {
    name: "Welcome",
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
    padding-bottom: 15px;
    margin-bottom: 25px;
}
.bg-smoke {
    position: absolute;
    display: grid;
    place-items: center;
    background-color: rgba(0, 0, 0, 0.7);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding-top: 60px;
    z-index: 9999;
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
.welcome-data p {
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