export default {
  async fetch(request) {
    // Konfigurasi server VLESS
    const VLESS_SERVER = "ari-andika.site"; // Ganti dengan domain/IP server VLESS
    const VLESS_PORT = 443; // Port server VLESS (biasanya 443 untuk TLS)
    const UUID = "your-uuid"; // 904fccc7-7941-4a2e-99f4-0a220347a156

    // Header standar VLESS untuk autentikasi
    const vlessHeaders = {
      "Proxy-Authorization": `VLESS ${UUID}`,
      "Content-Type": "application/octet-stream",
    };

    // Membaca body permintaan
    const requestBody = await request.arrayBuffer();

    // Membuat koneksi ke server VLESS
    const serverUrl = `https://${VLESS_SERVER}:${VLESS_PORT}`;
    const options = {
      method: "POST",
      headers: vlessHeaders,
      body: requestBody,
    };

    try {
      // Meneruskan permintaan ke server VLESS
      const response = await fetch(serverUrl, options);

      // Salin header dari respons
      const responseHeaders = new Headers(response.headers);

      // Mengembalikan respons
      return new Response(response.body, {
        status: response.status,
        headers: responseHeaders,
      });
    } catch (err) {
      // Menangani kesalahan
      return new Response(`Error connecting to VLESS server: ${err.message}`, {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
};
{
  "tag": "vless-inbound",
  "protocol": "vless",
  "settings": {
    "clients": [
      {
        "id": "your-uuid",
        "level": 0,
        "email": "user@example.com"
      }
    ],
    "decryption": "none"
  },
  "streamSettings": {
    "network": "ws",
    "security": "tls",
    "tlsSettings": {
      "certificates": [
        {
          "certificateFile": "/path/to/cert.pem",
          "keyFile": "/path/to/key.pem"
        }
      ]
    }
  }
}
