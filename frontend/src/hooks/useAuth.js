// File: frontend/src/hooks/useAuth.js (KODE BARU - SYNCHRONOUS)

import secureLocalStorage from "react-secure-storage";

/**
 * Hook untuk membaca data user dari local storage secara LANGSUNG.
 * Ini menyelesaikan masalah 'login loop' karena datanya
 * tersedia secara instan untuk ProtectedRoute.
 */
export const useAuth = () => {
  // Baca data user secara langsung (synchronously).
  // Tidak perlu useState atau useEffect.
  const user = secureLocalStorage.getItem("user");
  
  // Langsung kembalikan datanya (bisa 'user' atau 'null')
  return { user }; 
};