<template>
  <div class="container-form">
    <div class="row register">
      <div class="col-lg-6"></div>
      <div class="col-lg-6">
        <form @submit.prevent="login">
          <div class="form-data">
            <h2 class="bold-700">Olá!</h2>
            <h2 class="bold-700">Estamos felizes em ter você aqui :)</h2>
            <hr>
            <h3 class="form-label bold-700">Entrar</h3>
            <input type="text" class="form-control mt-2" v-model="loginData.login" placeholder="Login">
            <p class="mb-0 required-alert" v-show="invalid.login">*Campo obrigatório</p>
            <input type="password" class="form-control mt-2" v-model="loginData.password" placeholder="Senha">
            <p class="mb-0 required-alert" v-show="invalid.password">*Campo obrigatório</p>
            <div class="d-grid mt-4">
              <button type="submit" class="btn btn-save">Entrar</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "FormLogin",
  data() {
    return {
      loginData: {
        login: '',
        password: ''
      },
      invalid: {
        login: false,
        password: false
      }
    };
  },
  methods: {
    ...mapActions(['saveToken', 'preloadData']),

    // Função para validar os campos do formulário
    valid(data) {
      let isValid = true;
      for (const field in this.invalid) {
        if (this.invalid.hasOwnProperty(field)) {
          if (typeof data[field] === 'string' && data[field] === '') {
            this.invalid[field] = true;
            isValid = false;
          } else {
            this.invalid[field] = false;
          }
        }
      }
      return isValid;
    },

    // Função para realizar o login
    async login() {
      // Valida os dados de login antes de enviar
      if (this.valid(this.loginData)) {
        try {
          const response = await fetch('https://api.prattuapp.com.br/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.loginData)
          });

          const data = await response.json();

          // Verifica se a resposta da API foi bem-sucedida
          if (response.ok) {
            this.saveToken(data.token);  // Salva o token no Vuex
            
            // Realiza o fetch dos dados necessários após o login
            try {
              await this.preloadData(); // Carrega os dados (navbar, sidebar, etc.)
              this.$router.push('/visao'); // Redireciona após o carregamento dos dados
            } catch (error) {
              console.error('Erro ao carregar dados após login:', error);
              alert('Erro ao carregar dados. Tente novamente.');
            }
          } else {
            alert('Erro ao fazer login');
          }
        } catch (error) {
          alert('Erro ao fazer login');
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
