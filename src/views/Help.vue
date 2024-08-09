<template>
  <div class="profile container-data">
    <Navbar :navbarData="navbarData" />
    <Sidebar :sidebarData="sidebarData" />
    <div class="content">
      <h3 class="bold-600">Dúvidas Frequentes</h3>
      <h4>Bem-vindo à página de ajuda! Clique nos tópicos abaixo para ver as respostas.</h4>
      <div class="accordion-container">
        <div v-for="(section, sectionIndex) in faqSections" :key="sectionIndex" class="accordion-item">
          <div class="accordion-header" @click="toggleAccordion(sectionIndex)">
            <h5>{{ section.title }}</h5>
            <img :src="arrowIcon" :class="{'rotate': section.open}" class="arrow-icon" />
          </div>
          <div class="accordion-body" v-show="section.open">
            <div v-for="(item, itemIndex) in section.items" :key="itemIndex">
              <div class="accordion-item">
                <div class="accordion-header" @click="toggleItemAccordion(sectionIndex, itemIndex)">
                  <h5>{{ item.question }}</h5>
                  <img :src="arrowIcon" :class="{'rotate': item.open}" class="arrow-icon" />
                </div>
                <div class="accordion-body" v-show="item.open">
                  <p v-html="item.answer"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
 
import { ref } from 'vue';
import Navbar from '../components/Navbar.vue';
import Sidebar from '../components/Sidebar.vue';
import arrowIcon from '@/assets/img/arrow_drop_down.svg';

const navbarData = {};
const sidebarData = {};

const faqSections = ref([
  {
    title: 'Configurações da Conta',
    open: false,
    items: [
      { question: 'Quais são as taxas cobradas pela Prattu?', answer: 'Na Prattu, cobramos uma mensalidade fixa de R$ 179,99 para os restaurantes que utilizam nossa plataforma. Além disso, aplicamos uma taxa de processamento de 3,6% para compras realizadas no crédito e de R$0,99 para compras feitas através do Pix. Essas taxas são competitivas e até 75% menores quando comparadas a outras empresas do setor. Nossa estrutura de tarifas foi desenhada para ser justa e acessível, visando proporcionar o máximo de benefício aos nossos parceiros sem comprometer suas margens de lucro.', open: false },
      { question: 'Como altero a pessoa responsável pelo restaurante?', answer: 'Acesse a página de "Configurações Gerais" no dashboard e atualize os dados do responsável.', open: false },
      { question: 'Esqueci minha senha. Como posso recuperá-la?', answer: 'Na página de login, clique em "Esqueci minha senha" e siga as instruções para redefini-la.', open: false },
      { question: 'Gostaria de alterar a minha senha. Como faço isso?', answer: 'Acesse a página de “Configurações Gerais” no dashboard e redefina a sua senha de acesso.', open: false },
      { question: 'É possível desativar temporariamente meu restaurante na plataforma?', answer: 'Infelizmente ainda não oferecemos essa funcionalidade aos estabelecimentos. Entretanto, caso tenha algum problema, sinta-se à vontade para nos enviar uma mensagem através da aba “Suporte”. Ficaremos felizes em ajudar!', open: false },
      { question: 'Como faço para excluir a minha conta da plataforma?', answer: 'Entre em contato conosco através da aba “Suporte” e te auxiliaremos no processo de exclusão de conta.', open: false },
      { question: 'Como adiciono ou removo administradores da conta do restaurante?', answer: 'Ainda não estamos oferecendo essa funcionalidade aos estabelecimentos. O acesso precisa ser feito única e exclusivamente através da conta criada pelo administrador.', open: false },
      { question: 'Posso configurar diferentes níveis de acesso aos meus funcionários?', answer: 'Estamos planejando oferecer essa funcionalidade em breve para os estabelecimentos. No momento, o acesso precisa ser feito única e exclusivamente através da conta criada pelo administrador.', open: false },
      { question: 'Posso fazer parte de mais de uma categoria (Ex: doceria e cafeteria)?', answer: 'Não, você só pode fazer parte de uma categoria na Prattu. É importante escolher a categoria correta porque isso influencia diretamente na busca dos usuários na plataforma. Categorias precisas garantem que seu restaurante apareça nas pesquisas relevantes, aumentando a visibilidade e atraindo o público certo.', open: false },
      { question: 'Como configuro a disponibilidade de horário do meu estabelecimento?', answer: 'Para configurar a disponibilidade de horário do seu estabelecimento, acesse o dashboard da Prattu e vá para a seção "Horário de Funcionamento". Lá, você poderá definir os horários de funcionamento e os dias da semana em que seu restaurante estará aberto. Também é possível ajustar os horários para feriados e eventos especiais.', open: false },
      { question: 'Como funciona a configuração do tempo médio de preparo? Posso ajustar quantas vezes eu quiser?', answer: 'A configuração do tempo médio de preparo é essencial para manter os clientes informados sobre quanto tempo esperar pelo pedido. O tempo que o estabelecimento configurar na aba de “Tempo de Preparo” será o tempo que ele terá para preparar os pedidos, bem como o tempo que será mostrado para o usuário no aplicativo. Recomendamos definir um tempo viável e não muito longo, para evitar que os consumidores desistam da compra. Esse tempo pode ser ajustado quantas vezes for necessário.', open: false },
      { question: 'Quais são as formas de pedidos aceitas pela Prattu?', answer: 'Aceitamos duas formas de pedido: take-out (pedidos para retirada) e dine-in (pedidos para consumir no local). Vale lembrar que cada restaurante pode configurar as formas de pedido aceitas e não necessariamente precisam trabalhar com as duas (take-out e dine-in).', open: false },
      { question: 'Como respondo a avaliações de clientes?', answer: 'No momento, a Prattu não oferece a funcionalidade de responder diretamente às avaliações dos clientes. No entanto, você pode visualizar todas as avaliações recebidas acessando a seção "Eficiência Operacional" no dashboard do seu restaurante. Aqui, você verá o feedback detalhado dos clientes, permitindo que você entenda melhor suas experiências e identifique áreas para melhoria. Use essas informações para ajustar seus serviços e produtos, garantindo uma melhor satisfação dos clientes no futuro. Fique atento às atualizações da plataforma, pois essa funcionalidade poderá ser disponibilizada em breve.', open: false }
    ]
  },
  {
    title: 'Cardápio e Adição de Itens',
    open: false,
    items: [
      { question: 'Como adiciono novos itens ao meu cardápio?', answer: 'Para adicionar novos itens ao seu cardápio, acesse o dashboard e vá até a seção "Cardápio". Clique em "Adicionar Item" e preencha as informações necessárias, como nome do item, descrição, preço e categoria. Não se esqueça de adicionar uma imagem atraente para cada item.', open: false },
      { question: 'Posso criar categorias para meus itens?', answer: 'Sim, você pode e deve criar categorias para organizar melhor o seu cardápio. Categorias ajudam os clientes a encontrarem os itens de maneira mais fácil e rápida. Para criar uma categoria, vá até "Cardápio" e selecione "Adicionar Categoria".', open: false },
      { question: 'Posso criar mais de um cardápio para o meu estabelecimento?', answer: 'Sim, você poderá criar mais de um cardápio e configurá-los para diferentes horários do dia. Por exemplo, um cardápio ficará ativo no almoço, das 11h às 15h, e outro no jantar, das 19h às 00h.', open: false },
      { question: 'Quantas categorias posso adicionar ao meu cardápio?', answer: 'Não há limite para o número de categorias que você pode adicionar. É importante escolher as categorias corretas, pois isso influenciará a busca dos usuários na plataforma e facilitará a navegação pelo seu cardápio.', open: false },
      { question: 'Como edito ou removo um item do meu cardápio?', answer: 'Para editar ou remover um item, acesse a seção "Cardápio" no dashboard, encontre o item que deseja modificar e clique em "Editar" ou "Remover". Faça as alterações necessárias e salve.', open: false },
      { question: 'Posso adicionar descrições e imagens aos itens do cardápio?', answer: 'Sim, adicionar descrições detalhadas e imagens de alta qualidade é altamente recomendado. Isso ajuda a atrair os clientes e fornecer informações claras sobre o que eles estão pedindo.', open: false },
      { question: 'Como configuro variações de itens (tamanhos, sabores, adicionais etc.)?', answer: 'Na seção "Adicionar Item", você pode configurar variações e opções adicionais para cada item. Por exemplo, para um açai, você pode adicionar variações de tamanho (pequeno, médio, grande) e opções de adicionais (extra morango, leite condensado).', open: false },
      { question: 'Como ajusto os preços dos itens do meu cardápio?', answer: 'Para ajustar os preços, vá até a seção "Cardápio" no dashboard, encontre o item que deseja atualizar e faça as alterações necessárias no campo de preço. Não se esqueça de salvar as alterações após atualizar o preço.', open: false }
    ]
  }
]);

function toggleAccordion(index) {
  faqSections.value[index].open = !faqSections.value[index].open;
}

function toggleItemAccordion(sectionIndex, itemIndex) {
  faqSections.value[sectionIndex].items[itemIndex].open = !faqSections.value[sectionIndex].items[itemIndex].open;
}
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Red+Hat+Text:wght@400&display=swap');
  
  .help.container-data {
    display: flex;
  }
  
  .content {
    flex-grow: 1;
    padding: 40px;
    font-family: 'Red Hat Text', sans-serif;
   
  }
  
  h4 {
    font-size: 16px;
    font-weight: normal;
    margin-bottom: 20px;
    text-align: left;
    line-height: 26px;
  }
  
  .accordion-container {
    margin-top: 20px;
  }
  
  .accordion-item {
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    overflow: hidden;
  }
  
  .accordion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: white;
    cursor: pointer;
  }
  
  .accordion-header h5 {
    margin: 0;
    font-size: 16px;
  }
  
  .accordion-body {
    padding: 15px;
    background-color: #fff;
  }
  
  .accordion-body p {
    margin: 0;
  }
  
  .arrow-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.2s ease;
  transform: rotate(180deg); /* Inicialmente apontando para baixo */
}

.rotate {
  transform: rotate(0deg); /* Gira para cima quando o acordeon está aberto */
}
  </style>
  