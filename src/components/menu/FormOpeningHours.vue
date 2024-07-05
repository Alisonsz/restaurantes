<template>
    <div class="container-data">
        <form>
            <div>
                <div class="d-grid gap-2 mb-4">
                    <label class="form-label bold-500 mb-0">Adicione a um cardápio</label>
                    <select class="form-select" v-model="openingData.selectedMenu">
                        <option value="">Selecione um cardápio</option>
                        <option v-for="(menu, index) in dataMenu" :key="index" :value="index">{{ menu.name }}</option>
                    </select>
                    <label class="form-label bold-500 mt-2 mb-0">Cardápio sempre disponível?</label>
                    <label class="switch-yn mt-0">
                        <input type="checkbox" v-model="openingData.alwaysAvailable">
                        <span class="slider round"></span>
                    </label>
                    <div v-show="!openingData.alwaysAvailable">
                        <label class="form-label bold-500 mt-2 mb-0">Dias da semana</label>
                        <div class="mb-2">
                            <label class="weekday ml-1" v-for="(day, index) in openingData.weekday" :key="index">
                                <input type="checkbox" v-model="day.active">
                                <span class="checkmark">{{ day.day['0'] }}</span>
                            </label>
                        </div>
                        <label class="form-label bold-500 mt-2 mb-2">horário</label>
                        <div class="select-time">
                            <select class="form-select" v-model="openingData.startHour">
                                <option  v-for="(hour, index) in hours" :key="index">{{ hour }}</option>
                            </select>
                            <span>Ás</span>
                            <select class="form-select" v-model="openingData.endHour">
                                <option  v-for="(hour, index) in hours" :key="index">{{ hour }}</option>
                            </select>
                        </div>
                    </div>
                    
                </div>
                <div class="row">
                    <div class="col-lg-6 d-grid gap-2">
                        <button @click.prevent="$emit('closeModal')" type="submit" class="btn btn-cancel">Cancelar</button>
                    </div>
                    <div class="col-lg-6 d-grid gap-2">
                        <button @click.prevent="save()" type="submit" class="btn btn-save">Salvar</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "FormOpeningHours",
        data() {
            return {
                hours: [
                    "00h", "01h", "02h", "03h", "04h", "05h", 
                    "06h", "07h", "08h", "09h", "10h", "11h",  
                    "12h", "13h", "14h", "15h", "16h", "17h", 
                    "18h", "19h", "20h", "21h", "22h", "23h"
                ],
                openingData: {
                    selectedMenu: "",
                    alwaysAvailable: true,
                    weekday: [
                        { day: "seg", active: false },
                        { day: "ter", active: false },
                        { day: "qua", active: false },
                        { day: "qui", active: false },
                        { day: "sex", active: false },
                        { day: "sab", active: false },
                        { day: "dom", active: false }
                    ],
                    startHour: "00h",
                    endHour: "23h"
                }
            }            
        },
        emits: ["saveCategory", "closeModal", "saveOpeningHours"],
        props: {
            selectedMenuIndex: Number,
            openingEditData: Object,
            dataMenu: Object
        },
        methods: {
            save() {
                this.$emit('saveOpeningHours', this.openingData);
                this.$emit('closeModal');
            }
        },
        mounted() {
            this.openingData.selectedMenu = this.selectedMenuIndex;
            if (typeof this.openingEditData === "object" && Object.keys(this.openingEditData).length > 0) {
                this.openingData = this.openingEditData;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .modal-body .container-data {
        max-width: 450px !important;
        padding: 0 !important;
    }

    .modal-container {
        min-width: 350px !important;
    }

    .select-time {
        select {
            width: 90px;
            display: inline-block;
        }
        span {
            margin-left: 15px;
            margin-right: 15px;
        }
    }
</style>