<template>
    <div class="performance container-report">
        <div class="report-titles">
            <Navbar :navbarData="navbarData" /><Sidebar activePage="payments" />
            <div class="row">
                <div class="col">
                    <h3 class="bold-700">Pagamentos</h3>
                </div>
                <div class="col-lg-4  text-end">
                    <span class="icon-base icon-help ml-1" v-tippy="'Para realizar transações e editar/alterar informações financeiras, será necessário acessar a nossa plataforma parceira através do botão ao lado.'"></span>
                    <router-link  to="/" class="btn go-config">
                        <span class="add-item add-inline icon-config"></span> Configurar informações financeiras
                    </router-link>
                </div>
            </div>
        </div>
        <div class="report-data">
            <div class="select-interval">
                <div class="row">
                    <div class="col"></div>
                    <div class="col col-md-auto">
                        <div class="col-date">
                            <label for="dateStart" class="col-form-label">Data início</label>
                            <input type="date" lang="pt-br" id="dateStart" class="form-control date" v-model="dateStart" @change="loadData()">
                        </div>
                    </div>
                    <div class="col col-md-auto">
                        <div class="col-date">
                            <label for="dateEnd" class="col-form-label">Data fim</label>
                            <input type="date" lang="pt-br" id="dateEnd" class="form-control date" v-model="dateEnd" @change="loadData()">
                        </div>
                    </div>
                </div>
            </div>
            <div class="general-data">
                <div class="row">
                    <div class="col">
                        <h3>Faturamento</h3>
                    </div>
                </div>
                <div class="row amount-data">
                    <div class="col col-md-auto gross-amount-data">
                        <span class="type ml-1">Valor bruto das vendas</span>
                        <span class="icon-base icon-help ml-1" v-tippy="helpLegends.grossAmount"></span>
                        <p class="value">R$ {{ paymentsData.general.grossAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
                    </div>
                    <div class="col col-md-auto discounts-data">
                        <span class="type ml-1">Descontos</span>
                        <span class="icon-base icon-help ml-1" v-tippy="helpLegends.discounts"></span>
                        <p class="value">R$ {{ paymentsData.general.discounts.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
                    </div>
                    <div class="col col-md-auto net-amount-data">
                        <span class="type ml-1">Valor liquido recebido</span>
                        <span class="icon-base icon-help ml-1" v-tippy="helpLegends.netAmount"></span>
                        <p class="value">R$ {{ paymentsData.general.netAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
                    </div>
                    <div class="col"></div>
                </div>
            </div>

            <pre>{{ paymentsData.transfersX }}</pre>

            <div class="mt-4 table-data">
                <table class="table mt-3 mb-4">
                    <thead>
                        <tr>
                            <th scope="col" colspan="5">
                                <p class="bold-600 mt-2 mb-2">Repasses</p>
                            </th>
                        </tr>
                        <tr>
                            <th scope="col">
                                <p class="bold-600 mt-2 mb-2">Previsão de pagamento</p>
                            </th>
                            <th scope="col">
                                <p class="bold-600 mt-2 mb-2">Período de apuração</p>
                            </th>
                            <th scope="col" class="col-val">
                                <p class="bold-600 mt-2 mb-2">Valor total (R$)</p>
                            </th>
                            <th scope="col" class="col-val">
                                <p class="bold-600 mt-2 mb-2">Status</p>
                            </th>
                            <th scope="col" class="text-center col-details">
                                <p class="bold-600 mt-2 mb-2">Detalhes</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in tableData" :key="index">
                            <td class="align-middle">
                                <span class="table-text">{{ item.date }}</span>
                            </td>
                            <td class="align-middle">
                                <span class="table-text">{{ item.interval }}</span>
                            </td>
                            <td class="align-middle">
                                <span class="table-text">{{ item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                            </td>
                            <td class="align-middle">
                                <span :class="'icon-status icon-' + item.status">{{ statusLabel[item.status] }}</span>
                            </td>
                            <td class="text-center align-middle">
                                <span class="icon-base icon-next"  @click="dataDetails = item, showModalDetails = true"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table-summary">
                <table class="table mt-3 mb-4">
                    <tbody>
                        <tr>
                            <td class="align-middle">
                                <span class="table-text bold-500">Total em repasses</span>
                            </td>
                            <td class="align-middle">
                                <span class="table-text bold-500">{{ paymentsData.summary.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">
                                <span class="table-text">Valor recebido</span>
                            </td>
                            <td class="align-middle">
                                <span class="table-text">{{ paymentsData.summary.received.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle">
                                <span class="table-text">Valor a receber</span>
                            </td>
                            <td class="align-middle">
                                <span class="table-text">{{ paymentsData.summary.receivable.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Pagination @select-page="selectPage" :pageNumber="pageNumber" :setPageNumber="setPageNumber" :pageRecords="pageRecords" :totalRecords="paymentsData.transfers.length" />
            <div class="withdrawal-data">
                <span class="icon-base icon-info ml-1"></span>
                <span>Acesse a plataforma da Asaas através do link XXXX para realizar saques e tirar dúvidas referentes à toda parte financeira.</span>
            </div>
        </div>
        <Teleport to="body">
            <ModalDetails :show="showModalDetails" @close="showModalDetails = false">
                <template #header>Detalhes</template>
                <template #body>
                    <FormDetails @close-modal="showModalDetails = false" :dataDetails="dataDetails"/>
                </template>
            </ModalDetails>
        </Teleport>
    </div>
</template>

<script>
    import {ref} from 'vue';
    import Navbar from "../components/Navbar.vue";
    import Sidebar from "../components/Sidebar.vue";
    import Footer from "../components/Footer.vue";
    import Pagination from "../components/Pagination.vue";
    import FormDetails from "../components/payments/FormDetails.vue";
    import ModalDetails from "../components/ModalBase.vue";

    export default {
        name: "PaymentsView",
        setup() {
            const showModalDetails = ref(false);

            const pageNumber = ref(1);
            const setPageNumber = (value) => {
                pageNumber.value = value;
            };
            return {
                showModalDetails,
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
                    active: "payments",
                    open: false
                },
                navbarData: {
                    time: "9 horas",
                    notifications: 4
                },
                pageRecords: 10,
                dateStart: "",
                dateEnd: "",
                helpLegends: {
                    grossAmount: 'Representa o montante total de vendas antes de quaisquer deduções ou descontos.',
                    discounts: 'Total de taxas cobradas pelo meio de pagamento e pela Prattu.',
                    netAmount: 'Quantia total recebida após deduções, descontos ou taxas aplicáveis.'
                },
                paymentsData: {
                    general: {
                        grossAmount: 0,
                        discounts: 0,
                        netAmount: 0
                    },
                    summary: {
                        total: 0,
                        received: 0,
                        receivable: 0
                    },
                    transfers: []
                },
                statusLabel: {
                    paid: "Pago",
                    scheduled: "Agendado",
                    opened: "Em aberto"
                },
                
                tableData: [],
                dataDetails: []
            }            
        },
        components: {
            Navbar,
            Sidebar,
            Footer,
            Pagination,
            FormDetails,
            ModalDetails
        },
        methods: {
            loadData() {
                let id = 3424235;
                let listCustomers = [ "Patricia Gomes", "Felipe Martins", "Carlos Oliveira", "Laura Souza", "João Andrade", "Ana Andrade", "Felipe Pedro", "Felipe Martins", "Carlos Maria", "Maria Martins" ];
                let listNum = [3, 5, 8, 10, 12, 15, 20, 45];
                let listValues = [120, 123, 145, 190, -50, -78, 200];
                let currentBalance = 0;
                let currentDate = new Date(this.dateStart);
                let currentData;
                let currentAmount;
                this.paymentsData.transfers = [];
                this.paymentsData.general.grossAmount = 0;
                this.paymentsData.general.discounts = 0;
                this.paymentsData.general.netAmount = 0;
                this.paymentsData.summary.total = 0;
                this.paymentsData.summary.received = 0;
                this.paymentsData.summary.receivable = 0;
                while (currentDate <= new Date(this.dateEnd)) {
                    currentDate.setDate(currentDate.getDate() + 1);
                    currentBalance = 0;
                    currentData = {
                        date: String(currentDate.getDate()).padStart(2,'0') + "/" + (String(currentDate.getMonth() + 1).padStart(2,'0')) + "/" + currentDate.getFullYear(),
                        interval: "1 a " + String(currentDate.getDate()).padStart(2,'0') + "/" + (String(currentDate.getMonth() + 1).padStart(2,'0')) + "/" + currentDate.getFullYear(),
                        transactions: [],
                        cnabData: "dados bancarios das transacoes...",
                        amount: 0,
                        status: Object.keys(this.statusLabel)[Math.floor(Math.random() * 3)],
                    }
                    for (let i = 0; i <= listNum[Math.floor(Math.random() * listNum.length)]; i++) {
                        currentAmount = listValues[Math.floor(Math.random() * listValues.length)]
                        currentBalance += currentAmount
                        currentData.transactions.push({
                            id: id++,
                            date: String(currentDate.getDate()).padStart(2,'0') + "/" + (String(currentDate.getMonth() + 1).padStart(2,'0')) + "/" + currentDate.getFullYear(),
                            description: "Taxa pix - " + listCustomers[Math.floor(Math.random() * listCustomers.length)],
                            amount: currentAmount,
                            balance: currentBalance,
                            type: currentAmount > 0 ? "credit" : "debit"
                        });
                    }
                    currentData.amount = Math.abs(currentBalance);
                    this.paymentsData.transfers.push(currentData);
                    this.paymentsData.general.grossAmount += currentData.amount;
                    this.paymentsData.general.discounts = this.paymentsData.general.grossAmount * 0.2;
                    this.paymentsData.general.netAmount = this.paymentsData.general.grossAmount - this.paymentsData.general.discounts;
                    this.paymentsData.summary.total = this.paymentsData.general.grossAmount;
                    if (currentData.status === "paid") {
                        this.paymentsData.summary.received += currentData.amount;
                    } else {
                        this.paymentsData.summary.receivable += currentData.amount;
                    }
                }
                this.selectPage(1);
            },
            selectInterval() {
                this.loadData();
            },
            selectPage(page) {
                let startIndex = (page - 1) * this.pageRecords;
                this.tableData = this.paymentsData.transfers.slice(startIndex, startIndex + this.pageRecords);
            }
        },
        created() {
            const today = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);
            this.dateStart = sevenDaysAgo.toISOString().split('T')[0];
            this.dateEnd = today.toISOString().split('T')[0];
            this.loadData();
        }
    }
</script>

<style lang="scss" scoped>
    .go-config {
        background-color: $light-green !important;
        height: 34px !important;
        padding: 4px 20px !important;
        .add-item {
            margin-right: 5px;
            background-size: 18px;
        }
    }

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

    .select-interval {
        padding: 0 10px;
        .col-date {
            border-bottom: 1px solid $gray-line;
            label {
                font-size: 16px;
                font-weight: 500;
            }
        }
        .date {
            border: none;
            width: 140px;
            display: inline !important;
            height: 30px !important;
        }
    }

    .general-data {
        border: 1px solid $gray-line;
        border-radius: 4px;
        padding: 15px 15px;
        margin-top: 15px;
        h3 {
            border-bottom: 1px solid $gray-line;
            padding-bottom: 10px !important;
        }
        .amount-data {
            padding-top: 20px;
            padding-bottom: 10px;
            p {
                margin: 0;
                font-size: 20px;
                font-weight: 700;
                line-height: 1;
            }
            .gross-amount-data {
                padding-right: 20px;
                border-right: 1px solid $gray-line;
            }
            .discounts-data {
                padding-left: 25px;
                padding-right: 20px;
                border-right: 1px solid $gray-line;
                color: $red-primary;
            }
            .net-amount-data {
                padding-left: 25px;
                color: $light-primary;
            }
        }
    }

    .table-data {
        margin-bottom: 8px !important;
        .icon-base {
            border: 1px solid $gray-line;
            border-radius: 50%;
            width: 34px;
            height: 34px;
            display: block;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: 11px 11px;
            text-align: center;
            margin: auto;
            cursor: pointer;
        }
        .table {
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
            .col-val {
                width: 180px;
            }
            .col-details {
                width: 85px;
            }
        }
        .detail-footer {
            width: 100%;
            margin-bottom: 5px;
            hr {
                margin-top: 0
            }
            .btn-contact {
                border: 1px solid $light-green;
                padding: 7px 17px;
                float: left;
                .icon-contact {
                    width: 18px;
                    height: 18px;
                    display: inline-block;
                    background-position: center center;
                    background-repeat: no-repeat;
                    background-size: 18px 18px;
                    margin-right: 10px;
                    transform: translateY(3px);
                }
            }
            .btn-contact:hover {
                background-color: $light-green;
            }
        }
    }

    .table-summary {
        background-color: $gray-bg;
        border-radius: 3px;
        padding: 20px;
        margin-bottom: 20px;
        .table {
            margin: 0 !important;
        }
        td {
            background-color: transparent;
            border: none;
            padding: 0;
        }
    }

    .withdrawal-data {
        border: 1px solid $blue-primary;
        border-radius: 8px;
        padding: 15px;
        margin-top: 40px;
    }

    @media (max-width: 1280px) {
        .sidebar-open {
            .col-val {
                width: 110px !important;
            }
        }
    }
</style>