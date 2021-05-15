<template>
  <v-container>
    <!-- <v-btn @click="rectangleArea(bound)">
      click Me
    </v-btn> -->
    <v-overflow-btn
      class="my-2"
      :items="interval"
      v-model="selected"
      label="시간을 선택해주세요."
    >
    </v-overflow-btn>
    <div v-if="selected !== null">
      <div v-if="parseInt(selected) + 1 < 10">
        {{ selected }} 시부터 0{{ parseInt(selected) + 1 }} 시 까지의 누적 지도입니다.
      </div>
      <div v-else>
        {{ selected }} 시부터 {{ parseInt(selected) + 1 }} 시 까지의 누적 지도입니다.
      </div>
    </div>
    <v-card>
      <div id="map" style="width:auto; height:550px;" />
    </v-card>
  </v-container>
</template>

<script>
const pointInPolygon = require('point-in-polygon')
export default {
  data: () => ({
    selected: null,
    interval: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '17', '18', '19', '20', '21', '22', '23'],
    oneUser: [],
    copyUser: [],
    bound: [],
    secondBound: [],
    color: [
      '#FFEC19',
      '#FFE219',
      '#FFCE19',
      '#FFB819',
      '#FF9C19',
      '#FF8019',
      '#FF6519',
      '#FF4819',
      '#FF3119',
      '#FF1F19'
    ],
    point: [],
    all_of_poly: [],
    guide: null
  }),
  watch: {
    selected (newValue) {
      if (newValue !== null) {
        this.all_of_poly = []
        this.bound = []
        this.oneUser = []
        this.copyUser = []
        this.getIntervalMap()
      }
    }
  },
  mounted () {

  },
  methods: {
    showMap () {
      console.log('showmap 진입')
      if (window.kakao && window.kakao.maps) {
        console.log('if문 진입')
        this.initMap()
      } else {
        console.log('else문 진입')
        const script = document.createElement('script')
        script.onload = () => kakao.maps.load(this.initMap)
        script.src = 'http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=d7e202cbf950de5b1b4c7b698b00a3c3'
        document.head.appendChild(script)
        console.log('else finish')
      }
    },
    initMap () {
      // 지도 생성
      console.log('initMap 진입')
      const container = document.getElementById('map')
      const options = {
        center: new kakao.maps.LatLng(37.473836720026874, 127.14338151549067),
        level: 5
      }
      const map = new kakao.maps.Map(container, options)
      // console.log(this.guide, 'guideeeeeeeeeeee')
      // db 사람별로 배열 재정의, 아마 사람 이름이나 index로 재정의 해야 할듯 싶다.
      // console.log(this.guide, 'guide')
      for (const i of this.guide) {
        if (i.R_END_TIME === '0') {
          this.oneUser.push(i)
        } else {
          this.oneUser.push(i)
          this.copyUser.push(this.oneUser)
          this.oneUser = []
        }
      }

      // 바운드 마다 몇개의 (위도, 경도) 좌표가 있는지 counting 및 polyline 색 정하기
      for (const i of this.copyUser) {
        for (const j of i) {
          const linePath = []
          // const point = []
          this.point = []
          if (i.indexOf(j) < i.length - 1) {
            this.point.push(j)
            this.point.push(i[i.indexOf(j) + 1])
            const kakaoRectangle = this.makeRectangle(this.point) // secondBound, kakaoBound 생성
            kakaoRectangle.setMap(map)
            linePath.push(new kakao.maps.LatLng(this.point[0].R_LAT, this.point[0].R_LNG))
            linePath.push(new kakao.maps.LatLng(this.point[1].R_LAT, this.point[1].R_LNG))
            for (const k of this.bound) {
              // k 는 secondBound 배열이다.
              const polyline = new kakao.maps.Polyline({
                endArrow: true,
                path: linePath,
                strokeWeight: 1,
                strokeOpacity: 0.8,
                strokeStyle: 'solid'
              })
              let squareBound = null
              squareBound = [k[0], k[1], k[2], k[3]]
              if ((pointInPolygon([this.point[0].R_LAT, this.point[0].R_LNG], squareBound)) && (pointInPolygon([this.point[1].R_LAT, this.point[1].R_LNG], squareBound))) {
                k[4].count += 1
                this.all_of_poly.push(polyline)
              }
            }
          }
        }
      }
      // bound count 숫자에 따른 polyline 생 지정
      let index = 0
      for (const i of this.all_of_poly) {
        if (this.bound[index]) {
          const iterator = this.bound[index]
          i.Eb[0].strokeColor = this.color[iterator[4].count]
          index += 1
        }
        i.setMap(map)
      }
    },

    // way = [[위도, 경도], [위도, 경도]] 데이터 이다.
    // linePath가 오른쪽으로 움직일때
    toEast (way) {
      const array = []
      let sw = null
      let ne = null
      // 오른쪽 위로 움직일때
      if (parseFloat(way[1].R_LAT) >= parseFloat(way[0].R_LAT)) {
        sw = new kakao.maps.LatLng(parseFloat(way[0].R_LAT) - 0.00003, parseFloat(way[0].R_LNG) - 0.00003)
        ne = new kakao.maps.LatLng(parseFloat(way[1].R_LAT) + 0.00003, parseFloat(way[1].R_LNG) + 0.00003)
      } else {
        // 오른쪽 아래로 움직일때
        sw = new kakao.maps.LatLng(parseFloat(way[0].R_LAT) + 0.00003, parseFloat(way[0].R_LNG) - 0.00003)
        ne = new kakao.maps.LatLng(parseFloat(way[1].R_LAT) - 0.00003, parseFloat(way[1].R_LNG) + 0.00003)
      }
      array.push(sw)
      array.push(ne)
      return array
    },
    // linePath가 왼쪽으로 움직일때
    toWest (way) {
      const array = []
      let sw = null
      let ne = null
      // 왼쪽 위로 움직일때
      if (parseFloat(way[1].R_LAT) >= parseFloat(way[0].R_LAT)) {
        sw = new kakao.maps.LatLng(parseFloat(way[0].R_LAT) - 0.00003, parseFloat(way[0].R_LNG) + 0.00003)
        ne = new kakao.maps.LatLng(parseFloat(way[1].R_LAT) + 0.00003, parseFloat(way[1].R_LNG) - 0.00003)
      } else {
        // 왼쪽 아래로 움직일때
        sw = new kakao.maps.LatLng(parseFloat(way[0].R_LAT) + 0.00003, parseFloat(way[0].R_LNG) + 0.00003)
        ne = new kakao.maps.LatLng(parseFloat(way[1].R_LAT) - 0.00003, parseFloat(way[1].R_LNG) - 0.00003)
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
        this.secondBound.push([location[1].Ma, location[0].La])
        this.secondBound.push([location[1].Ma, location[1].La])
        this.secondBound.push([location[0].Ma, location[1].La])
      } else {
        this.secondBound.push([location[0].Ma, location[0].La])
        this.secondBound.push([location[0].Ma, location[1].La])
        this.secondBound.push([location[1].Ma, location[1].La])
        this.secondBound.push([location[1].Ma, location[0].La])
      }
      this.secondBound.push({ count: 0 })
      this.bound.push(this.secondBound)
    },
    // (위도, 경도) 좌표로 kakao rectangle bound 생성
    makeRectangle (point) {
      // const rectangle_point = []
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
        strokeWeight: 4,
        strokeColor: '#FF3DE5',
        strokeOpacity: 0.6,
        strokeStyle: 'solid',
        fillColor: '#FF8AEF',
        fillOpacity: 0
      })
      return rectangle
    },
    async getIntervalMap () {
      console.log('here?')
      const response = await this.$axios.get(`/api/position/interval?data=${this.selected}`)
      this.guide = []
      if (response.status === 200) {
        this.guide = response.data
        console.log(this.guide)
        return this.showMap()
      }
    }
  }
}
// 10회 주기로 카운팅 해서 색 변경
// 마우스 오버시 정확한 횟수 뜨도록
// 1시간별 이동 기록 지도
// 1시간별 이동 전체 카운트 ()
// 연령별 (10살씩 분기) -> 나이에 따른 이용 카운트
// 각각 진도 분기 시키기
// 일별 전체 카운트
// priority : 시간 > 연령 > 거리
</script>

<style>

</style>
