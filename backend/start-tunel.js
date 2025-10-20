// File: start-tunnels.js

import ngrok from 'ngrok';
import 'dotenv/config'; // Pastikan dotenv sudah terinstall (npm install dotenv)

// Gunakan fungsi async untuk memakai 'await'
(async function() {
  try {
    console.log('Menjalankan tunnel Ngrok...');

    // Jalankan tunnel untuk backend (port 3000)
    const backendUrl = await ngrok.connect({
      proto: 'http',
      addr: 3000, // Sesuaikan port back-end Anda
      authtoken_from_env: true // Ambil token dari file .env
    });
    console.log(`✅ Tunnel Back-End -> ${backendUrl}`);

    // Jalankan tunnel untuk frontend (port 5173)
    const frontendUrl = await ngrok.connect({
      proto: 'http',
      addr: 5173, // Sesuaikan port front-end Anda
      authtoken_from_env: true
    });
    console.log(`✅ Tunnel Front-End -> ${frontendUrl}`);

    console.log('\nKedua tunnel sudah berjalan. Biarkan terminal ini terbuka.');

  } catch (error) {
    console.error('Error saat menjalankan Ngrok:', error);
    process.exit(1);
  }
})();