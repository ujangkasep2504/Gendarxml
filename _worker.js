export default {
  async fetch(request) {
    // Konfigurasi server WebSocket
    const WS_SERVER = "ws://your-server-ip:8080"; // Ganti dengan IP dan port server WebSocket Anda
    const VMESS_SERVER = "coba.ari-andika.site"; // Ganti dengan domain server VMess
    const VMESS_PORT = 443; // Port server (umumnya 443 untuk TLS)
    const PATH = "/vmess"; // Path WebSocket sesuai konfigurasi server VMess
    const UUID = "904fccc7-7941-4a2e-99f4-0a220347a156"; // UUID untuk autentikasi VMess
    const path = "/websocket";  // Path yang digunakan oleh klien untuk mengakses WebSocket

    const upgradeHeader = request.headers.get("Upgrade");
    const url = new URL(request.url);

    // Jika permintaan adalah WebSocket dan path sesuai, arahkan ke WebSocket eksternal
    if (upgradeHeader === "websocket" && url.pathname === path) {
      try {
        const response = await fetch(WS_SERVER);

        if (response.ok) {
          return new Response("Connected to WebSocket server", {
            status: 101, // Status untuk upgrade koneksi
            headers: { "Connection": "Upgrade", "Upgrade": "websocket" }
          });
        } else {
          return new Response("Failed to connect to WebSocket server", {
            status: 500,
            headers: { "Content-Type": "text/plain" }
          });
        }
      } catch (error) {
        return new Response(`Failed to connect to WebSocket server: ${error.message}`, {
          status: 500,
          headers: { "Content-Type": "text/plain" }
        });
      }
    }

    // Menangani permintaan VMess jika bukan WebSocket
    if (url.pathname === "/vmess") {
      try {
        const vlessConfig = await getVmessConfig(VMESS_SERVER, VMESS_PORT, PATH, UUID);
        return new Response(vlessConfig, {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        return new Response(`Failed to fetch VMess config: ${error.message}`, {
          status: 500,
          headers: { "Content-Type": "text/plain" }
        });
      }
    }

    return new Response("Not a WebSocket or VMess request", { status: 400 });
  },
};

// Fungsi untuk mengambil konfigurasi VMess
async function getVmessConfig(VMESS_SERVER, VMESS_PORT, PATH, UUID) {
  const targetUrl = `wss://${VMESS_SERVER}:${VMESS_PORT}${PATH}`;

  // Buat URL konfigurasi VMess
  const vlessConfig = {
    vless: `vless://${UUID}@${VMESS_SERVER}:${VMESS_PORT}?encryption=none&security=tls&sni=${VMESS_SERVER}&fp=randomized&type=ws&host=${VMESS_SERVER}&path=${encodeURIComponent(PATH)}#${VMESS_SERVER}`,
  };

  return JSON.stringify(vlessConfig); // Mengembalikan konfigurasi dalam format JSON
}
