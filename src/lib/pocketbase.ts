import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

// Helper function for authentication state
export const isUserValid = () => pb.authStore.isValid;

// Authenticate as auth collection record
export const userData = await pb.collection('users').authWithPassword('malikjsnowden@proton.me', '@U&M7zXFy&a9qG:')

// Get current user data
// export const getCurrentUser = () => pb.authStore.model; // Deprecated

// Helper function for auth state changes
export const onAuthStateChange = (callback: () => void) => {
    pb.authStore.onChange(callback);
};