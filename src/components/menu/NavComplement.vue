<template>
  <div>
    <div class="row mb-3 mt-3">
      <!-- Busca e ordenação -->
      <div class="col-4">
        <div class="input-group mb-3 item-filter">
          <input
            type="text"
            class="form-control input-form"
            placeholder="Buscar complemento"
            v-model="complementTerm"
          />
          <span class="input-group-text input-form" id="basic-addon1">
            <span class="add-item add-inline icon-search"></span>
          </span>
        </div>
      </div>
      <div class="col-4">
        <select
          class="form-select item-order input-form"
          v-model="orderBy"
          @change="orderList"
        >
          <option value="">Organizar por</option>
          <option value="name">Nome</option>
        </select>
      </div>
      <div class="col-4 create-new text-end">
        <button
          @click="toggleModal(true)"
          type="button"
          class="btn btn-green new-category"
        >
          <span class="add-item add-inline add-black ml-1"></span> Criar complemento
        </button>
      </div>
    </div>
    <div class="pb-4">
      <table class="table mt-3">
        <thead>
          <tr>
            <th scope="col"><span class="bold-500">Nome do complemento</span></th>
            <th scope="col"><span class="bold-500">Itens utilizados</span></th>
            <th scope="col"><span class="bold-500">Status</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(complement, index) in searchComplements" :key="index">
            <td class="bold-400">{{ complement.name }}</td>
            <td class="used-items">
              <span v-for="(item, i) in complement.items" :key="i" class="ml-1">{{ item.name }}</span>
            </td>
            <td class="item-actions">
              <label class="switch ml-1">
                <input
                  type="checkbox"
                  v-model="complement.is_available"
                 
                  @change="toggleStatus(index, $event)"

                />
                <span class="slider round"></span>
              </label>
              <button
                class="btn btn-round input-base edit-button"
                @click="editComplement(index)"
              >
                <span class="edit-data"></span>
                <span class="text">Editar</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="Object.keys(allComplement).length === 0">
        <p class="mt-4">
          Você ainda não adicionou nenhum complemento ao seu cardápio. Comece agora para atrair cada vez mais clientes!
        </p>
      </div>
    </div>
    <Teleport to="body">
      <ModalFormComplement :show="showModalFormComplement" @close="toggleModal(false)">
        <template #header>Adicionar complemento</template>
        <template #body>
          <FormComplement
            @close-modal="toggleModal(false)"
            @save-complement="saveComplement"
            :complementEditData="complementEditData"
          />
        </template>
      </ModalFormComplement>
    </Teleport>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import ModalFormComplement from "../ModalBase.vue";
import FormComplement from './FormComplement.vue';

export default {
  name: 'NavComplement',
  components: {
    ModalFormComplement,
    FormComplement,
  },
  data() {
    return {
      showModalFormComplement: false,
      allComplement: [],
      complementEditData: {}, // Objeto para armazenar os dados de edição
      complementTerm: '',
      orderBy: '',
      complementList: [],
      loadingToggles: [],
    };
  },
  computed: {
    ...mapState({
      token: (state) => state.token,
      restaurantId: (state) => state.restaurantId,
    }),
    searchComplements() {
      if (this.complementTerm === '') {
        return this.complementList;
      }
      return this.complementList.filter((complement) =>
        complement.name.toLowerCase().includes(this.complementTerm.toLowerCase())
      );
    },
  },
  methods: {
    async fetchComponents() {
      try {
        const response = await axios.get(
          `https://api.prattuapp.com.br/api/components?restaurant_id=${this.restaurantId}`, 
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );
        this.allComplement = response.data.data;
        this.complementList = [...this.allComplement]; // Inicializa a lista de complementos
      } catch (error) {
        console.error('Erro ao buscar os componentes:', error);
      }
    },
    saveComplement(complementData) {
      if (typeof complementData === 'object') {
        const index = this.complementList.findIndex(comp => comp.id === complementData.id);
        if (index !== -1) {
          // Atualiza o complemento existente diretamente
          this.complementList[index] = { ...complementData };
        } else {
          // Adiciona um novo complemento
          this.complementList.push(complementData);
        }
      }
      this.complementEditData = {};
      this.toggleModal(false); // Fecha o modal após salvar
    },
    selectItem(index) {
      const selectedComplement = this.allComplement[index];

      // Preencha todos os campos do formulário com os dados do complemento selecionado
      this.complementEditData = {
        ...selectedComplement,
        items: selectedComplement.items.map(item => ({
          ...item,
          price: item.extravalue || 0, // Usa `extravalue` como preço ou 0 se não houver
        })),
        selectOne: selectedComplement.min_selections === 1, // Define se o campo de seleção obrigatória deve estar marcado
        selectNumber: selectedComplement.max_selections,
        selectMore: selectedComplement.max_item_select > 1, // Marca se o usuário pode selecionar mais de uma vez
        moreNumber: selectedComplement.max_item_select,
      };

      // Debugging: Verifique se os dados estão sendo corretamente setados
      console.log('Complemento selecionado para edição:', this.complementEditData);
    },
    orderList() {
      switch (this.orderBy) {
        case 'name':
          this.complementList = this.complementList.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
          break;
        case 'nameasc':
          this.complementList = this.complementList.sort((a, b) => {
            return b.name.localeCompare(a.name);
          });
          break;
      }
    },
    toggleModal(state, resetData = true) {
      if (resetData) {
        this.complementEditData = {}; // Reseta os dados ao abrir o modal para adicionar novo complemento
      }
      this.showModalFormComplement = state;

      // Se o modal foi fechado, atualize os complementos
      if (!state) {
        this.fetchComponents();
      }
    },
    editComplement(index) {
      this.selectItem(index); // Seleciona os dados para edição
      this.toggleModal(true, false); // Abre o modal e não reseta os dados (false)
    },
    async toggleStatus(index, event) {
  // Marcar o estado de carregamento como verdadeiro
  this.loadingToggles[index] = true;

  try {
    const complement = this.complementList[index];
    const newStatus = event.target.checked; // Pega o valor diretamente do evento

    // Enviar uma requisição POST para atualizar o status no backend
    const response = await axios.post(
      `https://api.prattuapp.com.br/api/components/${complement.id}/toggle`,
      { is_available: newStatus }, 
      {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Se a requisição for bem-sucedida, atualize o status localmente
    if (response.status === 200) {
      this.complementList[index].is_available = newStatus; // Atualiza o status apenas após a resposta
    } else {
      // Reverte o estado do checkbox em caso de erro
      event.target.checked = !newStatus;
    }
  } catch (error) {
    console.error("Error updating status:", error.response ? error.response.data : error.message);

    // Reverte o estado do checkbox em caso de erro
    event.target.checked = !newStatus;
  } finally {
    // Remover o estado de carregamento
    this.loadingToggles[index] = false;
  }
}


,
  },
  created() {
    this.fetchComponents(); // Chama a função para buscar os componentes na criação do componente
  },
};
</script>


<style lang="scss" scoped>
.create-new {
    text-align: right;
    .new-menu {
        border: 1px solid $gray-line;
        margin-right: 20px;
    }
    button {
        padding-left: 20px;
        padding-right: 20px;
    }
}

.table-data .input-base {
    background-color: $light-blue;
    margin-left: 10px;
    padding-top: 9px !important;
    padding-bottom: 9px !important;
    white-space: nowrap;
}

.item-actions {
    width: 240px;
}

.item-filter {
    .form-control {
        border-radius: 9px 0 0 9px !important;
    }
    .input-group-text {
        border-radius: 0 9px 9px 0 !important;
    }
    .icon-search {
        margin-top: -5px;
    }
}

.table thead span {
    display: block;
    padding-bottom: 10px;
} 

.table tbody td {
    vertical-align: middle;
    padding-top: 15px;
    padding-bottom: 15px;
} 

.table tbody td .switch {
    top: -3px !important;
} 

.used-items {
    padding-right: 50px !important;
}

.used-items span {
    border-right: 1px solid $gray-line;
    padding-right: 10px
}

.used-items span:last-child {
    border-right: none;
}
</style>
