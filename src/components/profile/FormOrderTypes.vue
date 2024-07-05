<template>
    <form>
        <div class="row mb-2 mt-3">
            <div class="col-lg-12 d-grid mb-2 gap-2" v-for="(type, index) in listOrderTypes" :key="index">
                <label class="btn btn-add" :for="'btn-check-'+index" :class="dataOrderTypes.includes(index) ? 'check-type' : ''"><span class="text">{{ type }}</span> 
                    <span class="add-item add-right add-on" v-if="!dataOrderTypes.includes(index)" @click="addType(index)"></span>
                    <span class="add-item add-right icon-remove" v-if="dataOrderTypes.includes(index)" @click="removeType(index)"></span>
                </label>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-lg-6 d-grid gap-2">
                <button @click.prevent="$emit('closeModal')" type="button" class="btn btn-cancel" >Cancelar</button>
            </div>
            <div class="col-lg-6 d-grid gap-2">
                <button @click.prevent="" type="submit" class="btn btn-cancel" v-if="(dataOrderTypes.length == 0)">Salvar</button>
                <button @click.prevent="saveTypes" type="submit" class="btn btn-save" v-if="(dataOrderTypes.length > 0)">Salvar</button>
            </div>
        </div>
    </form>
</template>

<script>
    export default {
        name: "FormOrderTypes",
        data() {
            return {
                dataOrderTypes: []
            }
        },
        props: {
            listOrderTypes: Object,
            orderTypes: Object
        },
        emits: ["closeModal", "saveModal"],
        methods: {
            addType(type) {
                this.dataOrderTypes.push(type);
            },
            removeType(type) {
                let index = this.dataOrderTypes.indexOf(type);
                this.dataOrderTypes.splice(index, 1);
            },
            saveTypes() {
                this.$emit('saveModal', this.dataOrderTypes);
                this.$emit('closeModal');
            }
        },
        mounted() {
            this.dataOrderTypes = Object.values(this.orderTypes);
        }
    };
</script>

<style lang="scss" scoped>
    .modal-container form {
        width: 450px !important;
    }
    .icon-remove {
        background-color: white;
        border-radius: 50%;
    }
    .check-type {
        border: 1px solid $gray-bg !important;
        background-color: $gray-bg;
    }
    .btn.btn-add {
        cursor: auto !important;
        .add-right {
            cursor: pointer;
        }
    }
</style>