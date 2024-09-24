<template>
  <div class="container-data">
    <form @submit.prevent="save">
      <div class="row header">
        <div class="col-lg-6">
          <label class="form-label bold-500 title">{{ itemData.id ? "Editar produto" : "Adicionar produto" }}</label>
        </div>
        <div class="col-lg-6 status">
          <label class="switch">
            <input type="checkbox" v-model="itemData.active" />
            <span class="slider round"></span>
          </label>
        </div>
      </div>
      <hr class="hr-title" />
      <div class="row">
        <div class="col-lg-6 d-grid">
          <label class="form-label bold-500" for="name">Nome
            <span class="char-limit">50 caracteres</span>
          </label>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6 d-grid">
          <input 
            type="text" 
            class="form-control mb-2" 
            id="name" 
            v-model="itemData.name" 
            placeholder="Ex: Hamburguer"
            maxlength="50">
          <p class="mb-0 required-alert" v-show="invalid.name || itemData.name.length > 50">
            *Campo obrigatório (máximo 50 caracteres)
          </p>
        </div>
        <div class="col-lg-6">
          <div class="input-group mb-1">
            <span class="input-group-text bold-500 block-1">Preço por unidade</span>
            <span class="input-group-text block-2">R$</span>
            <input
              type="text"
              class="form-control block-3"
              placeholder="Ex. 20,00"
              v-model="formattedPrice"
              @input="formatPrice"
              @blur="parsePrice"
            >
          </div>
          <p class="mb-0 required-alert" v-show="invalid.price">*Campo obrigatório</p>
        </div>
      </div>
      <div class="row mt-1">
        <div class="col-lg-4 d-grid">
          <div class="mb-3">
            <label for="image" class="form-label bold-500">Adicionar imagem</label>
            <div class="inputfile-box">
              <input type="file" id="file" class="inputfile" accept="image/*" @change="onFileChange" ref="fileInput">
              <label for="file">
                <span class="file-box">
                  <p>{{ imageName.trim() !== '' ? imageName : "JPEG, JPG e PNG até 12MB. Resolução mínima: 325x300" }}</p>
                </span>
                <span class="file-button" v-if="itemData.image && typeof itemData.image === 'string'">
                  <img :src="itemData.image">
                  <button type="button" @click.stop.prevent="removeImage" class="btn-remove-image">X</button>
                </span>
                <span class="file-button" v-else>
                  <img src="~@/assets/img/img.svg">
                </span>
              </label>
            </div>
          </div>
        </div>
        <div class="col-lg-8 d-grid">
          <label for="description" class="bold-500">Descrição do produto
            <span class="char-limit">250 caracteres</span>
          </label>
          <div class="form-floating">
            <textarea class="form-control item-description" placeholder="Deixe um comentário aqui" id="description" v-model="itemData.description" maxlength="250"></textarea>
            <label for="description">Ex: Hamburguer de 200g com pão australiano.</label>
          </div>
          <p class="mb-0 required-alert" v-show="invalid.description">*Descrição não pode exceder 250 caracteres</p>
        </div>
      </div>

      <!-- Categoria -->
      <div class="row mt-1">
        <div class="col-lg-12 d-grid">
          <div class="accordion" id="accordionCategory">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCategory" aria-expanded="false" aria-controls="collapseCategory">
                  <span class="bold-500 ml-1">Categorias</span><span>(opcional)</span>
                </button>
              </h2>
              <div id="collapseCategory" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionCategory">
                <div class="accordion-body">
                  <span class="hint mt-0 pt-0">Selecione as categorias apropriadas para o item que você está adicionando ao seu cardápio.</span>
                  <div class="row mt-0">
                    <div class="col-lg-9 d-grid">
                      <select class="form-select" v-model="selectCategory">
                        <option value="">Selecione uma categoria</option>
                        <option v-for="(category, index) in formCategories" :key="index" :value="category">{{ category.name }}</option>
                      </select>
                    </div>
                    <div class="col-lg-3 d-grid">
                      <button @click.prevent="addCategory" type="button" class="btn btn-save" :disabled="!selectCategory">
                        <span class="add-item add-inline add-black ml-1"></span> Adicionar
                      </button>
                    </div>
                  </div>
                  <div v-if="selectedCategories.length" class="mt-4 mb-2 position-relative">
                    <span class="ml-1">Categorias selecionadas:</span>
                    <div v-for="(category, index) in selectedCategories" :key="index" class="position-relative d-inline-block">
                      <span class="btn-round input-base edit-button bold-500 ml-1">{{ category.name }}</span>
                      <button type="button" @click.stop.prevent="removeCategory(index)" class="btn-remove-category">X</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Complemento -->
      <div class="row mt-4">
        <div class="col-lg-12 d-grid">
          <div class="accordion" id="accordionComplement">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseComplement" aria-expanded="false" aria-controls="collapseComplement">
                  <span class="bold-500 ml-1">Complementos</span> <span>(opcional)</span>
                </button>
              </h2>
              <div id="collapseComplement" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionComplement">
                <div class="accordion-body">
                  <span class="hint mt-0 pt-0">Selecione os complementos apropriados para o item que você está adicionando ao seu cardápio.</span>
                  <div class="row mt-0">
                    <div class="col-lg-9 d-grid">
                      <select class="form-select" v-model="selectComplement">
                        <option value="">Adicionar complemento</option>
                        <option v-for="(complement, index) in formComplements" :key="index" :value="complement">{{ complement.name }}</option>
                      </select>
                    </div>
                    <div class="col-lg-3 d-grid">
                      <button @click.prevent="addComplement" type="button" class="btn btn-save" :disabled="!selectComplement">
                        <span class="add-item add-inline add-black ml-1"></span> Adicionar
                      </button>
                    </div>
                  </div>
                  <div v-if="selectedComplements.length" class="mt-4 mb-2">
                    <span class="ml-1">Complementos adicionados:</span>
                    <div v-for="(complement, index) in selectedComplements" :key="index" class="position-relative d-inline-block">
                      <span class="btn-round input-base edit-button bold-500 ml-1">{{ complement.name }}</span>
                      <button type="button" @click.stop.prevent="removeComplement(index)" class="btn-remove-complement">X</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <div class="row mt-4 justify-content-end">
      <div class="col-lg-2 d-grid gap-2" v-if="itemData.id">
        <button @click.prevent="deleteProduct" type="button" class="btn btn-danger">Excluir</button>
      </div>
      <div class="col-lg-2 d-grid gap-2">
        <button @click.prevent="save" type="button" class="btn btn-save">Salvar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
  props: {
    itemEditData: Object,
    selectedCategoryId: Number, // Pre-selecionar a categoria
  },
  setup(props, { emit }) {
    const store = useStore();
    const initialAvailability = ref(true);
    const itemData = ref({
      id: "",
      active: true,
      name: "",
      price: 0,
      image: "",
      description: "",
      complement: [],
    });
    const formattedPrice = ref("");
    const imageName = ref("");
    const fileInput = ref(null);
    const selectCategory = ref(""); // Armazena a categoria selecionada
    const selectComplement = ref("");
    const selectedCategories = ref([]); // Várias categorias
    const selectedComplements = ref([]);
    const invalid = ref({
      name: false,
      price: false,
      description: false,
    });
    const imageRemoved = ref(false);

    // Resetar estado para novo item
    const resetItemData = () => {
      itemData.value = {
        id: "",
        active: true,
        name: "",
        price: 0,
        image: "",
        description: "",
        complement: [],
      };
      formattedPrice.value = "";
      imageName.value = "";
      selectedCategories.value = [];
      selectedComplements.value = [];
      imageRemoved.value = false;
    };

    // Carregar os dados do produto
    const loadProductData = async (productId) => {
      try {
        const response = await axios.get(`https://api.prattuapp.com.br/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${store.state.token}` },
        });

        const product = response.data;
        itemData.value = {
          id: product.id,
          name: product.name || "",
          price: product.price || 0,
          image: product.products_photo || "",
          description: product.description || "",
          active: product.is_available,
          complement: product.components.map((comp) => comp),
        };
        formattedPrice.value = formatCurrency(product.price);
        imageName.value = product.products_photo ? product.products_photo.split('/').pop() : '';
        initialAvailability.value = product.is_available;

        selectedCategories.value = Array.isArray(product.category_product) && product.category_product.length
          ? product.category_product.map(category => category)
          : [];
        selectedComplements.value = [...itemData.value.complement];
      } catch (error) {
        console.error('Erro ao carregar os dados do produto:', error);
      }
    };

    // Watch para resetar o estado ou carregar dados ao editar/criar novo item
    watch(
      () => props.itemEditData,
      (newData) => {
        if (newData && newData.id) {
          loadProductData(newData.id);
        } else {
          resetItemData();  // Reseta o estado ao criar novo
        }
      },
      { immediate: true }
    );

    // Pre-seleciona a categoria passada pela prop no dropdown
    watch(
      () => props.selectedCategoryId,
      (newCategoryId) => {
        if (newCategoryId) {
          selectCategory.value = newCategoryId;
          const category = store.state.formCategories.find(category => category.id === newCategoryId);
          if (category && !selectedCategories.value.includes(category)) {
            selectedCategories.value.push(category);
          }
        }
      },
      { immediate: true }
    );

    onMounted(() => {
      if (props.itemEditData && props.itemEditData.id) {
        loadProductData(props.itemEditData.id);
      }
    });

    // Formatação de preço
    const formatCurrency = (value) => {
      return parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const parsePrice = () => {
      const parsedValue = formattedPrice.value.replace(/\./g, '').replace(',', '.');
      const parsedFloat = parseFloat(parsedValue);
      itemData.value.price = isNaN(parsedFloat) ? 0 : parsedFloat;
    };

    const formatPrice = () => {
      const rawValue = formattedPrice.value.replace(/\D/g, '');
      const value = rawValue ? rawValue / 100 : 0;
      formattedPrice.value = formatCurrency(value);
    };

    // Funções de imagem
    const onFileChange = (e) => {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      createImage(files[0]);
    };

    const createImage = (file) => {
      imageName.value = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        itemData.value.image = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    const removeImage = () => {
      imageRemoved.value = true;
      itemData.value.image = null;
      imageName.value = "";
    };

    // Funções para categorias e complementos
    const addCategory = () => {
      if (selectCategory.value && !selectedCategories.value.includes(selectCategory.value)) {
        selectedCategories.value.push(selectCategory.value);
      }
    };

    const addComplement = () => {
      if (selectComplement.value && !selectedComplements.value.includes(selectComplement.value)) {
        selectedComplements.value.push(selectComplement.value);
      }
    };

    const removeCategory = (index) => {
      const categoryToRemove = selectedCategories.value[index];

      if (itemData.value.id && categoryToRemove) {
        axios.delete(`https://api.prattuapp.com.br/api/products/${itemData.value.id}/remove-categories`, {
          data: {
            restaurant_id: store.state.restaurantId,
            category_ids: [categoryToRemove.id],
          },
          headers: {
            Authorization: `Bearer ${store.state.token}`,
          },
        })
        .then(() => {
          selectedCategories.value.splice(index, 1);  // Atualiza o estado local
        })
        .catch((error) => {
          console.error('Erro ao remover a categoria:', error);
        });
      } else {
        // Se for um item novo e não salvo ainda, apenas remove localmente
        selectedCategories.value.splice(index, 1);
      }
    };

    const removeComplement = (index) => {
      selectedComplements.value.splice(index, 1);
    };

    // Validação de formulário
    const valid = (data) => {
      let isValid = true;
      invalid.value.name = !data.name;
      invalid.value.price = data.price === null || data.price === undefined || isNaN(data.price);
      invalid.value.description = data.description && data.description.length > 250;
      isValid = !invalid.value.name && !invalid.value.price && !invalid.value.description;
      return isValid;
    };

    // Salvar o produto
    const save = async () => {
      if (!valid(itemData.value)) return;

      const formData = new FormData();
      formData.append('name', itemData.value.name);
      formData.append('price', itemData.value.price);
      formData.append('description', itemData.value.description);
      formData.append('restaurant_id', store.state.restaurantId);
      formData.append('is_available', itemData.value.active ? 1 : 0);

      if (fileInput.value && fileInput.value.files && fileInput.value.files.length > 0) {
        formData.append('products_photo', fileInput.value.files[0]);
      }

      try {
        let response;
        if (itemData.value.id) {
          response = await axios.post(
            `https://api.prattuapp.com.br/api/restaurants/products/update/${itemData.value.id}`,
            formData,
            { headers: { Authorization: `Bearer ${store.state.token}`, 'Content-Type': 'multipart/form-data' } }
          );
        } else {
          response = await axios.post(
            'https://api.prattuapp.com.br/api/restaurants/products/create',
            formData,
            { headers: { Authorization: `Bearer ${store.state.token}`, 'Content-Type': 'multipart/form-data' } }
          );
          itemData.value.id = response.data.id;
        }

        if (imageRemoved.value && itemData.value.id) {
          await axios.delete(`https://api.prattuapp.com.br/api/products/${itemData.value.id}/remove-photo`, {
            headers: { Authorization: `Bearer ${store.state.token}` },
          });
        }

        // Associa categoria e complementos
        await associateCategory();
        await associateComplement();

        if (initialAvailability.value !== itemData.value.active) {
          await axios.patch(
            `https://api.prattuapp.com.br/api/products/${itemData.value.id}/availability`,
            { is_available: itemData.value.active },
            { headers: { Authorization: `Bearer ${store.state.token}`, 'Content-Type': 'application/json' } }
          );
        }

        store.dispatch('fetchMenusAndItems');
        emit('close-modal');
      } catch (error) {
        console.error('Erro ao salvar o produto:', error);
      }
    };

    const associateCategory = async () => {
      if (selectedCategories.value.length && itemData.value.id) {
        try {
          const categoryIds = selectedCategories.value.map(category => category.id);
          await axios.post(
            `https://api.prattuapp.com.br/api/category/add-product`,
            { product_id: itemData.value.id, categories: categoryIds },
            { headers: { Authorization: `Bearer ${store.state.token}` } }
          );
        } catch (error) {
          console.error('Erro ao associar categorias:', error);
        }
      }
    };

    const associateComplement = async () => {
      if (selectedComplements.value.length && itemData.value.id) {
        try {
          for (const complement of selectedComplements.value) {
            await axios.post(
              `https://api.prattuapp.com.br/api/components/${complement.id}/products/${itemData.value.id}/associate`,
              { restaurant_id: store.state.restaurantId },
              { headers: { Authorization: `Bearer ${store.state.token}`, 'Content-Type': 'application/json' } }
            );
          }
        } catch (error) {
          console.error('Erro ao associar complementos:', error);
        }
      }
    };

    const deleteProduct = async () => {
      try {
        await axios.delete(`https://api.prattuapp.com.br/api/products/${itemData.value.id}`, {
          headers: { Authorization: `Bearer ${store.state.token}` },
        });
        store.dispatch('fetchMenusAndItems');
        emit('close-modal');
      } catch (error) {
        console.error('Erro ao excluir o produto:', error);
      }
    };

    const closeModal = () => {
      emit('close-modal');
    };

    return {
      itemData,
      formattedPrice,
      imageName,
      fileInput,
      selectCategory,
      selectComplement,
      selectedCategories,
      selectedComplements,
      invalid,
      onFileChange,
      addCategory,
      addComplement,
      removeCategory,
      removeComplement,
      associateCategory,
      associateComplement,
      save,
      deleteProduct,
      closeModal,
      formatCurrency,
      parsePrice,
      formatPrice,
      removeImage,
    };
  },
  computed: {
    formCategories() {
      return this.$store.state.formCategories;
    },
    formComplements() {
      return this.$store.state.formComplements;
    },
  },
};
</script>



<style scoped lang="scss">
/* Estilos copiados do formulário 2 para manter a consistência */
.modal-body .container-data {
  min-width: 900px;
  padding: 0 !important;
}

.header {
  .title {
    margin-top: 10px;
  }
  .status label {
    margin-top: 5px;
    float: right;
  }
}

.hr-title {
  margin-top: 15px;
}

.input-group {
  .block-1 {
    border-color: $gray-line;
    padding-top: 8px;
    background-color: $white-primary;
  }
  .block-2 {
    background-color: $gray-line;
  }
  .block-3 {
    border-radius: 0 9px 9px 0 !important;
  }
}

.form-floating {
  margin-top: -12px;
}

.item-description {
  height: 80px;
}

.accordion-button:not(.collapsed) {
  background-color: transparent;
  border: none !important;
  color: $black-secondary;
  box-shadow: none;
}

.accordion-body {
  padding-top: 0;
}

.row.mt-4.justify-content-end {
  justify-content: flex-end !important;
}

.btn-remove-image,
.btn-remove-category,
.btn-remove-complement {
  position: absolute;
  top: -4px;
  right: 3px;
  width: 15px !important;
  height: 15px !important;
  background-color: red;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 10px !important;
  line-height: 1px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px !important;
  z-index: 9999;
}

.d-grid {
  position: relative;
}

.char-limit {
  position: absolute;
  right: 0;
  top: 10px;
  color: #6c757d;
  font-size: 0.7em;
  margin-right: 20px;
  font-weight: 400;
}

.form-floating label[for="description"] .char-limit {
  position: absolute;
  right: 10px;
  top: -40px;
}

.inputfile-box {
  p {
    font-size: 0.85em;
    color: #6c757d;
    margin: 0;
  }
}
</style>
