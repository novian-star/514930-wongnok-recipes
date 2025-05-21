<script setup lang="ts">
// Search
const search = ref<string>('');
const searching = ref<boolean>(false);
const searchTimeout = ref<NodeJS.Timeout | null>(null);

watch(search, () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searching.value = true;
  searchTimeout.value = setTimeout(() => {
    refresh();
    searching.value = false;
    page.value = 1;
  }, 500);
});

// Pagination
const page = ref<number>(1);
const limit = ref<number>(12);
const offset = computed(() => (page.value - 1) * limit.value);

watch(page, () => refresh());

// Data
const { data, refresh } = await useAsyncData(async () => {
  const result = await $fetch('/api/recipes', {
    query: {
      search: search.value,
      limit: limit.value,
      offset: offset.value,
    },
  });

  return { recipes: result.data, count: result.meta.count };
});

const recipes = computed(() => data.value?.recipes);
const count = computed(() => data.value?.count);
</script>

<template>
  <div class="max-w-5xl p-4 mx-auto space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Recipes</h1>
    </header>
    <div class="space-y-4">
      <!-- Search -->
      <div>
        <UInput
          v-model="search"
          type="text"
          :loading="searching"
          icon="lucide:search"
        />
      </div>
      <!-- Recipe list -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <template v-for="recipe in recipes" :key="recipe.id">
          <RecipeCard :data="recipe" />
        </template>
      </div>
      <!-- Pagination -->
      <div v-if="(count || 0) > limit">
        <UPagination
          v-model:page="page"
          :items-per-page="limit"
          :total="count"
        />
      </div>
    </div>
  </div>
</template>
