<script setup lang="ts">
import { NuxtLink } from '#components';
import type { Recipe } from '~~/.generated/prisma';

const props = defineProps<{
  data: Recipe & { ratings: { value: number }[] };
  preview?: boolean
}>();

const averageRatings = computed(() => {
  if (!props.data.ratings.length) return (0).toFixed(1);

  const total = props.data.ratings.reduce(
    (acc, rating) => acc + rating.value,
    0
  );

  return (total / props.data.ratings.length).toFixed(1);
});

const totalRating = computed(() => props.data.ratings.length);

const cookingTime = computed(() => {
  const options = useCookingTimeOptions();

  return options.find((option) => option.value === props.data.cookingTime);
});

const difficulty = computed(() => {
  const options = useDifficultyOptions();

  return options.find((option) => option.value === props.data.difficulty);
});
</script>

<template>
  <component :is="preview ? 'div' : NuxtLink" class="block" :to="`/${data.id}`">
    <div
      class="flex flex-col w-full h-full border border-default rounded shadow-xs overflow-hidden transition-all hover:-translate-y-0.5"
    >
      <!-- Image -->
      <div class="h-20 bg-muted border-b border-default text-muted">
        <template v-if="data.image">
          <img
            :alt="data.title"
            :src="data.image"
            class="w-full h-full object-cover"
          />
        </template>
        <template v-else>
          <div class="flex items-center justify-center w-full h-full">
            <UIcon name="lucide:utensils" />
          </div>
        </template>
      </div>
      <!-- Content -->
      <div class="flex flex-col flex-1 p-2 space-y-1">
        <!-- Header -->
        <div class="flex items-center justify-between gap-1">
          <!-- Title -->
          <h2 class="font-medium text-sm text-ellipsis line-clamp-1 overflow-hidden">
            {{ data.title }}
          </h2>
          <!-- Difficulty -->
          <UBadge icon="lucide:circle-check" variant="outline">
            {{ difficulty?.label }}
          </UBadge>
        </div>
        <!-- Body -->
        <div class="text-xs">
          <!-- Description -->
          <template v-if="data.description">
            <p class="text-muted text-wrap break-all line-clamp-3">
              {{ data.description }}
            </p>
          </template>
          <template v-else>
            <p class="text-dimmed">No description.</p>
          </template>
        </div>
        <!-- Footer -->
        <div class="flex items-center justify-between mt-auto gap-1">
          <!-- Ratings -->
          <div class="flex items-center gap-1">
            <UBadge icon="lucide:star">{{ averageRatings }}</UBadge>
            <span class="text-xs text-dimmed">({{ totalRating }})</span>
          </div>
          <!-- Cooking time -->
          <div class="text-end text-xs text-dimmed">
            {{ cookingTime?.label }}
          </div>
        </div>
      </div>
    </div>
  </component>
</template>
