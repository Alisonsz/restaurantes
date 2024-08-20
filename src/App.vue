<template>
    <div class="container-fluid">
      <div class="row">
        <main class="col-12 px-md-4 container-view">
          <router-view />
        </main>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    name: 'App',
    created() {
      this.preloadData();
    },
    methods: {
      ...mapActions(['preloadData'])
    }
  };
  </script>
  
  <style lang="scss">
  body {
      background-color: $gray-bg;
  }
  </style>
  