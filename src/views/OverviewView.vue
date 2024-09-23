<template>
  <div class="performance container-report">
      <div class="report-titles">
          <Navbar :navbarData="navbarData" /><Sidebar activePage="overview"  />
          <h3 class="bold-700 mb-4">Visão geral</h3>
      </div>
      <Chart :intervals="intervals" :intervalsLastLabel="intervalsLastLabel" ref="chart"/>
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
    .report-titles h3 {
        padding-bottom: 10px;
    }
</style>