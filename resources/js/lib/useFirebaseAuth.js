import { router } from '@inertiajs/react';
import {
  auth,
  googleProvider,
  firebaseErrorMessage,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
} from './firebase';

async function sendTokenToLaravel(endpoint, idToken, extraData = {}) {
  return new Promise((resolve, reject) => {
    router.post(
      endpoint,
      { id_token: idToken, ...extraData },
      {
        onSuccess: () => resolve(),
        onError: (errors) => reject(errors),
        preserveScroll: true,
      },
    );
  });
}

export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await cred.user.getIdToken();
  await sendTokenToLaravel(route('firebase.login'), idToken);
}

export async function registerWithEmail(email, password, extraData) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const idToken = await cred.user.getIdToken();
  await sendTokenToLaravel(route('firebase.register'), idToken, extraData);
}

export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  const idToken = await cred.user.getIdToken();
  await sendTokenToLaravel(route('firebase.login'), idToken);
}

export async function sendReset(email) {
  await sendPasswordResetEmail(auth, email, {
    url: window.location.origin + '/login',
  });
}

export async function logout() {
  await signOut(auth);
  router.post(route('firebase.logout'));
}

export { firebaseErrorMessage };