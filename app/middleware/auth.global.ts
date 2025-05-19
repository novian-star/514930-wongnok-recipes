import { useAuthStore } from '~/stores/auth';

declare module '#app' {
  interface PageMeta {
    requireAuth?: boolean;
  }
}

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const authStore = useAuthStore();

  // Prevent fetching data after failed authentication.
  // This is useful when user refreshes page.
  const attempt = useState('auth-attempt', () => false);

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
