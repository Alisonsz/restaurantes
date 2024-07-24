<template>
    <div class="home container-data">
      <Navbar />
      <FormLogin />
    </div>
  </template>
  
  <script>
  import Navbar from '../components/Navbar.vue';
  import FormLogin from '../components/home/FormLogin.vue';
  
  export default {
    name: "LoginView",
    components: {
      Navbar,
      FormLogin
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .container-data {
    padding-top: 70px;
    padding-bottom: 0;
    max-width: 100%;
    background-image: url("~@/assets/img/bg6.jpg");
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  </style>
  