<template>
    <div class="container-form">
        <form>
            <h2 class="text-center bold-700">Plano</h2>
            <p class="text-center mb-4 bold-400">Etapa {{ currentStep }} de {{ countSteps }}</p>
            <div class="form-data">
                <div class="plan-data">
                    <h3 class="bold-500">Plano básico</h3>
                    <p><span class="add-item check-single"></span> 3,6% de taxa para compras no crédito / R$1,19 para compras no Pix;</p>
                    <p><span class="add-item check-single"></span> 5% de taxa operacional Prattu;</p>
                    <p><span class="add-item check-single"></span> Acesso ao gestor de pedidos;</p>
                    <p><span class="add-item check-single"></span> Acesso à plataforma do Asaas;</p>
                    <p><span class="add-item check-single"></span> Gestão completa de pedidos, vendas e clientes;</p>
                    <p><span class="add-item check-single"></span> Suporte do nosso time durante o processo de cadastro e ativação da conta na plataforma;</p>
                    <p><span class="add-item check-single"></span> Início de cobrança: após 1 mês de uso.</p>
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
        name: "Plan",
        props: {
            currentStep: Number,
            countSteps: Number
        },
        methods: {
            save() {
                this.$emit('nextStep');
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
    .check-single {
        display: inline-block;
        position: relative;
        margin-right: 10px;
    }
    .plan-data {
        padding: 25px 30px 10px 30px;
        border: 1px solid $gray-line;
        border-radius: 8px
    }
    .plan-data p {
        margin-left: 31px;
        text-indent: -31px;
        margin-bottom: 10px;
    }
</style>