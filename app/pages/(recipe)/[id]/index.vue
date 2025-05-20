<script setup lang="ts">
import type { ComputedRefRecipe } from '~/pages/(recipe)/[id].vue';

const recipe = inject<ComputedRefRecipe>('recipe');

const averageRating = computed(() => {
  if (!recipe?.value) return (0).toFixed(1);

  const ratings = recipe.value.ratings;

  if (ratings.length === 0) return (0).toFixed(1);

  const total = ratings.reduce((acc, rating) => acc + rating.value, 0);

  return (total / ratings.length).toFixed(1);
});

const cookingTime = computed(() => {
  const options = useCookingTimeOptions();

  return options.find((option) => option.value === recipe?.value?.cookingTime);
});

const difficulty = computed(() => {
  const options = useDifficultyOptions();

  return options.find((option) => option.value === recipe?.value?.difficulty);
});

const isOwner = computed(() => {
  if (!recipe?.value) return false;

  const userId = useAuthStore().getSessionData()?.user.id;

  return recipe.value.userId === userId;
});

const rated = computed(() => {
  if (!recipe?.value) return undefined;

  const userId = useAuthStore().getSessionData()?.user.id;

  return recipe.value.ratings.find((rating) => rating.userId === userId);
});

function rate(value: number) {
  if (rated.value) {
    return;
  }

  const toast = useToast();

  $fetch('/api/recipes/:id/ratings', {
    method: 'POST',
    params: {
      id: recipe!.value!.id,
    },
    body: {
      value,
    },
  })
    .then(() => {
      refreshNuxtData();

      toast.add({
        title: 'Recipe rated successfully!',
      });
    })
    .catch((error) => {
      toast.add({
        title: 'Error rating recipe',
        description: error.message,
        color: 'error',
      });

      console.error('Error rating recipe:', error);
    });
}
</script>

<template>
  <div class="max-w-5xl p-4 mx-auto space-y-4">
    <header
      class="flex flex-col sm:flex-row sm:items-start justify-between gap-4"
    >
      <div class="flex items-start gap-4">
        <!-- Image -->
        <div class="border border-default rounded overflow-hidden">
          <template v-if="recipe?.image">
            <img
              :alt="recipe.title"
              :src="recipe.image"
              class="object-cover w-32 h-32 rounded-lg"
            />
          </template>
          <template v-else>
            <UIcon name="lucide:utensils" class="w-32 h-32 text-muted" />
          </template>
        </div>
        <div class="space-y-2">
          <h1 class="font-semibold text-2xl">{{ recipe?.title }}</h1>
          <div class="flex flex-col sm:flex-row sm:items-center gap-2">
            <!-- Ratings -->
            <div class="flex items-center gap-2">
              <UBadge icon="lucide:star">{{ averageRating }}</UBadge>
              <span class="text-sm text-dimmed">
                ({{ recipe?.ratings.length }})
              </span>
            </div>
            <!-- Difficulty -->
            <UBadge icon="lucide:circle-check" variant="outline">
              {{ difficulty?.label || 'No difficulty provided.' }}
            </UBadge>
            <!-- Cooking time-->
            <UBadge icon="lucide:clock" variant="outline">
              {{ cookingTime?.label || 'No cooking time provided.' }}
            </UBadge>
          </div>
          <!-- Description -->
          <p class="text-sm text-dimmed break-all">
            {{ recipe?.description || 'No description provided.' }}
          </p>
        </div>
      </div>

      <div>
        <!-- Update -->
        <template v-if="isOwner">
          <UButton
            :to="`/${recipe?.id}/update`"
            icon="lucide:edit"
            class="text-sm"
            color="primary"
          >
            Update
          </UButton>
        </template>
      </div>
    </header>
    <USeparator />
    <!-- Content -->
    <div class="space-y-4">
      <!-- Ingredients -->
      <div>
        <h2 class="font-medium">Ingredients</h2>
        <p class="text-sm text-dimmed break-all">
          {{ recipe?.ingredients || 'No ingredients provided.' }}
        </p>
      </div>
      <!-- Instructions -->
      <div>
        <h2 class="font-medium">Instructions</h2>
        <p class="text-sm text-dimmed break-all">
          {{ recipe?.instructions || 'No instructions provided.' }}
        </p>
      </div>
      <!-- Rate -->
      <div class="space-y-2">
        <h2 class="font-medium">Rate this recipe</h2>
        <UButtonGroup>
          <template v-for="index in 5" :key="index">
            <UButton
              :disabled="!!rated || isOwner"
              :color="(rated?.value || 0) >= index ? 'primary' : 'neutral'"
              :icon="
                (rated?.value || 0) >= index ? 'mage:star-fill' : 'mage:star'
              "
              variant="ghost"
              @click="rate(index)"
            />
          </template>
        </UButtonGroup>
        <template v-if="!!rated">
          <p class="text-sm text-dimmed">You have already rated this recipe.</p>
        </template>
        <template v-else-if="isOwner">
          <p class="text-sm text-dimmed">You cannot rate your own recipe.</p>
        </template>
      </div>
    </div>
  </div>
</template>
