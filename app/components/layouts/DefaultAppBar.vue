<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <header class="border-b border-default">
    <div class="flex items-center max-w-5xl h-16 px-4 mx-auto gap-4">
      <div class="flex items-center gap-2">
        <UButton to="/" icon="lucide:chef-hat" />
      </div>
      <div class="flex items-center ms-auto gap-2">
          <ColorModeToggle />
        <template v-if="authStore.authenticated">
          <UButton to="/create" icon="lucide:plus">Add Recipe</UButton>
        </template>
        <template v-if="!authStore.authenticated">
          <UButton to="/login" icon="lucide:log-in">Log in</UButton>
        </template>
        <template v-else>
          <UserMenu />
        </template>
      </div>
    </div>
  </header>
</template>
