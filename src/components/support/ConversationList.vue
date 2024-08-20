<template>
  <div class="conversation-list">
    <h2 class="conversation-title">Conversas ({{ conversations.length }})</h2>

    <div class="conversation-container">
      <div
        v-for="conversation in conversations"
        :key="conversation.id"
        :class="[
          'conversation',
          { 
            'active': isSelected(conversation.id), 
            'highlight': conversation.highlight || (conversation.hasNewMessages && !isSelected(conversation.id))
          }
        ]"
        @click="select(conversation.id)"
      >
        <div class="conversation-header">
          <div>
            <p class="conversation-id"><strong>Chamado {{ conversation.id }}</strong></p>
            <p class="conversation-title-text">{{ conversation.title }}</p>
            <p 
              class="conversation-status" 
              :class="conversation.status === 2 ? 'in-progress-status' : 'closed-status'">
              {{ conversation.status === 2 ? 'Em andamento' : 'Encerrado' }}
            </p>
          </div>
          <p class="conversation-date">{{ formatDate(conversation.created_at) }}</p>
        </div>
        <span v-if="conversation.hasNewMessages" class="new-message-indicator">•</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    conversations: {
      type: Array,
      required: true,
    },
    selectedConversationId: {
      type: Number,
      required: false,
    },
  },
  methods: {
    select(conversationId) {
      this.$emit('selectConversation', conversationId);

      const conversation = this.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.hasNewMessages = false;
        conversation.highlight = false;
      }
    },
    isSelected(conversationId) {
      return this.selectedConversationId === conversationId;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    }
  },
}
</script>


<style scoped>
.conversation-list {
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  height: 300px; /* Altura fixa para manter consistência */
  display: flex;
  flex-direction: column;
}

.conversation-title {
  font-size: 18px;
  font-weight: bold;
  padding: 30px 0;
  margin: 0;
  border-bottom: 1px solid #DCDCDC;
}

.conversation-container {
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 20px;
  gap: 10px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.conversation {
  padding: 15px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  background-color: #ffffff;
  border-radius: 8px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.conversation.highlight {
  background-color: #8d8b8b; /* Cor de destaque */
}

.new-message-indicator {
  color: red;
  font-size: 18px;
  margin-left: 10px;
  align-self: center;
  display: none;
}

.conversation:hover {
  background-color: #f0f0f0;
}

.conversation.active {
  background-color: #F1F4F4;
  font-weight: bold;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.conversation-id {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.conversation-title-text {
  font-size: 16px;
  font-weight: 400;
  margin: 0;
}

.conversation-date {
  font-size: 14px;
  font-weight: 300;
  color: #888;
  text-align: right;
  margin-top: 0;
  margin-bottom: 0;
  align-self: flex-start;
}

.conversation-status {
  font-size: 10px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 100px;
  margin-top: 15px;
  display: inline-block;
  min-width: 70px;
  text-align: center;
}

.in-progress-status {
  background-color: #BAEDBD;
  color: black;
}

.closed-status {
  background-color: #FF6347;
  color: white;
}

/* Media Queries para telas de 14 e 13 polegadas */
@media (max-width: 1400px) {
  .conversation-title {
    font-size: 16px;
  }
  .conversation {
    padding: 12px;
  }
  .conversation-id {
    font-size: 16px;
  }
  .conversation-title-text {
    font-size: 14px;
  }
  .conversation-date {
    font-size: 12px;
  }
  .conversation-status {
    font-size: 9px;
    padding: 4px 8px;
  }
}

@media (max-width: 1280px) {
  .conversation-title {
    font-size: 14px;
  }
  .conversation {
    padding: 10px;
  }
  .conversation-id {
    font-size: 14px;
  }
  .conversation-title-text {
    font-size: 12px;
  }
  .conversation-date {
    font-size: 10px;
  }
  .conversation-status {
    font-size: 8px;
    padding: 3px 6px;
  }
}
</style>
