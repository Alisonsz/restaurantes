<template>
    <nav aria-label="Page navigation example" v-if="typeof totalRecords === 'number'">
        <ul class="pagination">
            <li class="page-item icon-back">
                <a class="page-link" href="#" @click.prevent="selectCurrentPage(pageNumber - 1)"></a>
            </li>
            <li class="page-item page-number" v-if="firstRangeNumber === 2 && pageNumber === totalPages">
                <a class="page-link" href="#" @click.prevent="selectCurrentPage(1)">1</a>
            </li>
            <li class="page-item page-number" v-if="pageNumber > maxButtons && !(firstRangeNumber === 2 && pageNumber === totalPages)">
                <span class="page-link page-more" href="#" @click.prevent="">...</span>
            </li>
            <li class="page-item page-number" v-for="n in range()" :key="n" :class="n === pageNumber ? 'active' : ''">
                <a class="page-link" href="#" @click.prevent="selectCurrentPage(n)">{{ n }}</a>
            </li>
            <li class="page-item page-number" v-if="totalPages > pageNumber && totalPages > maxButtons && lastRangeNumber + 1 < totalPages">
                <span class="page-link page-more" href="#" @click.prevent="">...</span>
            </li>
            <li class="page-item page-number" v-if="lastRangeNumber < totalPages">
                <a class="page-link" href="#" @click.prevent="selectCurrentPage(totalPages)">{{ totalPages }}</a>
            </li>
            <li class="page-item icon-next">
                <a class="page-link" href="#" @click.prevent="selectCurrentPage(pageNumber + 1)"></a>
            </li>
        </ul>
    </nav>
</template>

<script>
    export default {
        name: "Pagination",
        data() {
            return {
                maxButtons: 4,
                firstRangeNumber: 0,
                lastRangeNumber: 0,
                totalPages: 0
            }
        },
        props: {
            pageNumber: Number,
            pageRecords: Number,
            totalRecords: Number,
            setPageNumber: Function,

        },
        methods: {
            range() {
                let numbers = [];
                this.totalPages = Math.ceil(this.totalRecords / this.pageRecords);
                if (this.totalPages < this.maxButtons) {
                    this.firstRangeNumber = 1;
                    this.lastRangeNumber = this.totalPages;
                    return this.totalPages;
                } else if (this.pageNumber <= this.maxButtons) {
                    this.firstRangeNumber = 1;
                    this.lastRangeNumber = this.maxButtons;
                    for (let i = 1; i <= this.maxButtons; i++) {
                        numbers.push(i);
                    }
                } else {
                    this.firstRangeNumber = (this.pageNumber - this.maxButtons) + 1;
                    this.lastRangeNumber = this.pageNumber;
                    for (let i = (this.pageNumber - this.maxButtons + 1); i <= this.pageNumber; i++) {
                        numbers.push(i);
                    }
                }
                return numbers;
            },
            selectCurrentPage(page) {
                if (page < 1) {
                    this.setPageNumber(1);
                    this.$emit('selectPage', 1);
                } else if (page > this.totalPages) {
                    this.setPageNumber(this.totalPages);
                    this.$emit('selectPage', this.totalPages);
                } else {
                    this.setPageNumber(page);
                    this.$emit('selectPage', page);
                }
            }
        },
        emits: ["selectPage"]
    }
</script>

<style lang="scss" scoped>
    .icon-back, .icon-next {
        background-color: $gray-bg;
        width: 40px;
        height: 40px;
        border-radius: 16px;
        background-position: center center;
        background-repeat: no-repeat;
        margin-right: 10px;
        .page-link {
            background: none !important;
            border: none !important;
            width: 40px;
            height: 40px;
            border-radius: 16px !important;
        }
    }

    .page-number {
        margin-right: 10px;
        .page-link {
            border: none !important;
            width: 40px;
            height: 40px;
            border-radius: 16px !important;
            text-align: center;
            padding-top: 9px;
            font-weight: 500;
            color: $gray-space;
        }
    }

    .page-more:hover {
        background-color: $white-primary !important;
    }

    .page-number.active .page-link {
        background-color: transparent;
        position: relative;
    }

    .page-number.active .page-link:after {
        content: "";
        width: 20px;
        height: 2px;
        position: absolute;
        bottom: 5px;
        left: 10px;
        background-color: $gray-space;
        opacity: 0.2;
    }
</style>