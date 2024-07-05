<template>
    <div class="container-form">
        <form>
            <div class="mt-3 modal-data">
                <p>Estamos suuuper empolgados em ter vocês como parceiros!</p>
                <p>Podemos garantir que iremos fazer de tudo (e mais um pouco!) para que o seu estabelecimento cresça e se destaque cada vez mais no mercado!</p>
                <div class="row mt-4">
                    <div class="col-12 d-grid">
                        <button @click.prevent="$emit('nextModal', 'link')" type="submit" class="btn btn-save">Próximo</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "Welcome",
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
</style>