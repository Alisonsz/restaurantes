<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask">
            <div class="modal-container" :class="typeof bgGray === 'boolean' && bgGray ? 'bg-gray' : ''">
                <button class="modal-default-button icon-back" @click="$emit('close')" v-if="noClose !== true"></button>
                <div class="modal-header">
                    <slot name="header"></slot>
                </div>
                <hr class="hr-header">
                <div class="modal-body">
                    <slot name="body"></slot>
                </div>
                <div class="modal-footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
    const props = defineProps({
        show: Boolean,
        noClose: Boolean,
        bgGray: Boolean
    });
</script>

<script>
    export default {
        name: "ModalBase"
    }
</script>


<style lang="scss" scoped>

    .hr-header {
        margin-top: 10px;
        margin-bottom: 0;
    }

    .modal-header {
        font-size: 24px;
        font-weight: 700;
    }

    .modal-container h3 {
        font-size: 16px;
        font-weight: 700;
    }

    .modal-container input {
        background-color: $gray-bg !important;
    }

    .modal-container label {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 5px;
    }

    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        transition: opacity 0.3s ease;
    }

    .modal-container {
        min-width: 350px;
        margin: auto;
        padding: 20px 30px;
        background-color: $white-primary;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
        transition: all 0.3s ease;
        border-radius: 16px;
    }

    .modal-container.bg-gray {
        background-color: $gray-bg !important;
    }

    .modal-body {
        margin: 10px 0 20px 0;
    }

    .modal-default-button {
        float: left;
        border: none;
        padding-top: 0;
        margin-right: 12px;
        width: 15px;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 13px 13px;
    }

    .modal-enter-from {
        opacity: 0;
    }

    .modal-leave-to {
        opacity: 0;
    }

    .modal-enter-from .modal-container,
    .modal-leave-to .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>