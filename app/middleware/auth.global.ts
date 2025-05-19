import { useAuthStore } from '~/stores/auth';

declare module '#app' {
  interface PageMeta {
    requireAuth?: boolean;
  }
}

// Prevent fetching data after failed authentication.
// This is useful when user refreshes page.
let attempt = false;

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const authStore = useAuthStore();

  // Attempt fetching session data if have not fetched.
  if (!authStore.authenticated && !attempt) {
    const result = await authStore.fetchSessionData().catch(() => null);

    if (result?.data) {
      authStore.setSessionData(result.data);
    }

    attempt = true;
  }

  // Check for protected routes.
  if (to.meta.requireAuth && !authStore.authenticated) {
    return navigateTo('/');
  }
});
