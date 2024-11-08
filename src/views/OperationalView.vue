<template>
    <div class="performance container-report">
        <div class="report-titles">
            <Navbar :navbarData="navbarData" /><Sidebar activePage="operacional" />
            <div class="row">
                <div class="col">
                    <h3 class="bold-700">Eficiência operacional</h3>
                </div>
                <div class="col-lg-4 select-interval">
                    <div class="row">
                        <div class="col">
                            <h4 class="bold-500">{{ intervalSelected === "oneMonth" ? "No último" : "Nos últimos" }}</h4>
                        </div>
                        <div class="col text-end">
                            <select class="form-select float-end text-end" v-model="intervalSelected" @change="selectInterval()">
                                <option v-for="(interval, index) in intervals" :key="index" :value="index">{{ interval }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Cards :intervalSelected="intervalSelected" :intervalsLastLabel="intervalsLastLabel" />
        <Tickets :intervalSelected="intervalSelected" />
        <Refused :intervalSelected="intervalSelected" ref="refused"/>
        <Reviews :intervalSelected="intervalSelected" :intervalsLastLabel="intervalsLastLabel" ref="reviews"/>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar.vue";
    import Sidebar from "../components/Sidebar.vue";
    import Footer from "../components/Footer.vue";
    import Reviews from "../components/operational/Reviews.vue";
    import Cards from "../components/operational/Cards.vue";
    import Tickets from "../components/operational/Tickets.vue";
    import Refused from "../components/operational/Refused.vue";

    export default {
        name: "OperationalView",
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
                }
            }            
        },
        components: {
            Navbar,
            Sidebar,
            Footer,
            Reviews,
            Cards,
            Tickets,
            Refused
        },
        methods: {
            selectInterval() {
                this.$refs.reviews.calculateScore();
                this.$refs.refused.countRefuseds();
                this.$refs.refused.updateChart();
            }
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