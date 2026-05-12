<template>
  <div class="about-content">
    <ContentRenderer v-if="page" :value="page" />
  </div>
</template>
<style scoped>
.about-content :deep(h3) {
  margin-top: 10px;
}

.about-content :deep(table) {
  width: 100%;
}

.about-content :deep(hr) {
  width: 100%;
}
</style>
<script setup lang="ts">
const { data: page } = await useAsyncData('about', () =>
  queryCollection('content').path('/about').first()
)
useHead({ title: 'About | Government Organisation ID Finder' })
</script>
