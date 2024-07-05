<template>
    <div class="container-data">
        <form>
            <div>
                <div class="d-grid gap-2 mb-4">
                    <label class="form-label bold-500 mb-0 mt-2">Descrição</label>
                    <input type="text" class="form-control" v-model="alternativeData.name" placeholder="Ex: Horário de verão">
                    <p class="mb-0 required-alert" v-show="invalid.name">*Campo obrigatório</p>
                    <div class="row select-date">
                        <div class="col select-placeholder day">
                            <label v-if="alternativeData.day === ''">Dia</label>
                            <select class="form-select" v-model="alternativeData.day">
                                <option v-for="(day, index) in days" :key="index" :value="day">{{ day }}</option>
                            </select>
                            <p class="mb-0 mt-2 required-alert" v-show="invalid.day">*Campo obrigatório</p>
                        </div>
                        <div class="col select-placeholder month">
                            <label v-if="alternativeData.month === ''">Mês</label>
                            <select class="form-select" v-model="alternativeData.month">
                                <option v-for="(month, index) in months" :key="index" :value="month">{{ month }}</option>
                            </select>
                            <p class="mb-0 mt-2 required-alert" v-show="invalid.month">*Campo obrigatório</p>
                        </div>
                        <div class="col select-placeholder year">
                            <label v-if="alternativeData.year === ''">Ano</label>
                            <select class="form-select" v-model="alternativeData.year">
                                <option v-for="(year, index) in years" :key="index" :value="year">{{ year }}</option>
                            </select>
                            <p class="mb-0 mt-2 required-alert" v-show="invalid.year">*Campo obrigatório</p>
                        </div>
                    </div>
                    <label class="form-label bold-500 mb-0 mt-2">Horários</label>
                    <div v-for="(hour, indexHour) in alternativeData.hours" :key="indexHour">
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
                        <p class="mb-0 required-alert mt-2" v-show="invalid.hours[indexHour]">*Selecione os horários de abertura e fechamento</p>
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
        name: "FormAlternative",
        data() {
            return {
                hours: [
                    "00h00", "01h00", "02h00", "03h00", "04h00", "05h00", 
                    "06h00", "07h00", "08h00", "09h00", "10h00", "11h00",  
                    "12h00", "13h00", "14h00", "15h00", "16h00", "17h00", 
                    "18h00", "19h00", "20h00", "21h00", "22h00", "23h00"
                ],
                days: [
                    "Dia 1", "Dia 2", "Dia 3", "Dia 4", "Dia 5", "Dia 6", "Dia 6",
                    "Dia 7", "Dia 8", "Dia 9", "Dia 10", "Dia 11", "Dia 12", "Dia 13",
                    "Dia 14", "Dia 15", "Dia 16", "Dia 17", "Dia 18", "Dia 19", "Dia 20",
                    "Dia 21", "Dia 22", "Dia 23", "Dia 24", "Dia 25", "Dia 26", "Dia 27",
                    "Dia 28", "Dia 29", "Dia 30", "Dia 31"
                ],
                months: [
                    "Janeiro", "Fevereiro", "Março", "Abril",
                    "Maio", "Junho", "Julho", "Agosto",
                    "Setembro", "Outubro", "Novembro", "Dezembro"
                ],
                years: [
                    2024, 2025, 2026
                ],
                invalid: {
                    name: false,
                    day: false,
                    month: false,
                    year: false,
                    hours: [false]
                },
                alternativeData: {
                    name: "",
                    day: "",
                    month: "",
                    year: "",
                    hours: [{ open: "", close: "" }],
                }
            }            
        },
        emits: ["saveCategory", "closeModal", "saveOpeningHours"],
        methods: {
            addHour() {
                this.alternativeData.hours.push({ open: "", close: "" });
                this.invalid.hours.push(false);
            },
            removeHour(index) {
                this.alternativeData.hours.splice(index, 1);
                this.invalid.hours.splice(index, 1);
            },
            valid(data) {
                let count = 0;
                let isvalid = true;
                for (const field in this.invalid) {
                    count++;
                    if (this.invalid.hasOwnProperty(field)) {
                        if (typeof data[field] === "string") {
                            if (data[field] === "") {
                                this.invalid[field] = true;
                                isvalid =  false;
                            } else {
                                this.invalid[field] = false;
                            }
                        }
                        if (typeof data[field] === "object" && field === 'hours') {
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
                if (this.valid(this.alternativeData)) {
                    this.$emit('saveAlternative', this.alternativeData);
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
    .modal-container {
        min-width: 350px !important;
    }
    .select-placeholder.open {
        padding-right: 0;
        label {
            margin-left: 8px;
        }
    }
    .select-placeholder.close {
        padding-left: 0;
        .add-item {
            transform: translateY(-3px);
        }
        label {
            margin-left: 8px;
        }
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
    .select-date {
        padding-left: 7px;
        padding-right: 7px;
    }
    .select-date .col {
        padding-left: 5px;
        padding-right: 5px;
    }
</style>