<template>
  <div class="container-form">
    <div class="row register">
      <div class="col-lg-6"></div>
      <div class="col-lg-6">
        <form>
          <div class="form-data">
            <h2 class="bold-700">Olá!</h2>
            <h2 class="bold-700">Estamos felizes em ter você aqui :)</h2>
            <hr>
            <h3 class="form-label bold-700">Criar conta</h3>
            <input type="text" class="form-control mt-2" v-model="accountData.name" placeholder="Nome completo">
            <p class="mb-0 required-alert" v-show="invalid.name">*Campo obrigatório, insira nome e sobrenome</p>
            <input type="email" class="form-control mt-2" v-model="accountData.email" placeholder="E-mail">
            <p class="mb-0 required-alert" v-show="invalid.email">*Campo obrigatório, insira um email válido</p>
            <input type="tel" class="form-control mt-2" v-model="accountData.phone" @input="formatPhone" placeholder="Celular">
            <p class="mb-0 required-alert" v-show="invalid.phone">*Campo obrigatório, insira um telefone válido</p>
            <input type="password" class="form-control mt-2" v-model="accountData.password" placeholder="Senha">
            <p class="mb-0 required-alert" v-show="invalid.password">*Campo obrigatório</p>
            <input type="password" class="form-control mt-2" v-model="confirmPassword" placeholder="Confirme a senha">
            <p class="mb-0 required-alert" v-show="invalidConfirmPassword">*As senhas devem ser iguais</p>
            <div class="form-checkx mt-2">
              <input class="form-check-input ml-1" type="checkbox" id="termsAndConditions" v-model="termsAndConditions">
              <label class="form-check-label" for="termsAndConditions">Li e concordo com os <a href="#">termos e condições</a></label>
            </div>
            <p class="mb-0 required-alert" v-show="invalidTermsAndConditions">*É preciso aceitar os termos e condições</p>
            <div class="d-grid mt-4">
              <button @click.prevent="save()" type="submit" class="btn btn-save">Criar conta</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';

export default {
  name: "FormRegister",
  data() {
    return {
      confirmPassword: "",
      invalidConfirmPassword: false,
      termsAndConditions: false,
      invalidTermsAndConditions: false,
      invalid: {
        name: false,
        email: false,
        phone: false,
        password: false
      },
      accountData: {
        name: "",
        email: "",
        phone: "",
        password: ""
      }
    };
  },
  methods: {
    ...mapActions(['saveToken']),
    formatPhone(event) {
      const input = event.target.value.replace(/\D/g, '');
      const formatted = input.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
      this.accountData.phone = formatted;
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

      // Validação do Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.email || !emailPattern.test(data.email)) {
        this.invalid.email = true;
        isvalid = false;
      } else {
        this.invalid.email = false;
      }

      // Validação do Telefone
      const phonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;
      if (!data.phone || !phonePattern.test(data.phone)) {
        this.invalid.phone = true;
        isvalid = false;
      } else {
        this.invalid.phone = false;
      }

      // Validação da Senha
      if (!data.password) {
        this.invalid.password = true;
        isvalid = false;
      } else {
        this.invalid.password = false;
      }

      return isvalid;
    },
    async save() {
      if (this.valid(this.accountData)) {
        if (this.accountData.password !== this.confirmPassword) {
          this.invalidConfirmPassword = true;
        } else {
          this.invalidConfirmPassword = false;
          if (!this.termsAndConditions) {
            this.invalidTermsAndConditions = true;
          } else {
            this.invalidTermsAndConditions = false;

            try {
              const response = await axios.post('https://api.prattuapp.com.br/api/register-site', this.accountData);
              const token = response.data.token;

              // Salvar o token no Vuex store
              this.saveToken(token);

              // Redirecionar para a página de cadastro
              this.$router.push({ name: 'register' });
            } catch (error) {
              console.error('Erro ao registrar o usuário:', error);
            }
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container-form {
  height: max-content;
  min-height: calc(100vh - 70px);
  margin: auto;
  padding: 0;
  border-radius: 0;
}
.container-form form {
  min-height: calc(100vh - 70px);
  padding: 20px 0;
  display: grid;
  place-items: center;
}
.container-form .form-data {
  padding: 40px 30px;
  border-radius: 16px;
  background-color: $gray-bg;
  min-width: 470px;
}
.container-form input {
  background-color: $white-primary !important;
}
.container-form input[type='checkbox'] {
  border-radius: 3px !important;
  height: 18px !important;
}
.container-form input[type='checkbox']:checked {
  background-color: $light-green !important;
}
.container-form h2 {
  font-size: 22px;
}
.container-form h3 {
  font-size: 18px;
  margin-bottom: 15px;
}
hr {
  margin: 20px 0;
}
.mt-2 {
  margin-top: 12px !important;
}
.btn-save {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.btn-save:hover {
  background-color: #45a049;
}
.required-alert {
  color: red;
  font-size: 12px;
}
</style>
