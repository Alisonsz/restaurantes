<template>
    <div class="performance container-report">
        <div class="report-titles">
            <Navbar :navbarData="navbarData" />
            <Sidebar :sidebarData="sidebarData" />
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
                            <select class="form-select float-end text-end" v-model="intervalSelected">
                                <option v-for="(label, key) in intervalsLabels" :key="key" :value="key">{{ label }}</option>
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
                        <th scope="col" class="col-val"><p class="bold-600">ID</p></th>
                        <th scope="col"><p class="bold-600">Cliente</p></th>
                        <th scope="col" class="col-val"><p class="bold-600">Data</p></th>
                        <th scope="col" class="col-val"><p class="bold-600">Hora</p></th>
                        <th scope="col" class="col-val"><p class="bold-600">Valor (R$)</p></th>
                        <th scope="col" class="col-val"><p class="bold-600">Status</p></th>
                        <th scope="col" class="text-center col-details"><p class="bold-600">Detalhes</p></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in paginatedData" :key="index">
                        <td class="align-middle"><span class="table-text">{{ item.id }}</span></td>
                        <td class="align-middle"><span class="table-text">{{ item.user.name }}</span></td>
                        <td class="align-middle"><span class="table-text">{{ item.date }}</span></td>
                        <td class="align-middle"><span class="table-text">{{ item.time }}</span></td>
                        <td class="align-middle"><span class="table-text">{{ parseFloat(item.total).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span></td>
                        <td class="align-middle">
                            <span :class="'icon-status icon-' + item.status">{{ statusLabel[item.status] }}</span>
                        </td>
                        <td class="text-center align-middle">
                            <span class="icon-base icon-next" @click="showDetails(item)"></span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination @select-page="selectPage" :pageNumber="pageNumber" :setPageNumber="setPageNumber" :pageRecords="pageRecords" :totalRecords="totalRecords" />
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
                        <router-link to="/chamados" class="btn btn-contact" aria-current="page">
                            <span class="icon-contact"></span>Contatar suporte
                        </router-link>
                    </div>
                </template>
            </ModalDetails>
        </Teleport>
    </div>
</template>

<script>
import { ref, watch, computed } from 'vue';
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';
import Pagination from '@/components/Pagination.vue';
import FormDetails from '@/components/history/FormDetails.vue';
import ModalDetails from '@/components/ModalBase.vue';
import axios from 'axios';

export default {
    name: "HistoryView",
    components: {
        Navbar,
        Sidebar,
        Pagination,
        FormDetails,
        ModalDetails
    },
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
            intervalsLabels: {
                sevenDays: "7 Dias",
                oneMonth: "1 Mês",
                sixMonths: "6 Meses"
            },
            statusLabel: {
                "5": "Pago",
                "6": "Cancelado",
                "7": "Recusado"
            },
            tableData: [],
            dataDetails: {},
            totalRecords: 0
        }            
    },
    computed: {
        paginatedData() {
            const start = (this.pageNumber - 1) * this.pageRecords;
            const end = start + this.pageRecords;
            return this.tableData.slice(start, end);
        }
    },
    methods: {
        async loadData() {
            const daysMap = {
                sevenDays: 7,
                oneMonth: 30,
                sixMonths: 180
            };

            const days = daysMap[this.intervalSelected];
            console.log(`Fetching data for the last ${days} days`); // Log para verificar a requisição
            try {
                const response = await axios.get(`https://api.prattuapp.com.br/api/orders/filtered-status/1?days=${days}`);
                console.log(response.data); // Log da resposta da requisição
                this.tableData = response.data;
                this.totalRecords = this.tableData.length;
                this.pageNumber = 1;
            } catch (error) {
                console.error("Error fetching data", error);
            }
        },
        selectPage(page) {
            this.pageNumber = page;
        },
        showDetails(item) {
            this.dataDetails = item;
            this.showModalDetails = true;
        }
    },
    watch: {
        intervalSelected(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.loadData();
            }
        }
    },
    created() {
        this.loadData();
    }
}
</script>
<style lang="scss" scoped>

.icon-status {
    display: inline-block;
    height: 34px;
    width: 105px;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    border-radius: 16px;
    padding: 6px;
    color: black;
}

.icon-5 { /* Pago */
    background-color: #baedbd;
}

.icon-6 { /* Cancelado */
    background-color: #fb9f9f;
}

.icon-7 { /* Recusado */
    background-color: #c6c7f8;
}

/* Other styles */
.icon-base {
    border: 1px solid grey;
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
        border: 1px solid #18e21c;
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
        background-color: #light-green;
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
