<script setup lang="ts">
import type { CookingTime, Difficulty } from '~~/.generated/prisma';

const authStore = useAuthStore();

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

// Cooking time
const cookingTime = ref<CookingTime | undefined>(undefined);
const cookingTimeOptions = useCookingTimeOptions();
cookingTimeOptions.splice(0, 0, {
  // @ts-expect-error : Allow undefined value
  value: undefined,
  label: 'None',
});

// Difficulty
const difficulty = ref<Difficulty | undefined>(undefined);
const difficultyOptions = useDifficultyOptions();
difficultyOptions.splice(0, 0, {
  // @ts-expect-error : Allow undefined value
  value: undefined,
  label: 'None',
});

// Owner
const owned = ref<boolean>(false);

// Data
const { data, refresh } = await useAsyncData(
  async () => {
    const result = await $fetch('/api/recipes', {
      query: {
        search: search.value,
        limit: limit.value,
        offset: offset.value,
        filter: {
          cookingTime: cookingTime.value || undefined,
          difficulty: difficulty.value || undefined,
        },
        owned: owned.value || undefined,
      },
    });

    return { recipes: result.data, count: result.meta.count };
  },
  {
    watch: [page, owned, cookingTime, difficulty],
  }
);

const recipes = computed(() => data.value?.recipes);
const count = computed(() => data.value?.count);
</script>

<template>
  <div class="max-w-5xl p-4 mx-auto space-y-4">
    <header>
      <h1 class="text-2xl font-semibold">Recipes</h1>
    </header>
    <div class="space-y-4">
      <div class="grid sm:grid-cols-3 md:grid-cols-4 sm:items-center gap-4">
        <!-- Search -->
        <div>
          <UInput
            v-model="search"
            type="text"
            :loading="searching"
            icon="lucide:search"
            placeholder="Search"
            class="w-full"
          />
        </div>
        <!-- Cooking time -->
        <USelect
          v-model="cookingTime"
          :items="cookingTimeOptions"
          label-key="label"
          value-key="value"
          placeholder="Select cooking time"
        />
        <!-- Difficulty -->
        <USelect
          v-model="difficulty"
          :items="difficultyOptions"
          label-key="label"
          value-key="value"
          placeholder="Select difficulty"
        />
        <!-- Owned recipe checkbox -->
        <div v-if="authStore.authenticated">
          <UCheckbox v-model="owned" label="Owned recipes" />
        </div>
      </div>
      <!-- Recipe list -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <template v-if="recipes?.length">
          <template v-for="recipe in recipes" :key="recipe.id">
            <LazyRecipeCard :data="recipe" />
          </template>
        </template>
        <template v-else>
          <div class="flex flex-col items-center justify-center col-span-full p-4 gap-2 text-muted">
            <UIcon class="w-10 h-10" name="lucide:frown" />
            <span>No result.</span>
          </div>
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
