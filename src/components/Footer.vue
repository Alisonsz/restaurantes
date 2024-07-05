<template>
    <nav class="navbar fixed-bottom navbar-light bg-light text-end">
        <div class="form-inlinev w-100">
            <span class="text-step">Etapa {{ currentConfigStep }} de {{ countConfigSteps }}</span>
            <button @click.prevent="$emit('nextConfigStep', 'link')" type="submit" class="btn btn-save">
                {{ (currentConfigStep && currentConfigStep === countConfigSteps ? "Salvar e finalizar" : "Salvar e continuar") }}
            </button>
        </div>
    </nav>
</template>

<script>
    export default {
        name: "Footer",
        props: {
            currentConfigStep: Number,
            countConfigSteps: Number
        }
    }
</script>

<style lang="scss" scoped>
    .navbar.fixed-bottom {
        background-color: $white-primary !important;
        height: 75px;
        padding-right: 30px;
        -webkit-box-shadow: 0px 4px 15px 0px rgba(0,0,0,0.60);
        -moz-box-shadow: 0px 4px 15px 0px rgba(0,0,0,0.60);
        box-shadow: 0px 4px 15px 0px rgba(0,0,0,0.60);
    }
    .text-step {
        margin-right: 20px;
    }
</style>