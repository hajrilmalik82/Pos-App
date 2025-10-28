// File: frontend/src/components/Logout.jsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Bersihkan semua data sesi
    // 'clear()' sudah mencakup 'removeItem'
    secureLocalStorage.clear(); 
    
    // 2. Paksa navigasi ke halaman login
    // 'replace: true' akan mengganti riwayat navigasi 
    // sehingga pengguna tidak bisa menekan "back" ke halaman yang dilindungi
    navigate("/login", { replace: true });

    // 3. (Opsional tapi bagus) Reload halaman untuk memastikan semua state ter-reset
    // window.location.reload(); 
    // Gunakan ini jika Anda merasa state (seperti dari Redux) masih tersangkut
    
  }, [navigate]); // Jalankan efek ini sekali saat komponen dimuat

  // Selama proses logout, tidak perlu merender apa-apa
  return null; 
};

export default Logout;