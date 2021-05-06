<template>
  <v-main>
    <div>
      <v-card>
        <div id="map" style="width:auto; height:920px;" />
      </v-card>
    </div>
  </v-main>
</template>

<script>
const pointInPolygon = require('point-in-polygon')
export default {
  async asyncData ({ $axios }) {
    const response = await $axios.get('/api/position/route')
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
      color: [
        '#FF1F19',
        '#FF3119',
        '#FF48Q9',
        '#FF6519',
        '#FF8019',
        '#FF9C19',
        '#FFB819',
        '#FFCE19',
        '#FFE219',
        '#FFEC19'
      ]
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
        if (i.END === 0) {
          this.oneUser.push(i)
        } if (i.END === 1) {
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
        if (i.END === 1) {
          this.count = 0
          this.dict = []
        }
      }

      // location 으로 rectangle 생성
      for (const i of this.area) {
        let sw = ''
        let ne = ''
        if (i[1].LNG > i[0].LNG) {
          const east = this.toEast(i)
          sw = east[0]
          ne = east[1]
        } else {
          const west = this.toWest(i)
          sw = west[0]
          ne = west[1]
        }
        const rectangleBounds = new kakao.maps.LatLngBounds(sw, ne)
        const rectangle = new kakao.maps.Rectangle({
          bounds: rectangleBounds,
          strokeWeight: 4,
          strokeColor: '#FF3DE5',
          strokeOpacity: 1,
          strokeStyle: 'solid',
          fillColor: '#FF8AEF',
          fillOpacity: 0
        })
        rectangle.setMap(map)
        console.log(pointInPolygon([37.481859728278394, 127.14922237366487], bound), 'true?')
      }

      // 사람마다 움직인 linepath 표시하기
      for (const i of this.copyUser) {
        const linePath = []
        for (const j of i) {
          linePath.push(new kakao.maps.LatLng(j.LAT, j.LNG))
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
          endArrow: true,
          path: linePath,
          strokeWeight: 3,
          strokeColor: this.color[0],
          strokeOpacity: 0.5,
          strokeStyle: 'solid'
        })
        polyline.setMap(map)
      }
    },
    // way = [[위도, 경도], [위도, 경도]] 데이터 이다.
    // linePath가 오른쪽으로 움직일때
    toEast (way) {
      console.log('east')
      const array = []
      const sw = new kakao.maps.LatLng(way[0].LAT + 0.00003, way[0].LNG - 0.00003)
      const ne = new kakao.maps.LatLng(way[1].LAT - 0.00003, way[1].LNG + 0.00003)
      array.push(sw)
      array.push(ne)
      return array
    },
    // linePath가 왼쪽으로 움직일때
    toWest (way) {
      console.log('west')
      const array = []
      const sw = new kakao.maps.LatLng(way[0].LAT - 0.000008, way[0].LNG + 0.00003)
      const ne = new kakao.maps.LatLng(way[1].LAT + 0.00004, way[1].LNG - 0.00003)
      array.push(sw)
      array.push(ne)
      return array
    }
  }
}
</script>

<style>

</style>
