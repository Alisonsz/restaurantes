<template>
    <div class="performance container-report">
        <div class="report-titles">
            <Navbar :navbarData="navbarData" /><Sidebar activePage="payments" />
            <div class="row">
                <div class="col">
                    <h3 class="bold-700">Pagamentos</h3>
                </div>
                <div class="col-lg-8  text-end">
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
                    <div class="col bold-500"></div>
                    <div class="col col-md-auto bold-500 filter" @click="showModalFilters = true">
                        Filtros 
                        <span class="icon-base icon-filter">
                            <span class="filter-on" v-if="validFilter()"></span>
                        </span>
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
                        <span class="type ml-1">Valor previsto</span>
                        <span class="icon-base icon-help ml-1" v-tippy="helpLegends.expected"></span>
                        <p class="value">R$ {{ paymentsData.general.expected.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
                    </div>
                    <div class="col col-md-auto gross-amount-data">
                        <span class="type ml-1">Valor confirmado</span>
                        <span class="icon-base icon-help ml-1" v-tippy="helpLegends.confirmed"></span>
                        <p class="value">R$ {{ paymentsData.general.confirmed.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
                    </div>
                    <div class="col col-md-auto gross-amount-data">
                        <span class="type ml-1">Valor recebido</span>
                        <span class="icon-base icon-help ml-1" v-tippy="helpLegends.received"></span>
                        <p class="value">R$ {{ paymentsData.general.received.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
                    </div>
                    <div class="col col-md-auto gross-amount-data" v-if="seeMore">
                        <span class="type ml-1">Valor sob custódia</span>
                        <span class="icon-base icon-help ml-1" v-tippy="helpLegends.custody"></span>
                        <p class="value">R$ {{ paymentsData.general.custody.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
                    </div>
                    <div class="col col-md-auto gross-amount-data" v-if="seeMore">
                        <span class="type ml-1">Valor vencido</span>
                        <span class="icon-base icon-help ml-1" v-tippy="helpLegends.overdue"></span>
                        <p class="value">R$ {{ paymentsData.general.overdue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
                    </div>
                    <div class="col">
                        <span v-if="seeMore" @click="seeMore = false">
                            <span class="seeMore">Ver menos</span>
                            <span class="left-icon"></span>
                        </span>
                        <span v-else @click="seeMore = true">
                            <span class="seeMinus">Veja mais</span>
                            <span class="right-icon"></span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="mt-4 table-data">
                <table class="table mt-3 mb-4">
                    <thead>
                        <tr>
                            <th scope="col" colspan="5">
                                <p class="bold-600 mt-2 mb-2">Cobrança</p>
                            </th>
                        </tr>
                        <tr>
                            <th scope="col">
                                <p class="bold-600 mt-2 mb-2">Data</p>
                            </th>
                            <th scope="col">
                                <p class="bold-600 mt-2 mb-2">Descrição</p>
                            </th>
                            <th scope="col">
                                <p class="bold-600 mt-2 mb-2">Forma de pagamento</p>
                            </th>
                            <th scope="col" class="col-val">
                                <p class="bold-600 mt-2 mb-2">Valor (R$)</p>
                            </th>
                            <th scope="col" class="col-status">
                                <p class="bold-600 mt-2 mb-2">Status</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in tableData" :key="index">
                            <td class="align-middle">
                                <span class="table-text">{{ item.date }}</span>
                            </td>
                            <td class="align-middle">
                                <span class="table-text">{{ item.description }}</span>
                            </td>
                            <td class="align-middle">
                                <span class="table-text">{{ item.paymentmethod }}</span>
                            </td>
                            <td class="align-middle">
                                <span class="table-text">{{ item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                            </td>
                            <td class="align-middle">
                                <span :class="'icon-status icon-' + item.status">{{ statusLabel[item.status] }}</span>
                                <span class="icon-base icon-data ml-1" v-tippy="item.info" v-if="item.info"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Pagination @select-page="selectPage" :pageNumber="pageNumber" :setPageNumber="setPageNumber" :pageRecords="pageRecords" :totalRecords="paymentsData.transfers.length" />
            <div class="withdrawal-data">
                <span class="icon-base icon-info ml-1"></span>
                <span>Acesse a plataforma da Asaas através <a href="https://www.asaas.com/login/auth?customerSignUpOriginChannel=HOME" target="_blank">deste link</a> para realizar saques e tirar dúvidas referentes à toda parte financeira.</span>
            </div>
        </div>
        <Teleport to="body">
            <ModalFilters :show="showModalFilters" @close="showModalFilters = false, resetFilter()" :noLine="true">
                <template #header>Filtros</template>
                <template #body>
                    <div class="line-filter">
                        <div class="list-filter mb-3">
                            <h5 class="title-filter">Filtre o período de exibição</h5>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" id="filter-period-beginning" value="beginning" v-model="filters.period.type"/>
                                <label class="form-check-label" for="filter-period-beginning">Desde o início</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" id="filter-period-year" value="year" v-model="filters.period.type"/>
                                <label class="form-check-label" for="filter-period-year">Este ano</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" id="filter-period-month" value="month" v-model="filters.period.type"/>
                                <label class="form-check-label" for="filter-period-month">Este mês</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" id="filter-period-personalized" value="personalized" v-model="filters.period.type"/>
                                <label class="form-check-label" for="filter-period-personalized">Personalizado</label>
                            </div>
                            <div v-if="filters.period.type === 'personalized'">
                                <div class="col col-md-auto">
                                    <div class="col-date">
                                        <label for="dateStart" class="col-form-label bold-500">Data início</label>
                                        <input type="date" lang="pt-br" id="dateStart" class="form-control date" v-model="filters.period.start">
                                    </div>
                                </div>
                                <div class="col col-md-auto">
                                    <div class="col-date">
                                        <label for="dateEnd" class="col-form-label bold-500">Data fim</label>
                                        <input type="date" lang="pt-br" id="dateEnd" class="form-control date" v-model="filters.period.end">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="list-filter">
                            <h5 class="title-filter">Filtre por status</h5>
                            <div class="form-check" v-for="(item, index) in statusLabel" :key="index">
                                <input class="form-check-input" type="checkbox" :id="'filter-status-'+index" v-model="filters.status[index]"/>
                                <label class="form-check-label" :for="'filter-status-'+index">{{ item }}</label>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-4 mb-1">
                        <div class="col-lg-6 d-grid gap-2">
                            <button type="button" class="btn btn-cancel" @click="clearFilter(), showModalFilters = false">Limpar filtros</button>
                        </div>
                        <div class="col-lg-6 d-grid gap-2">
                            <button type="button" class="btn btn-save" @click="applyFilter(), showModalFilters = false" v-if="validFilter()">Filtrar</button>
                            <button type="button" class="btn btn-block" v-else>Filtrar</button>
                        </div>
                    </div>
                </template>
            </ModalFilters>
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
    import ModalFilters from "../components/ModalBase.vue";

    export default {
        name: "PaymentsView",
        setup() {
            const showModalFilters = ref(false);

            const pageNumber = ref(1);
            const setPageNumber = (value) => {
                pageNumber.value = value;
            };
            return {
                showModalFilters,
                pageNumber,
                setPageNumber
            }
        },
        data() {
            return {
                seeMore: false,
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
                pageRecords: 20,
                dateStart: "",
                dateEnd: "",
                helpLegends: {
                    expected: 'Valor estimado que o estabelecimento poderá receber caso os pagamentos feitos sejam aprovados. Cobranças “Vencidas” também entram como “Previstas”.',
                    confirmed: 'Pagamentos no cartão crédito que já foram confirmados e estão aguardando repasse (ocorre a cada 32 dias).',
                    received: 'Pagamentos que já foram transferidos para a conta do estabelecimento (pagamentos via Pix são recebidos automaticamente).',
                    custody: 'São os pagamentos já realizados pelos clientes, mas que aguardam a confirmação de retirada e/ou consumo no local para que o repasse seja liberado.',
                    overdue: 'Quando um consumidor gera um código para pagamento via Pix, porém não conclui a compra, ela acaba sendo considerada como “Vencida”. Estes pedidos não chegam para o estabelecimento.'
                },
                baseData: "",
                paymentsData: {
                    general: {
                        expected: 0,
                        confirmed: 0,
                        received: 0,
                        custody: 0,
                        overdue: 0
                    },
                    summary: {
                        total: 0,
                        received: 0,
                        receivable: 0
                    },
                    transfers: []
                },
                statusLabel: {
                    custody: "Custódia",
                    confirmed: "Confirmado",
                    received: "Recebido",
                    reversed: "Estornado",
                    chargeback: "Chargeback",
                    overdue: "Vencido"
                },
                tableData: [],
                dataDetails: [],
                filters: {},
                filtersApplied: {},
                filtersBase: {
                    period: {
                        type: "",
                        start: "",                    
                        end: ""                    
                    },
                    status: {
                        custody: false,
                        confirmed: false,
                        received: false,
                        reversed: false,
                        chargeback: false,
                        overdue: false
                    }
                }
            }            
        },
        components: {
            Navbar,
            Sidebar,
            Footer,
            Pagination,
            FormDetails,
            ModalFilters
        },
        methods: {
            loadData() {
                let id = 3424235;
                let listCustomers = [ "Patricia Gomes", "Felipe Martins", "Carlos Oliveira", "Laura Souza", "João Andrade", "Ana Andrade", "Felipe Pedro", "Felipe Martins", "Carlos Maria", "Maria Martins" ];
                let listMethods = ["Crédito", "Débito", "PIX"];
                let listDesc = ["Torrada", "Suco de uva", "Pizza", "Compras realizadas na plataforma no período de 10 de agosto de 2024 até 30 de outubro de 2014 confirmadas e com pagamento realizado até a data atual"];
                let listNum = [3, 5, 8, 10, 12, 15, 20, 45];
                let listValues = [120, 123, 145, 190, -50, -78, 200];
                let newStatus;
                let currentBalance = 0;
                let currentDate = new Date(this.dateStart);
                let currentData;
                let currentAmount;
                this.paymentsData.transfers = [];
                this.paymentsData.general.expected = 0;
                this.paymentsData.general.confirmed = 0;
                this.paymentsData.general.received = 0;
                this.paymentsData.general.custody = 0;
                this.paymentsData.general.overdue = 0;
                this.paymentsData.summary.total = 0;
                this.paymentsData.summary.received = 0;
                this.paymentsData.summary.receivable = 0;
                while (currentDate <= new Date(this.dateEnd)) {
                    newStatus = Object.keys(this.statusLabel)[Math.floor(Math.random() * 6)];
                    currentDate.setDate(currentDate.getDate() + 1);
                    currentBalance = 0;
                    currentData = {
                        date: String(currentDate.getDate()).padStart(2,'0') + "/" + (String(currentDate.getMonth() + 1).padStart(2,'0')) + "/" + currentDate.getFullYear(),
                        interval: "1 a " + String(currentDate.getDate()).padStart(2,'0') + "/" + (String(currentDate.getMonth() + 1).padStart(2,'0')) + "/" + currentDate.getFullYear(),
                        transactions: [],
                        cnabData: "dados bancarios das transacoes...",
                        amount: 0,
                        description: listDesc[Math.floor(Math.random() * 4)],
                        paymentmethod: listMethods[Math.floor(Math.random() * 3)],
                        status: newStatus,
                        info: (newStatus === "confirmed" ? "Disponível \n 10/10/2024" : "")
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
                
                    if (currentData.status === "custody") {
                        this.paymentsData.general.expected += currentData.amount;
                    } 
                    if (currentData.status === "Confirmado") {
                        this.paymentsData.general.expected += currentData.amount;
                    } 
                    if (currentData.status === "overdue") {
                        this.paymentsData.general.expected += currentData.amount;
                    } 

                    if (currentData.status === "confirmed") {
                        this.paymentsData.general.confirmed += currentData.amount;
                    } 
                    if (currentData.status === "received") {
                        this.paymentsData.general.received += currentData.amount;
                    } 
                    if (currentData.status === "custody") {
                        this.paymentsData.general.custody += currentData.amount;
                    } 
                    if (currentData.status === "overdue") {
                        this.paymentsData.general.overdue += currentData.amount;
                    } 

                    if (currentData.status === "paid") {
                        this.paymentsData.summary.received += currentData.amount;
                    } else {
                        this.paymentsData.summary.receivable += currentData.amount;
                    }
                }
                this.selectPage(1);
            },
            clearFilter() {
                this.filters = JSON.parse(JSON.stringify(this.filtersBase));
                this.paymentsData.transfers = JSON.parse(JSON.stringify(this.baseData.transfers));
                this.selectPage(1);
            },
            validFilter() {
                if (Object.keys(this.filters.status).filter(key => this.filters.status[key]).length) {
                    return true;
                }
                if (["beginning", "year", "month"].includes(this.filters.period.type)) {
                    return true;
                }
                if (this.filters.period.type === "personalized" && (this.filters.period.start || this.filters.period.end)) {
                    return true;
                }
                return false;
            },
            applyFilter() {
                let dateStart = "";
                let dateEnd = "";
                let filterData = JSON.parse(JSON.stringify(this.baseData.transfers));

                if (["beginning", "year", "month", "personalized"].includes(this.filters.period.type)) {
                    const currentDate = new Date();
                    switch (this.filters.period.type) {
                        case 'year':
                            dateStart = new Date(currentDate.getFullYear(), 0, 1);
                        break;
                        case 'month':
                            dateStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                        break;
                        case 'personalized':
                            if (this.filters.period.start) {
                                dateStart = new Date(this.filters.period.start);
                            }
                            if (this.filters.period.end) {
                                dateEnd = new Date(this.filters.period.end);
                            }
                        break;
                    }
                }

                if (Object.keys(this.filters.status).filter(key => this.filters.status[key]).length) {
                    filterData = filterData.filter(
                        payment => Object.keys(this.filters.status).filter(key => this.filters.status[key]).includes(payment.status)
                    );
                }

                if (dateStart) {
                    filterData = filterData.filter(
                        payment => new Date(payment.date.split('/').reverse().join('-')) >= dateStart
                    );
                }

                if (dateEnd) {
                    filterData = filterData.filter(
                        payment => new Date(payment.date.split('/').reverse().join('-')) <= dateEnd
                    );
                }

                this.paymentsData.transfers = filterData;
                this.filtersApplied = JSON.parse(JSON.stringify(this.filters));
                
                this.selectPage(1);
            },
            resetFilter() {
                this.filters = JSON.parse(JSON.stringify(this.filtersApplied));
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
            sevenDaysAgo.setDate(today.getDate() - 70);
            this.dateStart = sevenDaysAgo.toISOString().split('T')[0];
            this.dateEnd = today.toISOString().split('T')[0];
            this.filters = JSON.parse(JSON.stringify(this.filtersBase));
            this.loadData();
            this.baseData = JSON.parse(JSON.stringify(this.paymentsData));
            this.filtersApplied = JSON.parse(JSON.stringify(this.filtersBase));
        }
    }
</script>

<style lang="scss" scoped>

    .col-status {
        width: 160px !important;
    }

    .right-icon {
        display: inline-block;
        width: 0;
        height: 0;
        border-left: 5px solid #000;
        border-right: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-top: 5px solid transparent;
        margin-left: 12px;
        cursor: pointer;
    }

    .left-icon {
        display: inline-block;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid #000;
        border-bottom: 5px solid transparent;
        border-top: 5px solid transparent;
        margin-left: 5px;
        cursor: pointer;
    }

    .go-config {
        background-color: $light-green !important;
        height: 34px !important;
        padding: 4px 20px !important;
        .add-item {
            margin-right: 5px;
            background-size: 18px;
        }
    }

    .form-check-input:checked {
        background-color: $light-green !important;
        border-color: $light-green !important;
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

    .filter {
        cursor: pointer;
    }

    .icon-filter {
        margin-left: 10px;
        width: 22px;
        height: 22px;
        background-size: 22px 22px;
        position: relative;
        .filter-on {
            position: absolute;
            top: -2px;
            right: -3px;
            background-color: $light-green;
            width: 9px;
            height: 9px;
            border-radius: 50%;
            display: block;
        }
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
            margin-left: 10px;
            margin-right: 0;
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

    .seeMore, 
    .seeMinus {
        margin-top: 12px;
        display: inline-block;
        margin-left: 5px;
        cursor: pointer;
    }

    .list-filter {
        border: 1px solid $gray-line;
        border-radius: 12px;
        padding: 12px;
        .title-filter, .col-form-label {
            font-size: 16px;
        }
    }

    thead th p {
        // white-space: nowrap;
    }

    @media (max-width: 1280px) {
        .sidebar-open {
            .col-val {
                width: 110px !important;
            }
        }
    }

    @media (max-height: 700px) {
        .line-filter {
            min-width: 550px;
            display: flex;
            justify-content: space-between;
            .list-filter {
                width: 48%;
                padding: 10px;
                margin-bottom: 0 !important;
            }
        }
    }

</style>