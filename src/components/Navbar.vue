<template>
    <header class="navbar sticky-top flex-md-nowrap p-0 shadow" :class="(typeof withSidebar === 'boolean' && withSidebar? 'with-sidebar' : '')" data-bs-theme="dark">
        <div class="row content">
            <div class="col">
                <a class="navbar-brand icon-arrow-left" href="#" v-if="(typeof withBack === 'boolean' && withBack)" @click.prevent="backStep()"></a>
            </div>
            <div class="col text-center">
                <img src="~@/assets/img/logo_principal.png" class="logo">
            </div>
            <div class="col p-0 text-end" v-if="noData">
                <router-link v-if="loggedIn === 1" class="navbar-brand input-base btn-round no-hover login" to="/login">
                    <span class="text">Já tem conta?</span> <span class="time bold-500">Entrar</span>
                </router-link>
                <router-link v-if="loggedIn === 2" class="navbar-brand input-base btn-round no-hover login" to="/">
                    <span class="text">Não tem conta?</span> <span class="time bold-500">Cadastrar</span>
                </router-link>
            </div>
            <div class="col p-0 text-end" v-if="!noData">
                <a class="navbar-brand icon-bell" href="#" v-if="typeof navbarData?.notifications === 'number'">
                    <span class="badge" v-if="navbarData?.notifications > 0">{{ navbarData?.notifications }}</span>
                </a>
                <a class="navbar-brand open-time input-base btn-round no-hover" href="#" v-if="navbarData?.time" :class="navbarData?.open ? 'open' : 'close'">
                    <span class="text">{{ navbarData?.open ? 'Aberto' : 'Fechado' }}: </span> 
                    <span class="time bold-500">{{ navbarData?.open ? '' : 'reabre às' }} {{ navbarData?.time }}</span>
                </a>
                <a v-if="navbarData?.open && navbarData.preparation" class="navbar-brand open-time input-base btn-round no-hover preparation-data" :class="'preparation-'+navbarData.preparationStatus">
                    <span class="text">Preparo: </span> 
                    <span class="time bold-500">
                        <span class="preparation-icon" :class="'icon-'+navbarData.preparationStatus"></span>
                        {{ navbarData.preparation }}
                    </span>
                </a>
            </div>
        </div>
    </header>   
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: "Navbar",
    props: {
        withSidebar: Boolean,
        withBack: Boolean,
        noData: Boolean,
        loggedIn: Boolean
    },
    computed: {
        ...mapState(['navbarData']),
    },
    methods: {
        backStep() {
            this.$emit('backStep');
        }
    }
};
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
        background-color: $light-green;
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
    .open-time.open {
        background-color: $light-green;
    }
    .open-time.close {
        background-color: $red-primary;
    }
    .navbar .open-time .text {
        font-weight: normal;
    }
    .navbar .logo {
        height: 35px;
        margin-top: 3px;
    }
    .preparation-data {
        background-color: $white-primary;
    }
    .preparation-default .time {
        color: $light-green;
    }
    .preparation-paused .time {
        color: $red-primary;
    }
    .preparation-adjusted .time {
        color: $blue-secondary;
    }

    .preparation-icon {
        width: 15px;
        height: 15px;
        display: inline-block;
        position: relative;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 14px 14px;
        margin-bottom: -3px;
    }
    .login {
        background-color: $light-green;
        position: relative;
        top: 5px;
        cursor: pointer;
    }
</style>