<script setup lang="ts">
import * as v from 'valibot';

import { CreateRecipeSchema } from '~~/shared/validations/recipe';

// Page meta
definePageMeta({
  requireAuth: true,
});

// Form
const schema = CreateRecipeSchema;
const state = reactive({
  title: '',
  description: '',
  ingredients: '',
  instructions: '',
  cookingTime: 'SHORT',
  difficulty: 'EASY',
  image: '',
} satisfies v.InferInput<typeof schema>);
function handleSubmit() {
  const data = v.parse(schema, state);

  const toast = useToast();

  $fetch('/api/recipes', {
    method: 'POST',
    body: data,
  })
    .then((data) => {
      toast.add({
        title: 'Recipe created',
      });

      navigateTo(`/${data.id}`);
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
      <h1 class="font-semibold text-2xl">Update recipe</h1>
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
          <UButton type="submit" block>Submit</UButton>
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
