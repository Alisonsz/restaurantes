<template>
    <div class="preparation" :class="completeConfig ? '' : 'with-footer'">
      <Navbar :navbarData="navbarData" /><Sidebar :sidebarData="sidebarData" />
      <h2 class="bold-700 title">Tempo de preparo</h2>
      <div class="container-data">
        <label class="bold-500">Tempo médio padrão</label>
        <p class="mb-0 mt-0">Esse será o tempo que o estabelecimento terá para preparar os pedidos e o tempo que aparecerá ao consumidor no aplicativo.</p>
        <div class="row">
          <div class="col form-time">
            <button class="btn btn-minus" @click="changeTime('general', 'minus')"><span class="add-item add-right add-minus"></span></button>
            <input type="number" class="form-control mt-3 text" placeholder="Ex. 20 min" v-model.number="timeNumber.general.time">
            <button class="btn btn-plus" @click="changeTime('general', 'plus')"><span class="add-item add-right add-plus"></span></button>
            <button class="btn btn-save" :class="timeNumber.general.time === '' ? 'inactive' : ''" @click="saveGeneralTime(timeNumber.general)">Salvar</button>
          </div>
        </div>
        <p class="mb-0 mt-2 required-alert" v-show="invalid.general">*Campo obrigatório</p>
        <p class="mt-2 required-alert">Recomendamos não colocar um tempo de preparo longo, uma vez que isso pode fazer com que os consumidores desistam da compra.</p>
        <p v-if="dataTime.general !== ''">Tempo definido: {{ dataTime.general.time }} minutos <span class="add-item icon-trash" role="button" @click="removeGeneralTime()"></span></p>
        <hr>
            <div class="list-item accordion mt-3">
                <label class="bold-500 mt-2">Tempo médio específico</label>
                <p class="mb-0 mt-0">Tempo que o estabelecimento terá para preparar os pedidos em determinados dias e horários da semana. Esse tempo aparecerá para  o consumidor no aplicativo.</p>
                <div class="row">
                    <div class="col form-time">
                        <button class="btn btn-minus" @click="changeTime('special', 'minus')"><span class="add-item add-right add-minus"></span></button>
                        <input type="text" class="form-control mt-3 text" placeholder="Ex. 20 min" v-model="timeNumber.special.time">
                        <button class="btn btn-plus" @click="changeTime('special', 'plus')"><span class="add-item add-right add-plus"></span></button>
                        <button class="btn btn-save" 
                            :class="timeNumber.special.number <= 0 || timeNumber.special.day === '' || timeNumber.special.open === '' || timeNumber.special.close === '' ? 'inactive' : ''" 
                            @click="saveSpecialTime(timeNumber.special)">
                            Salvar
                        </button>
                    </div>
                </div>
                <div class="list-days mb-3" >
                    <div class="row item-day">
                        <div class="day">
                            <label for="special-day" v-if="timeNumber.special.day === ''">Dia da semana</label>
                            <select class="form-select" v-model="timeNumber.special.day" id="special-day">
                                <option  v-for="(day, i) in weekdays" :key="i" :value="i">{{ day }}</option>
                            </select>
                        </div>
                        <div class="day">
                            <label for="special-open" v-if="timeNumber.special.open === ''">Hora inicial</label>
                            <select class="form-select" v-model="timeNumber.special.open" id="special-open">
                                <option  v-for="(hour, i) in hours" :key="i">{{ hour }}</option>
                            </select>
                        </div>
                        <div class="day">
                            <label for="special-close" v-if="timeNumber.special.close === ''">Hora final</label>
                            <select class="form-select" v-model="timeNumber.special.close" id="special-close">
                                <option  v-for="(hour, i) in hours" :key="i">{{ hour }}</option>
                            </select>
                        </div>
                    </div>
                    <p class="mb-1 mt-1 required-alert" v-show="invalid.special">*Preencha todos os campos</p>
                </div>
                <p class="mb-0 mt-2 list-special" v-for="(time, index) in dataTime.special" :key="index">
                    <span v-if="time">
                        {{ time.day }}: {{ time.time }}, das {{ time.open }} às {{ time.close }}
                        <span class="add-item icon-trash" role="button" @click="removeSpecialTime(index)"></span>
                    </span>
                </p>
            </div>
        </div>
    </div>
    <Footer @next-config-step="nextConfigStep" :currentConfigStep="currentConfigStep" :countConfigSteps="countConfigSteps" v-if="completeConfig === false"/>
</template>

<script>
import axios from 'axios';
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import Footer from "../components/Footer.vue";
import { mapState } from 'vuex';

export default {
  name: "PreparationView",
  data() {
    return {
      completeConfig: false,
      currentConfigStep: 4,
      countConfigSteps: 5,
      weekdays: {
        1: "Domingo",
        2: "Segunda-feira",
        3: "Terça-feira",
        4: "Quarta-feira",
        5: "Quinta-feira",
        6: "Sexta-feira",
        7: "Sábado"
      },
      hours: [
        "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", 
        "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",  
        "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", 
        "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
      ],
      invalid: {
        general: false,
        special: false
      },
      timeNumber: {
        general: { number: 0, time: 0 },
        special: { number: 0, time: "", day: "", open: "", close: "" }
      },
      dataTime: {
        general: "",
        special: []
      },
      sidebarData: {
        logo: "/img/logo1.png",
        company: "TATÁ Sushi",
        address: "R. João Cachoeira, 278",
        active: "preparation",
        message: "Configure os menus abaixo para começar a receber pedidos!",
        open: true,
        links: {
          profile: { complete: true },
          menu: { complete: true },
          hours: { complete: true },
          preparation: { complete: false },
          config: { complete: false }
        }
      },
      navbarData: {}
    };
  },
  computed: {
    ...mapState(['token'])
  },
  methods: {
    async fetchRestaurantData() {
      try {
        // Obtém o ID do restaurante a partir dos dados do usuário
        const userResponse = await axios.get('https://api.prattuapp.com.br/api/users/me', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        const restaurantId = userResponse.data.restaurant_id;

        // Log para verificar o ID do restaurante e o token
        console.log('Restaurant ID:', restaurantId);
        console.log('Token:', this.token);

        // Faz a requisição para obter os dados do restaurante
        const restaurantResponse = await axios.get(`https://api.prattuapp.com.br/api/restaurants/${restaurantId}/detailed`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });

        this.restaurantId = restaurantId;
        const preparationTime = restaurantResponse.data.preparation_time;
        this.timeNumber.general.time = preparationTime; // Inicializar com o valor em minutos
      } catch (error) {
        console.error('Erro ao buscar dados do restaurante:', error);
      }
    },
    async saveGeneralTime(time) {
      if (time.time > 0) {
        try {
          // Converta o valor para string para replicar o comportamento do PHP cURL
          const preparationTime = time.time.toString();
          
          // Verifique a estrutura dos dados que estão sendo enviados
          console.log('Saving Preparation Time:', preparationTime);

          await axios.post(`https://api.prattuapp.com.br/api/restaurants/${this.restaurantId}?_method=PUT`, {
            preparation_time: preparationTime
          }, {
            headers: {
              'Authorization': `Bearer ${this.token}`
            }
          });
          this.dataTime.general = time;
          this.invalid.general = false;
          this.timeNumber.general = { number: 0, time: 0 };
        } catch (error) {
          console.error('Erro ao salvar tempo de preparação:', error);

          // Verifique se há mensagens de erro específicas na resposta
          if (error.response && error.response.data) {
            console.error('Erro detalhado:', error.response.data);
          }
        }
      } else {
        this.invalid.general = true;
      }
    },
    changeTime(field, operation) {
      if (operation === 'plus') {
        this.timeNumber[field].time += 1;
      } else if (operation === 'minus') {
        this.timeNumber[field].time -= 1;
        if (this.timeNumber[field].time < 0) {
          this.timeNumber[field].time = 0;
        }
      }
    },
    removeGeneralTime() {
      this.dataTime.general = "";
      this.timeNumber.general.time = 0;
    },
    nextConfigStep() {
      this.$router.push('/configuracoes');
    }
  },
  async created() {
    await this.fetchRestaurantData();
  },
  components: {
    Navbar,
    Sidebar,
    Footer
  }
};
</script>
<style lang="scss" scoped>
    h2.title {
        font-size: 23px;
        margin-bottom: 25px;
    }
    .container-data {
        min-height: calc(100vh - 190px);
    }
    .with-footer .container-data {
        min-height: calc(100vh - 260px);
    }
    .form-time {
        .btn-minus,.text,.btn-plus,.btn-plus {
            display: inline-block !important;
            margin-right: 10px;
        }
        .btn-minus,.btn-plus {
            border: 1px solid $gray-line;
            padding-top: 0;
        }
        .btn-save {
            margin-left: 10px;
            width: 100px;
            border-radius: 24px !important;
        }
        .btn-save.inactive {
            background-color: $gray-line !important;
        }
        .text {
            width: 350px;
            position: relative;
            top: 2px;
        }
    }
    .list-days {
        margin-top: 20px;
        .day {
            width: 200px;
            position: relative;
            label {
                position: absolute;
                pointer-events: none;
                color: $gray-primary;
                top: 7px;
                left: 25px;
            }
        }
    }
    .icon-trash {
        width: 30px;
        height: 24px !important;
        position: relative;
        display: inline-block;
    }
    .icon-trash {
        width: 30px;
        height: 30px;
        display: inline-block;
        margin-bottom: -2px;
    }
</style>