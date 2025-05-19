import type * as v from 'valibot';

import type { LoginSchema, SignUpSchema } from '~~/shared/validations/auth';

export const useAuthStore = defineStore('auth', () => {
  const data = ref<SessionUserData | null>(null);

  const authenticated = computed(() => !!data.value);

  function getSessionData() {
    return data.value;
  }

  function setSessionData(sessionData: SessionUserData) {
    return (data.value = sessionData);
  }

  function clearSessionData() {
    return (data.value = null);
  }

  function logIn(data: v.InferOutput<typeof LoginSchema>) {
    return $fetch('/api/auth/login', {
      method: 'POST',
      body: data,
    });
  }

  async function signUp(data: v.InferOutput<typeof SignUpSchema>) {
    return $fetch('/api/auth/sign-up', {
      method: 'POST',
      body: data,
    });
  }

  async function signOut() {
    return $fetch('/api/auth/sign-out', {
      method: 'POST',
    });
  }

  async function fetchSessionData() {
    // Request fetch forward cookie during SSR.
    const requestFetch = useRequestFetch();

    return requestFetch('/api/auth/me');
  }

  return {
    authenticated,
    getSessionData,
    setSessionData,
    clearSessionData,
    logIn,
    signUp,
    signOut,
    fetchSessionData,
  };
});
