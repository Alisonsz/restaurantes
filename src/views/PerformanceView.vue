<template>
    <div class="performance container-report">
      <div class="report-titles">
        <Navbar :navbarData="navbarData" />
        <Sidebar :sidebarData="sidebarData" />
        <div class="row">
          <div class="col">
            <h3 class="bold-700">Performance do Cardápio</h3>
          </div>
          <div class="col-lg-4 select-interval">
            <div class="row">
              <div class="col">
                <h4 class="bold-500">
                  {{ intervalSelected === "1month" ? "No último" : "Nos últimos" }}
                </h4>
              </div>
              <div class="col text-end">
                <select
                  class="form-select float-end text-end"
                  v-model="intervalSelected"
                  @change="selectInterval"
                >
                  <option
                    v-for="(label, key) in intervals"
                    :key="key"
                    :value="key"
                  >
                    {{ label }}
                  </option>
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
                <p class="bold-600">Variação Visitas</p>
                <span class="bold-400">({{ intervalsLastLabel[intervalSelected] }})</span>
              </th>
              <th scope="col" class="col-val text-center">
                <p class="bold-600">Pedidos</p>
              </th>
              <th scope="col" class="col-var text-center">
                <p class="bold-600">Variação Pedidos</p>
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
                <img v-if="item.photo_url" :src="item.photo_url" class="thumb-table" alt="Produto" />
                <img v-else src="~@/assets/img/img.svg" class="thumb-table" alt="Imagem indisponível" />
              </td>
              <td class="text-left align-middle col-name">
                <span class="bold-400">{{ (pageNumber - 1) * pageRecords + index + 1 }}º ranking</span>
                <p class="bold-500">{{ item.name }}</p>
              </td>
              <td class="text-center align-middle">
                <span class="number">{{ item.total_views }}</span>
              </td>
              <td class="text-center align-middle">
                <span :class="item.views_variation > 0 ? 'icon-var-up' : 'icon-var-down'">
                  {{ Math.abs(item.views_variation).toFixed(2) }}%
                </span>
              </td>
              <td class="text-center align-middle">
                <span class="number">{{ item.orders_in_period }}</span>
              </td>
              <td class="text-center align-middle">
                <span :class="item.orders_variation > 0 ? 'icon-var-up' : 'icon-var-down'">
                  {{ Math.abs(item.orders_variation).toFixed(2) }}%
                </span>
              </td>
              <td class="text-center align-middle">
                <span class="number">
                  {{ item.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <Pagination
          @select-page="setPageNumber"
          :pageNumber="pageNumber"
          :setPageNumber="setPageNumber"
          :pageRecords="pageRecords"
          :totalRecords="performanceData.length"
        />
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref } from 'vue';
  import { mapState } from 'vuex';
  import Navbar from '../components/Navbar.vue';
  import Sidebar from '../components/Sidebar.vue';
  import Footer from '../components/Footer.vue';
  import Pagination from '../components/Pagination.vue';
  
  export default {
    name: 'PerformanceView',
    components: {
      Navbar,
      Sidebar,
      Footer,
      Pagination,
    },
    data() {
      return {
        intervalSelected: '1month',
        intervals: {
          '7days': '7 dias',
          '1month': 'Mês',
          '6months': '6 meses',
        },
        intervalsLastLabel: {
          '7days': 'últimos 7 dias',
          '1month': 'último mês',
          '6months': '6 meses anteriores',
        },
        performanceData: [],
        tableData: [],
        pageRecords: 10,
        pageNumber: 1,
        sidebarData: {
          logo: '/img/logo1.png',
          company: 'TATÁ Sushi',
          address: 'R. João Cachoeira, 278',
          active: 'performance',
          open: false
        },
        navbarData: {
          time: '9 horas',
          notifications: 4
        },
      };
    },
    computed: {
      ...mapState(['token']),
    },
    methods: {
      loadData() {
        const url = `https://api.prattuapp.com.br/api/restaurants/1/most-visited-products?period=${this.intervalSelected}`;
        axios
          .get(url, {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          })
          .then((response) => {
            this.performanceData = response.data;
            this.selectPage(1); // Carregar a primeira página com os novos dados
          })
          .catch((error) => {
            console.error('Erro ao buscar dados da API:', error);
          });
      },
      selectInterval() {
        this.loadData(); // Recarrega os dados ao trocar o intervalo
      },
      setPageNumber(page) {
        this.pageNumber = page;
        this.selectPage(page);
      },
      selectPage(page) {
        const startIndex = (page - 1) * this.pageRecords;
        const endIndex = startIndex + this.pageRecords;
        this.tableData = this.performanceData.slice(startIndex, endIndex);
      },
    },
    created() {
      this.loadData(); // Carregar dados iniciais
    },
  };
  </script>
  
  <style scoped lang="scss">
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
    thead p,
    thead span {
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
      p,
      span {
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
  