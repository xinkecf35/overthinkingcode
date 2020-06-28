<template>
  <main id="error">
    <div v-if="error.statusCode === 404">
      <h1>Sorry, that page or resource can't be found</h1>
      <h2><nuxt-link to="/">Take me back home</nuxt-link></h2>
    </div>
    <div v-else>
      <h1>Sorry, an error has occured</h1>
      <h2><nuxt-link to="/">Take me back home</nuxt-link></h2>
    </div>
  </main>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss">
#error {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
