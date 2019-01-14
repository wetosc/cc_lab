<template>
    <div>
        <h2 v-if="form.isPredicted" class="content-head is-center"> Estimated queue size: {{form.predicted}} people. </h2>
        <form class="pure-form pure-form-aligned">
            <fieldset>
                <div class="pure-control-group">
                    <label for="locationName">Location Name</label>
                    <input type="text" id="locationName" v-model="form.location.name">
                </div>
                <div class="pure-control-group">
                    <div v-if="form.location.lat && form.location.long">
                        <label for="location">Latitude: {{form.location.lat.toFixed(4)}} </label>
                        <label for="location">Longitude: {{form.location.long.toFixed(4)}} </label>
                    </div>
                    <button v-else type="button" @click="geolocate" id="location"> Geolocation </button>
                </div>
                
                <div v-if="form.editExtra">
                    <div class="pure-control-group">
                        <label for="peopleNr">People in queue</label>
                        <input min="0" max="100" type="number" id="peopleNr" v-model.number="form.peopleNr">
                    </div>
                    <button type="button" class="pure-button pure-button-primary" @click="save">Save collected info</button>
                </div>

                <button v-else type="button" class="pure-button pure-button-primary" @click="predict">Predict queue size</button>
                <hr>
                <button type="button" class="pure-button pure-button-primary" @click="toggleExtra">{{form.editExtraMsg}}</button>
            </fieldset>
        </form>
</div>
</template>

<script>
require('@/assets/pure-min.css')

export default {
    methods: {
        geolocate: function () {
            const model = this.form.location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position)=> {
                    model.long = position.coords.longitude;
                    model.lat = position.coords.latitude;
                });
            }
        },
        predict: function () {
            const url = "http://api:3000/api/queue/"
            const form = this.form
            if (this.form.id) {
                getData(url + this.form.id).then(function (response) {
                    form.isPredicted = true
                    form.predicted = response.people
                    console.log(response)
                })
            } else {
                const loc = this.form.location
                postData(url, {"location": {name: loc.name, lat: loc.lat, long: loc.long}}).then(function (response) {
                    form.id = response.id
                    console.log(response)
                })
            }
        },
        save: function () {
            const url = "http://api:3000/api/queue/"
            if (this.form.id) {
                postData(url + this.form.id, {"people": this.form.peopleNr}, method="PATCH").then(function (response) {
                    
                })
            } else {
                const loc = this.form.location
                postData(url, {"location": {name: loc.name, lat: loc.lat, long: loc.long}, "people": this.form.peopleNr}).then(function (response) {
                    this.form.id = response.id
                })
            }
        },
        toggleExtra() {
            this.form.editExtraMsg = this.form.editExtra ? "I'm already there" : "I want just predictions"
            this.form.editExtra  = !this.form.editExtra
        }
    },
    data: () => {
        return {
            form: {
                location: {
                    name: "",
                    lat: "",
                    long: ""
                },
                id: "",
                editExtra: false, 
                editExtraMsg: "I'm already there",
                isPredicted: false,
                predicted: 0,
                peopleNr: 0,
            }
        }
    }
}


function postData(url = "", data, method="POST") {
    console.log(JSON.stringify(data))
    return fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: "no-cors", // no-cors, cors, *same-origin
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json());
}

function getData(url = "") {
        return fetch(url).then(response => response.json());
}

</script>

<style>
label {
    display: inline-block;
}
</style>
