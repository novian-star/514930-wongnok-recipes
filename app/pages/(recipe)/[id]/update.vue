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
  <div class="p-4">
    <header>
      <h1>Create recipe</h1>
    </header>
    <div>
      <UForm :schema :state @submit="handleSubmit">
        <UFormField name="title" label="Title" required>
          <UInput v-model="state.title" type="text" />
        </UFormField>
        <UFormField name="description" label="Description">
          <UTextarea v-model="state.description" />
        </UFormField>
        <UFormField name="ingredients" label="Ingredients">
          <UTextarea v-model="state.ingredients" />
        </UFormField>
        <UFormField name="instructions" label="Instructions">
          <UTextarea v-model="state.instructions" />
        </UFormField>
        <UFormField name="cookingTime" label="Cooking time" required>
          <USelect
            v-model="state.cookingTime"
            :items="useCookingTimeOptions()"
            value-key="value"
          />
        </UFormField>
        <UFormField name="difficulty" label="Difficulty" required>
          <USelect
            v-model="state.difficulty"
            :items="useDifficultyOptions()"
            value-key="value"
          />
        </UFormField>
        <UFormField name="image" label="Image">
          <UInput v-model="state.image" />
        </UFormField>
        <UButton type="button" @click="handleReset">Reset</UButton>
        <UButton type="submit">Submit</UButton>
      </UForm>
    </div>
  </div>
</template>
