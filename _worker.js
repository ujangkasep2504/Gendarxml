export default {
  async fetch(request) {
    // Konfigurasi server VLESS
    const VLESS_SERVER = "coba.ari-andika.site"; // Ganti dengan domain/IP server VLESS
    const VLESS_PORT = 443; // Port server VLESS (biasanya 443 untuk TLS)
    const UUID = "your-uuid"; // 904fccc7-7941-4a2e-99f4-0a220347a156
    const PATH = "/vless"; // INDONESIA

    // Membangun URL untuk koneksi WebSocket
    const targetUrl = `wss://${VLESS_SERVER}:${VLESS_PORT}${PATH}`;

    try {
      // Membuka koneksi WebSocket
      const webSocket = await connectWebSocket(targetUrl, UUID);

      // Meneruskan data dari klien ke server VLESS
      const { readable, writable } = webSocket;
      return new Response(readable, { status: 101, headers: { Connection: "Upgrade" } });

    } catch (error) {
      return new Response(`Failed to connect to VLESS server: ${error.message}`, {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
};

// Fungsi untuk membuat koneksi WebSocket dengan autentikasi VLESS
async function connectWebSocket(url, uuid) {
  // Header untuk autentikasi VLESS
  const headers = {
    "Proxy-Authorization": `VLESS ${uuid}`,
    "Sec-WebSocket-Protocol": "vless",
  };

  const webSocket = new WebSocket(url, headers);

  // Menunggu koneksi terhubung
  return new Promise((resolve, reject) => {
    webSocket.onopen = () => resolve(webSocket);
    webSocket.onerror = (error) => reject(error);
  });
}
