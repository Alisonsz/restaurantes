<template>
    <header class="navbar sticky-top flex-md-nowrap p-0 shadow" :class="(typeof withSidebar === 'boolean' && withSidebar? 'with-sidebar' : '')" data-bs-theme="dark">
        <div class="row content">
            <div class="col">
                <a class="navbar-brand icon-arrow-left" href="#" v-if="(typeof withBack === 'boolean' && withBack)" @click.prevent="backStep()"></a>
            </div>
            <div class="col text-center">
                <img src="~@/assets/img/logo_principal.png" class="logo">
            </div>
            <div class="col p-0 text-end">
                <a class="navbar-brand icon-bell" href="#" v-if="typeof notifications === 'number'">
                    <span class="badge" v-if="notifications > 0">{{ notifications }}</span>
                </a>
                <a class="navbar-brand open-time input-base btn-round bg-light-blue no-hover" href="#" v-if="typeof time === 'string'">
                    <span class="text">Aberto à</span> <span class="time">{{ time }}</span>
                </a>
            </div>
        </div>
    </header>   
</template>

<script>
    export default {
        name: "Navbar",
        data() {
            return {
                time: null,
                notifications: null
            } 
        },
        props: {
            navbarData: Object,
            withSidebar: Boolean,
            withBack: Boolean
        },
        methods: {
            backStep() {
                this.$emit('backStep');
            }
        },
        created() {
            if (typeof this.navbarData === 'object') {
                if (typeof this.navbarData.time === 'string') {
                    this.time = this.navbarData.time;
                }
                if (typeof this.navbarData.notifications === 'number') {
                    this.notifications = this.navbarData.notifications;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .navbar {
        height: 70px;
        background-color: $black-secondary;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
    }
    .navbar.with-sidebar {
        padding-left: 72px !important;
    }
    .navbar .content {
        width: 100%;
    }
    .navbar .icon-arrow-left {
        margin-left: 20px;
        margin-top: 6px;
        text-align: center;
        width: 30px;
        height: 30px;
        background-size: 16px 16px;
        background-repeat: no-repeat;
        background-position: center center;
        display: block;
    }
    .navbar .icon-bell {
        width: 30px;
        height: 30px;
        background-size: 23px 23px;
        background-repeat: no-repeat;
        background-position: center center;
        display: inline-block;
        position: relative;
        margin-top: 5px;
    }
    .navbar .icon-bell .badge {
        font-size: 12px;
        color: $black-primary;
        background-color: $light-blue;
        width: 17px;
        height: 17px;
        padding: 2px 3px 1px 1px;
        line-height: 1;
        text-align: center;
        border-radius: 50%;
        font-weight: 500;
        position: absolute;
        top: 0;
        right: -4px;
    }
    .navbar .open-time {
        position: relative;
        top: -10px;
    }
    .navbar .open-time .text {
        font-weight: normal;
    }
    .navbar .logo {
        height: 35px;
        margin-top: 3px;
    }
</style>