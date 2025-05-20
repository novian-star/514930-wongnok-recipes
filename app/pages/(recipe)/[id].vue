<script setup lang="ts">
const route = useRoute();

const id = route.params.id as string;

const { data } = await useFetch('/api/recipes/:id', {
  params: { id },
});

const recipe = computed(() => data.value);

if (!recipe.value) {
  navigateTo('/');
}

provide('recipe', recipe);

export type ComputedRefRecipe = typeof recipe;
</script>

<template>
  <NuxtPage />
</template>
