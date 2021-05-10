<template>
  <v-main>
    <div>
      <v-btn @click="rectangleArea(bound)">
        click Me
      </v-btn>
      <v-card>
        <div id="map" style="width:auto; height:920px;" />
      </v-card>
    </div>
  </v-main>
</template>

<script>
// const qs = require('qs')
const pointInPolygon = require('point-in-polygon')
export default {
  async asyncData ({ $axios }) {
    const response = await $axios.get('/api/position/route')
    // console.log(response.data, 'dataaaaaaaaaa')
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
      area: [],
      dict: [],
      count: 0,
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
      final: 0
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
        center: new kakao.maps.LatLng(37.48453520929921, 127.15139573922777),
        level: 3
      }
      const map = new kakao.maps.Map(container, options)

      // db 사람별로 배열 재정의, 아마 사람 이름이나 index로 재정의 해야 할듯 싶다.
      for (const i of this.guide) {
        if (i.R_END === 0) {
          this.oneUser.push(i)
        } else {
          this.oneUser.push(i)
          this.copyUser.push(this.oneUser)
          this.oneUser = []
        }
      }

      // polyline 으로 rectangle 만들기 위해 2개씩 배열 자르기(한개씩 중복 및 다른 사람이면 버리기)
      for (const i of this.guide) {
        this.dict.push(i)
        this.count += 1
        if (this.count === 2) {
          this.area.push(this.dict)
          this.dict = []
          this.dict.push(i)
          this.count = 1
        }
        if (i.R_END === 1) {
          this.count = 0
          this.dict = []
        }
      }
      // location 으로 rectangle 생성
      for (const i of this.area) {
        let sw = ''
        let ne = ''
        // const secondBound = []
        if (i[1].R_LNG > i[0].R_LNG) {
          const east = this.toEast(i)
          this.makeBound(east)
          // console.log(this.bound, 'boundddddddddddddd')
          sw = east[0]
          ne = east[1]
          // secondBound.push([sw.Ma, sw.La])
          // secondBound.push([ne.Ma, sw.La])
          // secondBound.push([ne.Ma, ne.La])
          // secondBound.push([sw.Ma, ne.La])
          // this.bound.push(secondBound)
          // this.bound 를 east 로 이동할때만 넣어논거 임시방편임
        } else {
          const west = this.toWest(i)
          this.makeBound(west)
          // console.log(this.bound, 'bounddddddddddddddd')
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
        rectangle.setMap(map)
      }

      // linePath 그리기 전 (위도, 경도)가 bound에 있는지 아닌지 파악

      // 사람마다 움직인 linepath 표시하기
      // console.log(this.bound, 'bound')
      console.log(this.copyUser, 'copyuser')
      for (const i of this.copyUser) {
        console.log(this.copyUser.indexOf(i), i, 'ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ')
        // i는 사람 1명이 1번에 다닌 (위도, 경도) 데이터 집합
        const linePath = []
        for (const j of i) {
          // j는 i의 각각 (위도, 경도) 데이터
          linePath.push(new kakao.maps.LatLng(j.R_LAT, j.R_LNG))
          for (const k of this.bound) {
            const squareBound = [k[0], k[1], k[2], k[3]]
            if (pointInPolygon([j.R_LAT, j.R_LNG], squareBound)) {
              k[4].count += 1
              console.log(this.bound.indexOf(k), '에서', k[4].count, '번')
            } else {
              console.log('bombbbbbbbbbbbbb')
            }
          }
        }
        // 출발 마커
        // const startSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png'
        // const startSize = new kakao.maps.Size(50, 45)
        // const startOption = {
        //   offset: new kakao.maps.Point(15, 45)
        // }
        // const startImage = new kakao.maps.MarkerImage(startSrc, startSize, startOption)
        // const startPosition = new kakao.maps.LatLng(i[0].LAT, i[0].LNG)
        // const startMarker = new kakao.maps.Marker({
        //   position: startPosition,
        //   image: startImage
        // })
        // startMarker.setMap(map)

        // 도착 마커
        // const arriveSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/blue_b.png'
        // const arriveSize = new kakao.maps.Size(50, 45)
        // const arriveOption = {
        //   offset: new kakao.maps.Point(15, 45)
        // }
        // const arriveImage = new kakao.maps.MarkerImage(arriveSrc, arriveSize, arriveOption)
        // console.log(i.length, '크기~~~~~~~`')
        // const arrivePosition = new kakao.maps.LatLng(i[i.length - 1].LAT, i[i.length - 1].LNG)
        // const arriveMarker = new kakao.maps.Marker({
        //   position: arrivePosition,
        //   image: arriveImage
        // })
        // arriveMarker.setMap(map)

        const polyline = new kakao.maps.Polyline({
          // endArrow: true,
          path: linePath,
          strokeWeight: 3,
          strokeOpacity: 0.8,
          strokeStyle: 'solid',
          strokeColor: '#22ff00'
        })
        if (this.final === 2) {
          polyline.Eb[0].strokeColor = this.color[9]
        } else {
          polyline.Eb[0].strokeColor = this.color[0]
        }
        polyline.setMap(map)
      }
    },

    // way = [[위도, 경도], [위도, 경도]] 데이터 이다.
    // linePath가 오른쪽으로 움직일때
    toEast (way) {
      console.log('east')
      const array = []
      let sw = null
      let ne = null
      if (parseFloat(way[1].R_LAT) >= parseFloat(way[0].R_LAT)) {
        sw = new kakao.maps.LatLng(parseFloat(way[0].R_LAT) - 0.00003, parseFloat(way[0].R_LNG) - 0.00003)
        ne = new kakao.maps.LatLng(parseFloat(way[1].R_LAT) + 0.00003, parseFloat(way[1].R_LNG) + 0.00003)
      } else {
        sw = new kakao.maps.LatLng(parseFloat(way[0].R_LAT) + 0.00003, parseFloat(way[0].R_LNG) - 0.00003)
        ne = new kakao.maps.LatLng(parseFloat(way[1].R_LAT) - 0.00003, parseFloat(way[1].R_LNG) + 0.00003)
      }
      array.push(sw)
      array.push(ne)
      return array
    },
    // linePath가 왼쪽으로 움직일때
    toWest (way) {
      console.log('west')
      const array = []
      let sw = null
      let ne = null
      if (parseFloat(way[1].R_LAT) >= parseFloat(way[0].R_LAT)) {
        sw = new kakao.maps.LatLng(parseFloat(way[0].R_LAT) - 0.00003, parseFloat(way[0].R_LNG) + 0.00003)
        ne = new kakao.maps.LatLng(parseFloat(way[1].R_LAT) + 0.00003, parseFloat(way[1].R_LNG) - 0.00003)
      } else {
        sw = new kakao.maps.LatLng(parseFloat(way[0].R_LAT) + 0.00003, parseFloat(way[0].R_LNG) + 0.00003)
        ne = new kakao.maps.LatLng(parseFloat(way[1].R_LAT) - 0.00003, parseFloat(way[1].R_LNG) - 0.00003)
      }
      array.push(sw)
      array.push(ne)
      return array
    },
    makeBound (location) {
      this.secondBound = []
      this.secondBound.push([location[0].Ma, location[0].La])
      this.secondBound.push([location[0].Ma, location[1].La])
      this.secondBound.push([location[1].Ma, location[0].La])
      this.secondBound.push([location[1].Ma, location[1].La])
      this.secondBound.push({ count: 0 })
      this.bound.push(this.secondBound)
    },
    async rectangleArea (square) {
      console.log(square, 'square')
      const formData = {
        position: square
      }
      console.log(formData, 'form')
      const response = await this.$axios.post('/api/position/bound', formData)
      console.log(response)
      if (response) {
        console.log('db 적재 성공')
      }
    }
  }
}
</script>

<style>

</style>
