<script setup lang="ts">
import { FetchError } from 'ofetch';
import * as v from 'valibot';

import { useAuthStore } from '~/stores/auth';
import { SignUpSchema } from '~~/shared/validations/auth';

definePageMeta({
  middleware: () => {
    const authStore = useAuthStore();

    if (authStore.authenticated) {
      return navigateTo('/');
    }
  },
});

const schema = SignUpSchema;

const state = reactive({
  name: '',
  username: '',
  password: '',
} satisfies v.InferInput<typeof schema>);

function handleSubmit() {
  const data = v.parse(schema, state);

  const authStore = useAuthStore();
  const toast = useToast();

  authStore
    .signUp(data)
    .then(() => {
      toast.add({
        title: 'Sign up success',
      });

      authStore.fetchSessionData().then((result) => {
        authStore.setSessionData(result.data);
      })

      navigateTo('/');
    })
    .catch((error) => {
      if (error instanceof FetchError) {
        if (error.status === 409) {
          toast.add({
            title: 'Duplicated username',
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
      <UFormField name="name" label="Name">
        <UInput v-model="state.name" />
      </UFormField>
      <UFormField name="username" label="Username">
        <UInput v-model="state.username" />
      </UFormField>
      <UFormField name="password" label="Password">
        <UInput v-model="state.password" type="password" />
      </UFormField>
      <UButton type="submit">Sign up</UButton>
      <NuxtLink to="/login">Login</NuxtLink>
    </UForm>
  </div>
</template>
