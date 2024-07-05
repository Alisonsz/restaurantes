<template>
    <div class="config container-data" :class="completeConfig ? '' : 'with-footer'">
        <Navbar :navbarData="navbarData" /><Sidebar :sidebarData="sidebarData"  />
        <h3 class="bold-600">Configurações</h3>
    </div>
    <Footer @next-config-step="showModalCongratulations = true" :currentConfigStep="currentConfigStep" :countConfigSteps="countConfigSteps" v-if="completeConfig === false"/>
    <Teleport to="body">
        <ModalCongratulations :show="showModalCongratulations" @close="showModalCongratulations = false">
            <template #header>Parabéns!</template>
            <template #body>
                <Congratulations @close="showModalCongratulations= false" @finish-config="finishConfig"/>
            </template>
        </ModalCongratulations>
    </Teleport>
</template>

<script setup>
    import { ref } from 'vue';
    
    import ModalCongratulations from "../components/ModalBase.vue";
    const showModalCongratulations = ref(false);
</script>

<script>
    import Navbar from "../components/Navbar.vue";
    import Sidebar from "../components/Sidebar.vue";
    import Footer from "../components/Footer.vue";
    import Congratulations from "../components/config/Congratulations.vue";

    export default {
        name: "ConfigView",
        data() {
            return {
                completeConfig: false,
                currentConfigStep: 5,
                countConfigSteps: 5,
                sidebarData: {
                    logo: "/img/logo1.png",
                    company: "TATÁ Sushi",
                    address: "R. João Cachoeira, 278",
                    active: "config",
                    message: "Configure os menus abaixo para começar a receber pedidos!",
                    open: true,
                    links: {
                        profile: { complete: true },
                        menu: { complete: true },
                        hours: { complete: true },
                        preparation: { complete: true },
                        config: { complete: false }
                    }
                },
                navbarData: {
                    /*
                    time: "9 horas",
                    notifications: 4
                    */
                }
            }            
        },
        components: {
            Navbar,
            Sidebar,
            Footer,
            Congratulations
        },
        methods: {
            finishConfig() {
                this.completeConfig = true;
                delete this.sidebarData.links;
            }
        }
    }
</script>