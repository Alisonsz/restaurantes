<template>
    <div class="performance container-report">
        <div class="report-titles">
            <Navbar :navbarData="navbarData" /><Sidebar :sidebarData="sidebarData"  />
            <div class="row">
                <div class="col">
                    <h3 class="bold-700">Performance do cardápio</h3>
                </div>
                <div class="col-lg-4 select-interval">
                    <div class="row">
                        <div class="col">
                            <h4 class="bold-500">{{ intervalSelected === "oneMonth" ? "No último" : "Nos últimos" }}</h4>
                        </div>
                        <div class="col text-end">
                            <select class="form-select float-end text-end" v-model="intervalSelected" @change="selectInterval(), setPageNumber(1)">
                                <option v-for="(interval, index) in intervals" :key="index" :value="index">{{ interval }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="report-data">
            <table class="table mt-3 mb-4">
                <thead>
                    <tr>
                        <th scope="col" colspan="2">
                            <p class="bold-600">Item</p>
                        </th>
                        <th scope="col" class="col-val text-center">
                            <p class="bold-600">Visitas</p>
                        </th>
                        <th scope="col" class="col-var text-center">
                            <p class="bold-600">Variação visitas</p>
                            <span class="bold-400">({{ intervalsLastLabel[intervalSelected] }})</span>
                        </th>
                        <th scope="col" class="col-val text-center">
                            <p class="bold-600">Pedidos</p>
                        </th>
                        <th scope="col" class="col-var text-center">
                            <p class="bold-600">Variação pedidos</p>
                            <span class="bold-400">({{ intervalsLastLabel[intervalSelected] }})</span>
                        </th>
                        <th scope="col" class="col-val text-center">
                            <p class="bold-600">Total (R$)</p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in tableData" :key="index">
                        <td class="text-left align-middle col-thumb">
                            <img v-if="item.image !== ''" :src="item.image" class="thumb-table">
                            <img v-else src="~@/assets/img/img.svg" class="thumb-table">
                        </td>
                        <td class="text-left align-middle col-name">
                            <span class="bold-400">{{ item.position }}º ranking</span>
                            <p class="bold-500">{{ item.name }}</p>
                        </td>
                        <td class="text-center align-middle">
                            <span class="number">{{ item.visits }}</span>
                        </td>
                        <td class="text-center align-middle">
                            <span :class="item.visitVariation > 0 ? 'icon-var-up' : 'icon-var-down'">{{  Math.abs(item.visitVariation) }}%</span>
                        </td>
                        <td class="text-center align-middle">
                            <span class="number">{{ item.orders }}</span>
                        </td>
                        <td class="text-center align-middle">
                            <span :class="item.orderVariation > 0 ? 'icon-var-up' : 'icon-var-down'">{{ Math.abs(item.orderVariation) }}%</span>
                        </td>
                        <td class="text-center align-middle">
                            <span class="number">{{ item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination @select-page="selectPage" :pageNumber="pageNumber" :setPageNumber="setPageNumber" :pageRecords="pageRecords" :totalRecords="performanceData[intervalSelected].length" />
        </div>
    </div>
</template>

<script>
    import {ref} from 'vue';
    import Navbar from "../components/Navbar.vue";
    import Sidebar from "../components/Sidebar.vue";
    import Footer from "../components/Footer.vue";
    import Pagination from "../components/Pagination.vue";

    export default {
        name: "PerformanceView",
        setup() {
            const pageNumber = ref(1);
            const setPageNumber = (value) => {
                pageNumber.value = value;
            };
            return {
                pageNumber,
                setPageNumber
            }
        },
        data() {
            return {
                sidebarData: {
                    logo: "/img/logo1.png",
                    company: "TATÁ Sushi",
                    address: "R. João Cachoeira, 278",
                    active: "performance",
                    open: false
                 },
                navbarData: {
                    time: "9 horas",
                    notifications: 4
                },
                pageRecords: 10,
                intervalSelected: "sevenDays",
                intervals: {
                    sevenDays: "7 dias",
                    oneMonth: "Mês",
                    sixMonths: "6 meses"
                },
                intervalsLastLabel: {
                    sevenDays: "últimos 7 dias",
                    oneMonth: "último mês",
                    sixMonths: "6 meses anteriores"
                },
                performanceData: {
                    sevenDays: [],
                    oneMonth: [],
                    sixMonths: []
                },
                tableData: []
            }            
        },
        components: {
            Navbar,
            Sidebar,
            Footer,
            Pagination
        },
        methods: {
            loadData(interval) {
                if (this.performanceData[interval].length > 0) {
                    this.intervalSelected = interval;
                    this.selectPage(1);
                    return;
                }
                this.tableData = [];
                let maxVisit = 1250 * Math.floor(Math.random() * 10);
                let orders = 0;
                let varMin = -50;
                let varMax = 180;
                let product = {};
                let allProducts = [
                    "Salada Caesar", "Bruschetta", "Sopa de Cebola", "Camarão Empanado", "Asas de Frango",
                    "Pizza Margherita", "Lasanha à Bolonhesa", "Espaguete Carbonara", "Ravioli de Ricota", "Fettuccine Alfredo",
                    "Bife à Parmegiana", "Frango Grelhado", "Salmão ao Molho de Maracujá", "Bacalhau à Brás", "Risoto de Camarão",
                    "Tiramisu", "Panna Cotta", "Cheesecake", "Petit Gâteau", "Mousse de Chocolate",
                    "Café Expresso", "Capuccino", "Suco de Laranja", "Refrigerante", "Água Mineral",
                    "Chá Gelado", "Suco de Maçã", "Batata Frita", "Coxinha", "Bolinho de Bacalhau",
                    "Hambúrguer Clássico", "Sanduíche Natural", "Wrap de Frango", "Taco Mexicano", "Quesadilla",
                    "Sushi de Salmão", "Temaki de Atum", "Sashimi de Peixe Branco", "Nigiri de Polvo", "Uramaki Califórnia",
                    "Pad Thai", "Curry Verde de Frango", "Nasi Goreng", "Satay de Camarão", "Ramen",
                    "Churros", "Creme Brulee", "Bolo de Cenoura", "Torta de Limão", "Brownie",
                    "Batida de Coco", "Caipirinha", "Mojito", "Piña Colada", "Dry Martini"
                ];
                for (var i = 0; i < 50; i++) {
                    let randomIndex = Math.floor(Math.random() * allProducts.length);
                    if (maxVisit > 1) {
                        maxVisit = maxVisit - Math.floor(Math.random() * 150);
                    } else {
                        maxVisit = 1;
                    }
                    orders = parseInt((maxVisit - Math.floor(Math.random() * (varMax - varMin + 1)) + varMin) * 0.6);
                    product = {
                        position: i + 1,
                        name: allProducts[randomIndex],
                        image: "",
                        visits: maxVisit,
                        visitVariation: Math.floor(Math.random() * (varMax - varMin + 1)) + varMin,
                        orders: orders < 0 ? orders * -1 : orders,
                        orderVariation: Math.floor(Math.random() * (varMax - varMin + 1)) + varMin,
                        total: Math.abs(((orders * Math.floor(Math.random() * (15 - 2 + 1)) + 2) / 1.1))
                    };
                    this.performanceData[interval].push(product);
                    if (i < this.pageRecords) {
                        this.tableData.push(product);
                    }
                    allProducts.splice(randomIndex, 1);
                }
            },
            selectInterval() {
                this.loadData(this.intervalSelected);
            },
            selectPage(page) {
                let startIndex = (page - 1) * this.pageRecords;
                this.tableData = this.performanceData[this.intervalSelected].slice(startIndex, startIndex + this.pageRecords);
            }
        },
        created() {
            this.loadData(this.intervalSelected);
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

    .report-data .table {
        thead th {
            vertical-align: top;
            padding-bottom: 10px;
        }
        thead p, thead span {
            font-size: 15px;
            margin-bottom: 0;
            padding-bottom: 0;
            line-height: 1.1;
        }
        .col-var {
            width: 160px !important;
        }
        .col-val {
            width: 110px !important;
            
        }
        .col-thumb {
            padding-left: 0;
            padding-right: 0;
            width: 65px;
        }
        .col-name {
            p, span {
                padding: 0;
                margin: 0;
                line-height: 1;
            }
            p {
                font-size: 16px;
            }
            span {
                font-size: 14px;
            }
        }
        tbody .number {
            font-size: 15px;
        }
    }
</style>