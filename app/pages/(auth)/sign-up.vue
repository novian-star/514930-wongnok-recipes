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
 <div
    class="flex flex-col items-center sm:justify-center w-screen h-[calc(100dvh-64px)]"
  >
    <h1 class="pb-4 sm:pt-0 font-semibold text-2xl">Sign Up</h1>
    <div class="w-xs p-4 mx-auto border border-default rounded">
      <UForm :schema :state class="space-y-4" @submit="handleSubmit">
        <UFormField name="name" label="Name">
          <UInput v-model="state.name" type="text" class="w-full" />
          <template #error><span /></template>
        </UFormField>
        <UFormField name="username" label="Username">
          <UInput v-model="state.username" type="text" class="w-full" />
          <template #error><span /></template>
        </UFormField>
        <UFormField name="password" label="Password">
          <UInput v-model="state.password" type="password" class="w-full" />
          <template #error><span /></template>
        </UFormField>
        <div class="mt-8 space-y-2">
          <UButton type="submit" block>Sign up</UButton>
          <USeparator>or</USeparator>
          <UButton to="/login" block color="neutral" variant="ghost">
            Log in
          </UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>
