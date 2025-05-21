<script setup lang="ts">
import * as v from 'valibot';

import { CreateRecipeSchema } from '~~/shared/validations/recipe';

import type { ComputedRefRecipe } from './../[id].vue';

// Page meta
definePageMeta({
  requireAuth: true,
});

// Recipe
const recipe = inject<ComputedRefRecipe>('recipe');

// Form
const schema = CreateRecipeSchema;
// prettier-ignore
const state = reactive({
  title:        recipe?.value?.title        || '',
  description:  recipe?.value?.description  || '',
  ingredients:  recipe?.value?.ingredients  || '',
  instructions: recipe?.value?.instructions || '',
  cookingTime:  recipe?.value?.cookingTime  || 'SHORT',
  difficulty:   recipe?.value?.difficulty   || 'EASY',
  image:        recipe?.value?.image        || '',
} satisfies v.InferInput<typeof schema>);

function handleReset() {
  // prettier-ignore
  state.title =         recipe?.value?.title || '';
  state.description = recipe?.value?.description || '';
  state.ingredients = recipe?.value?.ingredients || '';
  state.instructions = recipe?.value?.instructions || '';
  state.cookingTime = recipe?.value?.cookingTime || 'SHORT';
  state.difficulty = recipe?.value?.difficulty || 'EASY';
  state.image = recipe?.value?.image || '';
}

function handleSubmit() {
  const data = v.parse(schema, state);

  const toast = useToast();

  $fetch(`/api/recipes/:id`, {
    method: 'PUT',
    params: { id: recipe?.value?.id },
    body: data,
  })
    .then((data) => {
      toast.add({
        title: 'Recipe updated',
      });

      navigateTo(`/${data.id}`);

      refreshNuxtData();
    })
    .catch((error) => {
      console.error(error);

      toast.add({
        title: 'Unexpected error',
      });
    });
}
</script>

<template>
  <div class="max-w-5xl p-4 mx-auto space-y-4">
    <header>
      <div class="flex items-center gap-2">
        <UButton
          :to="`/${recipe?.id}`"
          color="neutral"
          icon="lucide:arrow-left"
          variant="link"
        />
        <h1 class="font-semibold text-2xl">Update recipe</h1>
      </div>
    </header>
    <div class="flex items-start gap-4">
      <!-- Form-->
      <div class="grow">
        <UForm :schema :state class="space-y-4" @submit="handleSubmit">
          <UFormField name="title" label="Title" required>
            <UInput v-model="state.title" type="text" class="w-full" />
          </UFormField>
          <UFormField name="description" label="Description">
            <UTextarea v-model="state.description" class="w-full" />
          </UFormField>
          <UFormField name="ingredients" label="Ingredients">
            <UTextarea v-model="state.ingredients" class="w-full" />
          </UFormField>
          <UFormField name="instructions" label="Instructions">
            <UTextarea v-model="state.instructions" class="w-full" />
          </UFormField>
          <UFormField name="cookingTime" label="Cooking time" required>
            <USelect
              v-model="state.cookingTime"
              :items="useCookingTimeOptions()"
              value-key="value"
              class="w-full"
            />
          </UFormField>
          <UFormField name="difficulty" label="Difficulty" required>
            <USelect
              v-model="state.difficulty"
              :items="useDifficultyOptions()"
              value-key="value"
              class="w-full"
            />
          </UFormField>
          <UFormField name="image" label="Image">
            <UInput v-model="state.image" class="w-full" />
          </UFormField>
          <div class="flex gap-2">
            <UButton
              type="button"
              block
              color="neutral"
              variant="outline"
              @click="handleReset"
              >Reset</UButton
            >
            <UButton type="submit" block>Submit</UButton>
          </div>
        </UForm>
      </div>
      <!-- Preview -->
      <div class="grow space-y-1">
        <div class="font-medium text-sm">Preview</div>
        <!-- @vue-expect-error -->
        <RecipeCard :data="{ ...state, ratings: [] }" preview class="max-w-48" />
      </div>
    </div>
  </div>
</template>
