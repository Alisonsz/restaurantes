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
      <span class="hint">{{ dataInterval }}</span>
      <div class="chart">
          <canvas id="barChart"></canvas>
      </div>
  </div>
</template>

<script>
import { shallowRef, watch } from 'vue';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default {
    name: "ChartHours",
    data() {
        return {
            maxSales: 0,
            reportChart: null,
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

            const storage = this.getDataHours();

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

            if (this.reportChart) {
                this.reportChart.destroy();
            }

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
            if (!this.salesData || !this.reportChart) return;

            this.reportChart.data.datasets[0].backgroundColor = Object.values(this.baseColors);
            this.reportChart.data.datasets[0].hoverBackgroundColor = Object.values(this.baseColors);
            this.reportChart.data.datasets[0].data = Object.values(this.getDataHours());
            this.reportChart.update();
            this.highlightChartBar();
        },
        searchMaxSales() {
            const storage = this.getDataHours();
            let index = null;
            let maxValue = -Infinity;
            let i = 0;
            for (let hour in storage) {
                if (storage[hour] > maxValue) {
                    maxValue = storage[hour];
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
        },
        getDataHours() {
            if (!this.salesData) return {};
            const intervalMapping = {
                sevenDays: 7,
                oneMonth: 30,
                sixMonths: 180
            };
            const interval = intervalMapping[this.intervalSelected];
            const hours = {
                0: 'h00',
                1: 'h02',
                2: 'h04',
                3: 'h06',
                4: 'h08',
                5: 'h10',
                6: 'h12',
                7: 'h14',
                8: 'h16',
                9: 'h18',
                10: 'h20',
                11: 'h22'
            };
            const data = this.salesData[interval].hourly_sales;
            const mappedData = {};
            Object.keys(data).forEach(hour => {
                const key = Math.floor(hour / 2);
                if (!mappedData[hours[key]]) {
                    mappedData[hours[key]] = 0;
                }
                mappedData[hours[key]] += data[hour];
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
