    <template>
    <div>
        <div>
        <input 
            type="text" 
            id="address" 
            v-model="address" 
            placeholder="Digite o endereço, cidade ou CEP" 
            style="width: 300px; padding: 5px; margin-bottom: 10px;"
        />
        </div>
        <div>
        <div id="map" style="width: 100%; height: 400px;"></div>
        </div>
        <form @submit.prevent="submitLocation">
        <div>
            <label for="latitude">Latitude:</label>
            <input type="text" id="latitude" v-model="latitude" readonly />
        </div>
        <div>
            <label for="longitude">Longitude:</label>
            <input type="text" id="longitude" v-model="longitude" readonly />
        </div>
        <div>
            <label for="street">Rua:</label>
            <input type="text" id="street" v-model="street" readonly />
        </div>
        <div>
            <label for="number">Número:</label>
            <input type="text" id="number" v-model="number" readonly />
        </div>
        <div>
            <label for="neighborhood">Bairro:</label>
            <input type="text" id="neighborhood" v-model="neighborhood" readonly />
        </div>
        <div>
            <label for="city">Cidade:</label>
            <input type="text" id="city" v-model="city" readonly />
        </div>
        <div>
            <label for="state">Estado:</label>
            <input type="text" id="state" v-model="state" readonly />
        </div>
        <div>
            <label for="country">País:</label>
            <input type="text" id="country" v-model="country" readonly />
        </div>
        <div>
            <label for="postal_code">CEP:</label>
            <input type="text" id="postal_code" v-model="postal_code" readonly />
        </div>
        <div>
            <label for="complement">Complemento:</label>
            <input type="text" id="complement" v-model="complement" />
        </div>
        <button type="submit">Submit</button>
        </form>
    </div>
    </template>

    <script>
    export default {
    data() {
        return {
        address: '',
        map: null,
        marker: null,
        latitude: '',
        longitude: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        complement: '',
        center: { lat: -23.55052, lng: -46.633308 }
        };
    },
    mounted() {
        this.initMap();
        this.initAutocomplete();
    },
    methods: {
        initMap() {
        this.map = new google.maps.Map(document.getElementById("map"), {
            center: this.center,
            zoom: 10
        });

        this.marker = new google.maps.Marker({
            position: this.center,
            map: this.map,
            draggable: true
        });

        this.map.addListener("click", (event) => {
            this.updateLocation(event.latLng);
        });

        this.marker.addListener("dragend", (event) => {
            this.updateLocation(event.latLng);
        });
        },
        initAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(document.getElementById('address'), {
            types: ['geocode'],
            componentRestrictions: { country: 'br' }
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
            this.updateLocation(place.geometry.location);
            this.fillAddressComponents(place.address_components);
            }
        });
        },
        updateLocation(location) {
        this.marker.setPosition(location);
        this.map.panTo(location);
        this.latitude = location.lat();
        this.longitude = location.lng();
        this.getAddressFromLatLng(location);
        },
        getAddressFromLatLng(location) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location }, (results, status) => {
            if (status === 'OK' && results[0]) {
            this.fillAddressComponents(results[0].address_components);
            } else {
            alert('Geocode was not successful for the following reason: ' + status);
            }
        });
        },
        fillAddressComponents(components) {
        const componentForm = {
            street_number: 'number',
            route: 'street',
            sublocality_level_1: 'neighborhood',
            locality: 'city',
            administrative_area_level_2: 'city', // Adicionado
            administrative_area_level_1: 'state',
            country: 'country',
            postal_code: 'postal_code'
        };

        components.forEach(component => {
            component.types.forEach(type => {
            if (componentForm[type]) {
                this[componentForm[type]] = component.long_name;
            }
            });
        });
        },
        submitLocation() {
        alert(`Latitude: ${this.latitude}, Longitude: ${this.longitude}`);
        // Aqui você pode enviar os dados para seu servidor
        }
    }
    };
    </script>
