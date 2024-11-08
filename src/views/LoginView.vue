<template>
  <div class="home container-data">
    <Navbar :noData="true" :loggedIn="2"/>
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
max-width: 100%;
background-image: url("~@/assets/img/bglogin.jpg");
background-position: left top;
background-size: cover;
background-repeat: no-repeat;
border-radius: 0;
margin-top: 22px;
}
</style>
