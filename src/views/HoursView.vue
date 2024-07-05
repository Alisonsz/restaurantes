<template>
    <div class="hours container-data" :class="completeConfig ? '' : 'with-footer'">
        <Navbar :navbarData="navbarData" /><Sidebar :sidebarData="sidebarData" />
        <h3 class="bold-600">Horário de funcionamento</h3>
        <hr>
        <div class="row header-hours">
            <div class="col"><label class="bold-500">Dia da semana</label></div>
            <div class="day"><label class="bold-500">Abre</label></div>
            <div class="day"><label class="bold-500">Fecha</label></div>
            <div class="action"></div>
        </div>
        <div class="list-days" v-for="(day, indexDay) in weekdays" :key="indexDay">
            <div class="row item-day" v-for="(hour, indexHour) in dataHour[indexDay]" :key="indexHour">
                <div class="col text"><span>{{ day }}</span></div>
                <div class="day">
                    <select class="form-select" v-model="hour.open" @change="changeDay(indexDay, indexHour, 'open')">
                        <option value="closed">Fechado</option>
                        <option  v-for="(hour, i) in hours" :key="i">{{ hour }}</option>
                    </select>
                </div>
                <div class="day">
                    <select class="form-select" v-model="hour.close" @change="changeDay(indexDay, indexHour, 'close')">
                        <option value="closed">Fechado</option>
                        <option  v-for="(hour, i) in hours" :key="i">{{ hour }}</option>
                    </select>
                </div>
                <div class="action">
                    <span class="add-item add-right add-on" role="button" @click="addDay(indexDay)" v-if="indexHour === 0"></span>
                    <span class="add-item add-right icon-remove" role="button" @click="removeDay(indexDay, indexHour)" v-if="indexHour > 0"></span>
                </div>
            </div>
        </div>
        <div class="list-item accordion mt-3" id="accordion-holiday">
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading-holiday">
                    <div class="row">
                        <div class="col title">
                            <p class="bold-500">Horários de feriado</p>
                            <span class="hint">Crie um horário para cada feriado do ano.</span>
                        </div>
                        <div class="col text-end" :class="Object.keys(dataHolidays).length > 0 ? '' : 'move'">
                            <button @click.prevent="showModalHoliday = true" type="submit" class="btn btn-save">
                                <span class="add-item add-inline add-black ml-1"></span> Adicionar novo horário
                            </button>
                        </div>
                    </div>
                    <span v-if="Object.keys(dataHolidays).length > 0">
                        <button class="accordion-button" :class="Object.keys(dataHolidays).length > 0 ? '' : 'collapsed'" type="button" data-bs-toggle="collapse" data-bs-target="#item-holiday" aria-expanded="false" aria-controls="item-holiday"></button>
                    </span>
                </h2>
                <div id="item-holiday" class="accordion-collapse collapse" :class="Object.keys(dataHolidays).length > 0 ? 'show' : ''" aria-labelledby="heading-holiday" data-bs-parent="#item-holiday">
                    <div class="list-days" v-for="(day, indexDay) in dataHolidays" :key="indexDay">
                        <div class="row item-day" v-for="(hour, indexHour) in day.hours" :key="indexHour">
                            <div class="col text">
                                <span>{{ indexHour === 0 ? day.name : "" }}</span>
                                <span class="add-item icon-trash" role="button" @click="removeHoliday(indexDay)" v-if="indexHour === 0"></span>
                            </div>
                            <div class="day">
                                <select class="form-select" v-model="hour.open" @change="changeHolidayHour(indexDay, indexHour)">
                                    <option  v-for="(hour, i) in hours" :key="i">{{ hour }}</option>
                                </select>
                            </div>
                            <div class="day">
                                <select class="form-select" v-model="hour.close" @change="changeHolidayHour(indexDay, indexHour)">
                                    <option  v-for="(hour, i) in hours" :key="i">{{ hour }}</option>
                                </select>
                            </div>
                            <div class="action">
                                <span class="add-item add-right add-on" role="button" @click="addHoliday(indexDay)" v-if="indexHour === 0"></span>
                                <span class="add-item add-right icon-remove" role="button" @click="removeHolidayHour(indexDay, indexHour)" v-if="indexHour > 0"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="list-item accordion mt-3" id="accordion-alternative">
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading-alternative">
                    <div class="row">
                        <div class="col title">
                            <p class="bold-500">Horários alternativos</p>
                            <span class="hint">Crie um horário para ocasiões específicas.</span>
                        </div>
                        <div class="col text-end" :class="Object.keys(dataAlternative).length > 0 ? '' : 'move'">
                            <button @click.prevent="showModalAlternative = true" type="submit" class="btn btn-save">
                                <span class="add-item add-inline add-black ml-1"></span> Adicionar novo horário
                            </button>
                        </div>
                    </div>
                    <span v-if="Object.keys(dataAlternative).length > 0">
                        <button class="accordion-button" :class="Object.keys(dataAlternative).length > 0 ? '' : 'collapsed'" type="button" data-bs-toggle="collapse" data-bs-target="#item-alternative" aria-expanded="false" aria-controls="item-alternative"></button>
                    </span>
                </h2>
                <div id="item-alternative" class="accordion-collapse collapse" :class="Object.keys(dataAlternative).length > 0 ? 'show' : ''" aria-labelledby="heading-alternative" data-bs-parent="#item-alternative">
                    <div class="list-days" v-for="(day, indexDay) in dataAlternative" :key="indexDay">
                        <div class="row item-day">
                            <div class="col text">
                                <span>{{ day.name }}</span>
                                <span class="add-item icon-trash" role="button" @click="removeAlternative(indexDay)"></span>
                            </div>
                            <div class="day">
                                <select class="form-select" v-model="day.day">
                                    <option v-for="(day, index) in days" :key="index" :value="day">{{ day }}</option>
                                </select>
                            </div>
                            <div class="day">
                                <select class="form-select" v-model="day.month">
                                    <option v-for="(month, index) in months" :key="index" :value="month">{{ month }}</option>
                                </select>
                            </div>
                            <div class="day">
                                <select class="form-select" v-model="day.year">
                                    <option v-for="(year, index) in years" :key="index" :value="year">{{ year }}</option>
                                </select>
                            </div>
                            <div class="action"></div>
                        </div>
                        <div class="row item-day" v-for="(hour, indexHour) in day.hours" :key="indexHour">
                            <div class="col text"></div>
                            <div class="day"></div>
                            <div class="day">
                                <select class="form-select" v-model="hour.open" @change="changeAlternativeHour(indexDay, indexHour)">
                                    <option  v-for="(hour, i) in hours" :key="i">{{ hour }}</option>
                                </select>
                            </div>
                            <div class="day">
                                <select class="form-select" v-model="hour.close" @change="changeAlternativeHour(indexDay, indexHour)">
                                    <option  v-for="(hour, i) in hours" :key="i">{{ hour }}</option>
                                </select>
                            </div>
                            <div class="action">
                                <span class="add-item add-right add-on" role="button" @click="addAlternative(indexDay)" v-if="indexHour === 0"></span>
                                <span class="add-item add-right icon-remove" role="button" @click="removeAlternativeHour(indexDay, indexHour)" v-if="indexHour > 0"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer @next-config-step="nextConfigStep" :currentConfigStep="currentConfigStep" :countConfigSteps="countConfigSteps" v-if="completeConfig === false"/>
    <Teleport to="body">
        <ModalHoliday :show="showModalHoliday" @close="showModalHoliday = false">
            <template #header>Adicionar novo horário</template>
            <template #body>
                <FormHoliday @close-modal="showModalHoliday= false" @save-holiday="saveHoliday" />
            </template>
        </ModalHoliday>
        <ModalAlternative :show="showModalAlternative" @close="showModalAlternative = false">
            <template #header>Horário Alternativo</template>
            <template #body>
                <FormAlternative @close-modal="showModalAlternative= false" @save-alternative="saveAlternative" />
            </template>
        </ModalAlternative>
    </Teleport>
</template>

<script setup>
    import { ref } from 'vue'

    import ModalHoliday from "../components/ModalBase.vue";
    const showModalHoliday = ref(false)

    import ModalAlternative from "../components/ModalBase.vue";
    const showModalAlternative = ref(false)
</script>

<script>
    import Navbar from "../components/Navbar.vue";
    import Sidebar from "../components/Sidebar.vue";
    import Footer from "../components/Footer.vue";
    import FormHoliday from "../components/hours/FormHoliday.vue";
    import FormAlternative from "../components/hours/FormAlternative.vue";
    
    export default {
        name: "HoursView",
        data() {
            return {
                completeConfig: false,
                currentConfigStep: 3,
                countConfigSteps: 5,
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
                weekdays: {
                    monday: "Segunda-feira",
                    tuesday: "Terça-feira",
                    wednesday: "Quarta-feira",
                    thursday: "Quinta-feira",
                    friday: "Sexta-feira",
                    saturday: "Sábado",
                    sunday: "Domingo"
                },
                dataHour: {
                    monday: [{ open: "00h00", close: "00h00" }],
                    tuesday: [{ open: "00h00", close: "00h00" }],
                    wednesday: [{ open: "00h00", close: "00h00" }],
                    thursday: [{ open: "00h00", close: "00h00" }],
                    friday: [{ open: "00h00", close: "00h00" }],
                    saturday: [{ open: "00h00", close: "00h00" }],
                    sunday: [{ open: "00h00", close: "00h00" }]
                },
                dataHolidays: [],
                dataAlternative: [],
                sidebarData: {
                    logo: "/img/logo1.png",
                    company: "TATÁ Sushi",
                    address: "R. João Cachoeira, 278",
                    active: "hours",
                    message: "Configure os menus abaixo para começar a receber pedidos!",
                    open: true,
                    links: {
                        profile: { complete: true },
                        menu: { complete: true },
                        hours: { complete: false },
                        preparation: { complete: false },
                        config: { complete: false }
                    }
                },
                navbarData: {
                    /*
                    time: "9 horas",
                    notifications: 4
                    */
                }
            }            
        },
        components: {
            Navbar,
            Sidebar,
            Footer,
            FormHoliday,
            FormAlternative
        },
        methods: {
            addDay(index) {
                this.dataHour[index].push({ open: "00h00", close: "00h00" });
            },
            removeDay(indexDay, indexHour) {
                this.dataHour[indexDay].splice(indexHour, 1);
            },
            changeDay(indexDay, indexHour, type) {
                if (this.dataHour[indexDay][indexHour][type] === "closed") {
                    this.dataHour[indexDay][indexHour].open = "closed";
                    this.dataHour[indexDay][indexHour].close = "closed";
                } else {
                    if (type === "open" && this.dataHour[indexDay][indexHour].close === "closed") {
                        this.dataHour[indexDay][indexHour].close = "00h00";
                    }
                    if (type === "close" && this.dataHour[indexDay][indexHour].open === "closed") {
                        this.dataHour[indexDay][indexHour].open = "00h00";
                    }
                }
            },
            saveHoliday(holidayData) {
                this.dataHolidays.push(holidayData);
            },
            addHoliday(index) {
                this.dataHolidays[index].hours.push({ open: "00h00", close: "00h00" });
            },
            removeHoliday(index) {
                this.dataHolidays.splice(index, 1);
            },
            removeHolidayHour(indexDay, indexHour) {
                this.dataHolidays[indexDay].hours.splice(indexHour, 1);
            },
            changeHolidayHour(indexDay, indexHour) {},
            saveAlternative(holidayData) {
                this.dataAlternative.push(holidayData);
            },
            addAlternative(index) {
                this.dataAlternative[index].hours.push({ open: "00h00", close: "00h00" });
            },
            removeAlternative(index) {
                this.dataAlternative.splice(index, 1);
            },
            removeAlternativeHour(indexDay, indexHour) {
                this.dataAlternative[indexDay].hours.splice(indexHour, 1);
            },
            changeAlternativeHour(indexDay, indexHour) {},
            nextConfigStep() {
                this.$router.push('/preparo');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header-hours {
        padding-left: 0;
        padding-right: 0;
        margin-left: 0;
        margin-right: 0;
        .day {
            padding-left: 0;
        }
    }
    .header-hours .col {
        padding-left: 0;
        margin-left: 0;
    }
    .hours.container-data .list-days {
        border: 1px solid $gray-line;
        margin: 7px 0 7px 0;
        border-radius: 5px; 
        padding: 0 25px !important;
        position: relative;
    }
    .hours.container-data .item-day {
        border-top: 1px solid $gray-line;
        padding: 10px 0;
        
    }
    .hours.container-data .item-day:first-child {
        border-top: none;        
    }
    .hours.container-data .day {
        width: 150px !important;
    }
    .hours.container-data .action {
        width: 40px !important;
    }
    .hours.container-data .text {
        padding-left: 0 !important;
        margin-left: 0 !important;
    }
    .hours.container-data .text span {
        position: relative;
        top: 10px;
    }
    .hours.container-data .action span {
        position: relative;
        top: 12px;
    }
    .hours.container-data .text span,
    .hours.container-data .day select {
        font-size: 15px
    }

    .accordion-button:not(.collapsed) {
        background-color: transparent;
        border: none !important;
        color: $black-secondary;
        box-shadow: none;
    }
    .accordion-header {
        position: relative;
        font-size: 16px;
        height: 70px;
        font-weight: 400;
        padding-top: 13px;
        padding-left: 16px;
    }
    .accordion-header .title p {
        padding-bottom: 0;
        margin-bottom: 0;
    }
    .accordion-header .row {
        width: calc(100% - 30px);
    }
    .accordion-header .move {
        margin-right: -35px;
    }
    .accordion-button {
        position: absolute;
        top: 0;
        right: 3px;
        width: 40px;
        height: 70px !important;
        padding-left: 8px;
        background-color: transparent;
    }
    .accordion-body {
        padding-top: 0;
    }
    .item-actions .dropdown {
        position: absolute;
        right: 0;
        top: 0;
    }
    .item-actions .dropdown-toggle::after {
        display: none;
    }
    .item-actions .dropdown li:first-child {
        border-top: none !important;
    }
    .dropdown-menu {
        padding: 2px 15px;
    }
    .list-item .accordion-item {
        background-color: $white-primary;
    }
    #item-alternative .list-days,
    #item-holiday .list-days {
        border: none !important;  
    }
    #item-alternative .list-days .item-day,
    #item-holiday .list-days .item-day {
        border: none !important;
    }
    #item-alternative .list-days .item-day:first-child,
    #item-holiday .list-days .item-day:first-child {
        border-top: 1px solid $gray-line !important;
    }
    .icon-trash {
        width: 30px;
        height: 30px;
        display: inline-block;
        left: 10px;
        margin-bottom: -9px;
    }
</style>
