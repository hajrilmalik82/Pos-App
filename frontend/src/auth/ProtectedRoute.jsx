// File: frontend/src/auth/ProtectedRoute.jsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Hook dari Langkah 8

/*
  Logika yang Diperbarui:
  1. Cek autentikasi (harus login).
  2. Cek otorisasi (Role/Hak Akses).
*/

const ProtectedRoute = ({ permissionKey, adminOnly = false }) => {
  const { user } = useAuth();

  // 1. Cek Autentikasi (Wajib login)
  if (!user) {
    // Jika belum login, tendang ke /login
    return <Navigate to="/login" replace />;
  }

  // 2. Cek Admin (Admin boleh akses segalanya)
  if (user.role === "admin") {
    return <Outlet />; // Lolos
  }

  // --- Mulai dari sini, kita tahu user adalah "user" (bukan admin) ---

  // 3. Cek Rute Khusus Admin
  if (adminOnly) {
    // User BUKAN admin, tapi rute ini HANYA untuk admin
    return <Navigate to="/" replace />; // Tendang ke Home
  }

  // 4. Cek Rute dengan Hak Akses Spesifik
  if (permissionKey) {
    if (user[permissionKey]) {
      // User punya hak akses (misal: canAccessMaster)
      return <Outlet />; // Lolos
    } else {
      // User tidak punya hak akses
      return <Navigate to="/" replace />; // Tendang ke Home
    }
  }

  // 5. Rute Terproteksi Umum (misal: /home)
  // Jika lolos cek login (No. 1), dan rute ini tidak butuh
  // 'adminOnly' or 'permissionKey', maka izinkan akses.
  return <Outlet />;
};

export default ProtectedRoute;