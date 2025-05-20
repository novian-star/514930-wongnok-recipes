import { useAuthStore } from '~/stores/auth';

declare module '#app' {
  interface PageMeta {
    requireAuth?: boolean;
  }
}

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const authStore = useAuthStore();

  // Prevent refetching session data after navigation.
  const attempt = useState('attempt', () => false);

  // Attempt fetching session data if have not fetched.
  if (!authStore.authenticated && !attempt.value) {
    const result = await authStore.fetchSessionData().catch(() => null);

    if (result?.data) {
      authStore.setSessionData(result.data);
    }

    attempt.value = true;
  }

  // Check for protected routes.
  if (to.meta.requireAuth && !authStore.authenticated) {
    return navigateTo('/');
  }
});
