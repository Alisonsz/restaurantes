<template>
  <div class="performance container-report">
      <div class="report-titles">
          <Navbar :navbarData="navbarData" /><Sidebar activePage="overview"  />
          <div class="type-report">
              <button @click.prevent="changeReport('sales')" type="submit" class="btn" :class="reportSelected === 'sales' ? 'report-active' : ''">
                  <span class="add-item add-inline icon-sale"></span> Vendas
              </button>
              <button @click.prevent="changeReport('requests')" type="submit" class="btn" :class="reportSelected === 'requests' ? 'report-active' : ''">
                  <span class="add-item add-inline icon-request"></span> Pedidos
              </button>
          </div>
      </div>
      <Chart :reportSelected="reportSelected" :intervals="intervals" :intervalsLastLabel="intervalsLastLabel" ref="chart"/>
      <Cards :intervals="intervals" :intervalsLastLabel="intervalsLastLabel"/>
      <Notifications />
  </div>
</template>

<script>
  import Navbar from "../components/Navbar.vue";
  import Sidebar from "../components/Sidebar.vue";
  import Footer from "../components/Footer.vue";
  import Chart from "../components/overview/Chart.vue";
  import Cards from "../components/overview/Cards.vue";
  import Notifications from "../components/overview/Notifications.vue";

  export default {
      name: "OverviewView",
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
              reportSelected: "sales"
          }            
      },
      methods: {
          changeReport(report) {
              this.reportSelected = report;
              this.$refs.chart.reloadChart(report);
          }
      },
      components: {
          Navbar,
          Sidebar,
          Footer,
          Chart,
          Cards,
          Notifications
      }
  }
</script>

<style lang="scss" scoped>
  .type-report button {
      background-color: $gray-line;
      width: 120px;
      margin-right: 15px;
  }
  .report-active {
      background-color: $light-green !important;
  }
</style>