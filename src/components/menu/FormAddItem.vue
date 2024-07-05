<template>
    <div class="container-data small-data">
        <form>
            <div>
                <div class="d-grid gap-2">
                    <button @click.prevent="$emit('newItem'), $emit('closeModal')" type="submit" class="btn btn-save">Criar novo item</button>
                </div>
                <div class="d-grid gap-2 mt-2">
                    <button @click.prevent="$emit('searchItem'), $emit('closeModal')" type="submit" class="btn btn-save">Buscar item existente</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "FormAddItem",
        emits: ["newItem", "searchItem", "closeModal"]
    };
</script>

<style lang="scss" scoped>
    .modal-body .small-data {
        width: 350px !important;
        padding: 0 !important;
    }

    .modal-container {
        min-width: 350px !important;
    }
</style>