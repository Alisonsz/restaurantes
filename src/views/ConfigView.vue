<template>
    <div class="container-report" :class="completeConfig ? '' : 'with-footer'">
        <Navbar :navbarData="navbarData" />
        <Sidebar activePage="config" />
        <div class="report-titles">
            <Navbar :navbarData="navbarData" /><Sidebar activePage="config" />
            <div class="row">
                <div class="col">
                    <h3 class="bold-700 mb-2">Configurações</h3>
                </div>
            </div>
        </div>
        <div class="container-data">
            <div class="content">
            <h4>
                Configure as informações da pessoa responsável pela conta do estabelecimento na plataforma.
                <br />
                O e-mail será utilizado para acessar a Prattu e, em caso de eventuais problemas, essa será a pessoa contatada.
            </h4>
            <div class="image-container">
                <img :src="profileImage" alt="Profile Image" class="profile-image" @click="selectImage" />
                <button @click="selectImage">Alterar imagem</button>
            </div>
            <div class="form-container">
                <div class="left-column">
                    <div class="form-group">
                        <label for="name">Nome</label>
                        <i class="fas fa-user"></i>
                        <input type="text" id="name" v-model="formData.name" placeholder="Nome" />
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <i class="fas fa-envelope"></i>
                        <input type="email" id="email" v-model="formData.email" placeholder="Email" />
                    </div>
                </div>
                <div class="right-column">
                    <div class="form-group">
                        <label for="position">Posição</label>
                        <i class="fas fa-briefcase"></i>
                        <select id="position" v-model="formData.position">
                            <option value="Proprietário(a)">Proprietário(a)</option>
                            <option value="Gerente Geral">Gerente Geral</option>
                            <option value="Gerente de Cozinha">Gerente de Cozinha</option>
                            <option value="Funcionário(a)">Funcionário(a)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="phone">Telefone</label>
                        <i class="fas fa-phone"></i>
                        <input type="text" id="phone" v-model="formData.phone" @input="applyPhoneMask" placeholder="Telefone" />
                    </div>
                </div>
            </div>
            <!-- <div class="form-container" v-if="completeConfig">
                <div class="password-container">
                    <div class="form-group">
                        <label for="current-password">Senha Atual</label>
                        <i class="fas fa-lock"></i>
                        <input type="password" id="current-password" v-model="passwordData.currentPassword" placeholder="Senha Atual" />
                    </div>
                    <div class="form-group">
                        <label for="new-password">Nova Senha</label>
                        <i class="fas fa-lock"></i>
                        <input type="password" id="new-password" v-model="passwordData.newPassword" placeholder="Nova Senha" />
                    </div>
                    <div class="form-group">
                        <label for="confirm-new-password">Confirme a Nova Senha</label>
                        <i class="fas fa-lock"></i>
                        <input type="password" id="confirm-new-password" v-model="passwordData.confirmNewPassword" placeholder="Confirme a Nova Senha" />
                    </div>
                </div>
            </div> -->
            <div class="buttons" v-if="completeConfig === true">
                <button :class="['btn', 'btn-success', { 'btn-disabled': !hasChanges }]" :disabled="!hasChanges" @click="save">Salvar</button>
            </div>
        </div>
        <Footer @next-config-step="showModalCongratulations = true, complete()" :currentConfigStep="currentConfigStep" :countConfigSteps="countConfigSteps" :completeStep="formData.position.length > 0" v-if="completeConfig === false" />
        <Teleport to="body">
            <ModalCongratulations :show="showModalCongratulations" @close="showModalCongratulations = false">
                <template #header>Parabéns!</template>
                <template #body>
                    <Congratulations @close="showModalCongratulations= false" @finish-config="finishConfig" />
                </template>
            </ModalCongratulations>
        </Teleport>
        <!-- Componente FormSuccess para mensagens de sucesso -->
        <Teleport to="body">
    <FormSuccess :message="successMessage" v-if="showFormSuccess" @close="showFormSuccess = false" />
        </Teleport>

    </div>
        </div>
        
</template>

<script setup>

import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import FormSucess from '../components/config/FormSucess.vue'; // Corrigir a importação
import ModalCongratulations from "../components/ModalBase.vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import Footer from "../components/Footer.vue";
import Congratulations from "../components/config/Congratulations.vue";
import { useStore } from 'vuex';

const store = useStore();
const showModalCongratulations = ref(false);
const showFormSuccess = ref(false); // Novo estado para o modal FormSucess
const profileImage = ref('/path/to/default-image.jpg');
const formData = ref({
    name: '',
    email: '',
    position: 'Gerente Geral',
    phone: ''
});

const initialFormData = ref({ ...formData.value });

const passwordData = ref({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
});

const sidebarData = ref({
    logo: "/img/logo1.png",
    company: "TATÁ Sushi",
    address: "R. João Cachoeira, 278",
    active: "config",
    message: "Configure os menus abaixo para começar a receber pedidos!",
    open: true,
    links: {
        profile: { complete: true },
        menu: { complete: true },
        hours: { complete: true },
        preparation: { complete: true },
        config: { complete: false }
    }
});

const navbarData = ref({});

onMounted(async () => {
    try {
        const response = await axios.get('https://api.prattuapp.com.br/api/users/me', {
            headers: {
                'Authorization': `Bearer ${store.state.token}`
            }
        });
        const userData = response.data;
        formData.value = {
            name: userData.name,
            email: userData.email,
            position: 'Gerente Geral',
            phone: userData.phone
        };
        initialFormData.value = { ...formData.value };
        profileImage.value = userData.profile_photo || '/path/to/default-image.jpg';
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
    }
});

function selectImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
        const file = input.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('profile_photo', file);
                await axios.post('https://api.prattuapp.com.br/api/user/profile-photo', formData, {
                    headers: {
                        'Authorization': `Bearer ${store.state.token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                profileImage.value = URL.createObjectURL(file);
            } catch (error) {
                console.error('Erro ao atualizar foto de perfil:', error);
            }
        }
    };
    input.click();
}

async function save() {
    try {
        // Atualizar dados do usuário
        await axios.post('https://api.prattuapp.com.br/api/user?_method=PUT', {
            name: formData.value.name,
            email: formData.value.email,
            phone: formData.value.phone
        }, {
            headers: {
                'Authorization': `Bearer ${store.state.token}`
            }
        });

        // Verificar se houve alterações nos dados
        if (
            formData.value.name !== initialFormData.value.name ||
            formData.value.email !== initialFormData.value.email ||
            formData.value.phone !== initialFormData.value.phone
        ) {
            showFormSuccess.value = true;
            successMessage.value = 'Dados atualizados com sucesso!';
        }

        // Alterar senha se necessário
        if (passwordData.value.currentPassword && passwordData.value.newPassword && passwordData.value.confirmNewPassword) {
            if (passwordData.value.newPassword !== passwordData.value.confirmNewPassword) {
                showFormSuccess.value = true;
                successMessage.value = 'As novas senhas não coincidem!';
                return;
            }
            await axios.post('https://api.prattuapp.com.br/api/user/change-password?_method=PUT', {
                current_password: passwordData.value.currentPassword,
                new_password: passwordData.value.newPassword,
                new_password_confirmation: passwordData.value.confirmNewPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${store.state.token}`
                }
            });
            showFormSuccess.value = true;
            successMessage.value = 'Senha alterada com sucesso!';
        }
    } catch (error) {
        if (error.response) {
            console.error('Erro ao atualizar dados:', error.response.data);
            if (error.response.status === 422) {
                showFormSuccess.value = true;
                successMessage.value = 'Erro de validação: ' + JSON.stringify(error.response.data.errors);
            } else if (error.response.status === 400) {
                showFormSuccess.value = true;
                successMessage.value = 'Senha atual incorreta!';
            } else {
                showFormSuccess.value = true;
                successMessage.value = 'Erro ao atualizar dados: ' + error.response.data.message;
            }
        } else {
            console.error('Erro ao atualizar dados:', error.message);
            showFormSuccess.value = true;
            successMessage.value = 'Erro ao atualizar dados: ' + error.message;
        }
    }
}

function applyPhoneMask(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 5) {
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else {
        value = value.replace(/^(\d*)/, '($1');
    }
    event.target.value = value;
}

const hasChanges = computed(() => {
    return JSON.stringify(formData.value) !== JSON.stringify(initialFormData.value) || 
           passwordData.value.currentPassword || 
           passwordData.value.newPassword || 
           passwordData.value.confirmNewPassword;
});

const completeConfig = ref(store.state.completeConfig);
const currentConfigStep = ref(5);
const countConfigSteps = ref(5);
const successMessage = ref('');

</script>

<script>
import { mapActions } from 'vuex';

export default {
  name: "ConfigView",
  methods: {
    ...mapActions(['saveCompleteConfig']),
    complete() {
        this.saveCompleteConfig(true);
    },
    finishConfig() {
        //this.$router.push('/preparo');
        window.location.reload();
    }
  }
}
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Red+Hat+Text:wght@400&display=swap');

.config.container-data {
    display: flex;
}

.content {
    flex-grow: 1;
    padding: 20px;
    font-family: 'Red Hat Text', sans-serif;
}

h4 {
    font-size: 16px;
    font-weight: normal;
    margin-bottom: 20px;
    text-align: left;
    line-height: 26px;
}

.image-container {
    text-align: left;
    margin-bottom: 48px;
    margin-top: 48px;
}

.profile-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    margin-bottom: 10px;
    padding: 5px;
}

button {
    cursor: pointer;
    border: none !important;
    background-color: #FFFFFF;
    font-size: 16px;
    text-decoration: underline;
}

.form-container {
    display: flex;
    justify-content: space-between;
}

.left-column, .right-column {
    width: 48%;
}

.form-group {
    display: flex;
    align-items: center;
    margin-bottom: 32px;
    position: relative;
    flex-direction: column;
    align-items: flex-start;
}

.form-group i {
    position: absolute;
    left: 15px;
    top: 35px;
}

.form-group label {
    margin-bottom: 5px;
    font-weight: bold;
}

input, select {
    flex: 1;
    padding: 10px 10px 10px 40px;
    border-radius: 4px;
    font-family: 'Red Hat Text', sans-serif;
    width: 100%;
}

input::placeholder {
    color: #999;
    padding: 10px;
}

select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: url('data:image/svg+xml;utf8,<svg fill="gray" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>') no-repeat right 10px center;
    background-color: #fff;
}

.fas {
    color: #666;
    margin-top: 5px;
}

.password-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.password-container .form-group {
    width: 30%;
}

.buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.buttons .btn {
    padding: 5px 20px;
    border: none !important;
    border-radius: 5px;
    color: white;
    margin-left: 10px;
}

.buttons .btn-success {
    background-color: #2ecc71;
    text-decoration: none;
    color: black;
}
.btn-disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
    border: 1px solid #ccc;
}
.buttons .btn-disabled {
    background-color: #d3d3d3; /* Cinza */
    cursor: not-allowed;
    color: #999;
}
</style>