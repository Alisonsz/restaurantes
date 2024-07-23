<template>
    <form @submit.prevent="saveCompany">
      <div class="mb-2">
        <label for="displayName" class="form-label">Nome do restaurante</label>
        <input type="text" class="form-control" id="displayName" v-model="dataCompany.display_name">
      </div>
      <div class="mb-2">
        <label for="name" class="form-label">Razão social</label>
        <input type="text" class="form-control" id="name" v-model="dataCompany.name">
      </div>
      <hr>
      <h3>Endereço</h3>
      <div class="row mb-2">
        <div class="col-lg-4">
          <label for="zipCode" class="form-label">CEP</label>
          <input type="text" class="form-control" id="zipCode" v-model="dataCompany.zip_code">
        </div>
        <div class="col-lg-8">
          <label for="neighborhood" class="form-label">Bairro</label>
          <input type="text" class="form-control" id="neighborhood" v-model="dataCompany.address_line2">
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-lg-8">
          <label for="street" class="form-label">Rua</label>
          <input type="text" class="form-control" id="street" v-model="dataCompany.street">
        </div>
        <div class="col-lg-4">
          <label for="number" class="form-label">Número</label>
          <input type="text" class="form-control" id="number" v-model="dataCompany.number">
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-lg-8">
          <label for="city" class="form-label">Cidade</label>
          <input type="text" class="form-control" id="city" v-model="dataCompany.city">
        </div>
        <div class="col-lg-4">
          <label for="state" class="form-label">Estado</label>
          <input type="text" class="form-control" id="state" v-model="dataCompany.state">
        </div>
      </div>
      <div class="row mt-4 mb-1">
        <div class="col-lg-6 d-grid gap-2">
          <button @click.prevent="$emit('closeModal')" type="button" class="btn btn-cancel">Cancelar</button>
        </div>
        <div class="col-lg-6 d-grid gap-2">
          <button type="submit" class="btn btn-save">Salvar</button>
        </div>
      </div>
    </form>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: "FormCompany",
    data() {
      return {
        dataCompany: {
          display_name: "",
          name: "",
          zip_code: "",
          address_line2: "",
          street: "",
          number: "",
          city: "",
          state: "",
          country: "Brasil",  // Assumindo que o país é fixo
          latitude: null,
          longitude: null
        },
        restaurantId: null
      }
    },
    methods: {
      async fetchRestaurantId() {
        try {
          const userResponse = await axios.get('https://api.prattuapp.com.br/api/users/me', {
            headers: {
              'Authorization': `Bearer ${this.$store.state.token}`
            }
          });
          this.restaurantId = userResponse.data.restaurant_id;
          await this.fetchCompanyData();
        } catch (error) {
          console.error("Erro ao buscar ID do restaurante:", error);
        }
      },
      async fetchCompanyData() {
        try {
          const response = await axios.get(`https://api.prattuapp.com.br/api/restaurants/${this.restaurantId}/detailed`, {
            headers: {
              'Authorization': `Bearer ${this.$store.state.token}`
            }
          });
          this.dataCompany = response.data;
        } catch (error) {
          console.error("Erro ao buscar dados do restaurante:", error);
        }
      },
      async saveCompany() {
        if (!this.validateCompanyData()) {
          console.error("Dados inválidos, por favor, verifique os campos.");
          return;
        }
  
        try {
          console.log("Enviando dados do restaurante:", this.dataCompany);
          await axios.post(`https://api.prattuapp.com.br/api/restaurants/${this.restaurantId}?_method=PUT`, this.dataCompany, {
            headers: {
              'Authorization': `Bearer ${this.$store.state.token}`
            }
          });
          this.$emit('saveModal', this.dataCompany);
          this.$emit('closeModal');
        } catch (error) {
          console.error("Erro ao salvar dados do restaurante:", error);
        }
      },
      validateCompanyData() {
        // Adicione aqui as validações necessárias
        const { display_name, name, zip_code, street, number, city, state } = this.dataCompany;
        return display_name && name && zip_code && street && number && city && state;
      }
    },
    mounted() {
      this.fetchRestaurantId();
    },
    emits: ["closeModal", "saveModal"]
  };
  </script>
  
  <style scoped>
  .modal-container form {
    width: 500px !important;
  }
  </style>
  
  