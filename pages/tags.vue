<template>
  <main>
    <ul v-for="tag in Object.keys(tags)" :key="tag">
      <li>
        <section>
          {{ tag }}
          <ul v-for="post in tags[tag]" :key="post.id">
            <li>
              <nuxt-link :to="post.route">{{ post.title }} </nuxt-link>
            </li>
          </ul>
        </section>
      </li>
    </ul>
  </main>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: mapState(['tags']),
};
</script>

<style></style>
