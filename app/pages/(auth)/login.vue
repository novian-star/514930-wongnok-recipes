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
      });

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
  <div
    class="flex flex-col items-center sm:justify-center w-screen h-[calc(100dvh-64px)]"
  >
    <h1 class="pb-4 sm:pt-0 font-semibold text-2xl">Log In</h1>
    <div class="w-xs p-4 mx-auto border border-default rounded">
      <UForm :schema :state class="space-y-4" @submit="handleSubmit">
        <UFormField name="username" label="Username">
          <UInput v-model="state.username" type="text" class="w-full" />
          <template #error><span /></template>
        </UFormField>
        <UFormField name="password" label="Password">
          <UInput v-model="state.password" type="password" class="w-full" />
          <template #error><span /></template>
        </UFormField>
        <div class="mt-8 space-y-2">
          <UButton type="submit" block>Log in</UButton>
          <USeparator>or</USeparator>
          <UButton to="/sign-up" block color="neutral" variant="ghost">
            Sign up
          </UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>
