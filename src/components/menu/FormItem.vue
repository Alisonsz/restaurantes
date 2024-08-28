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
      <hr class="hr-title">
      <div class="row">
        <div class="col-lg-6 d-grid">
          <label class="form-label bold-500" for="name">Nome</label>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6 d-grid">
          <input type="text" class="form-control mb-2" id="name" v-model="itemData.name" placeholder="Ex: Hamburguer">
          <p class="mb-0 required-alert" v-show="invalid.name">*Campo obrigatório</p>
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
                  <p>{{ imageName.trim() !== '' ? imageName : "Adicionar imagem" }}</p>
                </span>
                <span class="file-button" v-if="itemData.image && typeof itemData.image === 'string'">
                  <img :src="itemData.image">
                </span>
                <span class="file-button" v-else>
                  <img src="~@/assets/img/img.svg">
                </span>
              </label>
            </div>
          </div>
        </div>
        <div class="col-lg-8 d-grid">
          <label for="description" class="bold-500">Descrição do produto</label>
          <div class="form-floating">
            <textarea class="form-control item-description" placeholder="Deixe um comentário aqui" id="description" v-model="itemData.description"></textarea>
            <label for="description">Ex: Hamburger de 200g com pão australiano.</label>
          </div>
        </div>
      </div>

      <!-- Seções de Categoria e Complementos são exibidas apenas ao editar -->
      <template v-if="itemData.id">
        <div class="row mt-1">
          <div class="col-lg-12 d-grid">
            <div class="accordion" id="accordionCategory">
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCategory" aria-expanded="false" aria-controls="collapseCategory">
                    <span class="bold-500 ml-1">Categoria</span>
                  </button>
                </h2>
                <div id="collapseCategory" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionCategory">
                  <div class="accordion-body">
                    <span class="hint mt-0 pt-0">Selecione a categoria apropriada para o item que você está adicionando ao seu cardápio.</span>
                    <div class="row mt-0">
                      <div class="col-lg-9 d-grid">
                        <select class="form-select" v-model="selectCategory">
                          <option value="">Selecione uma categoria</option>
                          <option v-for="(category, index) in formCategories" :key="index" :value="category">{{ category.name }}</option>
                        </select>
                      </div>
                      <div class="col-lg-3 d-grid">
                        <button @click.prevent="associateCategory" type="button" class="btn btn-save" :disabled="!selectCategory">
                          <span class="add-item add-inline add-black ml-1"></span> Adicionar
                        </button>
                      </div>
                    </div>
                    <div v-if="categorySelected" class="mt-4 mb-2">
                      <span class="ml-1">Categoria selecionada:</span>
                      <span class="btn-round input-base edit-button bold-500 ml-1">{{ categorySelected.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-lg-12 d-grid">
            <div class="accordion" id="accordionComplement">
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseComplement" aria-expanded="false" aria-controls="collapseComplement">
                    <span class="bold-500 ml-1">Complemento</span> <span>(opcional)</span>
                  </button>
                </h2>
                <div id="collapseComplement" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionComplement">
                  <div class="accordion-body">
                    <span class="hint mt-0 pt-0">Selecione o complemento apropriado para o item que você está adicionando ao seu cardápio.</span>
                    <div class="row mt-0">
                      <div class="col-lg-9 d-grid">
                        <select class="form-select" v-model="selectComplement">
                          <option value="">Adicionar complemento</option>
                          <option v-for="(complement, index) in formComplements" :key="index" :value="complement">{{ complement.name }}</option>
                        </select>
                      </div>
                      <div class="col-lg-3 d-grid">
                        <button @click.prevent="associateComplement" type="button" class="btn btn-save">
                          <span class="add-item add-inline add-black ml-1"></span> Adicionar
                        </button>
                      </div>
                    </div>
                    <div v-if="itemData.complement && itemData.complement.length > 0" class="mt-4 mb-2">
                      <span class="ml-1">Complementos adicionados:</span>
                      <span v-for="(complement, index) in itemData.complement" :key="index" class="btn-round input-base edit-button bold-500 ml-1">{{ complement.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
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
import { mapState } from 'vuex';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  props: {
    itemEditData: Object, // Recebe o ID do produto para edição
  },
  setup(props, { emit }) {
    const store = useStore();
    const itemData = ref({
      id: "",
      active: true,
      name: "",
      price: "",
      image: "",
      description: "",
      complement: [],
    });
    const formattedPrice = ref(""); // Campo para formatação do preço
    const imageName = ref("");
    const fileInput = ref(null);
    const selectCategory = ref("");
    const selectComplement = ref("");
    const categorySelected = ref(null); // Armazena a categoria selecionada
    const invalid = ref({
      name: false,
      price: false,
    });

    const loadProductData = async (productId) => {
      try {
        const response = await axios.get(`https://api.prattuapp.com.br/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${store.state.token}`,
          },
        });

        const product = response.data;
        itemData.value = {
          id: product.id,
          name: product.name,
          price: product.price, // Recebe o valor com ponto
          image: product.products_photo,
          description: product.description,
          active: product.is_available,
          complement: product.components.map((comp) => comp),
        };
        formattedPrice.value = formatCurrency(product.price); // Converte o valor para o formato com vírgula
        imageName.value = product.products_photo ? product.products_photo.split('/').pop() : '';

        // Definindo a categoria selecionada
        categorySelected.value = store.state.formCategories.find(category => category.id === product.category_product_id);
        selectCategory.value = categorySelected.value; // Define o valor selecionado no select
      } catch (error) {
        console.error('Erro ao carregar os dados do produto:', error);
      }
    };

    onMounted(() => {
      if (props.itemEditData && props.itemEditData.id) {
        loadProductData(props.itemEditData.id); // Carregar os dados do produto ao montar o componente
      }
    });

    const formatCurrency = (value) => {
      if (!value) return '';
      // Formata o número para o padrão brasileiro (com vírgula como separador decimal)
      return parseFloat(value).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    const parsePrice = () => {
      // Converte o valor de volta para o formato com ponto
      const parsedValue = formattedPrice.value.replace(/\./g, '').replace(',', '.');
      itemData.value.price = parseFloat(parsedValue);
    };

    const formatPrice = () => {
      // Remove qualquer formatação anterior e aplica novamente
      const rawValue = formattedPrice.value.replace(/\D/g, '');
      formattedPrice.value = formatCurrency(rawValue / 100);
    };

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

    const associateCategory = async () => {
      if (selectCategory.value && itemData.value.id) {
        try {
          await axios.post(
            `https://api.prattuapp.com.br/api/category/${selectCategory.value.id}/add-product`,
            { product_id: itemData.value.id },
            {
              headers: {
                Authorization: `Bearer ${store.state.token}`,
              },
            }
          );
          categorySelected.value = selectCategory.value; // Atualiza a categoria selecionada
        } catch (error) {
          console.error('Erro ao associar a categoria:', error);
        }
      }
    };

    const associateComplement = async () => {
      if (selectComplement.value && itemData.value.id) {
        try {
          await axios.post(
            `https://api.prattuapp.com.br/api/components/${selectComplement.value.id}/products/${itemData.value.id}/associate`,
            { restaurant_id: store.state.restaurantId },
            {
              headers: {
                Authorization: `Bearer ${store.state.token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          if (!itemData.value.complement) {
            itemData.value.complement = [];
          }
          itemData.value.complement.push(selectComplement.value);
          selectComplement.value = "";
        } catch (error) {
          console.error('Erro ao associar o complemento:', error);
        }
      }
    };

    const valid = (data) => {
      let isValid = true;
      invalid.value.name = !data.name;
      invalid.value.price = !data.price;
      isValid = !invalid.value.name && !invalid.value.price;
      return isValid;
    };

    const save = async () => {
      if (!valid(itemData.value)) return;

      const formData = new FormData();
      formData.append('name', itemData.value.name);
      formData.append('price', itemData.value.price); // Salva o valor com ponto
      formData.append('description', itemData.value.description);
      formData.append('restaurant_id', store.state.restaurantId);
      formData.append('is_available', itemData.value.active ? 1 : 0);

      if (fileInput.value && fileInput.value.files && fileInput.value.files.length > 0) {
        formData.append('products_photo', fileInput.value.files[0]);
      }

      try {
        let response;
        if (itemData.value.id) {
          // Editar produto
          response = await axios.post(
            `https://api.prattuapp.com.br/api/restaurants/products/update/${itemData.value.id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${store.state.token}`,
                'Content-Type': 'multipart/form-data',
              },
            }
          );
        } else {
          // Criar novo produto
          response = await axios.post(
            'https://api.prattuapp.com.br/api/restaurants/products/create',
            formData,
            {
              headers: {
                Authorization: `Bearer ${store.state.token}`,
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          itemData.value.id = response.data.id; // Armazena o ID do produto criado
        }

        // Despachar uma ação para o Vuex store
        store.dispatch('fetchMenusAndItems');

        // Emitir evento para fechar o modal
        emit('close-modal');
      } catch (error) {
        console.error('Erro ao salvar o produto:', error);
      }
    };

    const deleteProduct = async () => {
      try {
        await axios.delete(`https://api.prattuapp.com.br/api/products/${itemData.value.id}`, {
          headers: {
            Authorization: `Bearer ${store.state.token}`,
          },
        });
        // Atualiza o Vuex store e fecha o modal após a exclusão
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
      categorySelected,
      invalid,
      onFileChange,
      associateCategory,
      associateComplement,
      save,
      deleteProduct, // Função de exclusão
      closeModal,
      formatCurrency,
      parsePrice,
      formatPrice,
    };
  },
  computed: {
    ...mapState({
      formCategories: (state) => state.formCategories,
      formComplements: (state) => state.formComplements,
    }),
  },
};
</script>

<style lang="scss" scoped>
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

/* Nova regra de estilo para alinhamento dos botões sempre à direita */
.row.mt-4.justify-content-end {
  justify-content: flex-end !important;
}
</style>
