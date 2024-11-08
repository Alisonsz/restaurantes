<template>
    <form>
        <div class="row mb-2 mt-3">
            <div class="col-lg-12 d-grid mb-2 gap-2">
                <label class="btn btn-add" :for="'btn-check-withdrawal-on'" :class="dataType.withdrawalOn ? 'check-type' : ''">
                    <span class="text">Retirada</span> 
                    <span class="add-item add-right add-on" v-if="!dataType.withdrawalOn" @click="addType('withdrawalOn')"></span>
                    <span class="add-item add-right icon-remove" v-if="dataType.withdrawalOn" @click="removeType('withdrawalOn')"></span>
                </label>
            </div>
            <div class="col-lg-12 d-grid mb-2 gap-2">
                <label class="btn btn-add" :for="'btn-check-eat-on'" :class="dataType.eatOn ? 'check-type' : ''">
                    <span class="text">Comer no local</span> 
                    <span class="add-item add-right add-on" v-if="!dataType.eatOn" @click="addType('eatOn')"></span>
                    <span class="add-item add-right icon-remove" v-if="dataType.eatOn" @click="removeType('eatOn')"></span>
                </label>
            </div>
            
        </div>
        <div class="row mt-4">
            <div class="col-lg-6 d-grid gap-2">
                <button @click.prevent="$emit('closeModal')" type="button" class="btn btn-cancel" >Cancelar</button>
            </div>
            <div class="col-lg-6 d-grid gap-2">
                <button @click.prevent="" type="submit" class="btn btn-block" v-if="(dataType.eatOn === eatOn && dataType.withdrawalOn === withdrawalOn)">Salvar</button>
                <button @click.prevent="saveTypes" type="submit" class="btn btn-save" v-else>Salvar</button>
            </div>
        </div>
    </form>
</template>

<script>
    export default {
        name: "FormOrderTypes",
        data() {
            return {
                dataType: {
                    eatOn: false,
                    withdrawalOn: false,
                }
            }
        },
        props: {
            listOrderTypes: Object,
            eatOn: Boolean,
            withdrawalOn: Boolean,
        },
        emits: ["closeModal", "saveModal"],
        methods: {
            addType(type) {
                switch (type) {
                case 'eatOn':
                    this.dataType.eatOn = true;
                    break;
                case 'withdrawalOn':
                    this.dataType.withdrawalOn = true;
                    break;
                }
            },
            removeType(type) {
                switch (type) {
                case 'eatOn':
                    this.dataType.eatOn = false;
                    break;
                case 'withdrawalOn':
                    this.dataType.withdrawalOn = false;
                    break;
                }
            },
            saveTypes() {
                this.$emit('saveModal', this.dataType);
                this.$emit('closeModal');
            }
        },
        mounted() {
            this.dataType.eatOn = this.eatOn;
            this.dataType.withdrawalOn = this.withdrawalOn;
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