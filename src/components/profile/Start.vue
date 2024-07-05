<template>
    <div class="container-form">
        <form>
            <div class="mt-3 modal-data">
                <p>Antes de começar a receber pedidos, vamos garantir que seu perfil esteja completo e pronto para conquistar novos clientes. </p>
                <p>Para isso, precisamos preencher suas informações nas seguintes páginas:</p>
                <span>- Perfil</span>
                <span>- Cardápio</span>
                <span>- Horário de funcionamento</span>
                <span>- Tempo de preparação</span>
                <span>- Configurações da conta</span>
                <div class="row mt-4">
                    <div class="col-12 d-grid">
                        <button @click.prevent="$emit('nextModal', 'close')" type="submit" class="btn btn-save">Começar</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "Start",
        emits: ["nextModal"]
    };
</script>

<style lang="scss" scoped>
    .container-form {
        max-width: 500px;
    }
    .modal-data p {
        margin-bottom: 15px;
    }
    .modal-data span {
        display: block;
        font-size: 16px;
    }
</style>