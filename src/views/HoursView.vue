<template>
  <div class="hours container-data" :class="completeConfig ? '' : 'with-footer'">
    <Navbar :navbarData="navbarData" />
    <Sidebar activePage="hours" />
    <h3 class="bold-600">Horário de funcionamento</h3>
    <hr />
    <div class="row header-hours">
      <div class="col"><label class="bold-500">Dia da semana</label></div>
      <div class="day"><label class="bold-500">Abre</label></div>
      <div class="day"><label class="bold-500">Fecha</label></div>
      <div class="action"></div>
    </div>
    <div class="list-days" v-for="(hours, dayOfWeek) in dataHour" :key="dayOfWeek">
      <div class="row item-day" v-for="(hour, index) in hours" :key="index">
        <div class="col text"><span>{{ weekdays[dayOfWeek] }}</span></div>
        <div class="day">
          <select class="form-select" v-model="hour.open" @change="changeDay(dayOfWeek, index, 'open')">
            <option value="closed">Fechado</option>
            <option v-for="(hourOption, i) in hoursOptions" :key="i">{{ hourOption }}</option>
          </select>
        </div>
        <div class="day">
          <select class="form-select" v-model="hour.close" @change="changeDay(dayOfWeek, index, 'close')">
            <option value="closed">Fechado</option>
            <option v-for="(hourOption, i) in hoursOptions" :key="i">{{ hourOption }}</option>
          </select>
        </div>
        <div class="action">
          <span class="add-item add-right add-on" role="button" @click="addDay(dayOfWeek)" v-if="index === 0"></span>
          <span class="add-item add-right icon-remove" role="button" @click="removeDay(dayOfWeek, index)" v-if="index > 0"></span>
        </div>
      </div>
    </div>
    <Footer @next-config-step="nextConfigStep" :currentConfigStep="currentConfigStep" :countConfigSteps="countConfigSteps" :completeStep="verifyCompleteStep()" v-if="!completeConfig" />
  </div>
</template>

<script>
import axios from 'axios';
import { mapState, mapActions } from 'vuex';
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import Footer from "../components/Footer.vue";

export default {
  name: "HoursView",
  data() {
    return {
      completeConfig: this.$store.state.completeConfig,
      currentConfigStep: 1,
      countConfigSteps: 5,
      completeStep: true,
      hoursOptions: [
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
      navbarData: {},
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
      restaurantId: null,
    };
  },
  computed: {
    ...mapState(['token']),
  },
  methods: {
    ...mapActions(['saveCompleteStep']),
    async fetchRestaurantId() {
      try {
        const response = await axios.get('https://api.prattuapp.com.br/api/users/me', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        return response.data.restaurant_id;
      } catch (error) {
        console.error('Erro ao buscar o ID do restaurante:', error);
        throw error;
      }
    },
    async fetchOpeningHours(restaurantId) {
      try {
        const response = await axios.get(`https://api.prattuapp.com.br/api/restaurants/${restaurantId}/opening-hours`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.initializeDataHour(response.data);
      } catch (error) {
        console.error('Erro ao buscar os horários de funcionamento:', error);
        throw error;
      }
    },
    
    verifyCompleteStep() {
      this.saveCompleteStep('hours');
      return this.completeStep = Object.values(this.dataHour).every(day =>
        day.every(hour => hour.id !== null && hour.open && hour.close)
      );
    },
    initializeDataHour(openingHours) {
      this.dataHour = {};
      openingHours.forEach(hour => {
        const dayOfWeek = hour.day_of_week;
        if (!this.dataHour[dayOfWeek]) {
          this.dataHour[dayOfWeek] = [];
        }
        this.dataHour[dayOfWeek].push({
          open: !hour.id ? "" :(hour.is_closed ? "closed" : hour.open_time.slice(0, 5)),
          close: !hour.id ? "" :(hour.is_closed ? "closed" : hour.close_time.slice(0, 5)),
          id: hour.id,
          is_closed: hour.is_closed
        });
      });
    },
    async changeDay(dayOfWeek, index, type) {
      const hourData = this.dataHour[dayOfWeek][index];
      if (hourData.open === "closed" || hourData.close === "closed") {
        hourData.is_closed = true;
        hourData.open_time = null;
        hourData.close_time = null;
      } else {
        hourData.is_closed = false;
        hourData.open_time = hourData.open;
        hourData.close_time = hourData.close;
      }

      try {
        if (hourData.id) {
          await this.updateOpeningHour(hourData.id, {
            restaurant_id: this.restaurantId,
            day_of_week: dayOfWeek,
            open_time: hourData.open_time,
            close_time: hourData.close_time,
            is_closed: hourData.is_closed
          });
        } else {
          const newHourData = await this.createOpeningHour({
            restaurant_id: this.restaurantId,
            day_of_week: dayOfWeek,
            open_time: hourData.open_time,
            close_time: hourData.close_time,
            is_closed: hourData.is_closed
          });
          hourData.id = newHourData.id;
        }
      } catch (error) {
        console.error('Erro ao atualizar horário de funcionamento:', error);
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
        throw error;
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
        throw error;
      }
    },
    addDay(dayOfWeek) {
      if (!this.dataHour[dayOfWeek]) {
        this.dataHour[dayOfWeek] = [];
      }
      this.dataHour[dayOfWeek].push({ open: "00:00", close: "00:00" });
    },
    removeDay(dayOfWeek, index) {
      this.dataHour[dayOfWeek].splice(index, 1);
    },
    nextConfigStep() {
      this.$router.push('/preparo');
    },
    async fetchData() {
      try {
        this.restaurantId = await this.fetchRestaurantId();
        await this.fetchOpeningHours(this.restaurantId);
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
      }
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
