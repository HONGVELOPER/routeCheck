<template>
  <v-main>
    <div>
      <v-card>
        <div id="map" style="width:auto; height:650px;" />
      </v-card>
    </div>
  </v-main>
</template>

<script>
const pointInPolygon = require('point-in-polygon')
export default {
  async asyncData ({ $axios }) {
    const response = await $axios.get('/api/position/route')
    console.log(response.status, 'data in')
    if (response.status === 200) {
      return {
        guide: response.data
      }
    }
  },
  data () {
    return {
      linePath: null,
      oneUser: [],
      copyUser: [],
      dotCount: 0,
      bound: [],
      secondBound: [],
      color: [
        '#99DDFF',
        '#99BBFF',
        '#9999FF',
        '#9977FF',
        '#9955FF',
        // '#777777',
        '#9911FF',
        '#CC00FF',
        '#CC00BB',
        '#CC0088',
        '#CC0055'
      ],
      colorCount: 0,
      point: [],
      all_of_poly: []
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
    async initMap () {
      // 지도 생성
      const container = document.getElementById('map')
      const options = {
        center: new kakao.maps.LatLng(37.473836720026874, 127.14338151549067),
        level: 5
      }
      const map = new kakao.maps.Map(container, options)

      console.log('map create finish')
      // db 사람별로 배열 재정의, 아마 사람 이름이나 index로 재정의 해야 할듯 싶다.
      for (const i of this.guide) {
        if (i.R_END_TIME === '0') {
          this.oneUser.push(i)
        } else {
          this.oneUser.push(i)
          this.copyUser.push(this.oneUser)
          this.oneUser = []
        }
      }

      console.log('DB 재정렬 완료')

      for (const i of this.copyUser) {
        for (const j of i) {
          const linePath = []
          this.point = []
          if (i.indexOf(j) < i.length - 1) {
            this.point.push(j)
            this.point.push(i[i.indexOf(j) + 1])
            const kakaoRectangle = await this.makeRectangle(this.point) // secondBound, kakaoBound 생성
            kakaoRectangle.setMap(map)
            linePath.push(new kakao.maps.LatLng(this.point[0].R_LAT, this.point[0].R_LNG))
            linePath.push(new kakao.maps.LatLng(this.point[1].R_LAT, this.point[1].R_LNG))
            const polyline = new kakao.maps.Polyline({
              endArrow: true,
              path: linePath,
              // strokeColor: '#FFFFFF',
              strokeWeight: 2,
              strokeOpacity: 0.8,
              strokeStyle: 'solid'
            })
            for (const k of this.bound) {
              const squareBound = [k[0], k[1], k[2], k[3]]
              if ((pointInPolygon([this.point[0].R_LAT, this.point[0].R_LNG], squareBound)) || (pointInPolygon([this.point[1].R_LAT, this.point[1].R_LNG], squareBound))) {
                k[4].count += 1
              }
            }
            this.all_of_poly.push(polyline)
          }
        }
      }
      console.log('select polyline color')

      let index = 0
      for (const i of this.all_of_poly) {
        if (this.bound[index]) {
          const iterator = this.bound[index]
          if (this.color[parseInt(iterator[4].count / 2)]) {
            i.Eb[0].strokeColor = this.color[parseInt(iterator[4].count / 1.5)]
          } else {
            i.Eb[0].strokeColor = this.color[9]
          }
          index += 1
          i.setMap(map)
        }
      }
    },
    // way = [[위도, 경도], [위도, 경도]] 데이터 이다.
    // linePath가 오른쪽으로 움직일때
    toEast (way) {
      // console.log('east')
      const array = []
      let sw = null
      let ne = null
      // 오른쪽 위로 움직일때
      if (parseFloat(way[1].R_LAT) >= parseFloat(way[0].R_LAT)) {
        sw = new kakao.maps.LatLng(parseFloat(way[0].R_LAT) - 0.00003, parseFloat(way[0].R_LNG) - 0.0003)
        ne = new kakao.maps.LatLng(parseFloat(way[1].R_LAT) + 0.00003, parseFloat(way[1].R_LNG) + 0.0003)
      } else {
        // 오른쪽 아래로 움직일때
        sw = new kakao.maps.LatLng(parseFloat(way[0].R_LAT) + 0.00003, parseFloat(way[0].R_LNG) - 0.0003)
        ne = new kakao.maps.LatLng(parseFloat(way[1].R_LAT) - 0.00003, parseFloat(way[1].R_LNG) + 0.0003)
      }
      array.push(sw)
      array.push(ne)
      return array
    },
    // linePath가 왼쪽으로 움직일때
    toWest (way) {
      // console.log('west')
      const array = []
      let sw = null
      let ne = null
      // 왼쪽 위로 움직일때
      if (parseFloat(way[1].R_LAT) >= parseFloat(way[0].R_LAT)) {
        sw = new kakao.maps.LatLng(parseFloat(way[0].R_LAT) - 0.00003, parseFloat(way[0].R_LNG) + 0.0003)
        ne = new kakao.maps.LatLng(parseFloat(way[1].R_LAT) + 0.00003, parseFloat(way[1].R_LNG) - 0.0003)
      } else {
        // 왼쪽 아래로 움직일때
        sw = new kakao.maps.LatLng(parseFloat(way[0].R_LAT) + 0.00003, parseFloat(way[0].R_LNG) + 0.0003)
        ne = new kakao.maps.LatLng(parseFloat(way[1].R_LAT) - 0.00003, parseFloat(way[1].R_LNG) - 0.0003)
      }
      array.push(sw)
      array.push(ne)
      return array
    },
    // (위도, 경도) 마다 rectangle bound 생성
    makeBound (location) {
      this.secondBound = []
      if ((location[1].Ma < location[0].Ma && location[1].La > location[0].La) ||
        (location[1].Ma >= location[0].Ma && location[1].La <= location[0].La)) {
        this.secondBound.push([location[0].Ma, location[0].La])
        this.secondBound.push([location[0].Ma, location[1].La])
        this.secondBound.push([location[1].Ma, location[1].La])
        this.secondBound.push([location[1].Ma, location[0].La])
      } else {
        this.secondBound.push([location[0].Ma, location[0].La])
        this.secondBound.push([location[1].Ma, location[0].La])
        this.secondBound.push([location[1].Ma, location[1].La])
        this.secondBound.push([location[0].Ma, location[1].La])
      }
      this.secondBound.push({ count: 0 })
      this.bound.push(this.secondBound)
    },
    // (위도, 경도) 좌표로 kakao rectangle bound 생성
    makeRectangle (point) {
      // console.log('rectangle~')
      let sw = ''
      let ne = ''
      if (point[1].R_LNG > point[0].R_LNG) {
        const east = this.toEast(point)
        this.makeBound(east)
        sw = east[0]
        ne = east[1]
      } else {
        const west = this.toWest(point)
        this.makeBound(west)
        sw = west[0]
        ne = west[1]
      }
      const rectangleBounds = new kakao.maps.LatLngBounds(sw, ne)
      const rectangle = new kakao.maps.Rectangle({
        bounds: rectangleBounds,
        strokeWeight: 2,
        strokeColor: '#FF3DE5',
        strokeOpacity: 0,
        strokeStyle: 'solid',
        fillColor: '#FF8AEF',
        fillOpacity: 0
      })
      return rectangle
    }
  }
}
</script>

<style>

</style>
