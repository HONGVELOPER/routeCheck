<template>
  <v-app>
    <v-btn to="/map">
      전체 데이터 누적 지도
    </v-btn>
    <v-btn to="/time_map">
      1시간 간격에 따른 지도
    </v-btn>
    <v-btn to="/marker_map">
      출발 도착 포인트 누적 지도
    </v-btn>
    <v-btn to="/chart">
      그래프
    </v-btn>
    <Nuxt />
  </v-app>
</template>

<script>
export default {

}
</script>

<style>

</style>
