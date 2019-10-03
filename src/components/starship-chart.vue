<template>
    <div class="starship-chart" ref="chart"></div>
</template>

<style scoped>
    .starship-chart {
        position: relative;
        width: 100% !important;
        margin: 0 auto;
    }
</style>

<script>
    import { Component } from 'starship';
    import Highcharts from 'highcharts';
    import BulletChart from 'highcharts/modules/bullet';

    BulletChart(Highcharts);
    
    export default Component('starship-chart', {

        properties: {
            $options: null,
            $width: 0,
            $height: 0,
            $type: 'chart',
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

                this.options.chart.events.load = this.options.chart.events.load || ((e) => {
                    this.$nextTick(() => {
                        //this.chart.reflow();
                    });
                });

                /*this.options.chart.events.redraw = this.options.chart.events.redraw || function() {
                    Highcharts.setAnimation(true, this);
                };*/

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