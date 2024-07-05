<template>
    <div class="preparation" :class="completeConfig ? '' : 'with-footer'">
        <Navbar :navbarData="navbarData" /><Sidebar :sidebarData="sidebarData" />
        <h2 class="bold-700 title">Tempo de preparo</h2>
        <div class="container-data">
            <label class="bold-500">Tempo médio padrão</label>
            <p class="mb-0 mt-0">Esse será o tempo que o estabelecimento terá para preparar os pedidos e o tempo que aparecerá ao consumidor no aplicativo.</p>
            <div class="row">
                <div class="col form-time">
                    <button class="btn btn-minus" @click="changeTime('general', 'minus')"><span class="add-item add-right add-minus"></span></button>
                    <input type="text" class="form-control mt-3 text" placeholder="Ex. 20 min" v-model="timeNumber.general.time">
                    <button class="btn btn-plus" @click="changeTime('general', 'plus')"><span class="add-item add-right add-plus"></span></button>
                    <button class="btn btn-save" :class="timeNumber.general.time === '' ? 'inactive' : ''" @click="saveGeneralTime(timeNumber.general)">Salvar</button>
                </div>
            </div>
            <p class="mb-0 mt-2 required-alert" v-show="invalid.general">*Campo obrigatório</p>
            <p class="mt-2 required-alert">Recomendamos não colocar um tempo de preparo longo, uma vez que isso pode fazer com que os consumidores desistam da compra.</p>
            <p v-if="dataTime.general !== ''">Tempo definido: {{ dataTime.general.time }} <span class="add-item icon-trash" role="button" @click="removeGeneralTime()"></span></p>
            <hr>
            <div class="list-item accordion mt-3">
                <label class="bold-500 mt-2">Tempo médio específico</label>
                <p class="mb-0 mt-0">Tempo que o estabelecimento terá para preparar os pedidos em determinados dias e horários da semana. Esse tempo aparecerá para  o consumidor no aplicativo.</p>
                <div class="row">
                    <div class="col form-time">
                        <button class="btn btn-minus" @click="changeTime('special', 'minus')"><span class="add-item add-right add-minus"></span></button>
                        <input type="text" class="form-control mt-3 text" placeholder="Ex. 20 min" v-model="timeNumber.special.time">
                        <button class="btn btn-plus" @click="changeTime('special', 'plus')"><span class="add-item add-right add-plus"></span></button>
                        <button class="btn btn-save" 
                            :class="timeNumber.special.number <= 0 || timeNumber.special.day === '' || timeNumber.special.open === '' || timeNumber.special.close === '' ? 'inactive' : ''" 
                            @click="saveSpecialTime(timeNumber.special)">
                            Salvar
                        </button>
                    </div>
                </div>
                <div class="list-days mb-3" >
                    <div class="row item-day">
                        <div class="day">
                            <label for="special-day" v-if="timeNumber.special.day === ''">Dia da semana</label>
                            <select class="form-select" v-model="timeNumber.special.day" id="special-day">
                                <option  v-for="(day, i) in weekdays" :key="i" :value="i">{{ day }}</option>
                            </select>
                        </div>
                        <div class="day">
                            <label for="special-open" v-if="timeNumber.special.open === ''">Hora inicial</label>
                            <select class="form-select" v-model="timeNumber.special.open" id="special-open">
                                <option  v-for="(hour, i) in hours" :key="i">{{ hour }}</option>
                            </select>
                        </div>
                        <div class="day">
                            <label for="special-close" v-if="timeNumber.special.close === ''">Hora final</label>
                            <select class="form-select" v-model="timeNumber.special.close" id="special-close">
                                <option  v-for="(hour, i) in hours" :key="i">{{ hour }}</option>
                            </select>
                        </div>
                    </div>
                    <p class="mb-1 mt-1 required-alert" v-show="invalid.special">*Preencha todos os campos</p>
                </div>
                <p class="mb-0 mt-2 list-special" v-for="(time, index) in dataTime.special" :key="index">
                    <span v-if="time">
                        {{ time.day }}: {{ time.time }}, das {{ time.open }} às {{ time.close }}
                        <span class="add-item icon-trash" role="button" @click="removeSpecialTime(index)"></span>
                    </span>
                </p>
            </div>
        </div>
    </div>
    <Footer @next-config-step="nextConfigStep" :currentConfigStep="currentConfigStep" :countConfigSteps="countConfigSteps" v-if="completeConfig === false"/>
</template>

<script>
    import Navbar from "../components/Navbar.vue";
    import Sidebar from "../components/Sidebar.vue";
    import Footer from "../components/Footer.vue"
    
    export default {
        name: "PreparationView",
        data() {
            return {
                completeConfig: false,
                currentConfigStep: 4,
                countConfigSteps: 5,
                weekdays: {
                    monday: "Segunda-feira",
                    tuesday: "Terça-feira",
                    wednesday: "Quarta-feira",
                    thursday: "Quinta-feira",
                    friday: "Sexta-feira",
                    saturday: "Sábado",
                    sunday: "Domingo"
                },
                hours: [
                    "00h00", "01h00", "02h00", "03h00", "04h00", "05h00", 
                    "06h00", "07h00", "08h00", "09h00", "10h00", "11h00",  
                    "12h00", "13h00", "14h00", "15h00", "16h00", "17h00", 
                    "18h00", "19h00", "20h00", "21h00", "22h00", "23h00"
                ],
                invalid: {
                    general: false,
                    special: false
                },
                timeNumber: {
                    general: { number: 0, time: ""},
                    special: { number: 0, time: "", day: "", open: "", close: ""}
                },
                dataTime: {
                    general: "",
                    special:  {
                        monday: "",
                        tuesday: "",
                        wednesday: "",
                        thursday: "",
                        friday: "",
                        saturday: "",
                        sunday: ""
                    }
                },
                sidebarData: {
                    logo: "/img/logo1.png",
                    company: "TATÁ Sushi",
                    address: "R. João Cachoeira, 278",
                    active: "preparation",
                    message: "Configure os menus abaixo para começar a receber pedidos!",
                    open: true,
                    links: {
                        profile: { complete: true },
                        menu: { complete: true },
                        hours: { complete: true },
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
            Footer
        },
        methods: {
            changeTime(field, operation) {
                if (this.timeNumber[field].time === "") {
                    this.timeNumber[field].number = 0;
                } else {
                    if (this.timeNumber[field].time.includes('h')) {
                        let dataHour = this.timeNumber[field].time.replace(/\s+/g, '').split("h");
                        if (dataHour.length > 1 && dataHour[1] !== "") {
                            this.timeNumber[field].number = (parseInt(dataHour[0]) * 60) + parseInt(dataHour[1]);
                        } else {
                            this.timeNumber[field].number = parseInt(dataHour[0]) * 60;
                        }
                    } else {
                        this.timeNumber[field].number = parseInt(this.timeNumber[field].time);
                    }
                }
                this.timeNumber[field].time = "";
                if (operation === 'plus') {
                    this.timeNumber[field].number = this.timeNumber[field].number +1;
                } else if (operation === 'minus') {
                    this.timeNumber[field].number = this.timeNumber[field].number -1;
                    if (this.timeNumber[field].number < 0) {
                        this.timeNumber[field].number = 0;
                    }
                }
                if (parseInt(this.timeNumber[field].number / 60) > 0) {
                    this.timeNumber[field].time += parseInt(this.timeNumber[field].number / 60) + ' h '
                }
                if (this.timeNumber[field].number % 60 > 0) {
                    this.timeNumber[field].time += (this.timeNumber[field].number % 60) + ' min '
                }
            },
            saveGeneralTime(time) {
                if (time.number > 0) {
                    this.dataTime.general = time;
                    this.invalid.general = false;
                    this.timeNumber.general = { number: 0, time: ""};
                } 
            },
            removeGeneralTime() {
                this.dataTime.general = "";
            },
            saveSpecialTime(time) {
                if (time.number > 0 && time.day !== "" && time.open !== "" && time.close !== "") {
                    this.dataTime.special[time.day] = time;
                    this.dataTime.special[time.day].day = this.weekdays[time.day];
                    this.timeNumber.special = { number: 0, time: "", day: "", open: "", close: ""};
                    this.invalid.special = false;
                }
            },
            removeSpecialTime(index) {
                this.dataTime.special[index] = "";
            },
            nextConfigStep() {
                this.$router.push('/configuracoes');
            }
        }
    }
</script>

<style lang="scss" scoped>
    h2.title {
        font-size: 23px;
        margin-bottom: 25px;
    }
    .container-data {
        min-height: calc(100vh - 190px);
    }
    .with-footer .container-data {
        min-height: calc(100vh - 260px);
    }
    .form-time {
        .btn-minus,.text,.btn-plus,.btn-plus {
            display: inline-block !important;
            margin-right: 10px;
        }
        .btn-minus,.btn-plus {
            border: 1px solid $gray-line;
            padding-top: 0;
        }
        .btn-save {
            margin-left: 10px;
            width: 100px;
            border-radius: 24px !important;
        }
        .btn-save.inactive {
            background-color: $gray-line !important;
        }
        .text {
            width: 350px;
            position: relative;
            top: 2px;
        }
    }
    .list-days {
        margin-top: 20px;
        .day {
            width: 200px;
            position: relative;
            label {
                position: absolute;
                pointer-events: none;
                color: $gray-primary;
                top: 7px;
                left: 25px;
            }
        }
    }
    .icon-trash {
        width: 30px;
        height: 24px !important;
        position: relative;
        display: inline-block;
    }
    .icon-trash {
        width: 30px;
        height: 30px;
        display: inline-block;
        margin-bottom: -2px;
    }
</style>