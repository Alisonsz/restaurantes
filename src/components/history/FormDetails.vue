<template>
    <form>
        <span :class="'icon-status icon-' + dataDetails.status">{{ statusLabel[dataDetails.status] }}</span>
        <div class="select-tabs">
            <button @click.prevent="selectTab = 'details'" class="btn" :class="selectTab === 'details' ? 'tab-active' : ''">Detalhes</button>
            <button @click.prevent="selectTab = 'general'" class="btn" :class="selectTab === 'general' ? 'tab-active' : ''">Geral</button>
        </div>
        <div class="details" v-if="selectTab === 'details'">
            <div class="mt-0">
                <span class="bold-600">Detalhes do pedido </span>
                <span>({{ dataDetails.products.length }} itens)</span>
            </div>
            <table class="table">
                <tbody>
                    <tr>
                        <td class="align-middle">
                            <span class="bold-600">Consumo</span>
                        </td>
                        <td class="align-middle text-end">
                            <span>{{ dataDetails.eat_on ? "Local" : "Entrega" }}</span>
                        </td>
                    </tr>
                    <tr v-for="(item, index) in dataDetails.products" :key="index" class="list-items">
                        <td class="align-middle">
                            <p class="bold-600">{{ item.product.name }} <span class="bold-400">({{ item.quantity }} {{ item.quantity > 1 ? 'unidades' : 'unidade' }})</span></p>
                        </td>
                        <td class="align-middle text-end">
                            <span class="bold-500">R$ {{ parseFloat(item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="total">
                <table class="table table-borderless">
                    <tbody>
                        <tr>
                            <td class="align-middle">
                                <span class="bold-700">Valor total</span>
                            </td>
                            <td class="align-middle text-end">
                                <span class="bold-700">R$ {{ parseFloat(dataDetails.total).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="general" v-if="selectTab === 'general'">
            <table class="table">
                <tbody>
                    <tr>
                        <td class="align-middle">
                            <span class="bold-600">ID do pedido</span>
                        </td>
                        <td class="align-middle text-end">
                            <span>{{ dataDetails.id }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="align-middle">
                            <span class="bold-600">Cliente</span>
                        </td>
                        <td class="align-middle text-end">
                            <span>{{ dataDetails.user.name }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="align-middle">
                            <span class="bold-600">Data e hora</span>
                        </td>
                        <td class="align-middle text-end">
                            <span>{{ dataDetails.date }} às {{ dataDetails.time }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="align-middle">
                            <span class="bold-600">Valor</span>
                        </td>
                        <td class="align-middle text-end">
                            <span>{{ parseFloat(dataDetails.total).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                        </td>
                    </tr>
                    <tr v-if="dataDetails.status === '5'">
                        <td class="align-middle">
                            <span class="bold-600">Horário da entrega</span>
                        </td>
                        <td class="align-middle text-end">
                            <span>{{ dataDetails.delivery_datetime }}</span>
                        </td>
                    </tr>
                    <tr v-if="dataDetails.payment_method">
                        <td class="align-middle">
                            <span class="bold-600">Forma de pagamento</span>
                        </td>
                        <td class="align-middle text-end">
                            <span>{{ dataDetails.payment_method }}</span>
                        </td>
                    </tr>
                    <tr v-if="dataDetails.status === '6' && dataDetails.user_rejection_reason">
                        <td class="align-middle">
                            <span class="bold-600">Motivo do cancelamento</span>
                        </td>
                        <td class="align-middle text-end">
                            <span>{{ dataDetails.user_rejection_reason }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </form>
</template>

<script>
export default {
    name: "FormDetails",
    emits: ["closeModal", "saveModal"],
    data() {
        return {
            selectTab: "details"
        }
    },
    props: {
        dataDetails: Object,
        statusLabel: Object
    }
};
</script>
<style lang="scss" scoped>
.icon-5 { /* Pago */
    background-color: #baedbd;
}

.icon-6 { /* Cancelado */
    background-color: #fb9f9f;
}

.icon-7 { /* Recusado */
    background-color: #c6c7f8;
}
    .modal-container form {
        width: 500px !important;
    }

    .select-tabs {
        margin-top: 10px;
        button {
            background-color: $gray-line;
            margin-right: 15px;
            border-radius: 8px 8px 0 0 !important;;
        }
    }
    
    .tab-active {
        background-color: $light-green !important;
    }

    .table {
        tr td {
            padding-left: 0;
            padding-right: 0;
        }
    }

    .row-reason {
        border-bottom: 1px solid $white-primary;
        td {
            padding-bottom: 0;
        }
    }

    .details,  .general {
        background-color: $white-primary;
        padding: 20px 25px 15px 25px;
        border-radius: 0px 16px 16px 16px;
    }

    .icon-status {
        position: absolute;
        top: -57px;
        right: 0;
    }

    .details {
        .list-items {
            font-size: 13px;
            p {
                padding: 0;
                margin: 0;
                line-height: 1.1;
            }
            p, span {
                color: $gray-primary;
            }
        }
        .total {
            background-color: $gray-bg !important;
            padding: 5px 15px;
            border-radius: 3px;
            margin-bottom: 10px;
            .table {
                margin-bottom: 0;
                tr td  {
                    background-color: transparent !important;
                    padding-top: 2px;
                    padding-bottom: 2px;
                }
            }
        }
    }
  
</style>