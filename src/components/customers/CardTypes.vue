<template>
    <div class="report-data mt-4 card-types">
        <div class="header">
            <div class="row">
                <div class="col-6">
                    <h3 class="title">Total de clientes</h3>
                </div>
                <div class="col-lg-6">
                    <div class="interval">
                        <label>{{ intervalSelected === "oneMonth" ? "No último" : "Nos últimos" }}</label>
                        <select class="form-select float-end text-end" v-model="intervalSelected" @change="updateChart()">
                            <option v-for="(interval, index) in intervals" :key="index" :value="index">{{ interval }}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="row card-data">
            <div class="col-sm-3">
                <div class="chart">
                    <div class="label">
                        <h4 class="number">{{ countCustomers }}</h4>
                        <p class="text">Clientes totais</p>
                        <span class="card-percent" :class="dataCustomers.generalCompare[intervalSelected] > 0 ? 'icon-var-up' : 'icon-var-down'">
                            {{ Math.abs(dataCustomers.generalCompare[intervalSelected]) }}%
                        </span>
                    </div>
                    <canvas id="doughnutChart" @mouseleave="resetColorChart()"></canvas>
                </div>
            </div>
            <div class="col-sm-9 d-flex align-items-center">
                <div class="row">
                    <div class="col d-flex list-cards" v-for="(data, index) in dataCustomers[intervalSelected]" :key="index">
                        <div class="card" :id="'card-'+index" @mouseover="setColorChart(index)" @mouseleave="resetColorChart()">
                            <h3 class="title">
                                <span class="legend" :style="{ backgroundColor: baseColors[index] }"></span>
                                {{ typeLabels[index].name }}
                            </h3>
                            <p class="description">{{ typeLabels[index].description }}</p>
                            <h4 class="number">
                                {{ data.number }}
                                <span class="card-percent" :class="data.compare > 0 ? 'icon-var-up' : 'icon-var-down'">
                                    {{ Math.abs(data.compare) }}%
                                </span>
                            </h4>
                            <hr>
                            <p class="other-data">{{ Math.round(data.number / countCustomers * 100) }}% do total de vendas</p>
                            <p class="other-data">R$ {{ data.tiket.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} ticket médio</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { shallowRef } from 'vue';
    import Chart from 'chart.js/auto';
    import ChartDataLabels from 'chartjs-plugin-datalabels'

    export default {
        name: "CardTypes",
        data() {
            return {
                intervalSelected: "sevenDays",
                countCustomers: 0,
                reportChart: [],
                baseColors: {
                    new: "rgba(153,154,242,0.6)", 
                    usual: "rgba(24,226,28,0.6)", 
                    casual: "rgba(58,170,244,0.6)"
                },
                baseColorsHover: {
                    new: "rgba(153,154,242,1)", 
                    usual: "rgba(24,226,28,1)", 
                    casual: "rgba(58,170,244,1)"
                },
                typeLabels: {
                    new: {
                        name: "Novos clientes",
                        description: "Clientes que pediram pela primeira vez na sua loja."
                    },
                    usual: {
                        name: "Clientes frequentes",
                        description: "Clientes que realizaram mais de 4 pedidos na sua loja nos últimos 90 dias."
                    },
                    casual: {
                        name: "Clientes ocasionais",
                        description: "Clientes que pediram até 4 vezes na sua loja nos últimos 90 dias."
                    }
                },
                dataCustomers: {
                    generalCompare: {
                        sevenDays: 3.5,
                        oneMonth: -12,
                        sixMonths: 59,
                    },
                    sevenDays: {
                        new: { number: 15, compare: 11, tiket: 12.45 },
                        casual: { number: 25, compare: -8, tiket: 12.65 },
                        usual: { number: 18, compare: 15, tiket: 19.45 }
                    },
                    oneMonth: {
                        new: { number: 20, compare: -2, tiket: 32.50 },
                        casual: { number: 68, compare: 22, tiket: 12.45 },
                        usual: { number: 30, compare: 15, tiket: 19.45 },
                    },
                    sixMonths: {
                        new: { number: 110, compare: 19, tiket: 17.45 },
                        casual: { number: 120, compare: 15, tiket: 13.45 },
                        usual: { number: 135, compare: -35, tiket: 12.45 }
                    }
                }
            }
        },
        props: {
            intervals: Object
        },
        methods: {
            countTotal() {
                this.countCustomers = Object.values(this.dataCustomers[this.intervalSelected]).map(item => item.number).reduce(function(accumulator, value){ 
                    return accumulator + value;
                }, 0);;
            },
            createChart() {
                const storage = Object.values(this.dataCustomers[this.intervalSelected]).map(item => item.number);
                
                var data = {
                    labels: Object.keys(this.baseColors),
                    datasets: [
                        {
                            label: "Clientes",
                            borderWidth: 0,
                            borderSkipped: false,
                            backgroundColor: Object.values(this.baseColors),
                            hoverBackgroundColor: Object.values(this.baseColorsHover),
                            data: Object.values(storage)
                        }
                    ]
                };
                
                var options = { 
                    maintainAspectRatio: false,
                    cutout: '70',
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: false,
                            usePointStyle: false
                        },
                        datalabels: {
                            display: false
                        }
                    },
                    onHover: (event, elements) => {
                        if (elements.length) {
                            const index = elements[0].index;
                            const items = Object.keys(this.baseColors);
                            this.reportChart.data.datasets[0].backgroundColor = ["rgba(241, 244, 244,1)", "rgba(241, 244, 244,1)", "rgba(241, 244, 244,1)"];
                            this.reportChart.data.datasets[0].backgroundColor[index] = this.baseColorsHover[items[index]];
                            this.reportChart.update();
                            document.querySelector('#card-new').classList.remove('active-new');
                            document.querySelector('#card-usual').classList.remove('active-usual');
                            document.querySelector('#card-casual').classList.remove('active-casual');
                            document.querySelector('#card-'+items[index]).classList.add('active-'+items[index]);
                        } 
                    }
                };
                
                this.reportChart = shallowRef(
                    new Chart("doughnutChart", {
                        type: "doughnut",
                        plugins: [ChartDataLabels],
                        options: options,
                        data: data
                    })
                );
            },
            updateChart() {
                const storage = Object.values(this.dataCustomers[this.intervalSelected]).map(item => item.number);
                const data = Object.values(storage);
                this.reportChart.data.datasets[0].data = data;
                this.reportChart.update();
            },
            searchMaxDay() {
                const storage = Object.values(this.dataCustomers[this.intervalSelected]).map(item => item.number);
                let index = null;
                let maxValue = -Infinity;
                let i = 0;
                for (let day in storage) {
                    if (storage[day] > maxValue) {
                        maxValue = storage[day]; 
                        index = i; 
                    }
                    i++;
                }
                return index;
            },
            resetColorChart() {
                this.reportChart.data.datasets[0].backgroundColor = Object.values(this.baseColors);
                this.reportChart.update();
                document.querySelector('#card-new').classList.remove('active-new');
                document.querySelector('#card-usual').classList.remove('active-usual');
                document.querySelector('#card-casual').classList.remove('active-casual');
            },
            setColorChart(type) {
                this.reportChart.data.datasets[0].backgroundColor = ["rgba(241, 244, 244,1)", "rgba(241, 244, 244,1)", "rgba(241, 244, 244,1)"];
                let index = Object.keys(this.baseColors).indexOf(type);
                this.reportChart.data.datasets[0].backgroundColor[index] = this.baseColorsHover[type];
                this.reportChart.update();
                document.querySelector('#card-new').classList.remove('active-new');
                document.querySelector('#card-usual').classList.remove('active-usual');
                document.querySelector('#card-casual').classList.remove('active-casual');
                document.querySelector('#card-'+type).classList.add('active-'+type);
            }
        },
        mounted() {
            this.countTotal();
            this.createChart();
        }
    };
</script>

<style lang="scss" scoped>
    .interval {
        width: 235px;
        float: right;
        position: relative;
        border-bottom: 1px solid $gray-line !important;
        padding-bottom: 2px;
        margin-bottom: 8px;
        height: 40px !important;
        label {
            position: absolute;
            margin-top: 7px;
            font-size: 16px;
            font-weight: 500;
            text-align: left;
        }
        select {
            background-color: transparent;
            border: none;
        }
    }

    .card-types {
        margin-top: 35px !important;
        .header {
            border-bottom: 1px solid $gray-line;
            margin-bottom: 20px;
            padding-bottom: 5px;
        }
        h3.title {
            font-size: 16px;
            font-weight: 500;
            margin-top: 10px;
        }
        .chart {
            height: 280px;
            border-right: 1px solid $gray-line;
            padding-right: 20px;
        }
    }

    .chart {
        position: relative;
        .label {
            position: absolute;
            text-align: center;
            top: calc(50% - 40px);
            left: calc(50% - 52px);
            .number {
                font-size: 28px;
                font-weight: 700;
                margin: 0;
                padding: 0;
                line-height: 1;
            }
            .text {
                font-size: 12px;
                font-weight: 400;
                margin: 0;
                padding: 0;
                line-height: 1;
                margin-bottom: 7px;
            }
        }
    }

    .active-new {
        background-color: rgba(198, 199, 248,0.6) !important;
    }
    .active-usual {
        background-color: rgba(24,226,28,0.3) !important;
    }
    .active-casual {
        background-color: rgba(130, 201, 248,0.4) !important;
    }

    .card-data {
        margin-top: 40px !important;
        margin-bottom: 20px !important;
    }

    .card {
        border: none;
        border-radius: 16px;
        padding: 20px 25px;
        background-color: #F1F4F4; //COLOCAR A COR CCERTA
        .title {
            font-size: 16px !important;
            font-weight: 500 !important;
            margin-bottom: 15px;
            .legend {
                width: 9px;
                height: 9px;
                display: inline-block;
                border-radius: 50%;
                margin-right: 5px;
                transform: translateY(-1px);
            }
        }
        .description {
            font-size: 14px !important;
            font-weight: 400;
            line-height: 1.5
        }
        .number {
            font-size: 28px !important;
            font-weight: 700;
            .card-percent {
                transform: translateY(-8px);
                margin-left: 3px;
            }
        }
        hr {
            border: none;
            border-bottom: 1px solid #DCDCDC; //COLOCAR A COR CCERTA
            box-shadow: none;
            opacity: 1;
            margin: 5px 0 10px 0;
        }
        .other-data {
            margin: 0;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.5
        }
    }

</style>