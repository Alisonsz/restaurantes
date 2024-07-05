<template>
    <div class="row mt-4 cards-data">
        <div class="col-lg-4 card-simple" v-for="(order, index) in dataOrders" :key="index">
            <div class="card">
                <div class="row">
                    <div class="col d-flex align-items-center data-type">
                        <span class="card-type">{{ labelOrders[index] }}</span>
                    </div>
                    <div class="col-md-auto d-flex align-items-center text-end">
                        <div class="card-data">
                            <p class="card-value">
                                {{ order[intervalSelected].value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
                                <span class="card-percent" :class="order[intervalSelected].compare > 0 ? 'icon-var-up' : 'icon-var-down'">
                                    {{  Math.abs(order[intervalSelected].compare) }}%
                                </span>
                            </p>
                            <span class="hint">Comparado {{ intervalSelected === "oneMonth" ? "ao" : "aos" }} <span class="no-break">{{ intervalsLastLabel[intervalSelected] }}</span></span>
                        </div>
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
                labelOrders: {
                    deliveredOrder: "Pedidos em atraso",
                    delayedOrder: "Pedidos entregues na hora",
                    errorOrder: "Pedidos com erros"
                },
                dataOrders: {
                    deliveredOrder: {
                        sevenDays: { value: 123, compare: -18 },
                        oneMonth: { value: 450, compare: 15 },
                        sixMonths: { value: 620, compare: 14 }
                    },
                    delayedOrder: {
                        sevenDays: { value: 345, compare: 32 },
                        oneMonth: { value: 504, compare: 18 },
                        sixMonths: { value: 1053, compare: 21 }
                    },
                    errorOrder: {
                        sevenDays: { value: 85, compare: -19 },
                        oneMonth: { value: 182, compare: -21 },
                        sixMonths: { value: 359, compare: 10 }
                    }
                }
            }
        },
        props: {
            intervalsLastLabel: Object,
            intervalSelected: String
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
        transform: translateY(-5px);
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
            padding: 25px;
            .card-value {
                font-size: 28px;
                font-weight: 700;
                margin: 0;
                padding: 0;
                .stars {
                    display: inline-block;
                    transform: translateY(-5px);
                    .icon-star {
                        opacity: 0.4;
                    }
                    .on {
                        opacity: 1 !important;
                    }
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
                .card-type {
                    max-width: 170px !important;
                }
            }
        }
        .card-simple {
            .card-type {
                font-size: 15px;
            }
            .hint {
                max-width: 170px !important;
            }
        }
    }
    @media (max-width: 1290px) {
        .sidebar-open {
            .card-simple {
                .hint {
                    max-width: 170px !important;
                }
            }
        }
    }
</style>