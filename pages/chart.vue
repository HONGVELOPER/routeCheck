<template>
  <v-main>
    <div id="map" style="display: None" />
    <v-row>
      <client-only>
        <v-col cols="6">
          <div class="usageTimeRatio">
            <BarChart :data="usageTimeChartData" :options="usageTimeChartOptions" :height="380" />
          </div>
        </v-col>
      </client-only>
      <client-only>
        <v-col cols="6">
          <div class="ageRatio">
            <BarChart :data="ageChartData" :options="ageChartOptions" :height="380" />
          </div>
        </v-col>
      </client-only>
    </v-row>
    <v-row>
      <client-only>
        <v-col cols="6">
          <div class="genderRatio">
            <BarChart :data="genderChartData" :options="genderChartOptions" :height="380" />
          </div>
        </v-col>
      </client-only>
      <client-only>
        <v-col cols="6">
          <div class="distanceRatio">
            <BarChart :data="distanceChartData" :options="distanceChartOptions" :height="380" />
          </div>
        </v-col>
      </client-only>
    </v-row>
  </v-main>
</template>

<script>
import BarChart from '~/components/BarChart.vue'
export default {
  components: { BarChart },
  async asyncData ({ $axios }) {
    const response = await $axios.get('/api/position/chart')
    if (response.status === 200) {
      return {
        graphData: response.data,
        usageTimeChartData: {
          labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
          datasets: [
            {
              label: 'graph according to the UsageTime',
              backgroundColor: '#f87979',
              data: response.data.usageTime
            }
          ]
        },
        ageChartData: {
          labels: ['10 대', '20 대', '30 대', '40 대', '50 대', '60 대 이상'],
          datasets: [
            {
              label: 'graph according to the Age',
              backgroundColor: '#f87979',
              data: response.data.ageCount
            }
          ]
        },
        genderChartData: {
          labels: ['남성', '여성'],
          datasets: [
            {
              label: 'graph according to the Gender',
              backgroundColor: '#f87979',
              data: response.data.genderCount
            }
          ]
        },
        barChartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            mode: 'single',
            callbacks: {
              title: (tooltipItem, data) => {
                return data.label
              }
            }
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  bieginAtZero: true,
                  max: 100,
                  min: 0,
                  stepsize: 1
                },
                gridLines: {
                  display: true
                }
              }
            ]
          }
        }
      }
    }
  },
  data () {
    return {
      usageTime_label: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      age_label: ['10대', '20대', '30대', '40대', '50대', '60대 이상'],
      distance: [],
      distanceCount: [0, 0, 0, 0, 0, 0, 0],
      distanceChartData: {
        labels: ['1km 미만', '1 ~ 3km', '3 ~ 5km', '5 ~ 7km', '7 ~ 9km', '9 ~ 11km', '11km 이상'],
        datasets: [
          {
            label: 'graph according to the Distance',
            backgroundColor: '#f87979'
            // data: [1, 2, 3, 4, 5, 6, 7]
          }
        ]
      },
      usageTimeChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: 'single',
          callbacks: {
            title: (tooltipItem, data) => {
              return data.label
            }
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                bieginAtZero: true,
                max: 50,
                min: 0,
                stepsize: 1
              },
              gridLines: {
                display: true
              }
            }
          ]
        }
      },
      ageChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: 'single',
          callbacks: {
            title: (tooltipItem, data) => {
              return data.label
            }
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                bieginAtZero: true,
                max: 200,
                min: 0,
                stepsize: 1
              },
              gridLines: {
                display: true
              }
            }
          ]
        }
      },
      genderChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: 'single',
          callbacks: {
            title: (tooltipItem, data) => {
              return data.label
            }
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                bieginAtZero: true,
                max: 300,
                min: 0,
                stepsize: 1
              },
              gridLines: {
                display: true
              }
            }
          ]
        }
      },
      distanceChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: 'single',
          callbacks: {
            title: (tooltipItem, data) => {
              return data.label
            }
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                bieginAtZero: true,
                max: 200,
                min: 0,
                stepsize: 1
              },
              gridLines: {
                display: true
              }
            }
          ]
        }
      }
    }
  },
  mounted () {
    if (window.kakao && window.kakao.maps) {
      this.initMap()
    } else {
      const script = document.createElement('script')
      script.onload = () => kakao.maps.load(this.initMap)
      script.src = 'http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=d7e202cbf950de5b1b4c7b698b00a3c3'
      document.head.appendChild(script)
    }
  },
  methods: {
    initMap () {
      const container = document.getElementById('map')
      const options = {
        center: new kakao.maps.LatLng(37.473836720026874, 127.14338151549067),
        level: 5
      }
      const map = new kakao.maps.Map(container, options)
      console.log(map, 'map')
      const result = this.getDistance(this.graphData.startEndInfo)
      this.distanceChartData.datasets[0].data = result
      console.log(this.distanceChartData.datasets[0], 'checkkkkkkkkkkkk')
    },
    getDistance (dotPoints) {
      let linePath = []
      for (const i of dotPoints) {
        linePath.push(new kakao.maps.LatLng(i.R_LAT, i.R_LNG))
        if (linePath.length === 2) {
          const polyline = new kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 5,
            strokeColor: '#FFAE00',
            strokeOpacity: 0.7,
            strokeStyle: 'solid'
          })
          this.distance.push(polyline.getLength())
          linePath = []
        }
      }
      for (const j of this.distance) {
        if (j < 1000) {
          this.distanceCount[0] += 1
        } else if (j >= 1000 && j < 3000) {
          this.distanceCount[1] += 1
        } else if (j >= 3000 && j < 5000) {
          this.distanceCount[2] += 1
        } else if (j >= 5000 && j < 7000) {
          this.distanceCount[3] += 1
        } else if (j >= 7000 && j < 9000) {
          this.distanceCount[4] += 1
        } else if (j >= 9000 && j < 1100) {
          this.distanceCount[5] += 1
        } else {
          this.distanceCount[6] += 1
        }
      }
      return this.distanceCount
    }
  }
}
</script>

<style>

</style>
