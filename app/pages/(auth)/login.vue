<script setup lang="ts">
import { FetchError } from 'ofetch';
import * as v from 'valibot';

import { useAuthStore } from '~/stores/auth';
import { LoginSchema } from '~~/shared/validations/auth';

definePageMeta({
  middleware: () => {
    const authStore = useAuthStore();

    if (authStore.authenticated) {
      return navigateTo('/');
    }
  },
});

const schema = LoginSchema;

const state = reactive({
  username: '',
  password: '',
} satisfies v.InferInput<typeof schema>);

function handleSubmit() {
  const data = v.parse(schema, state);

  const authStore = useAuthStore();
  const toast = useToast();

  authStore
    .logIn(data)
    .then(() => {
      toast.add({
        title: 'Login success',
      });

      authStore.fetchSessionData().then((result) => {
        authStore.setSessionData(result.data);
      })

      navigateTo('/');
    })
    .catch((error) => {
      if (error instanceof FetchError) {
        if (error.status === 401) {
          toast.add({
            title: 'Invalid username or password',
          });

          return;
        }
      }

      toast.add({
        title: 'Unexpected error',
      });
    });
}
</script>

<template>
  <div>
    <UForm :schema :state @submit="handleSubmit">
      <UFormField name="username" label="Username">
        <UInput v-model="state.username" />
      </UFormField>
      <UFormField name="password" label="Password">
        <UInput v-model="state.password" type="password" />
      </UFormField>
      <UButton type="submit">Login</UButton>
      <NuxtLink to="/sign-up">Sign up</NuxtLink>
    </UForm>
  </div>
</template>
