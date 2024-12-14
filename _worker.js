export default {
  async fetch(request) {
    // Konfigurasi server VMess
    const VMESS_SERVER = "coba.ari-andika.site"; // Ganti dengan domain server VMess
    const VMESS_PORT = 443; // Port server (umumnya 443 untuk TLS)
    const PATH = "/vmess"; // Path WebSocket sesuai konfigurasi server VMess
    const UUID = "904fccc7-7941-4a2e-99f4-0a220347a156"; // UUID untuk autentikasi

    // URL koneksi WebSocket ke server VMess
    const targetUrl = `wss://${VMESS_SERVER}:${VMESS_PORT}${PATH}`;

    const upgradeHeader = request.headers.get("Upgrade");
    const url = new URL(request.url);

    // Cek apakah permintaan menggunakan WebSocket dan path sesuai
    const websocketPath = "/websocket"; // Path WebSocket yang digunakan

    if (upgradeHeader === "websocket" && url.pathname === websocketPath) {
      // Jika WebSocket request, coba menghubungkan ke server VMess
      try {
        // Meneruskan koneksi WebSocket ke server VMess
        const response = await fetch(targetUrl, {
          method: "GET", // Menggunakan metode GET untuk WebSocket
          headers: {
            "Proxy-Authorization": `VMess ${UUID}`, // Header untuk autentikasi VMess
          }
        });

        // Meneruskan data dari server VMess
        if (response.ok) {
          const readable = response.body;
          return new Response(readable, {
            status: 101,
            headers: { "Connection": "Upgrade", "Upgrade": "websocket" },
          });
        } else {
          return new Response("Failed to connect to VMess server", {
            status: 500,
            headers: { "Content-Type": "text/plain" },
          });
        }
      } catch (error) {
        // Jika koneksi gagal, kirimkan pesan error
        return new Response(`Failed to connect to VMess server: ${error.message}`, {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        });
      }
    } else if (upgradeHeader === "websocket" && url.pathname === PATH) {
      // Jika WebSocket request dengan path /vmess
      return new Response("WebSocket connection to VMess", {
        status: 101,
        headers: { "Connection": "Upgrade", "Upgrade": "websocket" },
      });
    } else {
      // Jika bukan permintaan WebSocket atau path tidak sesuai
      return new Response("Not a WebSocket or VMess request", { status: 400 });
    }
  },
};
