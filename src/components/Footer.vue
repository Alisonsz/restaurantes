<template>
    <nav class="navbar fixed-bottom navbar-light bg-light text-end">
        <div class="form-inlinev w-100">
            <span class="text-step">Etapa {{ currentConfigStep }} de {{ countConfigSteps }}</span>
            <button @click.prevent="$emit('nextConfigStep', 'link')" type="button" class="btn btn-save" v-if="completeStep">
                {{ (currentConfigStep && currentConfigStep === countConfigSteps ? "Salvar e finalizar" : "Salvar e continuar") }}
            </button>
            <button @click.prevent="$emit('validNextStep')" type="button" class="btn btn-save-off" v-else>
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
            countConfigSteps: Number,
            completeStep: Boolean
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
    .btn-save-off {
        background-color: $gray-line;
    }
</style>