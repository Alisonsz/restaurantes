<template>
    <div class="row mt-4 cards-data">
        <div class="col-lg-4 card-tag">
            <div class="card-title">Pedidos recusados</div>
            <div class="card">
                <div class="interval">
                    <label>{{ refusedData.selected === "oneMonth" ? "No último" : "Nos últimos" }}</label>
                    <select class="form-select float-end text-end" v-model="refusedData.selected">
                        <option v-for="(interval, index) in intervals" :key="index" :value="index">{{ interval }}</option>
                    </select>
                </div>
                <div class="row">
                    <div class="data-type">
                        <p class="card-value">{{ refusedData[refusedData.selected].value }}</p>
                        <span class="card-type">Pedidos recusados</span>
                    </div>
                    <div class="col text-end">
                        <span class="card-percent" :class="refusedData[refusedData.selected].compare > 0 ? 'icon-var-up' : 'icon-var-down'">
                            {{  Math.abs(refusedData[refusedData.selected].compare) }}%
                        </span>
                        <span class="hint">Comparado {{ refusedData.selected === "oneMonth" ? "ao" : "aos" }} <span class="no-break">{{ intervalsLastLabel[refusedData.selected] }}</span></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-4 card-tag">
            <div class="card-title">Avaliações</div>
            <div class="card">
                <div class="interval">
                    <label>{{ reviewsData.selected === "oneMonth" ? "No último" : "Nos últimos" }}</label>
                    <select class="form-select float-end text-end" v-model="reviewsData.selected">
                        <option v-for="(interval, index) in intervals" :key="index" :value="index">{{ interval }}</option>
                    </select>
                </div>
                <div class="row">
                    <div class="data-type">
                        <p class="card-value">
                            {{ reviewsData[reviewsData.selected].value }}
                            <span class="stars">
                                <span class="icon-base icon-star" :class="Math.trunc(reviewsData[reviewsData.selected].value) >= 1 ? 'on' :  ''"></span>
                                <span class="icon-base icon-star" :class="Math.trunc(reviewsData[reviewsData.selected].value) >= 2 ? 'on' :  ''"></span>
                                <span class="icon-base icon-star" :class="Math.trunc(reviewsData[reviewsData.selected].value) >= 3 ? 'on' :  ''"></span>
                                <span class="icon-base icon-star" :class="Math.trunc(reviewsData[reviewsData.selected].value) >= 4 ? 'on' :  ''"></span>
                                <span class="icon-base icon-star" :class="Math.trunc(reviewsData[reviewsData.selected].value) >= 5 ? 'on' :  ''"></span>
                            </span>
                        </p>
                        <span class="card-type">Média de avaliações</span>
                    </div>
                    <div class="col text-end">
                        <span class="card-percent" :class="reviewsData[reviewsData.selected].compare > 0 ? 'icon-var-up' : 'icon-var-down'">{{  Math.abs(reviewsData[reviewsData.selected].compare) }}%</span>
                        <span class="hint">Comparado {{ reviewsData.selected === "oneMonth" ? "ao" : "aos" }} <span class="no-break">{{ intervalsLastLabel[reviewsData.selected] }}</span></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-4 card-tag">
            <div class="card-title">Preparo</div>
            <div class="card">
                <div class="interval">
                    <label>{{ preparationData.selected === "oneMonth" ? "No último" : "Nos últimos" }}</label>
                    <select class="form-select float-end text-end" v-model="preparationData.selected">
                        <option v-for="(interval, index) in intervals" :key="index" :value="index">{{ interval }}</option>
                    </select>
                </div>
                <div class="row">
                    <div class="data-type">
                        <p class="card-value">{{ preparationData[preparationData.selected].value }}</p>
                        <span class="card-type">Tempo médio de preparo</span>
                    </div>
                    <div class="col text-end">
                        <span class="card-percent" :class="preparationData[preparationData.selected].compare > 0 ? 'icon-var-up' : 'icon-var-down'">{{  Math.abs(preparationData[preparationData.selected].compare) }}%</span>
                        <span class="hint">Comparado {{ preparationData.selected === "oneMonth" ? "ao" : "aos" }} <span class="no-break">{{ intervalsLastLabel[preparationData.selected] }}</span></span>
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
                refusedData: {
                    selected: "sevenDays",
                    sevenDays: { value: 0, compare: 0 },
                    oneMonth: { value: 0, compare: 0 },
                    sixMonths: { value: 428, compare: 0 }
                },
                reviewsData: {
                    selected: "sevenDays",
                    sevenDays: { value: 0, compare: 0 },
                    oneMonth: { value: 0, compare: 0 },
                    sixMonths: { value: 0, compare: 0 }
                },
                preparationData: {
                    selected: "sevenDays",
                    sevenDays: { value: "40 min", compare: -15 },
                    oneMonth: { value: "39 min", compare: -12 },
                    sixMonths: { value: "38 min", compare: 11 }
                }
            }
        },
        props: {
            intervalsLastLabel: Object,
            intervals: Object
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

    .card-tag {
        .card-title {
            background-color: $white-primary;
            width: max-content;
            border-radius: 9px 9px 0 0;
            padding: 8px 25px 6px 25px;
            font-size: 14px;
            font-weight: 500;
        }
        
        .card {
            border-radius: 0 16px 16px 16px;
            border: none;
            padding: 15px 25px 15px 25px;
            min-height: 195px;
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
                font-weight: 400;
                margin: 0;
                padding: 0;
                line-height: 1;
                display: block;
            }
            .card-percent {
                margin-top: 10px;
                margin-bottom: 5px;
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
            .card-tag {
                .card-type {
                    max-width: 170px !important;
                }
            }
        }
        .card-tag {
            .card-type {
                font-size: 15px;
            }
        }
    }
</style>