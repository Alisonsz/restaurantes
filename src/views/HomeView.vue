<template>
  <div class="home container-data">
    <Navbar />
    <FormRegister  @save-account="saveAccount"/>
  </div>
</template>

<script>
    import Navbar from "../components/Navbar.vue";
    import FormRegister from "../components/home/FormRegister.vue";
    
    export default {
        name: "ProfileView",
        components: {
            Navbar,
            FormRegister
        },
        methods: {
            saveAccount() {
                this.$router.push('/cadastro');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container-data {
        padding-top: 70px;
        padding-bottom: 0;
        max-width: 100%;
        background-image: url("~@/assets/img/bg5.jpg");
        background-position: center center;
        background-size: cover;
        background-repeat: no-repeat;
        
    }
</style>