<template>
  <div class="report-data mt-4 card-days">
      <div class="header">
          <div class="row">
              <div class="col-12">
                  <h3 class="title">Dia com os melhores resultados</h3>
              </div>
          </div>
      </div>
      <h4 class="bold-700 subtitle">{{ labelDays[listDays[indexDay]] }} - {{ maxSales }} vendas</h4>
      <span class="hint">{{ dataInterval }}</span>
      <div class="chart">
          <canvas id="lineChart"></canvas>
      </div>
  </div>
</template>

<script>
import { shallowRef, watch } from 'vue';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default {
    name: "ChartDays",
    data() {
        return {
            maxSales: 0,
            reportChart: null,
            indexDay: 0,
            labelDays: { 
                seg: "Segunda", 
                ter: "Terça", 
                qua: "Quarta", 
                qui: "Quinta", 
                sex: "Sexta", 
                sab: "Sábado", 
                dom: "Domingo" 
            },
            listDays: ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'],
            baseColors: [
                "rgba(24,226,28,0.5)", 
                "rgba(24,226,28,0.5)", 
                "rgba(24,226,28,0.5)", 
                "rgba(24,226,28,0.5)", 
                "rgba(24,226,28,0.5)", 
                "rgba(24,226,28,0.5)", 
                "rgba(24,226,28,0.5)"
            ]
        };
    },
    props: {
        intervalSelected: String,
        salesData: Object
    },
    computed: {
        dataInterval() {
            const intervalMapping = {
                sevenDays: 7,
                oneMonth: 30,
                sixMonths: 180
            };
            const interval = intervalMapping[this.intervalSelected];
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - interval);
            return `${startDate.toLocaleDateString('pt-BR')} - ${endDate.toLocaleDateString('pt-BR')}`;
        }
    },
    methods: {
        createChart() {
            if (!this.salesData) return;

            const storage = this.getDataDays();

            var data = {
                labels: this.listDays,
                datasets: [
                    {
                        label: "Vendas",
                        borderRadius: 9,
                        borderWidth: 2,
                        borderSkipped: false,
                        pointBorderWidth: 5,
                        backgroundColor: "rgba(24,226,28,1)",
                        borderColor: "rgba(24,226,28,1)",
                        hoverBackgroundColor: Object.values(this.baseColors),
                        data: Object.values(storage)
                    }
                ]
            };

            var options = {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 35,
                        left: 20,
                        right: 20
                    }
                },
                scales: {
                    x: {
                        grid: { display: true },
                        border: { display: false },
                    },
                    y: {
                        grid: { display: true },
                        border: { display: false },
                        ticks: { display: false }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    datalabels: {
                        color: "#202025",
                        backgroundColor: this.baseColors,
                        anchor: "end",
                        align: 'end',
                        offset: 6,
                        borderRadius: 6,
                        padding: {
                            left: 8,
                            right: 8
                        },
                        font: {
                            family: "Arial, Helvetica, sans-serif",
                            size: 14
                        },
                        formatter: (value, context) => {
                            const minWidth = 20;
                            const ctx = context.chart.ctx;
                            let textWidth = ctx.measureText(value).width;
                            while (textWidth < minWidth) {
                                value = ' ' + value + ' ';
                                textWidth = ctx.measureText(value).width;
                            }
                            return value;
                        },
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

            if (this.reportChart) {
                this.reportChart.destroy();
            }

            this.reportChart = shallowRef(
                new Chart("lineChart", {
                    type: "line",
                    plugins: [ChartDataLabels],
                    options: options,
                    data: data
                })
            );

            this.highlightChartBar();
        },
        updateChart() {
            if (!this.salesData || !this.reportChart) return;

            this.reportChart.data.datasets[0].data = Object.values(this.getDataDays());
            this.reportChart.update();
            this.highlightChartBar();
        },
        searchMaxSales() {
            const storage = this.getDataDays();
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
            this.indexDay = index;
            return index;
        },
        highlightChartBar() {
            const maxIndex = this.searchMaxSales();
            this.reportChart.options.plugins.datalabels.backgroundColor = Object.values(this.baseColors);
            this.reportChart.options.plugins.datalabels.backgroundColor[maxIndex] = "rgba(24,226,28,1)";
            this.reportChart.update();
        },
        getDataDays() {
            if (!this.salesData) return {};
            const intervalMapping = {
                sevenDays: 7,
                oneMonth: 30,
                sixMonths: 180
            };
            const interval = intervalMapping[this.intervalSelected];
            const days = {
                0: 'dom',
                1: 'seg',
                2: 'ter',
                3: 'qua',
                4: 'qui',
                5: 'sex',
                6: 'sab'
            };
            const data = this.salesData[interval].day_of_week_sales;
            const mappedData = {};
            Object.keys(data).forEach(day => {
                mappedData[days[day]] = data[day];
            });
            return mappedData;
        }
    },
    mounted() {
        this.createChart();
    },
    watch: {
        salesData(newValue) {
            if (newValue) {
                this.createChart();
            }
        },
        intervalSelected() {
            this.updateChart();
        }
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

  .card-days {
      padding-bottom: 35px !important;
      .header {
          border-bottom: 1px solid $gray-line;
          margin-bottom: 20px;
          padding-bottom: 5px;
          .new-day {
              border: 1px solid $light-green;
              display: block;
              float: right;
              border-radius: 9px;
              font-size: 14px;
              padding: 4px 15px;
          }
          .new-day:hover {
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
          line-height: 1;
      }
      .hint {
          font-size: 12px;
          font-weight: 400;
      }
      .chart {
          height: 230px;
          padding-top: 10px;
      }
      .type-day {
          color: $black-secondary;
          font-size: 16px;
          font-weight: 500;
          line-height: 1;
          margin: 0;
          padding: 0;
      }
      .count-day {
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
      .day-open {
          background-color: $light-green;
      }
      .day-close {
          color: $white-primary;
          background-color: $blue-primary;
      }
      .day-list {
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
