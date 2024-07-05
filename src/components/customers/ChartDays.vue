<template>
    <div class="report-data card-interaction">
        <div class="row header">
            <div class="col-lg-6">
                <h3 class="bold-500">{{ dataReport.name }} <span class="icon-base icon-help" v-tippy="dataReport.description"></span></h3>
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
        <h4 class="bold-700 subtitle">{{ sumInteractions.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }} {{ dataReport.action }}</h4>
        <div class="data-compare">
            <span class="card-percent" :class="chartData[reportSelected][intervalSelected].generalCompare > 0 ? 'icon-var-up' : 'icon-var-down'">
                {{ Math.abs(chartData[reportSelected][intervalSelected].generalCompare) }}%
            </span>
            <span class="hint">comparado {{ intervalSelected === "oneMonth" ? "ao" : "aos" }} {{ intervalsLastLabel[intervalSelected] }}</span>
        </div>
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
        name: "ChartDays",
        data() {
            return {
                sumInteractions: 0,
                intervalSelected: "sevenDays",
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
                chartData: {
                    views: {
                        sevenDays: {
                            generalCompare: -14,
                            current: [
                                { time: "01/06/2024", value: 588 },
                                { time: "02/06/2024", value: 1058 },
                                { time: "03/06/2024", value: 685 },
                                { time: "04/06/2024", value: 1122 },
                                { time: "05/06/2024", value: 958 },
                                { time: "06/06/2024", value: 787 },
                                { time: "07/06/2024", value: 1235 }
                            ],
                            compare: [
                                { time: "25/07/2024", value: 988 },
                                { time: "26/07/2024", value: 758 },
                                { time: "27/07/2024", value: 985 },
                                { time: "28/07/2024", value: 782 },
                                { time: "29/07/2024", value: 1002 },
                                { time: "30/07/2024", value: 887 },
                                { time: "31/07/2024", value: 935 }
                            ]
                        },
                        oneMonth: {
                            generalCompare: -18,
                            current: [
                                { time: "01/06/2024", value: 79726 }, { time: "02/06/2024", value: 38680 }, { time: "03/06/2024", value: 4365 },
                                { time: "04/06/2024", value: 87521 }, { time: "05/06/2024", value: 72895 }, { time: "06/06/2024", value: 58972 }, 
                                { time: "07/06/2024", value: 99101 }, { time: "08/06/2024", value: 33147 }, { time: "09/06/2024", value: 15638 },
                                { time: "10/06/2024", value: 69752 }, { time: "11/06/2024", value: 72765 }, { time: "12/06/2024", value: 73783 },
                                { time: "13/06/2024", value: 70476 }, { time: "14/06/2024", value: 789 }, { time: "15/06/2024", value: 87365 },
                                { time: "16/06/2024", value: 43792 }, { time: "17/06/2024", value: 80245 }, { time: "18/06/2024", value: 80043 },
                                { time: "19/06/2024", value: 63275 }, { time: "20/06/2024", value: 9108 }, { time: "21/06/2024", value: 26130 },
                                { time: "22/06/2024", value: 37151 }, { time: "23/06/2024", value: 39451 }, { time: "24/06/2024", value: 48316 },
                                { time: "25/06/2024", value: 8989 }, { time: "26/06/2024", value: 12226 }, { time: "27/06/2024", value: 36833 },
                                { time: "28/06/2024", value: 11797 }, { time: "29/06/2024", value: 68557 }, { time: "30/06/2024", value: 18301 }
                            ],
                            compare: [
                                { time: "01/05/2024", value: 62735 }, { time: "02/05/2024", value: 61688 }, { time: "03/05/2024", value: 94489 }, 
                                { time: "04/05/2024", value: 1905 }, { time: "05/05/2024", value: 29019 }, { time: "06/05/2024", value: 97648 }, 
                                { time: "07/05/2024", value: 24065 }, { time: "08/05/2024", value: 37006 }, { time: "09/05/2024", value: 23814 }, 
                                { time: "10/05/2024", value: 50035 }, { time: "11/05/2024", value: 82968 }, { time: "12/05/2024", value: 73427 }, 
                                { time: "13/05/2024", value: 57670 }, { time: "14/05/2024", value: 3493 }, { time: "15/05/2024", value: 73431 }, 
                                { time: "16/05/2024", value: 88326 }, { time: "17/05/2024", value: 27279 }, { time: "18/05/2024", value: 22389 }, 
                                { time: "19/05/2024", value: 96801 }, { time: "20/05/2024", value: 13186 }, { time: "21/05/2024", value: 32866 }, 
                                { time: "22/05/2024", value: 81717 }, { time: "23/05/2024", value: 99363 }, { time: "24/05/2024", value: 80903 }, 
                                { time: "25/05/2024", value: 67568 }, { time: "26/05/2024", value: 20153 }, { time: "27/05/2024", value: 12825 }, 
                                { time: "28/05/2024", value: 37757 }, { time: "29/05/2024", value: 8366 }, { time: "30/05/2024", value: 51277 }
                            ]
                        }, 
                        sixMonths: {
                            generalCompare: 32,
                            current: [
                                { time: "Jan/2024", value: 87872 },
                                { time: "Fev/2024", value: 87756 },
                                { time: "Mar/2024", value: 88533 },
                                { time: "Abr/2024", value: 78752 },
                                { time: "Mai/2024", value: 32652 },
                                { time: "Jun/2024", value: 87565 }
                            ],
                            compare: [
                                { time: "Jul/2023", value: 77725 },
                                { time: "Ago/2023", value: 97766 },
                                { time: "Set/2023", value: 80033 },
                                { time: "Out/2023", value: 65722 },
                                { time: "Nov/2023", value: 52722 },
                                { time: "dez/2023", value: 56955 }
                            ]
                        }
                    },
                    interactios: {
                        sevenDays: {
                            generalCompare: 17,
                            current: [
                                { time: "25/07/2024", value: 988 },
                                { time: "26/07/2024", value: 758 },
                                { time: "27/07/2024", value: 985 },
                                { time: "28/07/2024", value: 782 },
                                { time: "29/07/2024", value: 1002 },
                                { time: "30/07/2024", value: 887 },
                                { time: "31/07/2024", value: 935 }
                            ],
                            compare: [
                                { time: "01/06/2024", value: 588 },
                                { time: "02/06/2024", value: 1158 },
                                { time: "03/06/2024", value: 685 },
                                { time: "04/06/2024", value: 1122 },
                                { time: "05/06/2024", value: 958 },
                                { time: "06/06/2024", value: 787 },
                                { time: "07/06/2024", value: 1235 }
                            ]
                        },
                        oneMonth: {
                            generalCompare: 19,
                            current: [
                                { time: "01/05/2024", value: 62735 }, { time: "02/05/2024", value: 61688 }, { time: "03/05/2024", value: 94489 }, 
                                { time: "04/05/2024", value: 1905 }, { time: "05/05/2024", value: 29019 }, { time: "06/05/2024", value: 97648 }, 
                                { time: "07/05/2024", value: 24065 }, { time: "08/05/2024", value: 37006 }, { time: "09/05/2024", value: 23814 }, 
                                { time: "10/05/2024", value: 50035 }, { time: "11/05/2024", value: 82968 }, { time: "12/05/2024", value: 73427 }, 
                                { time: "13/05/2024", value: 57670 }, { time: "14/05/2024", value: 3493 }, { time: "15/05/2024", value: 73431 }, 
                                { time: "16/05/2024", value: 88326 }, { time: "17/05/2024", value: 27279 }, { time: "18/05/2024", value: 22389 }, 
                                { time: "19/05/2024", value: 96801 }, { time: "20/05/2024", value: 13186 }, { time: "21/05/2024", value: 32866 }, 
                                { time: "22/05/2024", value: 81717 }, { time: "23/05/2024", value: 99363 }, { time: "24/05/2024", value: 80903 }, 
                                { time: "25/05/2024", value: 67568 }, { time: "26/05/2024", value: 20153 }, { time: "27/05/2024", value: 12825 }, 
                                { time: "28/05/2024", value: 37757 }, { time: "29/05/2024", value: 8366 }, { time: "30/05/2024", value: 51277 }
                            ],
                            compare: [
                                { time: "01/06/2024", value: 79726 }, { time: "02/06/2024", value: 38680 }, { time: "03/06/2024", value: 4365 },
                                { time: "04/06/2024", value: 87521 }, { time: "05/06/2024", value: 72895 }, { time: "06/06/2024", value: 58972 }, 
                                { time: "07/06/2024", value: 99101 }, { time: "08/06/2024", value: 33147 }, { time: "09/06/2024", value: 15638 },
                                { time: "10/06/2024", value: 69752 }, { time: "11/06/2024", value: 72765 }, { time: "12/06/2024", value: 73783 },
                                { time: "13/06/2024", value: 70476 }, { time: "14/06/2024", value: 789 }, { time: "15/06/2024", value: 87365 },
                                { time: "16/06/2024", value: 43792 }, { time: "17/06/2024", value: 80245 }, { time: "18/06/2024", value: 80043 },
                                { time: "19/06/2024", value: 63275 }, { time: "20/06/2024", value: 9108 }, { time: "21/06/2024", value: 26130 },
                                { time: "22/06/2024", value: 37151 }, { time: "23/06/2024", value: 39451 }, { time: "24/06/2024", value: 48316 },
                                { time: "25/06/2024", value: 8989 }, { time: "26/06/2024", value: 12226 }, { time: "27/06/2024", value: 36833 },
                                { time: "28/06/2024", value: 11797 }, { time: "29/06/2024", value: 68557 }, { time: "30/06/2024", value: 18301 }
                            ]
                        }, 
                        sixMonths: {
                            generalCompare: -7,
                            current: [
                                { time: "Jul/2023", value: 77725 },
                                { time: "Ago/2023", value: 97766 },
                                { time: "Set/2023", value: 80033 },
                                { time: "Out/2023", value: 65722 },
                                { time: "Nov/2023", value: 52722 },
                                { time: "dez/2023", value: 56955 }
                            ],
                            compare: [
                                { time: "Jan/2024", value: 87872 },
                                { time: "Fev/2024", value: 87756 },
                                { time: "Mar/2024", value: 88533 },
                                { time: "Abr/2024", value: 78752 },
                                { time: "Mai/2024", value: 32652 },
                                { time: "Jun/2024", value: 87565 }
                            ]
                        }
                    },
                    clicks: {
                        sevenDays: {
                            generalCompare: 32,
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
                            generalCompare: 12,
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
                        sixMonths:  {
                            generalCompare: -8,
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
                    },
                    conversion: {
                        sevenDays: {
                            generalCompare: -15,
                            current: [
                                { time: "25/07/2024", value: 18 },
                                { time: "26/07/2024", value: 58 },
                                { time: "27/07/2024", value: 95 },
                                { time: "28/07/2024", value: 52 },
                                { time: "29/07/2024", value: 30 },
                                { time: "30/07/2024", value: 47 },
                                { time: "31/07/2024", value: 65 }
                            ],
                            compare: [
                                { time: "01/06/2024", value: 58 },
                                { time: "02/06/2024", value: 19 },
                                { time: "03/06/2024", value: 32 },
                                { time: "04/06/2024", value: 45 },
                                { time: "05/06/2024", value: 17 },
                                { time: "06/06/2024", value: 12 },
                                { time: "07/06/2024", value: 40 }
                            ]
                        },
                        oneMonth: {
                            generalCompare: -8,
                            current: [
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
                            ],
                            compare: [
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
                            ]
                        },
                        sixMonths:  {
                            generalCompare: 25,
                            current: [
                                { time: "Jul/2023", value: 775 },
                                { time: "Ago/2023", value: 566 },
                                { time: "Set/2023", value: 333 },
                                { time: "Out/2023", value: 322 },
                                { time: "Nov/2023", value: 272 },
                                { time: "dez/2023", value: 555 }
                            ],
                            compare: [
                                { time: "Jan/2024", value: 258 },
                                { time: "Fev/2024", value: 350 },
                                { time: "Mar/2024", value: 508 },
                                { time: "Abr/2024", value: 205 },
                                { time: "Mai/2024", value: 485 },
                                { time: "Jun/2024", value: 359 }
                            ]
                        }
                    }
                }
            }
        },
        props: {
            reportSelected: String,
            intervalsLastLabel: Object,
            intervals: Object,
            dataReport: Object
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
                this.calcSumInteractions();
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
            },
            calcSumInteractions() {
                this.sumInteractions = 0;
                const storage = this.chartData[this.reportSelected][this.intervalSelected];
                const values = storage.current.map(row => row.value);
                for (let day in values) {
                    this.sumInteractions += parseInt(values);
                }
            }
        },
        mounted() {
            this.calcSumInteractions();
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

    .card-interaction {
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
        h4.subtitle {
            display: block;
            margin-top: 20px !important;
            margin-bottom: 0;
            padding-bottom: 0;
            line-height: 1;
        }
        .data-compare {
            margin-top: 5px;
            .hint {
                display: inline-block !important;
                margin-left: 10px;
                transform: translateY(-6px);
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
            height: 350px;
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
            .card-interaction {
                .card-percent {
                    transform: translateY(0);
                    margin-top: 3px;
                    margin-bottom: 3px;
                }
            }
        }
        .card-interaction {
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
            .card-interaction {
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
        .card-interaction {
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