<template>
    <div class="container-form">
        <form>
            <div class="mt-3 modal-data">
                <p>Seu cadastro foi concluído com sucesso.</p>
                <p>Agora, nossa equipe irá revisar as informações fornecidas. Este processo pode levar de <strong class="bold-600">24 a 48 horas</strong> para ser concluído. </p>
                <p>Assim que seu cadastro for aprovado, você receberá uma notificação por e-mail. </p>
                <p>Obrigado por se juntar à Prattu e bem-vindo à nossa plataforma!</p>
                <div class="row mt-4">
                    <div class="col-12 d-grid">
                        <button @click.prevent="$emit('close'), $emit('finishConfig')" type="submit" class="btn btn-save">Fechar</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "Congratulations",
        emits: ["close", "finishConfig"]
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