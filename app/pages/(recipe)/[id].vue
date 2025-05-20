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

const authStore = useAuthStore();

const isOwner = computed(
  () => authStore.getSessionData()?.user.id === recipe.value?.userId
);

export type ComputedRefRecipe = typeof recipe;
</script>

<template>
  <div>
    <template v-if="isOwner">
      <UButton :to="`/${recipe?.id}/update`">Update</UButton>
    </template>

    <NuxtPage />
  </div>
</template>
