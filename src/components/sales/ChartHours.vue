<template>
    <div class="report-data mt-4 card-hours">
        <div class="header">
            <div class="row">
                <div class="col-12">
                    <h3 class="title">Melhor horário</h3>
                </div>
            </div>
        </div>
        <h4 class="bold-700">{{ listHous[indexHour] }} - {{ maxSales }} vendas</h4>
        <span class="hint">{{ dataInterval[intervalSelected] }}</span>
        <div class="chart">
            <canvas id="barChart"></canvas>
        </div>
    </div>
</template>

<script>
    import { shallowRef } from 'vue';
    import Chart from 'chart.js/auto';
    import ChartDataLabels from 'chartjs-plugin-datalabels'

    export default {
        name: "ChartHours",
        data() {
            return {
                maxSales: 0,
                reportChart: [],
                indexHour: 0,
                listHous: ['00:00-02:00', '02:00-04:00', '04:00-06:00', '06:00-08:00', '08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00', '22:00-00:00'],
                baseColors: [
                    "rgba(24,226,28,0.5)", 
                    "rgba(24,226,28,0.5)", 
                    "rgba(24,226,28,0.5)", 
                    "rgba(24,226,28,0.5)", 
                    "rgba(24,226,28,0.5)", 
                    "rgba(24,226,28,0.5)", 
                    "rgba(24,226,28,0.5)", 
                    "rgba(24,226,28,0.5)", 
                    "rgba(24,226,28,0.5)", 
                    "rgba(24,226,28,0.5)", 
                    "rgba(24,226,28,0.5)", 
                    "rgba(24,226,28,0.5)"
                ],
                dataHours: {
                    sevenDays: {
                        h00: 4,
                        h02: 18,
                        h04: 25,
                        h06: 15,
                        h08: 27,
                        h10: 25,
                        h12: 50,
                        h14: 41,
                        h16: 8,
                        h18: 12,
                        h20: 52,
                        h22: 18
                    },
                    oneMonth: {
                        h00: 20,
                        h02: 30,
                        h04: 68,
                        h06: 35,
                        h08: 45,
                        h10: 25,
                        h12: 25,
                        h14: 25,
                        h16: 25,
                        h18: 25,
                        h20: 25,
                        h22: 58
                    },
                    sixMonths: {
                        h00: 110,
                        h02: 135,
                        h04: 150,
                        h06: 150,
                        h08: 150,
                        h10: 245,
                        h12: 150,
                        h14: 120,
                        h16: 130,
                        h18: 100,
                        h20: 150,
                        h22: 152
                    }
                },
                dataInterval: {
                    sevenDays: "20/06/2024 - 26/06/2024",
                    oneMonth: "26/05/2024 - 26/06/2024",
                    sixMonths: "26/01/2024 - 26/06/2024"
                }
            }
        },
        props: {
            intervalSelected: String
        },
        methods: {
            createChart() {
                const storage = this.dataHours[this.intervalSelected];
                
                var data = {
                    labels: this.listHous,
                    datasets: [
                        {
                            label: "Vendas",
                            borderRadius: 9,
                            borderWidth: 0,
                            borderSkipped: false,
                            pointBorderWidth: 5,
                            backgroundColor: Object.values(this.baseColors),
                            hoverBackgroundColor: Object.values(this.baseColors),
                            data: Object.values(storage)
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
                            font: {
                                family: "Arial, Helvetica, sans-serif",
                                size: 14
                            }
                        },
                        tooltip: {
                            enabled: false,
                            usePointStyle: true,
                            callbacks: {
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
                this.reportChart.data.datasets[0].backgroundColor = Object.values(this.baseColors);
                this.reportChart.data.datasets[0].hoverBackgroundColor = Object.values(this.baseColors);
                this.reportChart.data.datasets[0].data = Object.values(this.dataHours[this.intervalSelected]);
                this.reportChart.update();
                this.highlightChartBar();
            },
            searchMaxSales() {
                const storage = this.dataHours[this.intervalSelected];
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
                this.maxSales = maxValue;
                this.indexHour = index;
                return index;
            },
            highlightChartBar() {
                const maxIndex = this.searchMaxSales();
                this.reportChart.data.datasets[0].backgroundColor[maxIndex] = "rgba(24,226,28,1)";
                this.reportChart.data.datasets[0].hoverBackgroundColor[maxIndex] = "rgba(24,226,28,1)";
                this.reportChart.update();
            }
        },
        mounted() {
            this.createChart();
        }
    };
</script>

<style lang="scss" scoped>
    .accordion-button:not(.collapsed) {
        background-color: transparent !important;
        box-shadow: none;
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

    .card-hours {
        padding-bottom: 35px !important;
        .header {
            border-bottom: 1px solid $gray-line;
            margin-bottom: 20px;
            padding-bottom: 5px;
            .new-hour {
                border: 1px solid $light-green;
                display: block;
                float: right;
                border-radius: 9px;
                font-size: 14px;
                padding: 4px 15px;
            }
            .new-hour:hover {
                background-color: $light-green;;
            }
        }
        h3.title {
            font-size: 16px;
            font-weight: 500;
            margin-top: 10px;
        }
        h4 {
            padding-bottom: 0;
            margin-bottom: 0;
            line-height: 1 !important;
        }
        .hint {
            font-size: 12px;
            font-weight: 400;
        }
        .chart {
            height: 220px;
            padding-top: 10px;
        }
        .type-hour {
            color: $black-secondary;
            font-size: 16px;
            font-weight: 500;
            line-height: 1;
            margin: 0;
            padding: 0;
        }
        .count-hour {
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
        .hour-open {
            background-color: $light-green;
        }
        .hour-close {
            color: $white-primary;
            background-color: $blue-primary;
        }
        .hour-list {
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