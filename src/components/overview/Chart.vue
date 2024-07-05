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
                            sales: { value: 12345, compare: -16 },
                            tickets: { value: 345, compare: 32 },
                            access: { value: 19184, compare: 12 }
                        },
                        oneMonth: { 
                            sales: { value: 54325, compare: -15 },
                            tickets: { value: 1288, compare: 27 },
                            access: { value: 181224, compare: -3 }
                        },
                        sixMonths: { 
                            sales: { value: 89954, compare: 19 },
                            tickets: { value: 3864, compare: -3 },
                            access: { value: 548925, compare: 15 } 
                        }
                    },
                    requests: {
                        sevenDays: { 
                            requests: { value: 18222, compare: 16 },
                            customers: { value: 9887, compare: -22 },
                            newCustomers: { value: 802, compare: -15 }
                        },
                        oneMonth: { 
                            requests: { value: 35877, compare: 10 },
                            customers: { value: 15225, compare: -18 },
                            newCustomers: { value: 1258, compare: -2 }
                        },
                        sixMonths: { 
                            requests: { value: 952187, compare: 15 },
                            customers: { value: 34585, compare: 18 },
                            newCustomers: { value: 9055, compare: -25 }
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
                                { time: "02/06/2024", value: 1158.54 },
                                { time: "03/06/2024", value: 685.88 },
                                { time: "04/06/2024", value: 1122.22 },
                                { time: "05/06/2024", value: 958.01 },
                                { time: "06/06/2024", value: 787.56 },
                                { time: "07/06/2024", value: 1235.85 }
                            ],
                            compare: [
                                { time: "25/07/2024", value: 988.40 },
                                { time: "26/07/2024", value: 758.12 },
                                { time: "27/07/2024", value: 985.58 },
                                { time: "28/07/2024", value: 782.65 },
                                { time: "29/07/2024", value: 1002.01 },
                                { time: "30/07/2024", value: 887.52 },
                                { time: "31/07/2024", value: 935.85 }
                            ]
                        },
                        oneMonth: {
                            current: [
                                { time: "01/06/2024", value: 79726.71 }, { time: "02/06/2024", value: 38680.92 }, { time: "03/06/2024", value: 43650 },
                                { time: "04/06/2024", value: 87521.33 }, { time: "05/06/2024", value: 72895.83 }, { time: "06/06/2024", value: 58972.44 }, 
                                { time: "07/06/2024", value: 99101.58 }, { time: "08/06/2024", value: 33147.17 }, { time: "09/06/2024", value: 15638.29 },
                                { time: "10/06/2024", value: 69752.07 }, { time: "11/06/2024", value: 72765.82 }, { time: "12/06/2024", value: 73783.18 },
                                { time: "13/06/2024", value: 70476.85 }, { time: "14/06/2024", value: 789.36 }, { time: "15/06/2024", value: 87365.51 },
                                { time: "16/06/2024", value: 43792.88 }, { time: "17/06/2024", value: 80245.37 }, { time: "18/06/2024", value: 80043.56 },
                                { time: "19/06/2024", value: 63275.25 }, { time: "20/06/2024", value: 91086.07 }, { time: "21/06/2024", value: 26130.83 },
                                { time: "22/06/2024", value: 37151.61 }, { time: "23/06/2024", value: 39451.25 }, { time: "24/06/2024", value: 48316.41 },
                                { time: "25/06/2024", value: 8989.55 }, { time: "26/06/2024", value: 12226.41 }, { time: "27/06/2024", value: 36833.95 },
                                { time: "28/06/2024", value: 11797.12 }, { time: "29/06/2024", value: 68557.74 }, { time: "30/06/2024", value: 18301.28 }
                            ],
                            compare: [
                                { time: "01/05/2024", value: 62735.03 }, { time: "02/05/2024", value: 61688.15 }, { time: "03/05/2024", value: 94489.86 }, 
                                { time: "04/05/2024", value: 1905.88 }, { time: "05/05/2024", value: 29019.7 }, { time: "06/05/2024", value: 97648.83 }, 
                                { time: "07/05/2024", value: 24065.94 }, { time: "08/05/2024", value: 37006.18 }, { time: "09/05/2024", value: 23814.25 }, 
                                { time: "10/05/2024", value: 50035.36 }, { time: "11/05/2024", value: 82968.54 }, { time: "12/05/2024", value: 73427.2 }, 
                                { time: "13/05/2024", value: 57670.91 }, { time: "14/05/2024", value: 34939.1 }, { time: "15/05/2024", value: 73431.2 }, 
                                { time: "16/05/2024", value: 88326.92 }, { time: "17/05/2024", value: 27279.12 }, { time: "18/05/2024", value: 22389.74 }, 
                                { time: "19/05/2024", value: 96801.39 }, { time: "20/05/2024", value: 13186.82 }, { time: "21/05/2024", value: 32866.52 }, 
                                { time: "22/05/2024", value: 81717.87 }, { time: "23/05/2024", value: 99363.86 }, { time: "24/05/2024", value: 80903.27 }, 
                                { time: "25/05/2024", value: 67568.61 }, { time: "26/05/2024", value: 20153.54 }, { time: "27/05/2024", value: 12825.87 }, 
                                { time: "28/05/2024", value: 37757.18 }, { time: "29/05/2024", value: 8366.9 }, { time: "30/05/2024", value: 51277.61 }
                            ],
                        },
                        sixMonths: {
                            current: [
                                { time: "Jan/2024", value: 87872.55 },
                                { time: "Fev/2024", value: 8775.66 },
                                { time: "Mar/2024", value: 88553.33 },
                                { time: "Abr/2024", value: 78753.22 },
                                { time: "Mai/2024", value: 32655.22 },
                                { time: "Jun/2024", value: 8756.55 }
                            ],
                            compare: [
                                { time: "Jul/2023", value: 77872.55 },
                                { time: "Ago/2023", value: 9775.66 },
                                { time: "Set/2023", value: 8003.33 },
                                { time: "Out/2023", value: 65723.22 },
                                { time: "Nov/2023", value: 52755.22 },
                                { time: "dez/2023", value: 5696.55 }
                            ]
                        },
                    },
                    requests: {
                        title: "Total de pedidos",
                        label: "Pedidos",
                        sevenDays: {
                            current: [
                                { time: "01/06/2024", value: 58 },
                                { time: "02/06/2024", value: 19 },
                                { time: "03/06/2024", value: 32 },
                                { time: "04/06/2024", value: 45 },
                                { time: "05/06/2024", value: 17 },
                                { time: "06/06/2024", value: 12 },
                                { time: "07/06/2024", value: 40 }
                            ],
                            compare: [
                                { time: "25/07/2024", value: 18 },
                                { time: "26/07/2024", value: 58 },
                                { time: "27/07/2024", value: 95 },
                                { time: "28/07/2024", value: 52 },
                                { time: "29/07/2024", value: 30 },
                                { time: "30/07/2024", value: 47 },
                                { time: "31/07/2024", value: 65 }
                            ]
                        },
                        oneMonth: {
                            current: [
                                { time: "01/06/2024", value: 58 }, { time: "02/06/2024", value: 19 }, { time: "03/06/2024", value: 32 },
                                { time: "04/06/2024", value: 45 }, { time: "05/06/2024", value: 17 }, { time: "06/06/2024", value: 12 },
                                { time: "07/06/2024", value: 40 }, { time: "08/06/2024", value: 76 }, { time: "09/06/2024", value: 24 },
                                { time: "10/06/2024", value: 53 }, { time: "11/06/2024", value: 65 }, { time: "12/06/2024", value: 34 },
                                { time: "13/06/2024", value: 22 }, { time: "14/06/2024", value: 47 }, { time: "15/06/2024", value: 38 },
                                { time: "16/06/2024", value: 41 }, { time: "17/06/2024", value: 20 }, { time: "18/06/2024", value: 89 }, 
                                { time: "19/06/2024", value: 73 }, { time: "20/06/2024", value: 49 }, { time: "21/06/2024", value: 66 },
                                { time: "22/06/2024", value: 92 }, { time: "23/06/2024", value: 54 }, { time: "24/06/2024", value: 31 },
                                { time: "25/06/2024", value: 48 }, { time: "26/06/2024", value: 37 }, { time: "27/06/2024", value: 59 },
                                { time: "28/06/2024", value: 50 }, { time: "29/06/2024", value: 83 }, { time: "30/06/2024", value: 77 }
                            ],
                            compare: [
                                { time: "01/05/2024", value: 62 }, { time: "02/05/2024", value: 61 }, { time: "03/05/2024", value: 94 }, 
                                { time: "04/05/2024", value: 19 }, { time: "05/05/2024", value: 29 }, { time: "06/05/2024", value: 97 }, 
                                { time: "07/05/2024", value: 24 }, { time: "08/05/2024", value: 37 }, { time: "09/05/2024", value: 25 }, 
                                { time: "10/05/2024", value: 50 }, { time: "11/05/2024", value: 82 }, { time: "12/05/2024", value: 73 }, 
                                { time: "13/05/2024", value: 51 }, { time: "14/05/2024", value: 34 }, { time: "15/05/2024", value: 73 }, 
                                { time: "16/05/2024", value: 88 }, { time: "17/05/2024", value: 27 }, { time: "18/05/2024", value: 24 }, 
                                { time: "19/05/2024", value: 99 }, { time: "20/05/2024", value: 13 }, { time: "21/05/2024", value: 32 }, 
                                { time: "22/05/2024", value: 81 }, { time: "23/05/2024", value: 99 }, { time: "24/05/2024", value: 87 }, 
                                { time: "25/05/2024", value: 61 }, { time: "26/05/2024", value: 20 }, { time: "27/05/2024", value: 17 }, 
                                { time: "28/05/2024", value: 37 }, { time: "29/05/2024", value: 83 }, { time: "30/05/2024", value: 51 }
                            ]
                        },
                        sixMonths: {
                            current: [
                                { time: "Jan/2024", value: 258 },
                                { time: "Fev/2024", value: 350 },
                                { time: "Mar/2024", value: 508 },
                                { time: "Abr/2024", value: 205 },
                                { time: "Mai/2024", value: 485 },
                                { time: "Jun/2024", value: 359 }
                            ],
                            compare: [
                                { time: "Jul/2023", value: 775 },
                                { time: "Ago/2023", value: 566 },
                                { time: "Set/2023", value: 333 },
                                { time: "Out/2023", value: 322 },
                                { time: "Nov/2023", value: 272 },
                                { time: "dez/2023", value: 555 }
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