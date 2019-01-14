<template>
<form class="form-group">
    <label for="locationName">Enter the name of the place</label>
    <input type="text" id="locationName" class="form-control" v-model="data.location.name">
    <button class="form-control"> Geolocation </button>
</form>
</template>

<script>
export default {
    data() {
        return {
            data: {
                location: {
                    name: "",
                    lat: "",
                    long: ""
                },
                waitedTime: "",
                estimatedTime: "",
                endedAt: ""
            }
        }
    }
}

function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=> {
            
        });
    }
}
</script>

<style>
label {
    display: inline-block;
}
</style>
