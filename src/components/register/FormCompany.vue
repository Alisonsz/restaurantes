<template>
  <div class="container-form">
    <form>
      <h2 class="text-center bold-700">Informações do estabelecimento</h2>
      <p class="text-center mb-4 bold-400">
        Etapa {{ currentStep }} de {{ countSteps }}
      </p>
      <div class="form-data">
        <div class="row">
          <div class="col">
            <input
              type="text"
              class="form-control mt-3"
              v-model="dataCompany.registrationNumber"
              placeholder="CNPJ"
              @input="formatCnpj"
            />
            <p class="mb-0 required-alert" v-show="invalid.registrationNumber">
              {{ invalidMessages.registrationNumber }}
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <input
              type="text"
              class="form-control mt-3"
              v-model="dataCompany.company"
              placeholder="Razão social"
            />
            <p class="mb-0 required-alert" v-show="invalid.company">
              *Campo obrigatório
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <input
              type="text"
              class="form-control mt-3"
              v-model="dataCompany.trade"
              placeholder="Nome da loja"
            />
            <p class="mb-0 required-alert" v-show="invalid.trade">
              *Campo obrigatório
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <input
              type="text"
              id="address"
              v-model="address"
              placeholder="Digite o endereço, cidade ou CEP"
              class="form-control mt-3"
              autocomplete="new-address"
            />
            <p class="mb-0 required-alert" v-show="invalid.address">
              O endereço fornecido parece estar incompleto. Por favor, verifique os dados e tente novamente.
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-4 input-block">
            <input
              type="text"
              class="form-control mt-3"
              v-model="dataCompany.postalCode"
              placeholder="CEP"
              readonly
            />
            <span class="icon-padlock"></span>
          </div>
          <div class="col-8 input-block">
            <input
              type="text"
              class="form-control mt-3"
              v-model="dataCompany.neighborhood"
              placeholder="Bairro"
              readonly
            />
            <span class="icon-padlock"></span>
          </div>
        </div>
        <div class="row">
          <div class="col-7 input-block">
            <input
              type="text"
              class="form-control mt-3"
              v-model="dataCompany.city"
              placeholder="Cidade"
              readonly
            />
            <span class="icon-padlock"></span>
          </div>
          <div class="col-5 input-block">
            <input
              type="text"
              class="form-control mt-3"
              v-model="dataCompany.state"
              placeholder="Estado"
              readonly
            />
            <span class="icon-padlock"></span>
          </div>
        </div>
        <div class="row">
          <div class="col-4">
            <input
              type="text"
              class="form-control mt-3"
              v-model="dataCompany.number"
              placeholder="Número"
            />
            <p class="mb-0 required-alert" v-show="invalid.number">
              *Campo obrigatório
            </p>
          </div>
          <div class="col-8">
            <input
              type="text"
              class="form-control mt-3"
              v-model="dataCompany.complement"
              placeholder="Complemento"
            />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <input
              type="text"
              class="form-control mt-3"
              v-model="dataCompany.phone"
              @input="formatPhone"
              placeholder="Telefone"
            />
            <p class="mb-0 required-alert" v-show="invalid.phone">
              *Campo obrigatório
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <select class="form-select mt-3" v-model="dataCompany.companyType">
              <option value="">Tipo de empresa</option>
              <option
                v-for="(type, index) in companyTypes"
                :key="index"
                :value="type"
              >
                {{ type }}
              </option>
            </select>
            <p class="mb-0 required-alert" v-show="invalid.companyType">
              *Campo obrigatório
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <select class="form-select mt-3" v-model="dataCompany.revenue">
              <option value="">Faturamento mensal</option>
              <option
                v-for="(revenue, index) in allRevenue"
                :key="index"
                :value="revenue"
              >
                {{ revenue }}
              </option>
            </select>
            <p class="mb-0 required-alert" v-show="invalid.revenue">
              *Campo obrigatório
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <input type="hidden" v-model="dataCompany.latitude" />
            <input type="hidden" v-model="dataCompany.longitude" />
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-6 d-grid">
            <button
              @click.prevent="cancel()"
              type="button"
              class="btn btn-cancel"
            >
              Voltar
            </button>
          </div>
          <div class="col-6 d-grid">
            <button @click.prevent="save()" type="submit" class="btn btn-save">
              Próximo
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
  
  <script>
  import axios from 'axios';
  import { mapState } from 'vuex';
  
  export default {
    name: "FormCompany",
    data() {
      return {
        companyTypes: [
          "MEI",
          "LIMITADA",
          "INDIVIDUAL"
        ],
        allRevenue: [
          "R$0 - R$10.000",
          "R$10.001 - R$100.000",
          "R$100.001 - R$500.000",
          "R$500.001 - R$1M",
          "+R$1M"
        ],
        invalidMessages: {
          registrationNumber: "*Campo obrigatório",
        },
        invalid: {
          registrationNumber: false,
          company: false,
          trade: false, 
          address: false,
          number: false,
          phone: false,
          companyType: false,
          revenue: false,
        },
        dataCompany: {
          id: null,
          registrationNumber: "",
          company: "",
          trade: "",
          postalCode: "",
          neighborhood: "",
          address: "",
          number: "",
          city: "",
          state: "",
          complement: "",
          phone: "",
          revenue: "",
          latitude: "",
          longitude: "",
          companyType: ""
        },
        address: "",
      };
    },
    props: {
      currentStep: Number,
      countSteps: Number
    },
    computed: {
      ...mapState(['token'])
    },
    methods: {
      formatPhone(event) {
        const input = event.target.value.replace(/\D/g, '');
        const formatted = input.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        this.dataCompany.phone = formatted;
      },
      valid(data) {
        let isvalid = true;
        for (const field in this.invalid) {
          if (this.invalid.hasOwnProperty(field)) {
            if (typeof data[field] === "string" && data[field] === "") {
              this.invalid[field] = true;
              isvalid = false;
            } else {
              this.invalid[field] = false;
            }
            if (field === "registrationNumber" && data[field] !== "" && !this.validateCNPJ(data[field])) {
              isvalid = false;
            }
          }
        }
        return isvalid;
      },
      formatCnpj(event) {
        const input = event.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
        const formatted = input.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5');
        this.dataCompany.registrationNumber = formatted;
        this.validateCNPJ(formatted);
      },
      validateCNPJ(cnpj) {
        const cleanedCNPJ = cnpj.replace(/[^\d]+/g, '');
        if (cleanedCNPJ.length !== 14) {
          this.invalid.registrationNumber = false,
          this.invalidMessages.registrationNumber = '*Campo obrigatório';
          return false;
        }
        if (this.calculateDigits(cleanedCNPJ)) {
          this.invalid.registrationNumber = false,
          this.invalidMessages.registrationNumber = '*Campo obrigatório';
          return true;
        } else {
          this.invalid.registrationNumber = true,
          this.invalidMessages.registrationNumber = 'O CNPJ inserido é inválido. Por favor, verifique e tente novamente';
          return false;
        }
      },
      calculateDigits(cnpj) {
        let sum1 = 0;
        let sum2 = 0;
        const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        for (let i = 0; i < 12; i++) {
          sum1 += cnpj[i] * weights1[i];
        }
        let digit1 = (sum1 % 11 < 2) ? 0 : 11 - (sum1 % 11);
        for (let i = 0; i < 12; i++) {
          sum2 += cnpj[i] * weights2[i];
        }
        sum2 += digit1 * 2;
        let digit2 = (sum2 % 11 < 2) ? 0 : 11 - (sum2 % 11);
        return cnpj[12] == digit1 && cnpj[13] == digit2;
      },
      save() {
        if (this.dataCompany.id) {
          this.$emit('nextStep', this.currentStep);
        } else {
          if (this.valid(this.dataCompany)) {
            axios.post('https://api.prattuapp.com.br/api/restaurants', {
              name: this.dataCompany.trade,
              preparation_time: "30",
              zip_code: this.dataCompany.postalCode,
              street: this.dataCompany.address,
              number: this.dataCompany.number,
              city: this.dataCompany.city,
              state: this.dataCompany.state,
              country: "Brasil",
              company_legal_number: this.dataCompany.registrationNumber,
              latitude: this.dataCompany.latitude,
              longitude: this.dataCompany.longitude,
              categories: [1, 2, 3]
            }, {
              headers: {
                'Authorization': `Bearer ${this.token}`
              }
            })
            .then(response => {
              if (response.data.id) {
                this.dataCompany.id = response.data.id;
              }
              console.log('Restaurante criado com sucesso:', response.data);
              this.$emit('nextStep', this.currentStep);
            })
            .catch(error => {
              console.error('Erro ao criar restaurante:', error);
            });
          } 
        }
      },
      cancel() {
        this.$emit('backStep');
      },
      initAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(document.getElementById('address'), {
          types: ['geocode'],
          componentRestrictions: { country: 'br' }
        });
  
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            this.updateLocation(place.geometry.location);
            this.fillAddressComponents(place.address_components);
          }
        });
      },
      updateLocation(location) {
        this.dataCompany.latitude = location.lat();
        this.dataCompany.longitude = location.lng();
      },
      fillAddressComponents(components) {
        const componentForm = {
          street_number: 'number',
          route: 'address',
          sublocality_level_1: 'neighborhood',
          locality: 'city',
          administrative_area_level_2: 'city', // Adicionado
          administrative_area_level_1: 'state',
          country: 'country',
          postal_code: 'postalCode'
        };
  
        components.forEach(component => {
          component.types.forEach(type => {
            if (componentForm[type]) {
              this.dataCompany[componentForm[type]] = component.long_name;
            }
          });
        });
      }
    },
    mounted() {
      this.initAutocomplete();
    },
    emits: ["nextStep", "backStep"]
  };
  </script>
  
  <style lang="scss" scoped>
.container-form {
  max-width: 550px;
  margin: auto;
  padding: 0;
  min-height: calc(100vh - 130px);
  display: grid;
  place-items: center;
}
.container-form form {
  min-width: 550px;
  padding: 0;
}
.form-data {
  background-color: $white-primary;
  padding: 30px;
  border-radius: 16px;
}
.container-form h2 {
  font-size: 24px;
}
.mt-3 {
  margin-top: 12px !important;
}
.required-alert {
  color: red;
  font-size: 12px;
}
.input-block {
  position: relative;
}
.icon-padlock {
  text-align: center;
  width: 30px;
  height: 30px;
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-position: center center;
  margin: auto;
  display: inline-block;
  position: absolute;
  top: 17px;
  right: 15px;
  opacity: 0.2;
}
</style>
  