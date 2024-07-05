<template>
    <div class="container-base">
        <div>
            <div class="nav-tab" :class="selectedTab === 'general' ? 'active' : ''" @click="selectTab('general')">Geral</div>
            <div class="nav-tab" :class="selectedTab === 'categories' ? 'active' : ''" @click="selectTab('categories')">Categorias</div>
            <div class="nav-tab" :class="selectedTab === 'items' ? 'active' : ''" @click="selectTab('items')">Página de itens</div>
            <div class="nav-tab" :class="selectedTab === 'complement' ? 'active' : ''" @click="selectTab('complement')">Complementos</div>
        </div>
        <div class="container-tabs">
            <div class="general" v-show="selectedTab === 'general'">
                <NavGeneral :dataMenu="dataMenu" />
            </div>
            <div class="categories" v-show="selectedTab === 'categories'">
                <NavCategories :dataMenu="dataMenu" />
            </div>
            <div class="items" v-show="selectedTab === 'items'">
                <NavItems :dataMenu="dataMenu" />
            </div>
            <div class="complement" v-show="selectedTab === 'complement'">
                <NavComplement :dataMenu="dataMenu" />
            </div>
        </div>
    </div>
</template>

<script>
    import NavGeneral from "./NavGeneral.vue"
    import NavCategories from "./NavCategories.vue"
    import NavItems from "./NavItems.vue"
    import NavComplement from "./NavComplement.vue"

    export default {
        name: "Menu",
        components: {
            NavGeneral,
            NavCategories,
            NavItems,
            NavComplement
        },
        data() {
            return {
                selectedTab: "general",
                allCategories: []
            }            
        },
        methods: {
            selectTab(tab) {
                this.selectedTab = tab;
            }
        },
        props: {
            dataMenu: Object
        }
    };
</script>