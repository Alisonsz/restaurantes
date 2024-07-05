<template>
    <div class="report-data mt-4 card-notificarion">
        <div class="header">
            <div class="row">
                <div class="col-lg-4 d-flex align-items-center">
                    <h3 class="bold-500">Fique ligado!</h3>
                </div>
                <div class="col-lg-8 d-flex flex-row-reverse">
                    <Pagination @select-page="selectPage" :pageNumber="pageNumber" :setPageNumber="setPageNumber" :pageRecords="pageRecords" :totalRecords="dataNotifications.length" />
                </div>
            </div>
        </div>
        <div class="body">
            <div v-for="(notification, index) in tableData" :key="index">
                <h4><span class="icon-alert"></span> {{ notification.title }}</h4>
                <p>{{ notification.text }}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import {ref} from 'vue';
    import Pagination from "../Pagination.vue";

    export default {
        name: "Notifications",
        setup() {
            const pageNumber = ref(1);
            const setPageNumber = (value) => {
                pageNumber.value = value;
            };
            return {
                pageNumber,
                setPageNumber
            }
        },
        data() {
            return {
                tableData: [],
                pageRecords: 1,
                dataNotifications: [
                    {
                        title: "Aumento na taxa de cancelamento.",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                    },
                    {
                        title: "Aumento na taxa de cancelamento (2).",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                    },
                    {
                        title: "Aumento na taxa de cancelamento (3).",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                    },
                    {
                        title: "Aumento na taxa de cancelamento (4).",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                    },
                    {
                        title: "Aumento na taxa de cancelamento (5).",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                    }
                ]
            }
        },
        methods: {
            selectPage(page) {
                let startIndex = (page - 1) * this.pageRecords;
                this.tableData = this.dataNotifications.slice(startIndex, startIndex + this.pageRecords);
            }
        },
        components: {
            Pagination
        },
        created() {
            this.selectPage(1);
        }
    };
</script>

<style lang="scss" scoped>
    .card-notificarion {
        .header {
            border-bottom: 1px solid $gray-line;
            padding-bottom: 10px;
            margin-bottom: 20px;
            h3 {
                margin: 3px 0 0 0;
                padding: 0;
                line-height: 1;
                font-weight: 500;
                font-size: 16px;
            }
            span {
                color: $gray-primary;
                margin: 0;
                padding: 0;
                line-height: 1;
                font-weight: 400;
                font-size: 14px;
            }
            .icon-next {
                width: 16px;
                height: 16px;
                display: inline-block;
                position: relative;
                bottom: -2px;
                margin-left: 12px;
                background-position: center center;
                background-repeat: no-repeat;
                opacity: 0.6;
            }
        }
        .body {
            h4 {
                font-weight: 500;
                font-size: 16px;
            }
            p {
                color: $gray-primary;
                font-weight: 400;
                font-size: 16px;
                margin-bottom: 30px;
            }
            .icon-alert {
                width: 16px;
                height: 16px;
                display: inline-block;
                position: relative;
                bottom: -2px;
                margin-right: 8px;
                background-position: center center;
                background-repeat: no-repeat;
                background-size: 16px 16px;
            }
        }
    }
</style>