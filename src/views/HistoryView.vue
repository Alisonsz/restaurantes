<template>
    <div class="performance container-report">
        <div class="report-titles">
            <Navbar :navbarData="navbarData" /><Sidebar :sidebarData="sidebarData"  />
            <div class="row">
                <div class="col">
                    <h3 class="bold-700">Histórico de pedidos</h3>
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
                        <th scope="col" class="col-val">
                            <p class="bold-600">ID</p>
                        </th>
                        <th scope="col">
                            <p class="bold-600">Cliente</p>
                        </th>
                        <th scope="col" class="col-val">
                            <p class="bold-600">Data</p>
                        </th>
                        <th scope="col" class="col-val">
                            <p class="bold-600">Hora</p>
                        </th>
                        <th scope="col" class="col-val">
                            <p class="bold-600">Valor (R$)</p>
                        </th>
                        <th scope="col" class="col-val">
                            <p class="bold-600">Status</p>
                        </th>
                        <th scope="col" class="text-center col-details">
                            <p class="bold-600">Detalhes</p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in tableData" :key="index">
                        <td class="align-middle">
                            <span class="table-text">{{ item.id }}</span>
                        </td>
                        <td class="align-middle">
                            <span class="table-text">{{ item.customer }}</span>
                        </td>
                        <td class="align-middle">
                            <span class="table-text">{{ item.dateCreate }}</span>
                        </td>
                        <td class="align-middle">
                            <span class="table-text">{{ item.timeCreate }}</span>
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
            <Pagination @select-page="selectPage" :pageNumber="pageNumber" :setPageNumber="setPageNumber" :pageRecords="pageRecords" :totalRecords="historyData[intervalSelected].length" />
        </div>
        <Teleport to="body">
            <ModalDetails :show="showModalDetails" @close="showModalDetails = false" :bgGray="true">
                <template #header>Detalhes da transação</template>
                <template #body>
                    <FormDetails @close-modal="showModalDetails = false" :dataDetails="dataDetails" :statusLabel="statusLabel" />
                </template>
                <template #footer>
                    <div class="detail-footer">
                        <hr>
                        <router-link  to="/" class="btn btn-contact" aria-current="page">
                            <span class="icon-contact"></span>Contatar suporte
                        </router-link>
                    </div>
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
    import FormDetails from "../components/history/FormDetails.vue";
    import ModalDetails from "../components/ModalBase.vue";

    export default {
        name: "HistoryView",
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
                    active: "history",
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
                    sevenDays: "ultimos 7 dias",
                    oneMonth: "mês passado",
                    sixMonths: "6 meses anteriores"
                },
                statusLabel: {
                    paid: "Pago",
                    rejected: "Recusado",
                    canceled: "Cancelado"
                },
                historyData: {
                    sevenDays: [],
                    oneMonth: [],
                    sixMonths: []
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
            loadData(interval) {
                if (this.historyData[interval].length > 0) {
                    this.intervalSelected = interval;
                    this.selectPage(1);
                    return;
                }
                
                let data;
                let intervalRegisters = {
                    sevenDays: 15,
                    oneMonth: 45,
                    sixMonths: 80
                }
                let intervalLastTime = {
                    sevenDays: 7,
                    oneMonth: 30,
                    sixMonths: 180
                }
                let idStart = 254534656;
                let listCustomers = [ "Patricia Gomes", "Felipe Martins", "Carlos Oliveira", "Laura Souza", "João Andrade", "Ana Andrade", "Felipe Pedro", "Felipe Martins", "Carlos Maria", "Maria Martins" ];
                let listPayments = [
                    { type:"Dinheiro" },
                    { type:"Dinheiro" },
                    { type:"Débito", brand:"Mastercard", card:"****9890" },
                    { type:"Crédito", brand:"Mastercard", card:"****4524" },
                    { type:"Crédito", brand:"Visa", card:"****3564" }
                ];
                let listProducts = [
                    {
                        name: "Suco",
                        subitem: ["Laranja", "Morango"],
                        amount: 19.00,
                        quantity: 2
                    },
                    {
                        name: "Suco",
                        subitem: ["Limão"],
                        amount: 9.50,
                        quantity: 1
                    },
                    {
                        name: "Hot dog",
                        subitem: ["Simples"],
                        amount: 15.50,
                        quantity: 1
                    },
                    {
                        name: "Hot dog",
                        subitem: ["Vegetariano"],
                        amount: 17.50,
                        quantity: 1
                    },
                    {
                        name: "Hot dog",
                        subitem: ["Completo"],
                        amount: 22.50,
                        quantity: 1
                    },
                    {
                        name: "Pizza",
                        subitem: ["Portuguesa", "Marguerita"],
                        amount: 140.00,
                        quantity: 2
                    },
                    {
                        name: "Pizza",
                        subitem: ["Quatro queijos"],
                        amount: 75.00,
                        quantity: 1
                    },
                    {
                        name: "Pizza",
                        subitem: ["Portuguesa"],
                        amount: 70.00,
                        quantity: 1
                    }
                ];
                let listStatus = Object.keys(this.statusLabel);

                for (var i = 0; i < intervalRegisters[interval]; i++) {
                    let today = new Date();
                    let pastWeek = intervalLastTime[interval] * 24 * 60 * 60 * 1000;
                    let randomTime = today.getTime() - Math.random() * pastWeek;
                    let randomDate = new Date(randomTime);
                    let day = String(randomDate.getDate()).padStart(2, '0');
                    let month = String(randomDate.getMonth() + 1).padStart(2, '0');
                    let year = randomDate.getFullYear();

                    let createHours = Math.floor(Math.random() * 24);
                    let createMinutes = Math.floor(Math.random() * 60);
                    let createFormattedHours = String(createHours).padStart(2, '0');
                    let createFormattedMinutes = String(createMinutes).padStart(2, '0');

                    let deliverHours = Math.floor(Math.random() * 24);
                    let deliverMinutes = Math.floor(Math.random() * 60);
                    let deliverFormattedHours = String(deliverHours).padStart(2, '0');
                    let deliverFormattedMinutes = String(deliverMinutes).padStart(2, '0');

                    let status = listStatus[Math.floor(Math.random() * 3)];

                    data = {
                        id: idStart + i,
                        customer: listCustomers[Math.floor(Math.random() * listCustomers.length)],
                        consumption: "local",
                        dateCreate: `${day}/${month}/${year}`,
                        timeCreate: `${createFormattedHours}:${createFormattedMinutes}`,
                        items: [],
                        amount: 0,
                        status: status
                    }

                    for (var y = 0; y < (Math.floor(Math.random() * listProducts.length) + 1); y++) {
                        data.items.push(listProducts[y]);
                        data["amount"] = data["amount"] + listProducts[y].amount;
                    }

                    if (status == "paid") {
                        data["timeDelivered"] = `${deliverFormattedHours}:${deliverFormattedMinutes}`;
                        data["payment"] = listPayments[Math.floor(Math.random() * listPayments.length)];
                    }
                    if (status == "canceled") {
                        data["timeCanceled"] = `${deliverFormattedHours}:${deliverFormattedMinutes}`;
                        data["reason"] = "Pedido incorreto ou incompleto";
                    }
                    if (status == "rejected") {
                        data["timeRejected"] = `${deliverFormattedHours}:${deliverFormattedMinutes}`;
                        data["reason"] = "Atraso excessivo na entrega";
                    }
                    this.historyData[interval].push(data);
                    this.selectPage(1);
                }
            },
            selectInterval() {
                this.loadData(this.intervalSelected);
            },
            selectPage(page) {
                let startIndex = (page - 1) * this.pageRecords;
                this.tableData = this.historyData[this.intervalSelected].slice(startIndex, startIndex + this.pageRecords);
            }
        },
        created() {
            this.loadData(this.intervalSelected);
        }
    }
</script>

<style lang="scss" scoped>
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
        .col-val {
            width: 140px;
        }
        .col-details {
            width: 85px;
        }
    }

    .detail-footer {
        width: 100%;
        margin-bottom: 5px;
        hr {
            margin-top: 0;
            margin-bottom: 15px;
        }
        .btn-contact {
            border: 1px solid $light-green;
            padding: 4px 17px;
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

    @media (max-width: 1280px) {
        .sidebar-open {
            .col-val {
                width: 110px !important;
            }
        }
    }
</style>