<script setup lang="ts">
const authStore = useAuthStore();
const route = useRoute();

const sessionData = computed(authStore.getSessionData);

const signingOut = ref(false);

function handleSignOut() {
  const toast = useToast();
  signingOut.value = true;
  authStore
    .signOut()
    .then(() => {
      authStore.clearSessionData();
      toast.add({
        title: 'Sign out success',
      });
      if (route.meta.requireAuth) {
        navigateTo('/');
      }
    })
    .catch(() => {
      toast.add({
        title: 'Sign out failed',
      });
    })
    .finally(() => {
      signingOut.value = false;
    });
}
</script>

<template>
  <UPopover>
    <UButton color="neutral" icon="lucide:circle-user" variant="ghost" />
    <template #content>
      <div class="flex flex-col w-40 *:p-2 *:not-last:border-b *:border-default">
        <div class="text-sm">
          <div>{{ sessionData?.user.name }}</div>
          <div class="italic text-dimmed">@{{ sessionData?.user.username }}</div>
        </div>
        <div>
          <UButton
            :loading="signingOut"
            color="error"
            icon="lucide:log-out"
            variant="subtle"
            @click="handleSignOut"
          >
            Sign out
          </UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>
