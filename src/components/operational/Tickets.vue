<template>
    <div class="report-data mt-4 card-tickets">
        <div class="header">
            <div class="row">
                <div class="col-6">
                    <h3 class="title">Chamados</h3>
                </div>
                <div class="col-6 text-end">
                    <router-link  to="/" class="nav-link" aria-current="page">
                        <span class="new-ticket">Abrir chamado</span>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="accordion ticket-list">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <span class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#data-open" aria-expanded="true" aria-controls="data-open">
                                <span class="type-ticket">Em aberto</span> <span class="count-ticket ticket-open">{{ dataTickets.open[intervalSelected].count }}</span>
                            </span>
                        </h2>
                        <div id="data-open" class="accordion-collapse collapse show">
                            <div class="accordion-body">
                                <div class="data-table">
                                    <table class="table">
                                        <tbody>
                                            <tr v-for="(ticket, index) in dataTickets.open[intervalSelected].data" :key="index">
                                                <td class="align-middle" v-if="index < limitTickets">
                                                    <router-link  to="/" class="nav-link" aria-current="page">
                                                        Chamado - {{ ticket.id }}
                                                    </router-link>
                                                </td>
                                                <td class="align-middle text-end" v-if="index < limitTickets">
                                                    <router-link  to="/" class="nav-link" aria-current="page">
                                                        {{ ticket.date }} - {{ ticket.time }}
                                                    </router-link>
                                                </td>
                                                <td class="align-middle text-end col-icon" v-if="index < limitTickets">
                                                    <router-link  to="/" class="nav-link" aria-current="page">
                                                        <span class="icon-base icon-next"></span>
                                                    </router-link>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <router-link  to="/" class="nav-link mt-3 mb-2" aria-current="page" v-if="dataTickets.open[intervalSelected].count > limitTickets">
                                        <span class="new-ticket">Ver todos <span class="icon-next"></span></span>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="accordion ticket-list">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <span class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#data-close" aria-expanded="true" aria-controls="data-close">
                                <span class="type-ticket">Concluídos</span> <span class="count-ticket ticket-close">{{ dataTickets.close[intervalSelected].count }}</span>
                            </span>
                        </h2>
                        <div id="data-close" class="accordion-collapse collapse show">
                            <div class="accordion-body">
                                <div class="data-table">
                                    <table class="table">
                                        <tbody>
                                            <tr v-for="(ticket, index) in dataTickets.close[intervalSelected].data" :key="index">
                                                <td class="align-middle" v-if="index < limitTickets">
                                                    <router-link  to="/" class="nav-link" aria-current="page">
                                                        Chamado - {{ticket.id}}
                                                    </router-link>
                                                </td>
                                                <td class="align-middle text-end" v-if="index < limitTickets">
                                                    <router-link  to="/" class="nav-link" aria-current="page">
                                                        {{ticket.date}} - {{ticket.time}}
                                                    </router-link>
                                                </td>
                                                <td class="align-middle text-end col-icon" v-if="index < limitTickets">
                                                    <router-link  to="/" class="nav-link" aria-current="page">
                                                        <span class="icon-base icon-next"></span>
                                                    </router-link>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <router-link  to="/" class="nav-link mt-3 mb-2" aria-current="page" v-if="dataTickets.close[intervalSelected].count > limitTickets">
                                        <span class="new-ticket">Ver todos <span class="icon-next"></span></span>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Tickets",
        data() {
            return {
                limitTickets: 20,
                dataTickets: {
                    open: {
                        sevenDays: {
                            count: 3,
                            data: [
                                { id: 2495908, date: "15/04/2024", time: "13:24" },
                                { id: 2495909, date: "15/04/2024", time: "13:25" },
                                { id: 2495910, date: "15/04/2024", time: "13:26" }
                            ],
                        },
                        oneMonth: {
                            count: 7,
                            data: [
                                { id: 2495914, date: "15/04/2024", time: "13:30" },
                                { id: 2495915, date: "15/04/2024", time: "13:31" },
                                { id: 2495916, date: "15/04/2024", time: "13:32" },
                                { id: 2495917, date: "15/04/2024", time: "13:33" },
                                { id: 2495918, date: "15/04/2024", time: "13:34" },
                                { id: 2495919, date: "15/04/2024", time: "13:35" },
                                { id: 2495920, date: "15/04/2024", time: "13:36" }
                            ]
                        },
                        sixMonths: {
                            count: 20,
                            data: [
                                { id: 2495928, date: "15/04/2024", time: "13:44" },
                                { id: 2495929, date: "15/04/2024", time: "13:45" },
                                { id: 2495930, date: "15/04/2024", time: "13:46" },
                                { id: 2495931, date: "15/04/2024", time: "13:47" },
                                { id: 2495932, date: "15/04/2024", time: "13:48" },
                                { id: 2495933, date: "15/04/2024", time: "13:49" },
                                { id: 2495934, date: "15/04/2024", time: "13:50" },
                                { id: 2495935, date: "15/04/2024", time: "13:51" },
                                { id: 2495936, date: "15/04/2024", time: "13:52" },
                                { id: 2495937, date: "15/04/2024", time: "13:53" },
                                { id: 2495938, date: "15/04/2024", time: "13:54" },
                                { id: 2495939, date: "15/04/2024", time: "13:55" },
                                { id: 2495940, date: "15/04/2024", time: "13:56" },
                                { id: 2495941, date: "15/04/2024", time: "13:57" },
                                { id: 2495937, date: "15/04/2024", time: "13:53" },
                                { id: 2495938, date: "15/04/2024", time: "13:54" },
                                { id: 2495939, date: "15/04/2024", time: "13:55" },
                                { id: 2495940, date: "15/04/2024", time: "13:56" },
                                { id: 2495941, date: "15/04/2024", time: "13:57" },
                                { id: 2495942, date: "15/04/2024", time: "13:58" }
                            ]
                        }
                    },
                    close: {
                        sevenDays: {
                            count: 3,
                            data: [
                                { id: 2495911, date: "15/04/2024", time: "13:27" },
                                { id: 2495912, date: "15/04/2024", time: "13:28" },
                                { id: 2495913, date: "15/04/2024", time: "13:29" }
                            ]
                        },
                        oneMonth: {
                            count: 6,
                            data: [
                                { id: 2495921, date: "15/04/2024", time: "13:37" },
                                { id: 2495922, date: "15/04/2024", time: "13:38" },
                                { id: 2495923, date: "15/04/2024", time: "13:39" },
                                { id: 2495924, date: "15/04/2024", time: "13:40" },
                                { id: 2495925, date: "15/04/2024", time: "13:41" },
                                { id: 2495926, date: "15/04/2024", time: "13:42" }
                            ]
                        },
                        sixMonths: {
                            count: 52,
                            data: [
                                { id: 2495943, date: "15/04/2024", time: "13:59" },
                                { id: 2495944, date: "15/04/2024", time: "14:00" },
                                { id: 2495945, date: "15/04/2024", time: "14:01" },
                                { id: 2495946, date: "15/04/2024", time: "14:02" },
                                { id: 2495947, date: "15/04/2024", time: "14:03" },
                                { id: 2495948, date: "15/04/2024", time: "14:04" },
                                { id: 2495949, date: "15/04/2024", time: "14:05" },
                                { id: 2495950, date: "15/04/2024", time: "14:06" },
                                { id: 2495951, date: "15/04/2024", time: "14:07" },
                                { id: 2495952, date: "15/04/2024", time: "14:08" },
                                { id: 2495953, date: "15/04/2024", time: "14:09" },
                                { id: 2495954, date: "15/04/2024", time: "14:10" },
                                { id: 2495955, date: "15/04/2024", time: "14:11" },
                                { id: 2495956, date: "15/04/2024", time: "14:12" },
                                { id: 2495957, date: "15/04/2024", time: "14:13" },
                                { id: 2495958, date: "15/04/2024", time: "14:14" },
                                { id: 2495954, date: "15/04/2024", time: "14:10" },
                                { id: 2495955, date: "15/04/2024", time: "14:11" },
                                { id: 2495956, date: "15/04/2024", time: "14:12" },
                                { id: 2495959, date: "15/04/2024", time: "14:15" }
                            ]
                        }
                    }
                }
            }
        },
        props: {
            intervalSelected: String
        }
    };
</script>

<style lang="scss" scoped>
    .accordion-button:not(.collapsed) {
        background-color: transparent !important;
        box-shadow: none;
    }
    .accordion-body {
        padding-bottom: 20px;
    }
    .accordion-body .data-table {
        overflow: auto;
        overflow-x: hidden;
        max-height: 265px;
        .table {
            margin-bottom: 0;
        }
    }
    .accordion-body .data-table::-webkit-scrollbar {
        width: 12px;  
    }
    .accordion-body .data-table::-webkit-scrollbar-track {
        background: transparent;       
    }
    .accordion-body .data-table::-webkit-scrollbar-thumb {
        background-color: $gray-line;    
        border-radius: 20px;       
        border: 3px solid $white-primary; 
    }

    .icon-base {
        width: 14px;
        height: 14px;
        display: inline-block;
        position: relative;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 14px 14px;
        margin-bottom: -6px;
        margin-right: 3px;
    }

    .new-ticket {
        border: 1px solid $light-green;
        color: $black-primary;
        border-radius: 9px;
        font-size: 14px;
        padding: 8px 18px;
        line-height: 1;
        font-size: 14px;
        font-weight: 400;
        .icon-next {
            width: 11px;
            height: 11px;
            display: inline-block;
            position: relative;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: 11px 11px;
            margin-left: 5px;
            transform: translateY(1px);
        }
    }
    .new-ticket:hover {
        background-color: $light-green;;
    }

    .card-tickets {
        padding-bottom: 35px !important;
        .header {
            border-bottom: 1px solid $gray-line;
            margin-bottom: 20px;
            padding-bottom: 5px;
            .new-ticket {
                display: block;
                float: right;
            }
        }
        h3.title {
            font-size: 16px;
            font-weight: 500;
            margin-top: 10px;
        }
        .type-ticket {
            font-size: 16px;
            font-weight: 500;
            line-height: 1;
            margin: 0;
            padding: 0;
        }
        .count-ticket {
            font-size: 13px;
            font-weight: 500;
            min-width: 40px;
            min-height: 24px;
            margin-left: 10px;
            border-radius: 12px;
            padding: 4px;
            display: inline-block;
            text-align: center;
        }
        .ticket-open {
            background-color: $light-green;
        }
        .ticket-close {
            color: $white-primary;
            background-color: $blue-primary;
        }
        .ticket-list {
            .nav-link {
                color: $gray-primary;
                font-size: 13px;
                font-weight: 500;
            }
            .icon-base {
                border: 1px solid $gray-line;
                border-radius: 50%;
                width: 34px;
                height: 34px;
                display: inline-block;
                position: relative;
                background-position: center center;
                background-repeat: no-repeat;
                background-size: 11px 11px;
                margin-bottom: -1px;
            }
            .col-icon {
                width: 55px;
            }
        }
        .accordion-body {
            padding-top: 0;
        }
    }
</style>