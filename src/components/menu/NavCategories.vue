<template>
  <div>
    <div class="row mb-3 mt-3">
      <div class="col-6"></div>
      <div class="col-6 create-new text-end">
        <button @click="addNewCategory" type="button" class="btn btn-green new-category">
          <span class="add-item add-inline add-black ml-1"></span> Adicionar categoria
        </button>
      </div>
    </div>
    <div class="pb-4">
      <div class="row mt-4 mb-0">
        <div class="col-6">
          <p class="bold-500 mb-0 pb-0">Nome da categoria</p>
        </div>
        <div class="col-6 create-new text-end">
          <p class="bold-500 mb-0 pb-0">Cardápios</p>
        </div>
      </div>
      <div v-if="allCategories.length === 0">
        <hr>
        <p class="mt-4">Você ainda não adicionou nenhuma categoria ao seu cardápio. Comece agora para atrair cada vez mais clientes!</p>
      </div>
      <div class="table-data" v-for="(category, index) in allCategories" :key="index">
        <hr>
        <div class="row mt-4 mb-0">
          <div class="col-6">
            <p class="mb-0 pb-0">{{ category.name }}</p>
          </div>
          <div class="col-6 create-new text-end">
            <span class="mb-0 pb-0 btn-round input-base" v-for="(menu, i) in category.menus" :key="i">{{ menu.name }}</span>
            <button class="btn btn-round edit-button input-base" @click="editCategory(index)">
              <span class="edit-data"></span>
              <span class="text">Editar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <ModalFormCategory :show="showModalFormCategory" @close="resetForm">
        <template #header>Editar Categoria</template>
        <template #body>
          <FormCategory
            @close-modal="resetForm"
            @save-category="saveCategory"
            :dataMenu="allMenus"
            :selectedCategory="selectedCategory"
          />
        </template>
      </ModalFormCategory>
    </Teleport>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import FormCategory from "./FormCategory2.vue";
import ModalFormCategory from "../ModalBase.vue";

export default {
  name: "NavCategories",
  components: {
    FormCategory,
    ModalFormCategory,
  },
  data() {
    return {
      showModalFormCategory: false,
      selectedCategory: null, // Objeto da categoria selecionada
    };
  },
  computed: {
    ...mapState(['menus']),
    allCategories() {
      // Use um objeto para armazenar categorias únicas por ID
      const categoryMap = {};

      // Itera sobre os menus para gerar a lista de categorias
      this.menus.forEach(menu => {
        menu.categories.forEach(category => {
          if (!categoryMap[category.id]) {
            // Adiciona a categoria se ainda não existe no objeto
            categoryMap[category.id] = {
              id: category.id,
              name: category.name,
              menus: this.menus
                .filter(m => m.categories.some(cat => cat.id === category.id))
                .map(m => ({ id: m.id, name: m.name })),
            };
          }
        });
      });

      // Converte o objeto de categorias únicas de volta para um array
      const uniqueCategories = Object.values(categoryMap);

      // Ordena as categorias por ID, do mais recente para o mais antigo
      return uniqueCategories.sort((a, b) => b.id - a.id);
    },
    allMenus() {
      return this.menus.map(menu => ({
        name: menu.name,
        id: menu.id
      }));
    }
  },
  methods: {
    saveCategory(categoryData) {
      if (categoryData && categoryData.categoryName && categoryData.selectedMenu) {
        let menuIndex = this.menus.findIndex(menu => menu.id === categoryData.selectedMenu.id);
        if (menuIndex !== -1) {
          let categoryIndex = this.menus[menuIndex].categories.findIndex(cat => cat.name.toLowerCase() === categoryData.categoryName.trim().toLowerCase());
          if (categoryIndex === -1) {
            this.menus[menuIndex].categories.push({
              id: Date.now(),
              name: categoryData.categoryName.trim(),
              items: []
            });
          }
        }
      }
      this.resetForm(); // Reseta o formulário após salvar a categoria
    },
    editCategory(index) {
      this.selectedCategory = this.allCategories[index];
      this.showModalFormCategory = true;
    },
    resetForm() {
      this.selectedCategory = null; // Reseta o objeto selectedCategory
      this.showModalFormCategory = false; // Fecha o modal
    },
    addNewCategory() {
      this.resetForm(); // Reseta antes de abrir o modal para adicionar
      this.showModalFormCategory = true;
    }
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

  margin-left: 10px;

  white-space: nowrap;
}
.edit-button{
  margin-left: 5px;

}

</style>
