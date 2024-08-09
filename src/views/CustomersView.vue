<template>
    <div class="performance container-report">
        <div class="report-titles">
            <Navbar :navbarData="navbarData" /><Sidebar :sidebarData="sidebarData"  />
            <div class="row">
                <div class="col">
                    <h3 class="bold-700">Análise de clientes</h3>
                </div>
            </div>
        </div>
        <CardTypes :intervals="intervals" />
        <div class="type-report">
            <span v-for="(report, index) in reportList" :key="index">
                <button @click.prevent="changeReport(index)" type="submit" class="btn" :class="reportSelected === index ? 'report-active' : ''">
                    {{ report.name }}
                </button>
            </span>
        </div>
        <ChartDays :reportSelected="reportSelected" :intervals="intervals" :intervalsLastLabel="intervalsLastLabel" :dataReport="reportList[reportSelected]" ref="chartDays" />
    </div>
</template>

<script>
    import Navbar from "../components/Navbar.vue";
    import Sidebar from "../components/Sidebar.vue";
    import Footer from "../components/Footer.vue";
    import CardTypes from "../components/customers/CardTypes.vue";
    import ChartDays from "../components/customers/ChartDays.vue";

    export default {
        name: "CustomersView",
        data() {
            return {
                sidebarData: {
                    logo: "/img/logo1.png",
                    company: "TATÁ Sushi",
                    address: "R. João Cachoeira, 278",
                    active: "insights",
                    open: false
                 },
                navbarData: {
                    time: "9 horas",
                    notifications: 4
                },
                intervals: {
             
                    oneMonth: "Mês",
                    sixMonths: "6 meses"
                },
                intervalsLastLabel: {
                 
                    oneMonth: "mês passado",
                    sixMonths: "6 meses anteriores"
                },
                reportList: {
                    views: {
                        name: "Impressões",
                        description: "Número de vezes que o estabelecimento foi visto no feed social.",
                        action: "impressões"
                    },
                    interactios: {
                        name: "Engajamento",
                        description: "Envolvimento do público com publicações citando o seu estabelecimento (curtidas, comentários...).",
                        action: "interações"
                    },
                    clicks: {
                        name: "Taxa de cliques - CTR",
                        description: "Número de vezes que os usuários viram o seu estabelecimento no feed social e clicaram.",
                        action: "cliques"
                    },
                    conversion: {
                        name: "Taxa de conversão",
                        description: "Número de vezes que os usuários viram o seu estabelecimento no feed social, clicaram e realizaram uma compra.",
                        action: "Conversões"
                    }
                },
                reportSelected: "views",
            }            
        },
        methods: {
            changeReport(report) {
                this.reportSelected = report;
                this.$refs.chartDays.reloadChart(report);
            }
        },
        components: {
            Navbar,
            Sidebar,
            Footer,
            CardTypes,
            ChartDays
        }
    }
</script>

<style lang="scss" scoped>
    .type-report {
        margin-top: 30px;
        button {
            background-color: $gray-line;
            margin-right: 15px;
            border-radius: 8px 8px 0 0 !important;;
        }
    }
    
    .report-active {
        background-color: $light-green !important;
    }
</style>