<template>
  <v-main>
    <div>
      <v-card>
        <div id="map" style="width:auto; height:780px;" />
      </v-card>
    </div>
  </v-main>
</template>

<script>
export default {
  async asyncData ({ $axios }) {
    const response = await $axios.get('/api/position/marker')
    if (response.status === 200) {
      return {
        marker: response.data
      }
    }
  },
  data () {
    return {

    }
  },
  watch: {

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
      // 지도 생성
      const container = document.getElementById('map')
      const options = {
        center: new kakao.maps.LatLng(37.473836720026874, 127.14338151549067),
        level: 5
      }
      const map = new kakao.maps.Map(container, options)
      for (const i of this.marker) {
        if (this.marker.indexOf(i) % 2 === 0) {
          // 출발 마커
          const startSrc = require('@/assets/image/start_marker3.png')
          const startSize = new kakao.maps.Size(20, 10)
          const startOption = {
            offset: new kakao.maps.Point(15, 45)
          }
          const startImage = new kakao.maps.MarkerImage(startSrc, startSize, startOption)
          const startPosition = new kakao.maps.LatLng(i.R_LAT, i.R_LNG)
          const startMarker = new kakao.maps.Marker({
            position: startPosition,
            image: startImage
          })
          startMarker.setMap(map)
        } else {
          // 도착 마커
          // const arriveSrc = require('@/assets/image/arrive_marker.png')
          const arriveSrc = 'http://t1.daumcdn.net/localimg/localimages/07/2018/pc/img/marker_spot.png'
          const arriveSize = new kakao.maps.Size(20, 10)
          const arriveOption = {
            offset: new kakao.maps.Point(15, 45)
          }
          const arriveImage = new kakao.maps.MarkerImage(arriveSrc, arriveSize, arriveOption)
          const arrivePosition = new kakao.maps.LatLng(i.R_LAT, i.R_LNG)
          const arriveMarker = new kakao.maps.Marker({
            position: arrivePosition,
            image: arriveImage
          })
          arriveMarker.setMap(map)
        }
      }
    }
  }
}
</script>

<style>

</style>
