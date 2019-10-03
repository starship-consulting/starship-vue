<template>
    <google-map ref="map" :zoom="12" :center="center" style="width: 100%; height: 100%;">
        <GmapMarker :key="index" v-for="(marker, index) in items" :position="marker.position" :clickable="true" :draggable="true" />
        <!-- @click="center=marker.position"-->
    </google-map>
</template>

<style lang="scss">

</style>

<script>
    import { Component } from 'starship';
    import { gmapApi } from 'vue2-google-maps';
    
    export default Component('starship-google-map', {

        properties: {

            $latitude: 0.0,
            $longitude: 0.0,
            $markers: [],

            mapInitialized: false,

            center() {
                return { lat: this.latitude, lng: this.longitude }
            },

            items() {
                return this.markers.map(marker => {
                    return {
                        position: new google.maps.LatLng(marker.latitude, marker.longitude)
                    };
                });
            }
        },

        watch: {

            mapInitialized() {
                this.updateMap();
            },

            markers: {
                immediate: true,

                handler() {
                    setTimeout(this.updateMap, 1);
                }
            }
        },

        updateMap() {

            if (this.items && this.items.length && this.mapInitialized) {

                let bounds = new google.maps.LatLngBounds();
                
                this.items.each(marker => {
                    bounds.extend(marker.position);
                });
                        
                this.$refs.map.fitBounds(bounds);
            }
        },

        ready() {
            this.$refs.map.$mapPromise.then((map) => {
                this.mapInitialized = true;
            });
        }
    });
</script>