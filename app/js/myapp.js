var app = new Vue({
    el: '#app',
    data: {
        entrenadores: [],
        selectedEntrenador: null,
        batallaEntrenador1: null,
        batallaEntrenador2: null,
        showBattleModal: false,
        countdown: 0
    },
    created() {
        fetch('app/json/pokemon_data.json')
            .then(response => response.json())
            .then(data => {
                this.entrenadores = data;
            })
            .catch(error => {
                console.error('Error al cargar entrenadores:', error);
            });
    },
    methods: {
        selectEntrenador(entrenador) {
            this.selectedEntrenador = entrenador;
            document.body.classList.add('overflow-hidden');
        },
        closeEntrenador() {
            this.selectedEntrenador = null;
            document.body.classList.remove('overflow-hidden');
        },
        closeModalOutside(event) {
            if (event.target === event.currentTarget) {
                this.closeEntrenador();
            }
        },
        selectForBattle(entrenador) {
            if (!this.batallaEntrenador1) {
                this.batallaEntrenador1 = entrenador;
            } else if (!this.batallaEntrenador2) {
                this.batallaEntrenador2 = entrenador;
            }
        },
        removeBattleEntrenador(entrenador) {
            if (this.batallaEntrenador1 === entrenador) {
                this.batallaEntrenador1 = null;
            } else if (this.batallaEntrenador2 === entrenador) {
                this.batallaEntrenador2 = null;
            }
        },
        startNewBattle() {
            if (this.batallaEntrenador1 && this.batallaEntrenador2) {
                this.countdown = 3;
                const countdownInterval = setInterval(() => {
                    this.countdown--;
                    if (this.countdown === 0) {
                        clearInterval(countdownInterval);
                        this.showBattleModal = true;
                        document.body.classList.add('overflow-hidden');
                    }
                }, 1000);
            }
        },
        closeBattleModal() {
            this.showBattleModal = false;
            this.batallaEntrenador1 = null;
            this.batallaEntrenador2 = null;
            this.countdown = 0;
            document.body.classList.remove('overflow-hidden');
        },
        closeBattleModalOutside(event) {
            if (event.target === event.currentTarget) {
                this.closeBattleModal();
            }
        },
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },
    template: `
        <div class="container">
            <div id="entrenadores">
                <h1 class="title">Entrenadores Pokémon ({{ entrenadores.length }})</h1>
                <div class="button-container">
                    <button @click="startNewBattle" :disabled="!batallaEntrenador1 || !batallaEntrenador2" class="button new-battle-button" :class="{ 'disabled-button': !batallaEntrenador1 || !batallaEntrenador2 }">Nuevo combate</button>
                </div>
                <div class="selected-trainers">
                    <div v-if="batallaEntrenador1" class="selected-trainer">
                        {{ batallaEntrenador1.entrenador }}
                        <button @click="removeBattleEntrenador(batallaEntrenador1)" class="remove-button">&times;</button>
                    </div>
                    <div v-if="batallaEntrenador2" class="selected-trainer">
                        {{ batallaEntrenador2.entrenador }}
                        <button @click="removeBattleEntrenador(batallaEntrenador2)" class="remove-button">&times;</button>
                    </div>
                </div>
                <div class="grid">
                    <div v-for="entrenador in entrenadores" :key="entrenador.entrenador" class="card">
                        <img :src="entrenador.imagen" alt="entrenador.entrenador" class="trainer-image">
                        <h2 class="trainer-name">{{ entrenador.entrenador }}</h2>
                        <div class="button-group">
                          <button @click="selectEntrenador(entrenador)" class="button view-pokemon-button">Ver Pokémons</button>
                          <button @click="selectForBattle(entrenador)" class="button select-battle-button">Seleccionar para combate</button>
                        </div>
                    </div>
                </div>
                <div class="scroll-to-top">
                    <button @click="scrollToTop" class="button scroll-to-top-button">Ir al principio</button>
                </div>
            </div>
            <div v-if="selectedEntrenador" class="modal" @click="closeModalOutside">
                <div class="modal-content" @click.stop>
                    <div class="modal-header">
                        <h2 class="modal-title">{{ selectedEntrenador.entrenador }}</h2>
                        <button @click="closeEntrenador" class="modal-close-button">&times;</button>
                    </div>
                    <div class="modal-grid">
                        <div v-for="pokemon in selectedEntrenador.pokemons" :key="pokemon.nombre" class="pokemon-card">
                            <img :src="pokemon.imagen" alt="pokemon.nombre" class="pokemon-image">
                            <h3 class="pokemon-name">{{ pokemon.nombre }}</h3>
                        </div>
                    </div>
                    <button @click="closeEntrenador" class="button modal-close-button">Cerrar</button>
                </div>
            </div>
            <div v-if="showBattleModal" class="modal" @click="closeBattleModalOutside">
                <div class="modal-content" @click.stop>
                    <div class="modal-header">
                        <h2 class="modal-title">Nuevo combate entre {{ batallaEntrenador1.entrenador }} vs {{ batallaEntrenador2.entrenador }}</h2>
                        <button @click="closeBattleModal" class="modal-close-button">&times;</button>
                    </div>
                    <div class="modal-grid">
                        <div class="battle-trainer">
                            <h3 class="trainer-name">{{ batallaEntrenador1.entrenador }}</h3>
                            <div class="pokemon-grid">
                                <div v-for="pokemon in batallaEntrenador1.pokemons" :key="pokemon.nombre" class="pokemon-card">
                                    <img :src="pokemon.imagen" alt="pokemon.nombre" class="pokemon-image">
                                    <h4 class="pokemon-name">{{ pokemon.nombre }}</h4>
                                </div>
                            </div>
                        </div>
                        <div class="battle-trainer">
                            <h3 class="trainer-name">{{ batallaEntrenador2.entrenador }}</h3>
                            <div class="pokemon-grid">
                                <div v-for="pokemon in batallaEntrenador2.pokemons" :key="pokemon.nombre" class="pokemon-card">
                                    <img :src="pokemon.imagen" alt="pokemon.nombre" class="pokemon-image">
                                    <h4 class="pokemon-name">{{ pokemon.nombre }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button @click="closeBattleModal" class="button modal-close-button">Cerrar</button>
                </div>
            </div>
            <div v-if="countdown > 0" class="modal countdown-modal">
                <div class="countdown">{{ countdown }}</div>
            </div>
        </div>
    `
});
