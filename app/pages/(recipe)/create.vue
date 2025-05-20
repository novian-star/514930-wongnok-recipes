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
        <UButton type="submit">Submit</UButton>
      </UForm>
    </div>
  </div>
</template>
