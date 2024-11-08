<template>
  <div class="performance container-report">
      <div class="report-titles">
          <Navbar :navbarData="navbarData" /><Sidebar activePage="sales" />
          <div class="row">
              <div class="col">
                  <h3 class="bold-700">Vendas</h3>
              </div>
              <div class="col-lg-4 select-interval">
                  <div class="row">
                      <div class="col-md-auto">
                          <h4 class="bold-500">{{ intervalSelected === "oneMonth" ? "No último" : "Nos últimos" }}</h4>
                      </div>
                      <div class="col text-end">
                          <select class="form-select float-end text-end" v-model="intervalSelected" @change="selectInterval">
                              <option v-for="(interval, index) in intervals" :key="index" :value="index">{{ interval }}</option>
                          </select>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <Cards :intervalSelected="intervalSelected" :intervalsLastLabel="intervalsLastLabel" :salesData="salesData" />
      <ChartDays :intervalSelected="intervalSelected" ref="chartDays" :salesData="salesData" />
      <ChartHours :intervalSelected="intervalSelected" ref="chartHours" :salesData="salesData" />
  </div>
</template>

<script>
  import Navbar from "../components/Navbar.vue";
  import Sidebar from "../components/Sidebar.vue";
  import Footer from "../components/Footer.vue";
  import Cards from "../components/sales/Cards.vue";
  import ChartDays from "../components/sales/ChartDays.vue";
  import ChartHours from "../components/sales/ChartHours.vue";

  export default {
      name: "SalesView",
      data() {
          return {
              sidebarData: {
                  logo: "/img/logo1.png",
                  company: "TATÁ Sushi",
                  address: "R. João Cachoeira, 278",
                  active: "monitor",
                  open: false
               },
              navbarData: {
                  time: "9 horas",
                  notifications: 4
              },
              intervalSelected: "sevenDays",
              intervals: {
                  sevenDays: "7 dias",
                  oneMonth: "Mês",
                  sixMonths: "6 meses"
              },
              intervalsLastLabel: {
                  sevenDays: "últimos 7 dias",
                  oneMonth: "mês passado",
                  sixMonths: "6 meses anteriores"
              },
              salesData: null
          }            
      },
      components: {
          Navbar,
          Sidebar,
          Footer,
          Cards,
          ChartDays,
          ChartHours
      },
      methods: {
          selectInterval() {
              this.fetchSalesData();
          },
          async fetchSalesData() {
              try {
                  const response = await fetch("https://api.prattuapp.com.br/api/restaurants/1/sales-analytics");
                  const data = await response.json();
                  this.salesData = data;
                  this.$refs.chartDays.updateChart();
                  this.$refs.chartHours.updateChart();
              } catch (error) {
                  console.error("Error fetching sales data:", error);
              }
          }
      },
      mounted() {
          this.fetchSalesData();
      }
  }
</script>

<style lang="scss" scoped>
  .select-interval {
      width: 250px;
      select {
          width: auto !important;
      }
  }
</style>
