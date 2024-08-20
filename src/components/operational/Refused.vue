<template>
    <div class="report-data mt-4 card-refuseds">
        <div class="header">
            <div class="row">
                <div class="col-12">
                    <h3 class="title">Pedidos recusados</h3>
                </div>
            </div>
        </div>
        <div class="row">
            <h4 class="bold-700 subtitle">{{ countRefused }} recusados</h4>
            <span class="hint">{{ dataInterval[intervalSelected] }}</span>
            <div class="col-sm-6">
                <div class="chart">
                    <canvas id="barChart"></canvas>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="accordion refused-list">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <span class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#data-refused" aria-expanded="true" aria-controls="data-refused">
                                <span class="type-refused">Motivos de recusa</span>
                            </span>
                        </h2>
                        <div id="data-refused" class="accordion-collapse collapse show">
                            <div class="accordion-body">
                                <div class="data-table">
                                    <table class="table">
                                        <tbody>
                                            <tr v-for="(reason, index) in dataRefuseds.byReason[intervalSelected]" :key="index">
                                                <td class="align-middle td-reason">
                                                    <span class="reason">{{ reason.reason }}</span>
                                                </td>
                                                <td class="align-middle text-start td-bar">
                                                    <span class="base-bar">
                                                        <span class="bar" :style="{ width: Math.round(reason.amount / countRefused * 100) + '%' }"></span>
                                                    </span>
                                                </td>
                                                <td class="align-middle text-end td-amount">
                                                    <span class="amount">{{ reason.amount }}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
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
        name: "Refused",
        data() {
            return {
                countRefused: 0,
                reportChart: [],
                baseColors: [
                    "rgba(24,226,28,0.5)", 
                    "rgba(24,226,28,0.5)", 
                    "rgba(24,226,28,0.5)", 
                    "rgba(24,226,28,0.5)", 
                    "rgba(24,226,28,0.5)", 
                    "rgba(24,226,28,0.5)", 
                    "rgba(24,226,28,0.5)"
                ],
                dataInterval: {
                    sevenDays: "20/06/2024 - 26/06/2024",
                    oneMonth: "26/05/2024 - 26/06/2024",
                    sixMonths: "26/01/2024 - 26/06/2024"
                },
                dataRefuseds: {
                    byDay: {
                        sevenDays: [
                            { time: "01/06/2024", value: 0 },
                            { time: "02/06/2024", value: 0 },
                            { time: "03/06/2024", value: 0 },
                            { time: "04/06/2024", value: 0 },
                            { time: "05/06/2024", value: 0 },
                            { time: "06/06/2024", value: 0 },
                            { time: "07/06/2024", value: 0 }
                        ],
                        oneMonth: [
                            { time: "01-05/Jun", value: 20 },
                            { time: "06-10/Jun", value: 30 },
                            { time: "11-15/Jun", value: 68 },
                            { time: "16-20/Jun", value: 35 },
                            { time: "21-25/Jun", value: 45 },
                            { time: "26-30/Jun", value: 25 }
                        ],
                        sixMonths: [
                            { time: "Jan/2024", value: 110 },
                            { time: "Fev/2024", value: 135 },
                            { time: "Mar/2024", value: 120 },
                            { time: "Abr/2024", value: 130 },
                            { time: "Mai/2024", value: 100 },
                            { time: "Jun/2024", value: 152 }
                        ]
                    },
                    byReason: {
                        sevenDays: [
                            { reason: "Pedido incorreto ou incompleto", amount: 0 },
                            { reason: "Qualidade inadequada da comida", amount: 0 },
                            { reason: "Atraso excessivo na entrega", amount: 0 }
                        ],
                        oneMonth: [
                            { reason: "Pedido incorreto ou incompleto", amount: 0 },
                            { reason: "Qualidade inadequada da comida", amount: 0 },
                            { reason: "Atraso excessivo na entrega", amount: 0 },
                            { reason: "Qualidade do produto", amount: 0 }
                        ],
                        sixMonths: [
                            { reason: "Pedido incorreto ou incompleto", amount: 0 },
                            { reason: "Qualidade inadequada da comida", amount: 0 },
                            { reason: "Atraso excessivo na entrega", amount: 0 },
                            { reason: "Qualidade do produto", amount: 0 },
                            { reason: "Taxas de entrega elevadas", amount: 0 },
                            { reason: "Preferência por outra opção", amount: 0 }
                        ]
                    }
                }
            }
        },
        props: {
            intervalSelected: String
        },
        methods: {
            countRefuseds() {
                this.countRefused = this.dataRefuseds.byReason[this.intervalSelected].reduce(function(accumulator, review){ 
                    return accumulator + review.amount;
                }, 0);
                this.dataRefuseds.byReason[this.intervalSelected] = this.dataRefuseds.byReason[this.intervalSelected].sort((a, b) => b.amount - a.amount);
            },
            createChart() {
                const storage = this.dataRefuseds.byDay[this.intervalSelected];
                
                var data = {
                    labels: storage.map(row => row.time),
                    datasets: [
                        {
                            label: "Recusados",
                            borderRadius: 9,
                            borderWidth: 0,
                            borderSkipped: false,
                            pointBorderWidth: 5,
                            backgroundColor: Object.values(this.baseColors),
                            hoverBackgroundColor: Object.values(this.baseColors),
                            data: storage.map(row => row.value),
                            titles: storage.map(row => row.time)
                        }
                    ]
                };
                
                var options = { 
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            grid: { display: false },
                            border: { display: false }
                        },
                        y: { display: false }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        datalabels: {
                            color: "#202025",
                            labels: {
                                title: {
                                    font: {
                                        family: "Arial, Helvetica, sans-serif",
                                        size: 14
                                    }
                                }
                            }
                        },
                        tooltip: {
                            enabled: false,
                            usePointStyle: true,
                            callbacks: {
                                title: function(tooltipItem) {
                                    return tooltipItem[0].dataset.titles[tooltipItem[0].dataIndex];
                                },
                                labelPointStyle: function() {
                                    return {
                                        pointStyle: 'circle'
                                    };
                                }
                            }
                        },
                    }
                };
                
                this.reportChart = shallowRef(
                    new Chart("barChart", {
                        type: "bar",
                        plugins: [ChartDataLabels],
                        options: options,
                        data: data
                    })
                );
                this.highlightChartBar();
            },
            updateChart() {
                const storage = this.dataRefuseds.byDay[this.intervalSelected];
                const data = storage.map(row => row.value);
                this.reportChart.data.datasets[0].data = data;
                this.reportChart.data.labels = storage.map(row => row.time),
                this.reportChart.update();
                this.highlightChartBar();
            },
            searchMaxDay() {
                const storage = this.dataRefuseds.byDay[this.intervalSelected].map(row => row.value);
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
            highlightChartBar() {
                const maxIndex = this.searchMaxDay();
                this.reportChart.data.datasets[0].backgroundColor = Object.values(this.baseColors);
                this.reportChart.data.datasets[0].hoverBackgroundColor = Object.values(this.baseColors);
                this.reportChart.data.datasets[0].backgroundColor[maxIndex] = "rgba(24,226,28,1)";
                this.reportChart.data.datasets[0].hoverBackgroundColor[maxIndex] = "rgba(24,226,28,1)";
                this.reportChart.update();
            }
        },
        mounted() {
            this.countRefuseds();
            this.createChart();
        }
    };
</script>

<style lang="scss" scoped>
    .accordion-button:not(.collapsed) {
        background-color: transparent !important;
        box-shadow: none;
    }
    #data-refused .accordion-body {
        padding-bottom: 20px;
    }
    #data-refused .accordion-body .data-table {
        overflow: auto;
        overflow-x: hidden;
        height: 210px;
        .table {
            margin-bottom: 0;
        }
    }
    #data-refused .accordion-body .data-table::-webkit-scrollbar {
        width: 12px;  
    }
    #data-refused .accordion-body .data-table::-webkit-scrollbar-track {
        background: transparent;       
    }
    #data-refused .accordion-body .data-table::-webkit-scrollbar-thumb {
        background-color: $gray-line;    
        border-radius: 20px;       
        border: 3px solid $white-primary; 
    }

    .icon-base {
        width: 14px;
        height: 14px;
        display: inline-block;
        position: relative;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 14px 14px;
        margin-bottom: -6px;
        margin-right: 3px;
    }

    .card-refuseds {
        padding-bottom: 35px !important;
        .header {
            border-bottom: 1px solid $gray-line;
            margin-bottom: 20px;
            padding-bottom: 5px;
            .new-refused {
                border: 1px solid $light-green;
                display: block;
                float: right;
                border-radius: 9px;
                font-size: 14px;
                padding: 4px 15px;
            }
            .new-refused:hover {
                background-color: $light-green;;
            }
        }
        h3.title {
            font-size: 16px;
            font-weight: 500;
            margin-top: 10px;
        }
        h4.subtitle {
            margin-bottom: 0;
            padding-bottom: 0;
            line-height: 1.1;
        }
        .hint {
            font-size: 12px;
            font-weight: 400;
        }
        .chart {
            height: 280px;
            border-right: 1px solid $gray-line;
            padding-right: 20px;
            padding-top: 50px;
        }
        .type-refused {
            color: $black-secondary;
            font-size: 16px;
            font-weight: 500;
            line-height: 1;
            margin: 0;
            padding: 0;
        }
        .count-refused {
            font-size: 13px;
            font-weight: 500;
            min-width: 40px;
            min-height: 24px;
            margin-left: 10px;
            border-radius: 12px;
            padding: 4px;
            display: inline-block;
            text-align: center;
        }
        .refused-open {
            background-color: $light-green;
        }
        .refused-close {
            color: $white-primary;
            background-color: $blue-primary;
        }
        .refused-list {
            .reason {
                color: $gray-primary;
                font-size: 13px;
                font-weight: 500;
            }
            .amount {
                font-size: 15px;
                font-weight: 600;
            }
            .icon-base {
                border: 1px solid $gray-line;
                border-radius: 50%;
                width: 34px;
                height: 34px;
                display: inline-block;
                position: relative;
                background-position: center center;
                background-repeat: no-repeat;
                background-size: 11px 11px;
                margin-bottom: -1px;
            }
            .bar {
                background-color: $light-green;
            }
        }
        .accordion-body {
            padding-top: 0;
        }
        .base-bar {
            display: block;
            height: 35px;
            min-width: 180px;
            width: 100% !important;
            margin: 7px 0;
            .bar {
                background-color: $light-green;
                display: block;
                height: 100%;
                opacity: 0.5;
                border-radius: 9px;
            }
        }

        .td-amount {
            max-width: 90px;
        }
    }
</style>