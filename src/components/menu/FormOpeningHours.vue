<template>
  <div class="container-data">
    <form @submit.prevent="save">
      <div>
        <div class="d-grid gap-2 mb-4">
          <label class="form-label bold-500 mb-0">Selecione um cardápio</label>
          <select class="form-select" v-model="openingData.selectedMenu" @change="fetchAvailableHours">
            <option value="">Selecione um cardápio</option>
            <option v-for="menu in menus" :key="menu.id" :value="menu.id">{{ menu.name }}</option>
          </select>
          <label class="form-label bold-500 mt-2 mb-0">Cardápio sempre disponível?</label>
          <label class="switch-yn mt-0">
            <input type="checkbox" v-model="openingData.alwaysAvailable" @change="toggleAlwaysAvailable">
            <span class="slider round"></span>
          </label>
          <div v-show="!openingData.alwaysAvailable">
            <label class="form-label bold-500 mt-2 mb-0">Dias da semana</label>
            <div class="mb-2">
              <label class="weekday ml-1" v-for="(day, index) in openingData.weekday" :key="index">
                <input type="checkbox" v-model="day.active">
                <span class="checkmark">{{ day.day }}</span>
              </label>
            </div>
            <label class="form-label bold-500 mt-2 mb-2">Horários</label>
            <div class="select-time">
              <select class="form-select" v-model="openingData.startHour">
                <option v-for="hour in hours" :key="hour">{{ hour }}</option>
              </select>
              <span>às</span>
              <select class="form-select" v-model="openingData.endHour">
                <option v-for="hour in hours" :key="hour">{{ hour }}</option>
              </select>
            </div>
          </div>
        </div>
        <div v-if="message.text" :class="['alert', message.type === 'error' ? 'alert-danger' : 'alert-success']">
          {{ message.text }}
        </div>
        <div class="row">
          <div class="col-lg-6 d-grid gap-2">
            <button @click="$emit('closeModal')" type="button" class="btn btn-cancel">Cancelar</button>
          </div>
          <div class="col-lg-6 d-grid gap-2">
            <button type="submit" class="btn btn-save">Salvar</button>
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
  name: "FormOpeningHours",
  props: {
    selectedMenuIndex: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      hours: [
        "00h", "01h", "02h", "03h", "04h", "05h",
        "06h", "07h", "08h", "09h", "10h", "11h",
        "12h", "13h", "14h", "15h", "16h", "17h",
        "18h", "19h", "20h", "21h", "22h", "23h"
      ],
      openingData: {
        selectedMenu: "",
        alwaysAvailable: false,
        weekday: [
          { day: "D", active: false },
          { day: "S", active: false },
          { day: "T", active: false },
          { day: "Q", active: false },
          { day: "Q", active: false },
          { day: "S", active: false },
          { day: "S", active: false }
        ],
        startHour: "00h",
        endHour: "23h"
      },
      message: {
        text: '',
        type: ''
      }
    }
  },
  computed: {
    ...mapState({
      token: state => state.token,
      restaurantId: state => state.restaurantId,
      menus: state => state.menus
    })
  },
  methods: {
    async fetchAvailableHours() {
      if (!this.openingData.selectedMenu) return;

      try {
        const response = await axios.get(
          `https://api.prattuapp.com.br/api/menu/${this.openingData.selectedMenu}/opening-hours`,
          {
            headers: { Authorization: `Bearer ${this.token}` }
          }
        );
        this.updateWeekdays(response.data.opening_hours);
      } catch (error) {
        const errorMessage = 'Erro ao buscar horários disponíveis.';
        console.log(errorMessage);
        this.message = {
          text: errorMessage,
          type: 'error'
        };
      }
    },
    updateWeekdays(openingHours) {
      this.openingData.weekday.forEach((day, index) => {
        const hours = openingHours.find(hour => hour.day_of_week === index + 1);
        if (hours) {
          day.active = true;
          this.openingData.startHour = hours.open_time.slice(0, 2) + 'h';
          this.openingData.endHour = hours.close_time.slice(0, 2) + 'h';
        } else {
          day.active = false;
        }
      });
    },
    toggleAlwaysAvailable() {
      if (this.openingData.alwaysAvailable) {
        this.openingData.weekday.forEach(day => {
          day.active = true;
        });
        this.openingData.startHour = "00h";
        this.openingData.endHour = "23h";
      }
    },
    async save() {
      try {
        const selectedDays = this.openingData.weekday
          .map((day, index) => day.active ? index + 1 : null)
          .filter(day => day !== null);

        // O array `selectedDays` pode ser vazio, o que resultará na exclusão dos horários
        await axios.post(
          `https://api.prattuapp.com.br/api/menu/${this.openingData.selectedMenu}/opening-hours`,
          {
            day_of_week: selectedDays,
            open_time: this.openingData.startHour.replace('h', ':00'),
            close_time: this.openingData.endHour.replace('h', ':00'),
            is_closed: false,
            allows_schedule: true
          },
          {
            headers: { Authorization: `Bearer ${this.token}` }
          }
        );

        const successMessage = 'Horários de funcionamento do cardápio criados ou atualizados com sucesso.';
        console.log(successMessage);
        this.message = {
          text: successMessage,
          type: 'success'
        };

        await this.$store.dispatch('fetchMenusAndItems');
        this.$emit('saveOpeningHours', this.openingData);
        this.$emit('closeModal');
      } catch (error) {
        const apiErrorMessage = error.response?.data?.errors?.error?.[0] || 'Erro ao salvar horários de funcionamento.';
        console.log(apiErrorMessage);
        this.message = {
          text: apiErrorMessage,
          type: 'error'
        };
      }
    }
  },
  mounted() {
    if (this.menus.length > 0) {
      this.openingData.selectedMenu = this.menus[this.selectedMenuIndex].id;
      this.fetchAvailableHours();
    }
  }
};
</script>


<style lang="scss" scoped>
  .modal-body .container-data {
    max-width: 450px !important;
    padding: 0 !important;
  }

  .modal-container {
    min-width: 350px !important;
  }

  .select-time {
    select {
      width: 90px;
      display: inline-block;
    }
    span {
      margin-left: 15px;
      margin-right: 15px;
    }
  }
</style>
