<script setup lang="ts">
const colorMode = useColorMode();

const preferences = [
  {
    value: 'light',
    icon: 'lucide:sun'
  },
  {
    value: 'dark',
    icon: 'lucide:moon',
  },
  {
    value: 'system',
    icon: 'lucide:sun-moon'
  }
];

const currentPreference = computed(() => 
  preferences.find((preference) => preference.value === colorMode.preference)
);

function toggleColorMode() {
  const currentIndex = preferences.findIndex((preference) => preference.value === colorMode.preference);

  const nextIndex = (currentIndex + 1) % preferences.length;

  const nextPreference = preferences[nextIndex] || preferences[0]!;

  colorMode.preference = nextPreference.value;
}
</script>

<template>
  <UButton color="neutral" :icon="currentPreference?.icon" variant="ghost" @click="toggleColorMode" />
</template>