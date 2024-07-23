<template>
    <div class="hours container-data" :class="completeConfig ? '' : 'with-footer'">
      <Navbar :navbarData="navbarData" />
      <Sidebar :sidebarData="sidebarData" />
      <h3 class="bold-600">Horário de funcionamento</h3>
      <hr />
      <div class="row header-hours">
        <div class="col"><label class="bold-500">Dia da semana</label></div>
        <div class="day"><label class="bold-500">Abre</label></div>
        <div class="day"><label class="bold-500">Fecha</label></div>
        <div class="action"></div>
      </div>
      <div class="list-days" v-for="(day, indexDay) in weekdays" :key="indexDay">
        <div class="row item-day" v-for="(hour, indexHour) in dataHour[indexDay]" :key="indexHour">
          <div class="col text"><span>{{ day }}</span></div>
          <div class="day">
            <select class="form-select" v-model="hour.open" @change="changeDay(indexDay, indexHour, 'open')">
              <option value="closed">Fechado</option>
              <option v-for="(hourOption, i) in hours" :key="i">{{ hourOption }}</option>
            </select>
          </div>
          <div class="day">
            <select class="form-select" v-model="hour.close" @change="changeDay(indexDay, indexHour, 'close')">
              <option value="closed">Fechado</option>
              <option v-for="(hourOption, i) in hours" :key="i">{{ hourOption }}</option>
            </select>
          </div>
          <div class="action">
            <span class="add-item add-right add-on" role="button" @click="addDay(indexDay)" v-if="indexHour === 0"></span>
            <span class="add-item add-right icon-remove" role="button" @click="removeDay(indexDay, indexHour)" v-if="indexHour > 0"></span>
          </div>
        </div>
      </div>
      <Footer @next-config-step="nextConfigStep" :currentConfigStep="currentConfigStep" :countConfigSteps="countConfigSteps" v-if="completeConfig === false" />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { mapState } from 'vuex';
  import Navbar from "../components/Navbar.vue";
  import Sidebar from "../components/Sidebar.vue";
  import Footer from "../components/Footer.vue";
  
  export default {
    name: "HoursView",
    data() {
      return {
        completeConfig: false,
        currentConfigStep: 3,
        countConfigSteps: 5,
        hours: [
          "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", 
          "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",  
          "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", 
          "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
        ],
        weekdays: {
          1: "Domingo",
          2: "Segunda-feira",
          3: "Terça-feira",
          4: "Quarta-feira",
          5: "Quinta-feira",
          6: "Sexta-feira",
          7: "Sábado"
        },
        dataHour: {},
        sidebarData: {
          logo: "/img/logo1.png",
          company: "TATÁ Sushi",
          address: "R. João Cachoeira, 278",
          active: "hours",
          message: "Configure os menus abaixo para começar a receber pedidos!",
          open: true,
          links: {
            profile: { complete: true },
            menu: { complete: true },
            hours: { complete: false },
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
      async fetchRestaurantId() {
        try {
          const response = await axios.get('https://api.prattuapp.com.br/api/users/me', {
            headers: {
              'Authorization': `Bearer ${this.token}`
            }
          });
          const userData = response.data;
          return userData.restaurant_id;
        } catch (error) {
          console.error('Erro ao buscar o ID do restaurante:', error);
          throw error;  // Rethrow the error to handle it in fetchData
        }
      },
      async fetchOpeningHours(restaurantId) {
        try {
          const response = await axios.get(`https://api.prattuapp.com.br/api/restaurants/${restaurantId}/opening-hours`, {
            headers: {
              'Authorization': `Bearer ${this.token}`
            }
          });
          const openingHours = response.data;
          this.initializeDataHour(openingHours);
        } catch (error) {
          console.error('Erro ao buscar os horários de funcionamento:', error);
          throw error;  // Rethrow the error to handle it in fetchData
        }
      },
      initializeDataHour(openingHours) {
        this.dataHour = {};
        Object.keys(this.weekdays).forEach(dayOfWeek => {
          const hoursForDay = openingHours.filter(hour => hour.day_of_week == dayOfWeek);
          if (hoursForDay.length === 0) {
            this.dataHour[dayOfWeek] = [{ open: "closed", close: "closed", is_closed: true }];
          } else {
            this.dataHour[dayOfWeek] = hoursForDay.map(hour => ({
              open: hour.is_closed ? "closed" : hour.open_time.slice(0, 5),
              close: hour.is_closed ? "closed" : hour.close_time.slice(0, 5),
              id: hour.id,
              is_closed: hour.is_closed
            }));
          }
        });
      },
      addDay(index) {
        this.dataHour[index].push({ open: "00:00", close: "00:00" });
      },
      removeDay(indexDay, indexHour) {
        this.dataHour[indexDay].splice(indexHour, 1);
      },
      async changeDay(indexDay, indexHour, type) {
        const hourData = this.dataHour[indexDay][indexHour];
        if (hourData.open === "closed" || hourData.close === "closed") {
          hourData.is_closed = true;
          hourData.open_time = null;
          hourData.close_time = null;
        } else {
          hourData.is_closed = false;
          hourData.open_time = hourData.open;
          hourData.close_time = hourData.close;
        }
  
        if (hourData.id) {
          await this.updateOpeningHour(hourData.id, {
            restaurant_id: this.restaurantId,
            day_of_week: indexDay,
            open_time: hourData.open_time,
            close_time: hourData.close_time,
            is_closed: hourData.is_closed
          });
        } else {
          const newHourData = await this.createOpeningHour({
            restaurant_id: this.restaurantId,
            day_of_week: indexDay,
            open_time: hourData.open_time,
            close_time: hourData.close_time,
            is_closed: hourData.is_closed
          });
          hourData.id = newHourData.id;
        }
      },
      async createOpeningHour(data) {
        try {
          const response = await axios.post('https://api.prattuapp.com.br/api/opening-hours', data, {
            headers: {
              'Authorization': `Bearer ${this.token}`
            }
          });
          return response.data;
        } catch (error) {
          console.error('Erro ao criar horário de funcionamento:', error);
          throw error;  // Rethrow the error to notify the changeDay method
        }
      },
      async updateOpeningHour(id, data) {
        try {
          const response = await axios.put(`https://api.prattuapp.com.br/api/opening-hours/${id}`, data, {
            headers: {
              'Authorization': `Bearer ${this.token}`
            }
          });
          return response.data;
        } catch (error) {
          console.error('Erro ao atualizar horário de funcionamento:', error);
          throw error;  // Rethrow the error to notify the changeDay method
        }
      },
      async fetchData() {
        try {
          this.restaurantId = await this.fetchRestaurantId();
          await this.fetchOpeningHours(this.restaurantId);
        } catch (error) {
          console.error('Erro ao buscar dados iniciais:', error);
        }
      },
      nextConfigStep() {
        this.$router.push('/preparo');
      }
    },
    async created() {
      await this.fetchData();
    },
    components: {
      Navbar,
      Sidebar,
      Footer
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .header-hours {
    padding-left: 0;
    padding-right: 0;
    margin-left: 0;
    margin-right: 0;
    .day {
      padding-left: 0;
    }
  }
  .header-hours .col {
    padding-left: 0;
    margin-left: 0;
  }
  .hours.container-data .list-days {
    border: 1px solid $gray-line;
    margin: 7px 0 7px 0;
    border-radius: 5px; 
    padding: 0 25px !important;
    position: relative;
  }
  .hours.container-data .item-day {
    border-top: 1px solid $gray-line;
    padding: 10px 0;
  }
  .hours.container-data .item-day:first-child {
    border-top: none;        
  }
  .hours.container-data .day {
    width: 150px !important;
  }
  .hours.container-data .action {
    width: 40px !important;
  }
  .hours.container-data .text {
    padding-left: 0 !important;
    margin-left: 0 !important;
  }
  .hours.container-data .text span {
    position: relative;
    top: 10px;
  }
  .hours.container-data .action span {
    position: relative;
    top: 12px;
  }
  .hours.container-data .text span,
  .hours.container-data .day select {
    font-size: 15px
  }
  .accordion-button:not(.collapsed) {
    background-color: transparent;
    border: none !important;
    color: $black-secondary;
    box-shadow: none;
  }
  .accordion-header {
    position: relative;
    font-size: 16px;
    height: 70px;
    font-weight: 400;
    padding-top: 13px;
    padding-left: 16px;
  }
  .accordion-header .title p {
    padding-bottom: 0;
    margin-bottom: 0;
  }
  .accordion-header .row {
    width: calc(100% - 30px);
  }
  .accordion-header .move {
    margin-right: -35px;
  }
  .accordion-button {
    position: absolute;
    top: 0;
    right: 3px;
    width: 40px;
    height: 70px !important;
    padding-left: 8px;
    background-color: transparent;
  }
  .accordion-body {
    padding-top: 0;
  }
  .item-actions .dropdown {
    position: absolute;
    right: 0;
    top: 0;
  }
  .item-actions .dropdown-toggle::after {
    display: none;
  }
  .item-actions .dropdown li:first-child {
    border-top: none !important;
  }
  .dropdown-menu {
    padding: 2px 15px;
  }
  .list-item .accordion-item {
    background-color: $white-primary;
  }
  #item-alternative .list-days,
  #item-holiday .list-days {
    border: none !important;  
  }
  #item-alternative .list-days .item-day,
  #item-holiday .list-days .item-day {
    border: none !important;
  }
  #item-alternative .list-days .item-day:first-child,
  #item-holiday .list-days .item-day:first-child {
    border-top: 1px solid $gray-line !important;
  }
  .icon-trash {
    width: 30px;
    height: 30px;
    display: inline-block;
    left: 10px;
    margin-bottom: -9px;
  }
  </style>
  