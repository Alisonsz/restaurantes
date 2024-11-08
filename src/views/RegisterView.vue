<template>
  <div class="register container-data">
    <Navbar  @back-step="backStep" :withBack="showNavBack" :loggedIn="3" :noData="true"/>
    <div class="row register">
        <div class="col" v-show="currentStep == 1">
            <FormResponsible @next-step="nextStep" :currentStep="currentStep" :countSteps="countSteps"/>
        </div>
        <div class="col" v-show="currentStep == 2">
            <FormCompany @next-step="nextStep" @back-step="backStep" :currentStep="currentStep" :countSteps="countSteps"/>
        </div>
        <div class="col" v-show="currentStep == 3">
            <Plan @next-step="nextStep" @back-step="backStep" :currentStep="currentStep" :countSteps="countSteps"/>
        </div>
        <div class="col" v-show="currentStep == 4">
            <Finance @next-step="nextStep" @back-step="backStep" :currentStep="currentStep" :countSteps="countSteps"/>
        </div>
        <div class="col" v-show="currentStep == 5">
            <Asaas @next-step="nextStep" @back-step="backStep" :currentStep="currentStep" :countSteps="countSteps"/>
        </div>
        <div class="col" v-show="currentStep == 6">
            <Welcome @next-step="nextStep" @back-step="backStep" :currentStep="currentStep" :countSteps="countSteps"/>
        </div>
        <div class="col" v-show="currentStep == 7">
            <Email @next-step="nextStep" @back-step="backStep" :currentStep="currentStep" :countSteps="countSteps"/>
        </div>
        <div class="col" v-show="currentStep == 8">
            <Start @next-step="nextStep" @back-step="backStep" :currentStep="currentStep" :countSteps="countSteps"/>
        </div>
    </div>
  </div>
</template>

<script>
    import Navbar from "../components/Navbar.vue";
    import FormResponsible from "../components/register/FormResponsible.vue";
    import FormCompany from "../components/register/FormCompany.vue";
    import Plan from "../components/register/Plan.vue";
    import Finance from "../components/register/Finance.vue";
    import Asaas from "../components/register/Asaas.vue";
    import Email from "../components/register/Email.vue";
    import Welcome from "../components/register/Welcome.vue";
    import Start from "../components/register/Start.vue";
    
    export default {
        name: "RegisterView",
        components: {
            Navbar,
            FormResponsible,
            FormCompany,
            Plan,
            Finance,
            Asaas,
            Email,
            Welcome,
            Start,
        },
        data() {
            return {
                showNavBack: false,
                currentStep: 1,
                countSteps: 5,
                limitSteps: 8,
            }            
        },
        methods: {
            nextStep() {
                if (this.currentStep === this.limitSteps) {
                    this.$router.push('/horario');
                }
                this.currentStep = this.currentStep +1;
                this.showNavBack = true;
            },
            backStep() {
                this.currentStep = this.currentStep -1;
                if (this.currentStep === 1) {
                    this.showNavBack = false;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container-data {
        padding-top: 100px;
        padding-bottom: 30px;
        border-radius: 0;
        min-height: 100vh !important;
        background-color: $gray-bg;
    }
</style>
