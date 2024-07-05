<template>
    <div class="container-form">
        <form>
            <div class="mt-3 modal-data">
                <p class="mb-4 move-text">
                    <span class="add-item icon-attention"></span>
                    <strong class="bold-600">Atenção</strong>: não se esqueça de acessar o link da Asaas enviado para o seu email cadastrado e inserir todas as suas informações financeiras. 
                    Sua conta só será aprovada após você finalizar essa etapa
                </p>
                <span class="hint move-text">Não recebeu o link?  <a href="#" class="link">Enviar o link novamente</a></span>
                <div class="row mt-4">
                    <div class="col-12 d-grid">
                        <button @click.prevent="$emit('nextModal', 'start')" type="submit" class="btn btn-save">Próximo</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "Link",
        emits: ["nextModal"]
    };
</script>

<style lang="scss" scoped>
    .container-form {
        max-width: 500px;
    }
    .modal-data p {
        margin-bottom: 0;
    }
    .icon-attention {
        display: inline-block;
        position: relative;
        margin-right: 10px;
    }
    .move-text {
        margin-left: 31px;
        text-indent: -27px;
    }
    .move-text .link{
        color: $gray-primary;
    }
</style>