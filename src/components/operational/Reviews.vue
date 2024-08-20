<template>
    <div class="report-data mt-4 card-review">
        <h3 class="title">Avaliações</h3>

        <!-- Exibe a mensagem de "Você ainda não tem avaliações" -->
        <div v-if="showNoReviewsMessage" class="no-reviews-message">
            <p>Você ainda não tem avaliações.</p>
        </div>

        <!-- Conteúdo principal que será ocultado quando showNoReviewsMessage for true -->
        <div v-else>
            <div class="row card-score">
                <div class="col-md-auto align-items-center score-data">
                    <h4>Média de avaliações</h4>
                    <h5>
                        {{ dataScore.genetalScore.toFixed(1) }}
                        <span class="stars">
                            <span v-for="(star, index) in 5" :key="index">
                                <span class="icon-base icon-star" :class="Math.trunc(dataScore.genetalScore) >= star ? 'on' : ''"></span>
                            </span>
                        </span>
                    </h5>
                    <span class="card-percent" :class="dataScore.compare[intervalSelected] > 0 ? 'icon-var-up' : 'icon-var-down'">
                        {{ Math.abs(dataScore.compare[intervalSelected]) }}%
                    </span>
                    <span class="hint">comparado {{ intervalSelected === "oneMonth" ? "ao" : "aos" }} {{ intervalsLastLabel[intervalSelected] }}</span>
                </div>
                <div class="col d-flex align-items-center">
                    <table class="score-chart">
                        <tr v-for="(star, index) in dataScore.allStars" :key="index">
                            <td>
                                <span class="label">{{ star }} {{ star === 1 ? 'estrela' : 'estrelas' }}</span>
                            </td>
                            <td>
                                <span class="bar">
                                    <span :class="'star-' + star" :style="{ width: Math.round(dataScore.countStars[star] / dataReviews[intervalSelected].length * 100) + '%' }"></span>
                                </span>
                            </td>
                            <td>
                                <span class="total">{{ Math.round(dataScore.countStars[star] / dataReviews[intervalSelected].length * 100) }}%</span>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="header">
                <div class="row">
                    <div class="col-lg-4 d-flex align-items-center">
                        <h3 class="bold-500">Avaliações ({{ dataReviews[intervalSelected].length }})</h3>
                    </div>
                    <div class="col-lg-8 d-flex flex-row-reverse">
                        <Pagination @select-page="selectPage" :pageNumber="pageNumber" :setPageNumber="setPageNumber" :pageRecords="pageRecords" :totalRecords="dataReviews[intervalSelected].length" />
                    </div>
                </div>
            </div>
            <div class="body">
                <div class="user-review" v-for="(review, index) in tableData" :key="index">
                    <h4> {{ review.name }}
                        <span class="stars">
                            <span v-for="(star, index) in 5" :key="index">
                                <span class="icon-base icon-star" :class="Math.trunc(review.stars) >= star ? 'on' : ''"></span>
                            </span>
                        </span>
                    </h4>
                    <p>{{ review.text }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import Pagination from "../Pagination.vue";

export default {
    name: "Reviews",
    props: {
        intervalSelected: String,
        intervalsLastLabel: Object,
        showNoReviewsMessage: {
            type: Boolean,
            default: true
        }
    },
    setup() {
        const pageNumber = ref(1);
        let setPageNumber = (value) => {
            pageNumber.value = value;
        };
        return {
            pageNumber,
            setPageNumber
        };
    },
    data() {
        return {
            tableData: [],
            pageRecords: 5,
            dataScore: {
                genetalScore: 0,
                allStars: [5, 4, 3, 2, 1],
                countStars: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                compare: {
                    sevenDays: 18,
                    oneMonth: -15,
                    sixMonths: 12
                }
            },
            dataReviews: {
                sevenDays: [
                    {
                        name: "Joice Cunha",
                        text: "Cardápio bem variado com ótimas opções, incluindo pratos vegetarianos e veganos. A qualidade dos ingredientes é evidente em cada prato. Foi uma experiência gastronômica muito agradável.",
                        stars: 5
                    },
                    {
                        name: "Lucas Almeida",
                        text: "Ambiente agradável e atendimento excelente. Os garçons foram atenciosos e conheciam bem o cardápio. A decoração é moderna e aconchegante, ideal para um jantar romântico ou uma reunião de negócios.",
                        stars: 4
                    },
                    {
                        name: "Mariana Souza",
                        text: "Comida deliciosa, mas o serviço foi um pouco lento. Esperamos mais de 30 minutos pelo prato principal, o que foi um pouco frustrante. No entanto, os sabores compensaram a espera.",
                        stars: 3
                    },
                    {
                        name: "Felipe Santos",
                        text: "Melhor restaurante da cidade! Recomendo a todos. Desde a entrada até a sobremesa, tudo estava perfeito. A carta de vinhos também é excelente, com muitas opções para harmonizar com os pratos.",
                        stars: 5
                    },
                    {
                        name: "Ana Paula",
                        text: "As sobremesas são incríveis e muito bem servidas. Provei o cheesecake e o mousse de chocolate, e ambos estavam deliciosos. Voltarei com certeza para experimentar outros pratos.",
                        stars: 5
                    },
                    {
                        name: "Roberto Lima",
                        text: "Bom custo-benefício, mas a comida poderia ser mais quente. Alguns pratos chegaram à mesa apenas mornos. Além disso, a apresentação dos pratos poderia ser melhorada.",
                        stars: 3
                    },
                    {
                        name: "Cláudia Menezes",
                        text: "Não gostei do atendimento, muito demorado. Os garçons pareciam estar sobrecarregados, o que afetou a qualidade do serviço. A comida estava boa, mas o tempo de espera foi inaceitável.",
                        stars: 2
                    }
                ],
                oneMonth: [
                    {
                        name: "Roberto Lima",
                        text: "Bom custo-benefício, mas a comida poderia ser mais quente. Alguns pratos chegaram à mesa apenas mornos. Além disso, a apresentação dos pratos poderia ser melhorada.",
                        stars: 3
                    },
                    {
                        name: "Cláudia Menezes",
                        text: "Não gostei do atendimento, muito demorado. Os garçons pareciam estar sobrecarregados, o que afetou a qualidade do serviço. A comida estava boa, mas o tempo de espera foi inaceitável.",
                        stars: 2
                    },
                    {
                        name: "Bruno Oliveira",
                        text: "A localização do restaurante é excelente, e a vista é simplesmente deslumbrante. A comida estava maravilhosa, e o serviço foi impecável. Definitivamente um lugar para voltar.",
                        stars: 5
                    },
                    {
                        name: "Carla Dias",
                        text: "Os pratos são bem servidos e muito saborosos. No entanto, achei os preços um pouco altos para o que é oferecido. O ambiente é agradável, mas pode ficar um pouco barulhento.",
                        stars: 4
                    },
                    {
                        name: "Thiago Fernandes",
                        text: "A variedade no menu é boa, mas senti falta de mais opções de bebidas. O atendimento foi razoável, mas a comida demorou um pouco para chegar. No geral, uma experiência mediana.",
                        stars: 3
                    },
                    {
                        name: "Isabela Costa",
                        text: "Experiência incrível! Desde o momento em que entramos, fomos recebidos com muita cordialidade. Os pratos estavam excelentes e o serviço foi de primeira. Super recomendo!",
                        stars: 5
                    },
                    {
                        name: "Joice Cunha",
                        text: "Cardápio bem variado com ótimas opções, incluindo pratos vegetarianos e veganos. A qualidade dos ingredientes é evidente em cada prato. Foi uma experiência gastronômica muito agradável.",
                        stars: 5
                    },
                    {
                        name: "Lucas Almeida",
                        text: "Ambiente agradável e atendimento excelente. Os garçons foram atenciosos e conheciam bem o cardápio. A decoração é moderna e aconchegante, ideal para um jantar romântico ou uma reunião de negócios.",
                        stars: 4
                    },
                    {
                        name: "Mariana Souza",
                        text: "Comida deliciosa, mas o serviço foi um pouco lento. Esperamos mais de 30 minutos pelo prato principal, o que foi um pouco frustrante. No entanto, os sabores compensaram a espera.",
                        stars: 3
                    },
                    {
                        name: "Felipe Santos",
                        text: "Melhor restaurante da cidade! Recomendo a todos. Desde a entrada até a sobremesa, tudo estava perfeito. A carta de vinhos também é excelente, com muitas opções para harmonizar com os pratos.",
                        stars: 5
                    },
                    {
                        name: "Ana Paula",
                        text: "As sobremesas são incríveis e muito bem servidas. Provei o cheesecake e o mousse de chocolate, e ambos estavam deliciosos. Voltarei com certeza para experimentar outros pratos.",
                        stars: 4
                    },
                    {
                        name: "Ricardo Mendes",
                        text: "A comida é boa, mas o ambiente deixa a desejar. Achei o local um pouco apertado e barulhento. O atendimento foi atencioso, mas acredito que poderiam melhorar a disposição das mesas.",
                        stars: 3
                    }
                ],
                sixMonths: [
                    {
                        name: "Carla Dias",
                        text: "Os pratos são bem servidos e muito saborosos. No entanto, achei os preços um pouco altos para o que é oferecido. O ambiente é agradável, mas pode ficar um pouco barulhento.",
                        stars: 4
                    },
                    {
                        name: "Thiago Fernandes",
                        text: "A variedade no menu é boa, mas senti falta de mais opções de bebidas. O atendimento foi razoável, mas a comida demorou um pouco para chegar. No geral, uma experiência mediana.",
                        stars: 3
                    },
                    {
                        name: "Isabela Costa",
                        text: "Experiência incrível! Desde o momento em que entramos, fomos recebidos com muita cordialidade. Os pratos estavam excelentes e o serviço foi de primeira. Super recomendo!",
                        stars: 5
                    },
                    {
                        name: "Ricardo Mendes",
                        text: "A comida é boa, mas o ambiente deixa a desejar. Achei o local um pouco apertado e barulhento. O atendimento foi atencioso, mas acredito que poderiam melhorar a disposição das mesas.",
                        stars: 3
                    },
                    {
                        name: "Fernanda Silva",
                        text: "Ótimo restaurante para ir com a família. O menu infantil é bem pensado e as crianças adoraram. O serviço é rápido e eficiente, e os preços são justos.",
                        stars: 4
                    },
                    {
                        name: "Gabriel Oliveira",
                        text: "Fui com um grupo de amigos e todos gostaram muito. Os pratos são bem servidos e o tempero é na medida certa. A carta de drinks também é bem variada e com opções deliciosas.",
                        stars: 5
                    },
                    {
                        name: "Patrícia Pereira",
                        text: "O restaurante tem um ambiente muito acolhedor, e o serviço é bastante atencioso. A comida é boa, mas senti falta de mais opções saudáveis no cardápio.",
                        stars: 3
                    },
                    {
                        name: "Júlio Cesar",
                        text: "A experiência foi boa, mas o estacionamento é pequeno e tivemos que esperar por uma vaga. O atendimento foi rápido e a comida estava saborosa, mas o preço é um pouco alto.",
                        stars: 4
                    },
                    {
                        name: "Natália Souza",
                        text: "Adorei o ambiente do restaurante, muito bem decorado e aconchegante. O cardápio é variado e a comida é deliciosa. O atendimento foi excelente, voltarei com certeza.",
                        stars: 5
                    },
                    {
                        name: "Pedro Henrique",
                        text: "A comida é muito boa, mas o restaurante estava muito cheio e tivemos que esperar bastante por uma mesa. O atendimento é bom, mas poderia ser mais ágil.",
                        stars: 3
                    },
                    {
                        name: "Larissa Costa",
                        text: "Um dos melhores restaurantes que já fui! A comida é excelente, o ambiente é aconchegante e o atendimento é impecável. Recomendo a todos.",
                        stars: 5
                    },
                    {
                        name: "Renato Lima",
                        text: "Gostei muito do restaurante, principalmente das opções de entrada. A sobremesa também estava deliciosa. O preço é justo pelo que é oferecido.",
                        stars: 4
                    },
                    {
                        name: "Daniela Martins",
                        text: "A comida é boa, mas o atendimento deixou a desejar. Os garçons pareciam desatentos e tivemos que pedir várias vezes por alguns itens.",
                        stars: 2
                    },
                    {
                        name: "Joice Cunha",
                        text: "Cardápio bem variado com ótimas opções, incluindo pratos vegetarianos e veganos. A qualidade dos ingredientes é evidente em cada prato. Foi uma experiência gastronômica muito agradável.",
                        stars: 5
                    },
                    {
                        name: "Lucas Almeida",
                        text: "Ambiente agradável e atendimento excelente. Os garçons foram atenciosos e conheciam bem o cardápio. A decoração é moderna e aconchegante, ideal para um jantar romântico ou uma reunião de negócios.",
                        stars: 4
                    },
                    {
                        name: "Mariana Souza",
                        text: "Comida deliciosa, mas o serviço foi um pouco lento. Esperamos mais de 30 minutos pelo prato principal, o que foi um pouco frustrante. No entanto, os sabores compensaram a espera.",
                        stars: 3
                    },
                    {
                        name: "Felipe Santos",
                        text: "Melhor restaurante da cidade! Recomendo a todos. Desde a entrada até a sobremesa, tudo estava perfeito. A carta de vinhos também é excelente, com muitas opções para harmonizar com os pratos.",
                        stars: 5
                    },
                    {
                        name: "Ana Paula",
                        text: "As sobremesas são incríveis e muito bem servidas. Provei o cheesecake e o mousse de chocolate, e ambos estavam deliciosos. Voltarei com certeza para experimentar outros pratos.",
                        stars: 4
                    },
                    {
                        name: "Roberto Lima",
                        text: "Bom custo-benefício, mas a comida poderia ser mais quente. Alguns pratos chegaram à mesa apenas mornos. Além disso, a apresentação dos pratos poderia ser melhorada.",
                        stars: 3
                    },
                    {
                        name: "Cláudia Menezes",
                        text: "Não gostei do atendimento, muito demorado. Os garçons pareciam estar sobrecarregados, o que afetou a qualidade do serviço. A comida estava boa, mas o tempo de espera foi inaceitável.",
                        stars: 2
                    },
                    {
                        name: "Bruno Oliveira",
                        text: "A localização do restaurante é excelente, e a vista é simplesmente deslumbrante. A comida estava maravilhosa, e o serviço foi impecável. Definitivamente um lugar para voltar.",
                        stars: 5
                    },
                    {
                        name: "Carlos Alberto",
                        text: "Restaurante com uma boa variedade de pratos e um ambiente agradável. O atendimento foi rápido e eficiente, e os preços são razoáveis.",
                        stars: 4
                    },
                    {
                        name: "Raquel Fernandes",
                        text: "Comida maravilhosa, ambiente acolhedor e atendimento excelente. Recomendo a todos que querem ter uma ótima experiência gastronômica.",
                        stars: 5
                    },
                    {
                        name: "Alexandre Gonçalves",
                        text: "O ambiente é bom, mas a comida deixou a desejar. Achei os pratos um pouco sem sabor e a apresentação poderia ser melhor.",
                        stars: 3
                    },
                    {
                        name: "Camila Ribeiro",
                        text: "Ótima opção para um jantar especial. O cardápio é variado e a comida é deliciosa. O atendimento foi excelente e o ambiente é muito agradável.",
                        stars: 5
                    }
                ]
            }
        };
    },
    methods: {
        selectPage(page) {
            let startIndex = (page - 1) * this.pageRecords;
            this.tableData = this.dataReviews[this.intervalSelected].slice(startIndex, startIndex + this.pageRecords);
        },
        calculateScore() {
            this.dataScore.countStars = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            this.selectPage(1);
            this.setPageNumber(1);
            this.dataScore.genetalScore = this.dataReviews[this.intervalSelected].reduce(function (accumulator, review) {
                return accumulator + review.stars;
            }, 0) / this.dataReviews[this.intervalSelected].length;
            for (var i = 0; i < this.dataReviews[this.intervalSelected].length; i++) {
                this.dataScore.countStars[this.dataReviews[this.intervalSelected][i].stars]++;
            }
        }
    },
    components: {
        Pagination
    },
    created() {
        this.calculateScore();
    }
};
</script>

<style lang="scss" scoped>
.no-reviews-message {
    text-align: center;
    font-size: 18px;
    color: #999;
    padding: 20px;
}

.icon-base {
    width: 14px;
    height: 14px;
    display: inline-block;
    position: relative;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 14px 14px;
    margin-bottom: -6px;
    margin-right: 3px;
}

.card-review {
    h3.title {
        font-size: 16px;
        font-weight: 500;
        margin-top: 10px;
        padding-bottom: 12px;
        border-bottom: 1px solid #ddd;
    }

    .header {
        padding-bottom: 10px;
        h3 {
            margin: 3px 0 0 0;
            padding: 0;
            line-height: 1;
            font-weight: 500;
            font-size: 16px;
        }
        span {
            color: #999;
            margin: 0;
            padding: 0;
            line-height: 1;
            font-weight: 400;
            font-size: 14px;
        }
        .icon-next {
            width: 16px;
            height: 16px;
            display: inline-block;
            position: relative;
            bottom: -2px;
            margin-left: 12px;
            background-position: center center;
            background-repeat: no-repeat;
            opacity: 0.6;
        }
    }
    .body {
        .user-review {
            background-color: #f9f9f9;
            color: #666;
            padding: 20px;
            margin-bottom: 15px;
            border-radius: 4px;
            h4 {
                font-weight: 500;
                font-size: 16px;
            }
            p {
                font-weight: 400;
                font-size: 16px;
                margin-bottom: 0;
            }
            .stars {
                margin-left: 10px;
            }
        }
    }

    .card-score {
        padding: 30px 10px 20px 10px;
        .score-data {
            border-right: 1px solid #ddd;
            padding: 20px 60px;
            margin-right: 45px;
            h4 {
                font-size: 18px;
                font-weight: 450;
                margin-bottom: 3px;
            }
            h5 {
                font-size: 30px;
                font-weight: 700;
                margin-bottom: 20px;
            }
            .stars {
                display: inline-block;
                transform: translateY(-10px);
            }
            .hint {
                display: block;
                margin-top: 3px;
            }
        }
    }

    .score-chart {
        td {
            padding-top: 3px;
            padding-bottom: 3px;
        }
        .label {
            font-size: 16px;
            font-weight: 450;
        }
        .bar {
            display: block;
            width: 180px;
            height: 10px;
            margin-left: 10px;
            margin-right: 10px;
            border-radius: 5px;
            background-color: #f9f9f9;
            .star-1, .star-2 {
                display: block;
                height: 10px;
                border-radius: 5px 0 0 5px;
                background-color: #e57373;
            }
            .star-3 {
                display: block;
                height: 10px;
                border-radius: 5px 0 0 5px;
                background-color: #ffeb3b;
            }
            .star-4, .star-5 {
                display: block;
                height: 10px;
                border-radius: 5px 0 0 5px;
                background-color: #81c784;
            }
        }
        .total {
            font-size: 16px;
        }
    }
}
</style>
