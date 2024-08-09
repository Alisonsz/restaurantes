<template>
  <div class="row mt-4 cards-data">
      <div class="col-lg-3 card-simple" v-for="(card, index) in Object.keys(dataCards)" :key="index">
          <div class="card">
              <div class="row">
                  <div class="col d-flex align-items-top data-type">
                      <span class="mt-3 card-type">
                          {{ labelCards[card].name }}
                          <span class="icon-base icon-help" v-tippy="labelCards[card].description"></span>
                      </span>
                  </div>
                  <div class="col-md-auto d-flex align-items-center text-end">
                      <div class="card-data" :class="labelCards[card].money === true ? 'with-coin' : ''">
                          <span class="card-value" v-if="labelCards[card].money === false">{{ dataCards[card].value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                          <span class="card-value" v-else><span class="coin">R$</span>{{ dataCards[card].value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                          <span class="card-percent" :class="dataCards[card].compare > 0 ? 'icon-var-up' : 'icon-var-down'">
                              {{  Math.abs(dataCards[card].compare).toFixed(1) }}%
                          </span>
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col d-flex flex-row-reverse bd-highlight">
                      <span class="mt-2 hint">Comparado {{ intervalSelected === "oneMonth" ? "ao" : "aos" }} <span class="no-break">{{ intervalsLastLabel[intervalSelected] }}</span></span>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name: "Cards",
    data() {
        return {
            labelCards: {
                sales: { 
                    name: "Total de vendas", 
                    description: "Valor total de vendas realizados na plataforma.", 
                    money: true
                },
                ticket:  {
                    name: "Tiket médio", 
                    description: "Valor médio gasto por cliente a cada compra realizada.", 
                    money: true
                },
                order:  {
                    name: "Número de pedidos", 
                    description: "Número de pedidos que foram realizadas na plataforma.", 
                    money: false
                },
                customers:  { 
                    name: "Novos Clientes", 
                    description: "Clientes que pediram pela primeira vez na sua loja.", 
                    money: false
                }
            }
        }
    },
    props: {
        intervalsLastLabel: Object,
        intervalSelected: String,
        salesData: Object
    },
    computed: {
        dataCards() {
            if (!this.salesData) return {};
            const intervalMapping = {
                sevenDays: 7,
                oneMonth: 30,
                sixMonths: 180
            };
            const interval = intervalMapping[this.intervalSelected];
            return {
                sales: {
                    value: this.salesData[interval].current_sales,
                    compare: this.salesData[interval].sales_percentage_change
                },
                ticket: {
                    value: this.salesData[interval].average_ticket,
                    compare: this.salesData[interval].sales_percentage_change
                },
                order: {
                    value: this.salesData[interval].current_orders,
                    compare: this.salesData[interval].orders_percentage_change
                },
                customers: {
                    value: 0, // mantendo como está
                    compare: 0 // mantendo como está
                }
            };
        }
    }
};
</script>

<style lang="scss" scoped>
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
  .card-percent {
      font-size: 12px;
      font-weight: 500;
  }
  .interval {
      position: relative;
      border-bottom: 1px solid $gray-line !important;
      padding-bottom: 2px;
      margin-bottom: 50px;
      height: 40px !important;
      label {
          position: absolute;
          margin-top: 7px;
          font-size: 16px;
          font-weight: 500;
          text-align: left;
      }
      select {
          background-color: transparent;
          border: none;
      }
  }

  .card-simple {
      .card-title {
          background-color: $white-primary;
          width: max-content;
          border-radius: 9px 9px 0 0;
          padding: 8px 25px 6px 25px;
          font-size: 14px;
          font-weight: 500;
      }
      
      .card {
          border-radius: 16px;
          border: none;
          padding: 15px 22px 20px 20px;
          .card-value {
              font-size: 28px;
              font-weight: 700;
              position: relative;
              display: block;
              margin: 0;
              padding: 0;
              .coin {
                  font-size: 14px;
                  font-weight: 500;
                  position: absolute;
                  left: 0;
                  top: 13px;
              }
          }
          .card-data.with-coin {
              .card-value {
                  padding-left: 22px;
              }
          }
          .card-type {
              font-size: 16px;
              font-weight: 500;
              margin: 0;
              padding: 0;
              line-height: 1;
              display: block;
          }
          .hint {
              font-size: 12px;
              font-weight: 400;
              margin: 0;
              padding: 0;
              display: block;
              line-height: 1;
          }
      }
      .data-type {
          width: max-content !important;
      }
  }

  @media (max-width: 1370px) {
      .sidebar-open {
          .card-simple {
              .card {
                  display: grid; place-items: center;
                  .align-items-center {
                      display: block !important;
                      width: 100% !important;
                  }
                  .data-type {
                      display: block !important;
                      width: 100% !important;
                      white-space: nowrap;
                      text-align: center;
                  }
                  .card-data {
                      display: grid; 
                      place-items: center;

                  }
              }
          }
      }
      .card-simple {
          .card-type {
              font-size: 15px;
          }
      }
  }

  @media (max-width: 1330px) {
      .card-simple {
          .card {
              display: grid; place-items: center;
              .align-items-center {
                  display: block !important;
                  width: 100% !important;
              }
              .data-type {
                  display: block !important;
                  width: 100% !important;
                  white-space: nowrap;
                  text-align: center;
              }
              .card-data {
                  display: grid; 
                  place-items: center;

              }
          }
      }
}
</style>
