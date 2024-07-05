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
                        <button @click.prevent="cancel()" type="button" class="btn btn-cancel" >Voltar</button>
                    </div>
                    <div class="col-6 d-grid">
                        <button @click.prevent="save()" type="submit" class="btn btn-save">Finalizar cadastro</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "Finance",
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
    .finance-data p {
        padding-bottom: 5px;
    }
</style>