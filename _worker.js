export default {
  async fetch(request) {
    // Konfigurasi server VMess
    const VMESS_SERVER = "coba.ari-andika.site"; // Ganti dengan alamat server VMess
    const VMESS_PORT = 443; // Biasanya 443 untuk TLS
    const PATH = "/vmess"; // Path yang sesuai di server VMess
    const UUID = "your-uuid"; // 904fccc7-7941-4a2e-99f4-0a220347a156

    // URL untuk WebSocket ke server VMess
    const targetUrl = `wss://${VMESS_SERVER}:${VMESS_PORT}${PATH}`;

    try {
      // Mencoba membuka koneksi WebSocket ke server VMess
      const webSocket = await connectWebSocket(targetUrl, UUID);

      // Meneruskan data dari klien ke server VMess
      const { readable, writable } = webSocket;
      return new Response(readable, { status: 101, headers: { Connection: "Upgrade" } });
    } catch (error) {
      // Jika gagal, kembalikan error
      return new Response(`Failed to connect to VMess server: ${error.message}`, {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
};

// Fungsi untuk membuka koneksi WebSocket tanpa header protokol
async function connectWebSocket(url, uuid) {
  const headers = {
    "Proxy-Authorization": `VMess ${uuid}`, // Gunakan UUID untuk autentikasi
  };

  const webSocket = new WebSocket(url, headers);

  return new Promise((resolve, reject) => {
    webSocket.onopen = () => resolve(webSocket); // Koneksi berhasil
    webSocket.onerror = (error) => reject(error); // Koneksi gagal
  });
}
