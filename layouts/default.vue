<template>
  <v-app>
    <v-btn to="/map">
      전체 데이터 누적 지도
    </v-btn>
    <v-btn to="/time_map">
      1시간 간격에 따른 지도 분리
    </v-btn>
    <v-btn to="/age_map">
      나이에 따른 지도 분리
    </v-btn>
    <v-btn to="/usage_time_map">
      이용시간에 따른 지도 분리
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
