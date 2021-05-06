<template>
  <v-btn @click="show()">show</v-btn>
</template>

<script>
export default {
  methods: {
    async show () {
      console.log('hi')
      const response = await this.$axios.get('/api/save')
      console.log(response)
    }
  }
}
</script>

<style>

</style>
