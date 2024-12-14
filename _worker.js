export default {
  async fetch(request) {
    // Konfigurasi server VMess
    const VMESS_SERVER = "coba.ari-andika.site"; // Ganti dengan domain server VMess
    const VMESS_PORT = 443; // Port server (umumnya 443 untuk TLS)
    const PATH = "/vmess"; // Path WebSocket sesuai konfigurasi server VMess
    const UUID = "904fccc7-7941-4a2e-99f4-0a220347a156"; // UUID untuk autentikasi

    // URL koneksi WebSocket ke server VMess
    const targetUrl = `wss://${VMESS_SERVER}:${VMESS_PORT}${PATH}`;

    try {
      // Coba membuka koneksi WebSocket ke server VMess menggunakan fetch
      const response = await fetch(targetUrl, {
        method: "GET", // Menggunakan metode GET untuk WebSocket
        headers: {
          "Proxy-Authorization": `VMess ${UUID}`, // Header untuk autentikasi VMess
        }
      });

      // Meneruskan data dari klien ke server VMess
      if (response.ok) {
        const readable = response.body;
        return new Response(readable, {
          status: 101,
          headers: { "Connection": "Upgrade" },
        });
      } else {
        return new Response("Failed to connect to VMess server", { status: 500 });
      }
    } catch (error) {
      // Jika koneksi gagal, kirimkan pesan error
      return new Response(`Failed to connect to VMess server: ${error.message}`, {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
};
