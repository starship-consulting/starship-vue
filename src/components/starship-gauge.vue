<template>
    <div class="starship-gauge" ref="chart"></div>
</template>

<style scoped>
    .starship-gauge {
        display: block;
        position: relative;
        width: 100% !important;
        margin: 0 auto;
    }
</style>

<script>
    import { Component } from 'starship';
    import Highcharts from 'highcharts'
    import HighchartsMore from 'highcharts/highcharts-more'
    import SolidGauge from 'highcharts/modules/solid-gauge'

    HighchartsMore(Highcharts);
    SolidGauge(Highcharts);

    export default Component('starship-gauge', {

        properties: {
            $options: null,
            $width: 0,
            $height: 0,
            $title: '',
            chart: null,
            isMounted: false
        },

        watch: {

            options() {
                this.updateChart();
            }
        },

        ready: function () {
            this.isMounted = true;
            this.updateChart();

            /*window.addEventListener('resize', () => {
                console.log(new Date())
                this.chart.highcharts().reflow();
            });*/
        },

        updateChart() {
            if (this.isMounted && this.options) {

                //this.unloadChart();

                this.options.credits = {
                    enabled: false
                };

                if (this.width) {
                    this.options.chart.width = this.width;
                }

                if (this.height) {
                    this.options.chart.height = this.height;
                }

                this.options.chart = this.options.chart || {};
                this.options.chart.events = this.options.chart.events || {};

                this.$nextTick(() => {
                    if (this.chart) {
                        this.chart.update(this.options);
                    }
                    else {
                        this.chart = Highcharts.chart(this.$refs.chart, this.options);
                    }
                });
            }
        },

        unloadChart() {
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }
        },

        beforeDestroy: function () {
            this.unloadChart();
        }
    });
</script>