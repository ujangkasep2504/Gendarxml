export default {
  async fetch(request) {
    // Konfigurasi server VMess
    const VMESS_SERVER = "coba.ari-andika.site"; // Ganti dengan domain/IP server VMess
    const VMESS_PORT = 443; // Port server VMess (biasanya 443 untuk TLS)
    const PATH = "/vmess"; // Path WebSocket server VMess
    const UUID = "your-uuid"; // Gendar

    // URL untuk koneksi WebSocket
    const targetUrl = `wss://${VMESS_SERVER}:${VMESS_PORT}${PATH}`;

    try {
      // Membuka koneksi WebSocket ke server VMess
      const webSocket = await connectWebSocket(targetUrl, UUID);

      // Meneruskan data dari klien ke server VMess
      const { readable, writable } = webSocket;
      return new Response(readable, { status: 101, headers: { Connection: "Upgrade" } });

    } catch (error) {
      return new Response(`Failed to connect to VMess server: ${error.message}`, {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
};

// Fungsi untuk membuat koneksi WebSocket dengan autentikasi VMess
async function connectWebSocket(url, uuid) {
  // Header untuk autentikasi VMess
  const headers = {
    "Proxy-Authorization": `VMess ${uuid}`,
    "Sec-WebSocket-Protocol": "vmess",
  };

  const webSocket = new WebSocket(url, headers);

  // Menunggu koneksi terhubung
  return new Promise((resolve, reject) => {
    webSocket.onopen = () => resolve(webSocket);
    webSocket.onerror = (error) => reject(error);
  });
}
