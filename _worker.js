export default {
  async fetch(request) {
    // Konfigurasi server Trojan
    const TROJAN_SERVER = "ari-andika.site"; // Ganti dengan domain/IP server Trojan Anda
    const TROJAN_PORT = 443; // Port server Trojan (biasanya 443 untuk TLS)
    const PASSWORD = "your-password"; // 904fccc7-7941-4a2e-99f4-0a220347a156

    // URL untuk koneksi WebSocket
    const targetUrl = `wss://${TROJAN_SERVER}:${TROJAN_PORT}`;

    try {
      // Membuka koneksi WebSocket ke server Trojan
      const webSocket = await connectWebSocket(targetUrl, PASSWORD);

      // Meneruskan data dari klien ke server Trojan
      const { readable, writable } = webSocket;
      return new Response(readable, { status: 101, headers: { Connection: "Upgrade" } });

    } catch (error) {
      return new Response(`Failed to connect to Trojan server: ${error.message}`, {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
};

// Fungsi untuk membuat koneksi WebSocket dengan autentikasi Trojan
async function connectWebSocket(url, password) {
  // Header untuk autentikasi Trojan
  const headers = {
    "Proxy-Authorization": `Basic ${btoa(password)}`,
    "Sec-WebSocket-Protocol": "trojan",
  };

  const webSocket = new WebSocket(url, headers);

  // Menunggu koneksi terhubung
  return new Promise((resolve, reject) => {
    webSocket.onopen = () => resolve(webSocket);
    webSocket.onerror = (error) => reject(error);
  });
}
