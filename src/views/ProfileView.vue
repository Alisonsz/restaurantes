<template>
  <div class="profile container-data" :class="completeConfig ? '' : 'with-footer'">
    <Navbar :navbarData="navbarData" />
    <Sidebar activePage="profile" />
    <div class="row">
      <div class="col-lg-6">
        <div class="row">
          <div class="col profile-image">
            <img v-if="dataCompany.cover_photo" :src="dataCompany.cover_photo ? dataCompany.cover_photo : ''" alt="Capa" @click="uploadLogo">
            <div v-else class="local-cover" @click="uploadLogo"> 
              <div class="border icon-image">
                <span class="label-image">Selecione a capa</span>
              </div>
            </div>
          </div>
          <div class="col d-flex align-items-center justify-content-center profile-logo">
            <img :src="dataCompany.logo_photo ? dataCompany.logo_photo : ''" alt="Logo" @click="uploadCover">
          </div>
        </div>
      </div>
      <div class="col-lg-6 information">
        <h3>Informações Gerais <span class="edit-data" @click="showModalCompany = true"></span></h3>
        <hr/>
        <p>
          <span class="trade">{{ dataCompany.display_name }}</span>
          <span> - {{ dataCompany.name }}</span>
        </p>
        <p>
          <span>{{ dataCompany.street }}</span>
          <span>, {{ dataCompany.number }}</span>
          <span> - {{ dataCompany.city }}</span>
          <span>/{{ dataCompany.state }}</span>
          <span> - {{ dataCompany.zip_code }}</span>
        </p>
        <p>{{ dataCompany.company_legal_number }}</p>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6">
        <div class="categories">
          <hr/>
          <h3>Categorias <span class="edit-data" @click="showModalCategories = true"></span></h3>
          <p class="hint">Atenção: As categorias poderão ser editadas somente de 20 em 20 dias.</p>
          <ul>
            <li class="input-base">{{ dataCompany.category }}</li>
          </ul>
        </div>
        <div class="preparation-time">
          <hr/>
          <h3>Tempo médio de preparo <router-link to="/preparo" class="edit-data"></router-link></h3>
          <p class="hint">Esse será o tempo médio de preparo que o estabelecimento terá para preparar o pedido.</p>
          <ul>
            <li>{{ dataCompany.preparation_time }} minutos</li>
          </ul>
        </div>
        <div class="order-types">
          <hr/>
          <h3>Formas de pedidos aceitas <span class="edit-data" @click="showModalOrderTypes = true"></span></h3>
          <p class="hint">Essas serão as formas com que o cliente poderá pedir do seu estabelecimento através do aplicativo.</p>
          <ul>
            <li class="input-base">Retirada</li>
            <li class="input-base" v-if="dataCompany.eat_on">Comer no local</li>
          </ul>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="description">
          <hr/>
          <h3>Descrição</h3>
          <textarea v-model="dataCompany.description" placeholder="Descrição do restaurante..." class="form-control"></textarea>
        </div>
        <div class="withdrawal">
          <h3>Instruções para retirada</h3>
          <textarea v-model="dataCompany.withdrawal" placeholder="Instruções para retirada..." class="form-control"></textarea>
        </div>
        <div class="opening-hours">
          <h3>Horários de funcionamento <router-link to="/horario" class="edit-data"></router-link></h3>
          <p>{{ formattedOpeningHours }}</p>
        </div>
      </div>
    </div>
  </div>
  <Footer @next-config-step="nextConfigStep" :currentConfigStep="currentConfigStep" :countConfigSteps="countConfigSteps" v-if="completeConfig === false"/>
  <Teleport to="body">
    <ModalCategories :show="showModalCategories" @close="showModalCategories = false">
      <template #header>Categoria</template>
      <template #body>
        <FormCategories @close-modal="showModalCategories = false" @save-modal="saveCategories" :category="dataCompany.category"/>
      </template>
    </ModalCategories>
    <ModalOrderTypes :show="showModalOrderTypes" @close="showModalOrderTypes = false">
      <template #header>Formas de pedidos aceitas</template>
      <template #body>
        <FormOrderTypes @close-modal="showModalOrderTypes = false" @save-modal="saveOrderTypes" :listOrderTypes="listOrderTypes" :orderTypes="dataCompany.orderTypes"/>
      </template>
    </ModalOrderTypes>
    <ModalCompany :show="showModalCompany" @close="showModalCompany = false">
      <template #header>Informações gerais</template>
      <template #body>
        <FormCompany @close-modal="showModalCompany = false" @save-modal="saveCompany" :company="dataCompany"/>
      </template>
    </ModalCompany>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

const store = useStore();

const showModalCategories = ref(false);
const showModalOrderTypes = ref(false);
const showModalCompany = ref(false);
const showModalLogo = ref(false);
const showModalCover = ref(false);

const dataCompany = reactive({
  logo_photo: null,
  cover_photo: null,
  name: "",
  display_name: "",
  company_legal_number: "",
  zip_code: "",
  street: "",
  number: "",
  city: "",
  state: "",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  withdrawal: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  opening_hours: [],
  preparation_time: 0,
  category: "",
  eat_on: false
});

const formattedOpeningHours = computed(() => {
  if (!dataCompany.opening_hours || dataCompany.opening_hours.length === 0) {
    return "Nenhum horário de funcionamento definido.";
  }

  const daysOfWeek = {
    1: "Domingo",
    2: "Segunda-feira",
    3: "Terça-feira",
    4: "Quarta-feira",
    5: "Quinta-feira",
    6: "Sexta-feira",
    7: "Sábado"
  };

  return dataCompany.opening_hours
    .sort((a, b) => a.day_of_week - b.day_of_week) // Ordena pela ordem dos dias da semana
    .map(hour => {
      return `${daysOfWeek[hour.day_of_week]}: ${hour.is_closed ? 'Fechado' : `${hour.open_time.slice(0, 5)} - ${hour.close_time.slice(0, 5)}`}`;
    })
    .join('\n');
});

async function uploadLogo() {
  try {
    const logoFile = await selectFile();
    await uploadImage(logoFile, 'logo_photo');
  } catch (error) {
    console.error('Erro ao fazer upload do logo:', error);
  }
}

async function uploadCover() {
  try {
    const coverFile = await selectFile();
    await uploadImage(coverFile, 'cover_photo');
  } catch (error) {
    console.error('Erro ao fazer upload da foto de capa:', error);
  }
}

async function selectFile() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => resolve(input.files[0]);
    input.onerror = reject;
    input.click();
  });
}

async function uploadImage(file, field) {
  try {
    const formData = new FormData();
    formData.append(field, file);

    const userResponse = await axios.get('https://api.prattuapp.com.br/api/users/me', {
      headers: {
        'Authorization': `Bearer ${store.state.token}`
      }
    });
    const restaurantId = userResponse.data.restaurant_id;

    await axios.post(`https://api.prattuapp.com.br/api/restaurants/${restaurantId}/update-logo-cover`, formData, {
      headers: {
        'Authorization': `Bearer ${store.state.token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    // Atualiza a imagem na UI após o upload
    if (field === 'logo_photo') {
      dataCompany.logo_photo = URL.createObjectURL(file);
    } else if (field === 'cover_photo') {
      dataCompany.cover_photo = URL.createObjectURL(file);
    }

  } catch (error) {
    console.error(`Erro ao fazer upload da ${field === 'logo_photo' ? 'logo' : 'foto de capa'}:`, error);
  }
}

onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  try {
    const userResponse = await axios.get('https://api.prattuapp.com.br/api/users/me', {
      headers: {
        'Authorization': `Bearer ${store.state.token}`
      }
    });
    const restaurantId = userResponse.data.restaurant_id;

    const restaurantResponse = await axios.get(`https://api.prattuapp.com.br/api/restaurants/${restaurantId}/detailed`, {
      headers: {
        'Authorization': `Bearer ${store.state.token}`
      }
    });
    
    Object.assign(dataCompany, restaurantResponse.data);
  } catch (error) {
    console.error('Erro ao buscar dados do restaurante:', error);
  }
}
</script>

<script>
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import Footer from "../components/Footer.vue";
import FormCategories from "../components/profile/FormCategories.vue";
import FormOrderTypes from "../components/profile/FormOrderTypes.vue";
import FormCompany from "../components/profile/FormCompany.vue";

export default {
  name: "ProfileView",
  data() {
    return {
      completeConfig: this.$store.state.completeConfig,
      currentConfigStep: 3,
      countConfigSteps: 5,
      sidebarData: {
        logo: "/img/logo1.png",
        company: "TATÁ Sushi",
        address: "R. João Cachoeira, 278",
        active: "profile",
        message: "Configure os menus abaixo para começar a receber pedidos!",
        open: true,
        links: {
          profile: { complete: true },
          menu: { complete: false },
          hours: { complete: false },
          preparation: { complete: false },
          config: { complete: false }
        }
      },
      navbarData: {}
    }            
  },
  components: {
    Navbar,
    Sidebar,
    Footer,
    FormCategories,
    FormOrderTypes,
    FormCompany,
  },
  methods: {
    showModalLogo() {
      this.showModalCompany = true;
    },
    showModalCover() {
      this.showModalCompany = true;
    },
    saveCategories(data) {
      this.dataCompany.category = data;
    },
    saveOrderTypes(data) {
      this.dataCompany.eat_on = data.includes('dinein');
    },
    saveCompany(data) {
      this.dataCompany = data;
    },
    nextConfigStep() {
      this.$router.push('/cardapio');
    }
  }
};
</script>
<style lang="scss" scoped>
.profile-logo {
  text-align: center;
  max-width: 150px;
  img {
    max-width: 100px;
    height: 100px;
    border-radius: 50%;
    cursor: pointer;
    object-fit: cover;
  }
}
.profile-image img {
  max-width: 100%;
  cursor: pointer;
}
.description textarea, .withdrawal textarea {
  width: 100%;
  height: 150px;
  resize: none;
  padding: 10px;
}
.information {
  .trade {
    font-weight: 500;
  }
  p, span {
    font-size: 16px;
  }
}
.opening-hours {
  white-space: pre;
}
.categories ul, .preparation-time ul, .order-types ul {
  padding-left: 0;
  li {
    list-style-type: none;
    display: inline-block;            
    margin-right: 15px;
  }
  .input-base {
    border-radius: 18px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
  li.input-base, li span.input-base {
    background-color: $light-blue;
  }
  li span.input-base {
    display: inline-block; 
    margin-left: 5px; 
  }
  li.inactive {
    background-color: $gray-bg;
  }
}
.local-cover {
  background-color: $gray-bg;
  padding: 15px;
  .border {
    width: 100%;
    min-height: 150px;
    background-color: red;
  }
}

.icon-image {
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center bottom;
}

.label-image {
  
}
</style>
