<template>
  <div class="container-form">
    <form>
      <h2 class="text-center bold-700">Informações do responsável</h2>
      <p class="text-center mb-4 bold-400">Etapa {{ currentStep }} de {{ countSteps }}</p>
      <div class="form-data">
        <input type="text" class="form-control mt-3" v-model="accountData.name" placeholder="Nome completo">
        <p class="mb-0 required-alert" v-show="invalid.name">*Campo obrigatório</p>
        <input type="tel" class="form-control mt-3" v-model="accountData.identificationCode" @input="formatCpf" placeholder="CPF">
        <p class="mb-0 required-alert" v-show="invalid.identificationCode">{{ invalidMessages.identificationCode }}</p>
        <div class="d-grid mt-4">
          <button @click.prevent="save()" type="submit" class="btn btn-save">Próximo</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapState } from 'vuex';

export default {
  name: "FormRegister",
  data() {
    return {
      invalidMessages: {
        identificationCode: "*Campo obrigatório"
      },
      invalid: {
        name: false,
        identificationCode: false
      },
      accountData: {
        name: "",
        identificationCode: ""
      }
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
    ...mapActions(['checkTokenValidity']),
    async fetchUserData() {
      try {
        await this.checkTokenValidity();
        const response = await axios.get('https://api.prattuapp.com.br/api/users/me', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        const userData = response.data;
        this.accountData.name = userData.name;
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    },
    formatCpf(event) {
      const input = event.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
      const formatted = input.replace(/(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
      this.accountData.identificationCode = formatted;
      this.validateCpf(formatted);
    },
    validateCpf(cpf) {
      const cleanCpf = cpf.replace(/[^\d]+/g, '');
      if (cleanCpf.length !== 11) {
        this.invalid.identificationCode = false,
        this.invalidMessages.identificationCode = '*Campo obrigatório';
        return false;
      }
      if (this.calculateDigits(cleanCpf)) {
        this.invalid.identificationCode = false,
        this.invalidMessages.identificationCode = '*Campo obrigatório';
        return true;
      } else {
        this.invalid.identificationCode = true,
        this.invalidMessages.identificationCode = 'O CPF inserido é inválido. Por favor, revise as informações e tente novamente';
        return false;
      }
    },
    calculateDigits(cpf) {
      const cleanCpf = cpf.replace(/\D/g, '');
      if (cleanCpf.length !== 11 || /^(\d)\1{10}$/.test(cleanCpf)) {
        return false;
      }
      let sum = 0;
      let remainder;
      for (let i = 1; i <= 9; i++) {
        sum += parseInt(cleanCpf.charAt(i - 1)) * (11 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cleanCpf.charAt(9))) {
        return false;
      }
      sum = 0;
      for (let i = 1; i <= 10; i++) {
        sum += parseInt(cleanCpf.charAt(i - 1)) * (12 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      return remainder === parseInt(cleanCpf.charAt(10));
    },
    valid(data) {
      let isvalid = true;

      // Validação do Nome Composto
      if (!data.name || !/\s/.test(data.name.trim())) {
        this.invalid.name = true;
        isvalid = false;
      } else {
        this.invalid.name = false;
      }

      // Validação do CPF
      // const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      // if (!data.identificationCode || !cpfPattern.test(data.identificationCode)) {
      //   this.invalid.identificationCode = true;
      //   isvalid = false;
      // } else {
      //   this.invalid.identificationCode = false;
      // }

      if (this.validateCpf(data.identificationCode)) {
        this.invalid.identificationCode = false;
      } else {
        this.invalid.identificationCode = true;
        isvalid = false;
      }

      return isvalid;
    },
    async save() {
      if (this.valid(this.accountData)) {
        try {
          await axios.put('https://api.prattuapp.com.br/api/user?_method=PUT', {
            cpf: this.accountData.identificationCode
          }, {
            headers: {
              'Authorization': `Bearer ${this.token}`
            }
          });
          this.$emit('nextStep', this.currentStep);
        } catch (error) {
          if (typeof error.response.data.errors.cpf === "object") {
            this.invalid.identificationCode = true,
            this.invalidMessages.identificationCode = 'O CPF inserido já foi cadastrado em nossa base';
          }
          console.error('Erro ao atualizar dados do usuário:', error);
        }
      }
    }
  },
  created() {
    this.fetchUserData();
  },
  emits: ["nextStep"]
};
</script>
  
  <style lang="scss" scoped>
  .container-form {
    max-width: 340px;
    margin: auto;
    padding: 0;
    min-height: calc(100vh - 130px);
    display: grid;
    place-items: center;
  }
  .container-form form {
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
  .container-form h3 {
    font-size: 20px;
    margin-bottom: 15px;
  }
  .required-alert {
    color: red;
    font-size: 12px;
  }
  </style>
  