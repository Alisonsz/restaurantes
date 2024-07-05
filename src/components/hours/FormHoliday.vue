<template>
    <div class="container-data">
        <form>
            <div>
                <div class="d-grid gap-2 mb-4">
                    <label class="form-label bold-500 mb-0">Selecione o feriado</label>
                    <p class="mb-0 required-alert" v-show="invalid.type">*Campo obrigatório</p>
                    <div class="select-holiday  select-placeholder">
                        <label v-if="holidayData.name === ''">Ex: Ano novo</label>
                        <select class="form-select" v-model="holidayData.name">
                            <option v-for="(holiday, index) in holidays" :key="index" :value="holiday.name">{{ holiday.name }}</option>
                        </select>
                    </div>
                    <p class="mb-0 required-alert" v-show="invalid.name">*Campo obrigatório</p>
                    <label class="form-label bold-500 mb-0 mt-2">Horários</label>
                    <div v-for="(hour, indexHour) in holidayData.hours" :key="indexHour">
                        <div class="row select-time">
                            <div class="col-md-auto select-placeholder open">
                                <label v-if="hour.open === ''">Abre</label>
                                <select class="form-select ml-1" v-model="hour.open">
                                    <option v-for="(hour, i) in hours" :key="i">{{ hour }}</option>
                                </select>
                            </div>
                            <div class="col select-placeholder close">
                                <label v-if="hour.close === ''">Fecha</label>
                                <select class="form-select" v-model="hour.close">
                                    <option v-for="(hour, i) in hours" :key="i">{{ hour }}</option>
                                </select>
                                <span class="add-item add-on" role="button" @click="addHour()" v-if="indexHour === 0"></span>
                                <span class="add-item icon-remove" role="button" @click="removeHour(indexHour)" v-if="indexHour > 0"></span>
                            </div>
                        </div>
                        <p class="mb-0 required-alert" v-show="invalid.hours[indexHour]">*Selecione os horários de abertura e fechamento</p>
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
        name: "FormHoliday",
        data() {
            return {
                hours: [
                    "00h00", "01h00", "02h00", "03h00", "04h00", "05h00", 
                    "06h00", "07h00", "08h00", "09h00", "10h00", "11h00",  
                    "12h00", "13h00", "14h00", "15h00", "16h00", "17h00", 
                    "18h00", "19h00", "20h00", "21h00", "22h00", "23h00"
                ],
                holidays: [
                    { date: "01/01/2024", name: "Ano novo" },
                    { date: "21/04/2024", name: "Tiradentes" },
                    { date: "01/05/2024", name: "Dia do trabalho" },
                    { date: "07/09/2024", name: "Independência do Brasil" },
                    { date: "12/10/2024", name: "Nossa Senhora Aparecida" },
                    { date: "02/11/2024", name: "Finados" },
                    { date: "15/11/2024", name: "Proclamação da república" },
                    { date: "25/12/2024", name: "Natal" }
                ],
                invalid: {
                    name: false,
                    hours: [false]
                },
                holidayData: {
                    name: "",
                    hours: [{ open: "", close: "" }],
                }
            }            
        },
        emits: ["saveCategory", "closeModal", "saveOpeningHours"],
        methods: {
            addHour() {
                this.holidayData.hours.push({ open: "", close: "" });
                this.invalid.hours.push(false);
            },
            removeHour(index) {
                this.holidayData.hours.splice(index, 1);
                this.invalid.hours.splice(index, 1);
            },
            valid(data) {
                let count = 0;
                let isvalid = true;
                for (const field in this.invalid) {
                    count++;
                    if (this.invalid.hasOwnProperty(field)) {
                        if (field === 'name') {
                            if (data[field] === "") {
                                this.invalid[field] = true;
                                isvalid =  false;
                            } else {
                                this.invalid[field] = false;
                            }
                        }
                        if (field === 'hours') {
                            data[field].forEach((hour, index) => {
                                if (hour.open === "" || hour.close === "") {
                                    isvalid =  false;
                                    this.invalid.hours[index] = true;
                                } else {
                                    this.invalid.hours[index] = false;
                                }
                            });
                        }
                        if (count === Object.keys(this.invalid).length) {
                            return(isvalid);
                        }
                    }
                }
            },
            save() {
                if (this.valid(this.holidayData)) {
                    this.$emit('saveHoliday', this.holidayData);
                    this.$emit('closeModal');
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .modal-body .container-data {
        width: 400px !important;
        padding: 0 !important;
    }
    .select-placeholder.open {
        padding-right: 0;
        label {
            margin-left: 14px;
        }
    }
    .select-placeholder.close {
        .add-item {
            transform: translateY(-3px);
        }
        label {
            margin-left: 14px;
        }
    }
    .modal-container {
        min-width: 350px !important;
    }
    .select-time {
        select {
            width: 130px;
            display: inline-block;
        }
        span {
            margin-left: 15px;
            margin-right: 15px;
        }
    }
    .select-time {
        position: relative;
    }
    .select-time .add-item {
        width: 30px;
        height: 30px;
        position: absolute;
        top: 7px !important;
    }
</style>