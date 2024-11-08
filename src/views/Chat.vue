<template>
  <div class="chat-wrapper">
    <Navbar :navbarData="navbarData" />
    <div class="main-container">
      <Sidebar activePage="support" />
      <div class="content">
        <div class="page-header">
          <h1>Suporte</h1>
          <button 
            v-if="hasConversations" 
            class="new-ticket-btn" 
            @click="openNewTicket">
            <img src="@/assets/img/add_circle.svg" alt="Abrir novo chamado" />
            Abrir novo chamado
          </button>
        </div>

        <div v-if="hasConversations" class="conversation-container">
          <ConversationList
            :conversations="conversations"
            :selectedConversationId="selectedConversationId"
            @selectConversation="selectConversation"
          />
          <div class="chat-container">
            <div class="chat-header">
              <h2>
                <span v-if="isNewConversation">Motivo do chamado:</span>
                <span v-if="!isNewConversation">Chamado {{ selectedConversationId }}: </span>
                <span class="conversation-title-text">{{ isNewConversation ? '' : selectedConversationTitle }}</span>
              </h2>
              <p 
                v-if="!isNewConversation" 
                class="status"
                :class="selectedConversationStatus === 2 ? 'in-progress-status' : 'closed-status'">
                {{ selectedConversationStatus === 2 ? 'Em andamento' : 'Encerrado' }}
              </p>
            </div>

            <div class="messages">
              <div class="bot-message">
                <p>Olá! 👋</p>
                <p>Como posso te ajudar?</p>
                <div class="problem-buttons">
                  <button 
                    class="problem-button" 
                    @click="handleProblemButtonClick('Problema com pedido', 1)"
                    :disabled="!isNewConversation"
                  >
                    Problema com pedido
                  </button>
                  <button 
                    class="problem-button" 
                    @click="handleProblemButtonClick('Dificuldade com o financeiro', 1)"
                    :disabled="!isNewConversation"
                  >
                    Dificuldade com o financeiro
                  </button>
                  <button 
                    class="problem-button" 
                    @click="handleProblemButtonClick('Ajuda para cadastrar produtos', 1)"
                    :disabled="!isNewConversation"
                  >
                    Ajuda para cadastrar produtos
                  </button>
                  <button 
                    class="problem-button" 
                    @click="handleProblemButtonClick('Outros', 2)"
                    :disabled="!isNewConversation"
                  >
                    Outros
                  </button>
                </div>
              </div>
              <div
                v-for="(message, index) in selectedConversationMessages"
                :key="message.id"
                :class="['message', { 'sent': message.user?.id === currentUser.id, 'received': message.user?.id !== currentUser.id }]"
              >
                <p v-if="message.user?.id !== selectedConversationMessages[index - 1]?.user?.id">
                  <strong>{{ message.user?.id === currentUser.id ? 'Você' : message.user?.name || 'Usuário desconhecido' }}:</strong>
                </p>
                <p v-if="message.message">{{ message.message }}</p>
                
                <template v-if="message.file_url">
                  <a :href="message.file_url" target="_blank">
                    <img
                      v-if="isImage(message.file_type)"
                      :src="message.file_url"
                      alt="Imagem enviada"
                      class="message-image"
                    />
                    <span v-else>
                      Enviou um arquivo: {{ message.file_name || 'arquivo desconhecido' }}
                    </span>
                  </a>
                </template>
              </div>
            </div>
            <div class="message-input-container">
              <textarea
                v-model="newMessage"
                @keydown.enter="handleKeyDown"
                class="message-input"
                placeholder="Digite sua mensagem"
                :disabled="isNewConversation"
                rows="1"
              ></textarea>
              <label for="file-upload" class="file-input-label">
                <img src="@/assets/img/chips_text.svg" alt="Enviar arquivo" class="file-input-icon"/>
              </label>
              <input id="file-upload" type="file" @change="handleFileUpload" class="file-input" :disabled="isNewConversation"/>
              <button @click="sendMessage" class="send-button" :disabled="isNewConversation">Enviar</button>
            </div>
          </div>
        </div>
        <div v-else class="no-conversations-container">
          <h2>Você não tem nenhum chamado.</h2>
          <img src="@/assets/img/bro.png" alt="Imagem centralizada" class="centered-image" />
          <p class="support-text">
            Está com dúvidas e precisa do suporte?<br>
            Entre em contato com a gente :)
          </p>
          <button class="new-ticket-btn" @click="openNewTicket">
            <img src="@/assets/img/add_circle.svg" alt="Abrir novo chamado" />
            Criar novo chamado
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import ConversationList from '@/components/support/ConversationList.vue';
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import simboloVerde from '@/assets/img/simboloverde.png';
import notificationSound from '@/assets/sounds/notification.mp3';

export default {
  components: {
    ConversationList,
    Navbar,
    Sidebar
  },
  data() {
    return {
      newMessage: '',
      selectedFile: null,
      conversations: [],
      selectedConversationId: null,
      selectedConversationTitle: '',
      selectedConversationMessages: [],
      selectedConversationStatus: null,
      currentUser: {},
      hasConversations: false,
      navbarData: {
        time: "9 horas",
        notifications: 4
      },
      sidebarData: {
        logo: "/img/logo1.png",
        company: "TATÁ Sushi",
        address: "R. João Cachoeira, 278",
        active: "insights",
        open: false
      },
      intervalId: null,
    };
  },
  computed: {
    ...mapState(['token']),
    isNewConversation() {
      return this.selectedConversationId === 'new';
    },
  },
  created() {
    this.fetchCurrentUser();
    this.loadConversations();
    this.selectConversation('new');
  },
  mounted() {
    this.checkNotificationPermission();
    document.addEventListener("visibilitychange", this.resetTitle);

    this.intervalId = setInterval(() => {
      this.loadConversations();
    }, 15000);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  methods: {
    async fetchCurrentUser() {
      try {
        const response = await axios.get('https://api.prattuapp.com.br/api/users/me', {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
        this.currentUser = response.data;
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    },
    async loadConversations() {
      try {
        const response = await axios.get('https://api.prattuapp.com.br/api/conversations', {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });

        this.conversations = response.data.conversations.data;
        this.hasConversations = response.data.hasConversations;

        if (this.hasConversations) {
          this.conversations.forEach(conversation => {
            this.listenToConversation(conversation.id);
          });
        } else {
          this.selectConversation('new');
        }
      } catch (error) {
        console.error('Erro ao carregar conversas:', error);
      }
    },
    async selectConversation(conversationId) {
      this.selectedConversationId = conversationId;

      if (conversationId !== 'new') {
        const selectedConversation = this.conversations.find(c => c.id === conversationId);
        if (selectedConversation) {
          this.selectedConversationTitle = selectedConversation.title;
          this.selectedConversationStatus = selectedConversation.status === 2 ? 2 : selectedConversation.status;
          selectedConversation.hasNewMessages = false;
          await this.loadMessages(conversationId);
        }
        this.listenToConversation(conversationId);
        this.scrollToBottom();
      } else {
        this.selectedConversationMessages = [];
        this.selectedConversationTitle = 'Nova Conversa';
        this.selectedConversationStatus = null;
        this.hasConversations = true;
      }
    },
    listenToConversation(conversationId) {
      if (window.Echo) {
        window.Echo.leave(`conversation.${conversationId}`);
      }

      window.Echo.private(`conversation.${conversationId}`)
        .listen('MessageSent', (event) => {
          if (this.selectedConversationId !== conversationId) {
            const conversation = this.conversations.find(c => c.id === conversationId);
            if (conversation) {
              conversation.hasNewMessages = true;
              this.showNotification(event.message);
            }
          } else {
            this.selectedConversationMessages.push(event.message);
            this.scrollToBottom();
          }
        });
    },
    async loadMessages(conversationId) {
      try {
        const response = await axios.get(`https://api.prattuapp.com.br/api/conversations/${conversationId}/messages`, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
        this.selectedConversationMessages = response.data;
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
      }
    },
    async handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        await this.sendFileMessage();
      }
    },
    async sendFileMessage() {
      if (!this.selectedFile) return;

      const formData = new FormData();
      formData.append('conversation_id', this.selectedConversationId);
      formData.append('file', this.selectedFile);

      try {
        await axios.post('https://api.prattuapp.com.br/api/messages', formData, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        this.selectedFile = null;
        await this.loadMessages(this.selectedConversationId);
        this.listenToConversation(this.selectedConversationId);
        this.scrollToBottom();
      } catch (error) {
        console.error('Erro ao enviar o arquivo:', error);
      }
    },
    isImage(fileType) {
      return fileType && fileType.startsWith('image/');
    },
    handleKeyDown(event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        this.sendMessage();
      }
    },
    async sendMessage() {
      if (!this.newMessage.trim() && !this.selectedFile) return;

      const formData = new FormData();
      formData.append('conversation_id', this.selectedConversationId);
      
      if (this.newMessage.trim()) {
        formData.append('message', this.newMessage);
      }
      
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      try {
        await axios.post('https://api.prattuapp.com.br/api/messages', formData, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'multipart/form-data'
          },
        });

        this.newMessage = '';
        this.selectedFile = null;

        await this.loadMessages(this.selectedConversationId);
        this.listenToConversation(this.selectedConversationId);
        this.scrollToBottom();
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
    },
    async sendMessageWithBotParam(bot) {
      if (!this.newMessage.trim() && !this.selectedFile) return;

      const formData = new FormData();
      formData.append('conversation_id', this.selectedConversationId);
      
      if (this.newMessage.trim()) {
        formData.append('message', this.newMessage);
      }
      
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      try {
        const url = `https://api.prattuapp.com.br/api/messages?bot=${bot}`;
        await axios.post(url, formData, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'multipart/form-data'
          },
        });

        this.newMessage = '';
        this.selectedFile = null;
        await this.loadMessages(this.selectedConversationId);
        this.listenToConversation(this.selectedConversationId);
        this.scrollToBottom();
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
    },
    async  NewConversation(title, bot) {
      try {
        const response = await axios.post('https://api.prattuapp.com.br/api/conversations', {
          title: title,
          user_ids: [2, 3],
        }, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
        }});

        const newConversation = response.data;
        newConversation.status = 2;
        newConversation.highlight = true;
        this.conversations.unshift(newConversation);
        await this.selectConversation(newConversation.id);

        this.newMessage = title;
        await this.sendMessageWithBotParam(bot);

      } catch (error) {
        console.error('Erro ao iniciar uma nova conversa:', error);
      }
    },
    handleProblemButtonClick(problemTitle, bot) {
      this.NewConversation(problemTitle, bot);
    },
    openNewTicket() {
      this.selectConversation('new');
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$el.querySelector('.messages');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    checkNotificationPermission() {
      if (!("Notification" in window)) {
        console.log("Este navegador não suporta notificações de desktop.");
      } else if (Notification.permission === "granted") {
        console.log("Notificações já estão permitidas.");
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log("Permissão para notificações concedida.");
          }
        });
      }
    },
    showNotification(message) {
      if (Notification.permission === "granted") {
        new Notification("Nova Mensagem!", {
          body: message.message,
          icon: simboloVerde,
        });
      }

      const audio = new Audio(notificationSound);
      audio.play();

      document.title = "💬 Nova mensagem!";

      setTimeout(() => {
        if (this.selectedConversationId !== message.conversation_id) {
          document.title = "💬 Nova mensagem!";
        }
      }, 3000);
    },
    resetTitle() {
      if (!document.hidden && this.selectedConversationId) {
        const selectedConversation = this.conversations.find(c => c.id === this.selectedConversationId);
        if (selectedConversation && !selectedConversation.hasNewMessages) {
          document.title = "Suporte";
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.chat-wrapper {
  display: flex;
  flex-direction: column;
  background-color: #f0f0f0;
}

.main-container {
  display: flex;
}

.content {
  flex-grow: 1;
  padding: 20px;
}

/* Estilo do cabeçalho */
.page-header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
 
  margin-top: 90px;
}

.page-header h1 {
  margin: 0;
  padding: 0 10px;
  font-size: 24px;
  font-weight: bold;
  color: black;
}

.new-ticket-btn {
  display: flex;
  align-items: center;
  background-color: #18E21C;
  color: black;
  border: none;
  padding: 25px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  font-weight: 400 !important;
}

.new-ticket-btn img {
  margin-right: 10px;
}

/* Estilo dos containers de conversa e chat */
.conversation-container {
  display: flex;
  gap: 30px;
}

.conversation-list {
  flex-basis: 30%;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
  height: 700px; /* Altura fixa para manter consistência */
}
@media (max-width: 1280px) { /* Ajuste o valor conforme necessário */
  .conversation-list, .chat-container {
    height: 500px !important; /* Altura ajustada para telas menores */
  }
}
.chat-container {
  flex-basis: 70%;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 48px 48px 24px;
  display: flex;
  flex-direction: column;
  border: none;
  height: 700px; /* Altura fixa para manter consistência */
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  border-bottom: 1px solid #DCDCDC;
  padding-bottom: 24px;
}

.chat-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

.status {
  font-size: 12px;
  font-weight: 500;
  padding: 10px 15px;
  border-radius: 100px;
  margin-bottom: 0;
  align-self: flex-end;
}

.in-progress-status {
  background-color: #BAEDBD;
  color: black;
}

.closed-status {
  background-color: #FF6347;
  color: black;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  border-radius: 8px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.message {
  max-width: 60%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
}

.sent {
  align-self: flex-end;
  text-align: right;
}

.received {
  background-color: #ffffff;
  align-self: flex-start;
}

.message-image {
  max-width: 150px;
  max-height: 150px;
  margin-top: 10px;
  border-radius: 8px;
}

.message-input-container {
  display: flex;
  align-items: center;
  background-color: #ffffff !important;
  padding: 24px 0;
  border-top: 1px solid #dcdcdc;
  margin-top: 10px;
}

.message-input {
  flex-grow: 1;
  padding: 10px;
  border: none !important;
  border-radius: 5px;
  background-color: #ffffff !important;
  resize: none;
  overflow-y: hidden; /* Oculta a barra de rolagem */
  max-height: 150px; /* Limita a altura máxima */
}

.message-input:focus {
  outline: none;
  box-shadow: none;
}

.file-input-label {
  margin-left: 10px;
  cursor: pointer;
}

.file-input-icon {
  width: 24px;
  height: 24px;
}

.file-input {
  display: none;
}

.send-button {
  background-color: $light-green;
  color: black;
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.send-button:hover {
  background-color: #8ad868;
  border-color: #7ED957;
  border: 1px;
  color: white;
}

.bot-message {
  background-color: #f1f3f4;
  padding: 20px;
  border-radius: 8px;
  margin: 10px 0;
  max-width: 50%;
}

.bot-message p {
  margin: 0 0 10px;
}

.problem-buttons {
  display: flex;
  flex-wrap: wrap;
}

.problem-button {
  margin: 5px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  border: 1px solid #7ED957;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
}

.problem-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #34a853;
}

.problem-button:hover {
  border-color: white;
}

.problem-button:disabled {
  border: 1px solid #ccc;
  color: #797878;
}

.no-conversations-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.no-conversations-container h2 {
  margin-bottom: 20px;
}

.new-ticket-btn {
  display: flex;
  align-items: center;
  background-color: #18E21C;
  color: black;
  border: none;
  padding: 25px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  font-weight: 400 !important;
  text-align: center;
}

.centered-image {
  margin-bottom: 20px;
  max-width: 100%;
  height: auto;
}

.support-text {
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
  text-align: center;
  line-height: 1.5;
}

.conversation-title-text {
  font-weight: 400;
}

/* Media Queries para telas de 14 e 13 polegadas */
@media (max-width: 1400px) {
  .page-header h1 {
    font-size: 20px;
  }
  .new-ticket-btn {
    font-size: 12px;
    padding: 15px;
  }
  .chat-header h2 {
    font-size: 18px;
  }
  .status {
    font-size: 10px;
    padding: 8px 12px;
  }
  .messages {
    padding: 8px;
  }
  .message {
    padding: 8px;
    margin-bottom: 8px;
  }
  .message-input-container {
    padding: 16px 0;
  }
  .message-input {
    padding: 8px;
  }
  .send-button {
    padding: 8px 16px;
  }
  .problem-button {
    padding: 16px;
  }
  .support-text {
    font-size: 14px;
  }
}

@media (max-width: 1280px) {
  .page-header h1 {
    font-size: 18px;
  }
  .new-ticket-btn {
    font-size: 10px;
    padding: 10px;
  }
  .chat-header h2 {
    font-size: 16px;
  }
  .status {
    font-size: 8px;
    padding: 6px 10px;
  }
  .messages {
    padding: 6px;
  }
  .message {
    padding: 6px;
    margin-bottom: 6px;
  }
  .message-input-container {
    padding: 12px 0;
  }
  .message-input {
    padding: 6px;
  }
  .send-button {
    padding: 6px 12px;
  }
  .problem-button {
    padding: 14px;
  }
  .support-text {
    font-size: 12px;
  }
}
</style>
