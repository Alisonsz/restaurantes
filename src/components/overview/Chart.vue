<template>
    <div class="report-data card-general">
        <div class="row header">
            <div class="col-lg-6">
                <h3 class="bold-500">Visão geral</h3>
            </div>
            <div class="col-lg-6">
                <div class="interval">
                    <label>{{ intervalSelected === "oneMonth" ? "No último" : "Nos últimos" }}</label>
                    <select class="form-select float-end text-end" v-model="intervalSelected" @change="reloadChart(reportSelected)">
                        <option v-for="(interval, index) in intervals" :key="index" :value="index">{{ interval }}</option>
                    </select>
                </div>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-lg-4" v-for="(cardData, index) in generalData[reportSelected][intervalSelected]" :key="index" :value="index">
                <div class="card">
                    <div class="row">
                        <div class="col-md-auto">
                            <p>
                                <span class="icon-base" :class="reportCardLabels[index].icon"></span>
                                <span class="card-title">{{ reportCardLabels[index].name }}</span>
                                <span class="icon-base icon-help" v-tippy="reportCardLabels[index].description"></span>
                            </p>
                        </div>
                        <div class="col text-center">
                            <span class="card-value" v-if="reportCardLabels[index].money === false">{{ cardData.value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                            <span class="card-value" v-else><span class="coin">R$</span>{{ cardData.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                            <span class="card-percent" :class="cardData.compare > 0 ? 'icon-var-up' : 'icon-var-down'">
                                {{  Math.abs(cardData.compare) }}%
                            </span>
                            <span class="hint">Comparado {{ intervalSelected === "oneMonth" ? "ao" : "aos" }} <span class="no-break">{{ intervalsLastLabel[intervalSelected] }}</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <p class="legend-chart">
            <span class="text-start">{{ chartData[reportSelected].label }}</span>
            <span class="text-center">{{ chartData[reportSelected].title }}</span>
        </p>
        <div class="chart">
            <canvas id="lineChart"></canvas>
        </div>
    </div>
</template>

<script>
    import { shallowRef } from 'vue';
    import Chart from 'chart.js/auto';
    import VueTippy from 'vue-tippy';
    import 'tippy.js/dist/tippy.css'; 
    import 'tippy.js/animations/scale.css';

    export default {
        name: "Chart",
        data() {
            return {
                intervalSelected: "sevenDays",
                reportChart: [],
                reportCardLabels: {
                    sales: { 
                        name: "Total de vendas", 
                        icon: "icon-sale",
                        description: "Valor total de vendas realizadas na plataforma.",
                        money: true
                    },
                    tickets: { 
                        name: "Ticket Médio", 
                        icon: "icon-ticket",
                        description: "Valor médio gasto por cliente a cada compra realizada.",
                        money: true
                    },
                    access: { 
                        name: "Total de acessos", 
                        icon: "icon-target",
                        description: "Número total de pessoas que acessaram o seu cardápio",
                        money: false 
                    },
                    requests: {
                        name: "Total de pedidos", 
                        icon: "icon-request",
                        description: "Número total de pedidos realizados na plataforma.",
                        money: false
                    },
                    customers: {
                        name: "Total de clientes", 
                        icon: "icon-customer",
                        description: "Número total de clientes que pediram no seu estabelecimento",
                        money: false
                    },
                    newCustomers: {
                        name: "Novos clientes", 
                        icon: "icon-ticket",
                        description: "Número de clientes que pediram pela primeira vez no seu estabelecimento.",
                        money: false 
                    }
                },
                generalData: {
                    sales: {
                        sevenDays: { 
                            sales: { value: 15, compare: -1 },
                            tickets: { value: 3, compare: 3 },
                            access: { value: 1, compare: 1 }
                        },
                        oneMonth: { 
                            sales: { value: 54, compare: -1 },
                            tickets: { value: 1, compare: 2 },
                            access: { value: 1, compare: -3 }
                        },
                        sixMonths: { 
                            sales: { value: 8, compare: 1 },
                            tickets: { value: 3, compare: -3 },
                            access: { value: 5, compare: 1 } 
                        }
                    },
                    requests: {
                        sevenDays: { 
                            requests: { value: 1, compare: 1 },
                            customers: { value: 9, compare: -2 },
                            newCustomers: { value: 8, compare: -1 }
                        },
                        oneMonth: { 
                            requests: { value: 3, compare: 1 },
                            customers: { value: 1, compare: -1 },
                            newCustomers: { value: 1, compare: -2 }
                        },
                        sixMonths: { 
                            requests: { value: 9, compare: 1 },
                            customers: { value: 3, compare: 1 },
                            newCustomers: { value: 9, compare: -2 }
                        }
                    }
                },
                chartData: {
                    sales: {
                        title: "Total de vendas",
                        label: "Valor (R$)",
                        sevenDays: {
                            current: [
                                { time: "01/06/2024", value: 588.55 },
                              
                            ],
                            compare: [
                                { time: "25/07/2024", value: 988.40 },
                               
                            ]
                        },
                        oneMonth: {
                            current: [
                                { time: "01/06/2024", value: 79726.71 }, { time: "02/06/2024", value: 38680.92 }, { time: "03/06/2024", value: 43650 },
                              
                            ],
                            compare: [
                                { time: "01/05/2024", value: 62735.03 }, { time: "02/05/2024", value: 61688.15 }, { time: "03/05/2024", value: 94489.86 }, 
                               
                            ],
                        },
                        sixMonths: {
                            current: [
                                { time: "Jan/2024", value: 87872.55 },
                              
                            ],
                            compare: [
                                { time: "Jul/2023", value: 77872.55 },
                              
                            ]
                        },
                    },
                    requests: {
                        title: "Total de pedidos",
                        label: "Pedidos",
                        sevenDays: {
                            current: [
                                { time: "01/06/2024", value: 58 },
                               
                            ],
                            compare: [
                                { time: "25/07/2024", value: 18 },
                              
                            ]
                        },
                        oneMonth: {
                            current: [
                                { time: "01/06/2024", value: 58 }, { time: "02/06/2024", value: 19 }, { time: "03/06/2024", value: 32 },
                              
                            ],
                            compare: [
                                { time: "01/05/2024", value: 62 }, { time: "02/05/2024", value: 61 }, { time: "03/05/2024", value: 94 }, 
                              
                            ]
                        },
                        sixMonths: {
                            current: [
                                { time: "Jan/2024", value: 258 },
                              
                            ],
                            compare: [
                                { time: "Jul/2023", value: 775 },
                               
                            ]
                        }
                    }
                }
            }
        },
        props: {
            reportSelected: String,
            intervalsLastLabel: Object,
            intervals: Object
        },
        components: {
            VueTippy
        },
        methods: {
            reloadChart(reportSelected) {
                const storage = this.chartData[reportSelected][this.intervalSelected];
                this.reportChart.data.labels = storage.current.map(row => row.time);
                this.reportChart.data.datasets[0].data = storage.current.map(row => row.value);
                this.reportChart.data.datasets[0].titles = storage.current.map(row => row.time);
                this.reportChart.data.datasets[1].data = storage.compare.map(row => row.value);
                this.reportChart.data.datasets[1].titles = storage.compare.map(row => row.time);
                this.reportChart.update();
            },
            createChart() {
                const title = this.chartData[this.reportSelected].title;
                const storage = this.chartData[this.reportSelected][this.intervalSelected];

                var data = {
                    labels: storage.current.map(row => row.time),
                    datasets: [
                        {
                            label: "Período ativo",
                            borderWidth: 2,
                            pointBorderWidth: 5,
                            backgroundColor: "rgba(24,226,28,1)",
                            borderColor: "rgba(24,226,28,1)",
                            data: storage.current.map(row => row.value),
                            titles: storage.current.map(row => row.time)
                        },
                        {
                            label: "Período anterior",
                            borderWidth: 2,
                            pointBorderWidth: 5,
                            backgroundColor: "rgba(208,244,234,1)",
                            borderColor: "rgba(208,244,234,1)",
                            data: storage.compare.map(row => row.value),
                            titles: storage.compare.map(row => row.time)
                        }
                    ]
                };

                var options = { 
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: "bottom",
                            align: "end",
                            labels: {
                                boxWidth: 12,
                                boxHeight: 12,
                                padding: 20,
                                useBorderRadius: true,
                                borderRadius: 6
                            }
                        },
                        tooltip: {
                            enabled: true,
                            usePointStyle: true,
                            callbacks: {
                                title: function(tooltipItem) {
                                    return tooltipItem[0].dataset.titles[tooltipItem[0].dataIndex];
                                },
                                labelPointStyle: function(context) {
                                    return {
                                        pointStyle: 'circle'
                                    };
                                }
                            }
                        }
                    }
                };

                this.reportChart = shallowRef(
                    this.reportChart = new Chart("lineChart", {
                        type: "line",
                        options: options,
                        data: data
                    })
                );        
            }
        },
        mounted() {
            this.createChart();
        }
    };
</script>

<style lang="scss" scoped>
    .icon-base {
        width: 18px;
        height: 18px;
        display: inline-block;
        position: relative;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 18px 18px;
        margin-bottom: -4px;
    }
    .card-percent {
        font-size: 12px;
        font-weight: 500;
    }
    .interval {
        position: relative;
        border-bottom: 1px solid $gray-line !important;
        padding-bottom: 2px;
        margin-bottom: 50px;
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

    .card-general {
        hr {
            margin: 0;
            padding: 0;
            opacity: 1;
            border-top: 1px solid $gray-line !important;
        }
        .header {
            h3 {
                font-size: 16px;
                font-weight: 500;
                margin-top: 10px;
            }
            .interval {
                width: 235px;
                float: right;
                margin-bottom: 12px;
            }
        }
        .card {
            background-color: $gray-bg;
            border: none;
            margin-top: 20px;
            padding: 12px 15px 15px 15px;
            border-radius: 16px;
            .row {
                --bs-gutter-x: 0.5rem;
            }
            .col-md-auto {
                display: grid;
                place-items: center;
                p {
                    padding: 0;
                    margin: 0;
                }
            }
        }
        .card-title {
            font-size: 15px;
            font-weight: 500;
            margin-left: 5px;
            margin-right: 5px;
        }
        .card-value {
            font-size: 26px;
            font-weight: 700;
            position: relative;
            display: inline-block;
            padding-left: 22px;
            line-height: 1;
            margin: 10px 5px 0 0;
            .coin {
                font-size: 14px;
                font-weight: 500;
                position: absolute;
                left: 0;
                top: 7px;
            }
        }
        .card-percent {
            margin-top: 10px;
            transform: translateY(-7px);
        }
        .hint {
            display: block;
            text-align: center;
            line-height: 1.2;
        }
        .chart {
            margin-top: 5px;
            width: 100%;
            height: 320px;
            margin-bottom: 15px;
        }
        .legend-chart {
            position: relative;
            display: block;
            text-align: center;
            padding-bottom: 0;
            margin-bottom: 10px;
            margin-top: 35px;
            line-height: 1;
            font-weight: 500;
            font-size: 14px;
            .text-start {
                position: absolute;
                left: 0;
            }
        }
    }

    @media (max-width: 1570px) {
        .sidebar-open {
            .card-general {
                .card-percent {
                    transform: translateY(0);
                    margin-top: 3px;
                    margin-bottom: 3px;
                }
            }
        }
        .card-general {
            .card-title {
                display: inline-block;
                max-width: 75px;
                text-align: center;
                line-height: 1.3;
                margin-top: 5px;
            }
            .card-percent {
                width: 65px
            }
            .col-md-auto{
                .icon-base {
                    transform: translateY(-8px);
                }
            }
        }
    }

    @media (max-width: 1370px) {
        .sidebar-open {
            .card-general {
                .card-title {
                    max-width: none;
                    margin-top: 10px;
                }
                .col-md-auto{
                    .icon-base {
                        transform: translateY(0);
                    }
                }
                .card-percent {
                    width: 80px;
                    transform: translateY(-8px) !important;
                }
                .col-md-auto {
                    width: 100%;
                }
            }
        }
    }

    @media (max-width: 1280px) {
        .card-general {
            .card-title {
                max-width: none;
                margin-top: 10px;
            }
            .col-md-auto{
                .icon-base {
                    transform: translateY(0);
                }
            }
            .card-percent {
                width: 80px;
                transform: translateY(-8px) !important;
            }
            .col-md-auto {
                width: 100%;
            }
        }
    }
</style>