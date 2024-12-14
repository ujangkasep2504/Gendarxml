export default {
  async fetch(request) {
    // Konfigurasi server WebSocket dan VMess
    const VMESS_SERVER = "ari-andika.site";  // Gunakan domain Anda
    const VMESS_PORT = 443;  // Port untuk koneksi TLS (biasanya 443)
    const PATH_VMESS = "/vmess";  // Path VMess yang akan digunakan
    const WS_SERVER = "wss://ari-andika.site";  // WebSocket menggunakan domain Anda
    const PATH_WS = "/websocket";  // Path WebSocket yang diinginkan
    const UUID = "904fccc7-7941-4a2e-99f4-0a220347a156"; // UUID untuk VMess

    const url = new URL(request.url);
    const upgradeHeader = request.headers.get("Upgrade");

    // Log request URL dan upgrade header untuk debugging
    console.log("Request URL: " + url.pathname);
    console.log("Upgrade Header: " + upgradeHeader);

    // Cek apakah permintaan menggunakan WebSocket
    if (upgradeHeader === "websocket" && url.pathname === PATH_WS) {
      console.log("WebSocket request detected, upgrading...");
      return await handleWebSocket(request);
    } 
    
    // Cek apakah permintaan untuk path VMess
    if (url.pathname === PATH_VMESS) {
      console.log("VMess request detected.");
      return await handleVMess(request);
    }

    // Jika bukan WebSocket atau VMess, kembalikan status 400
    console.log("Not a WebSocket or VMess request.");
    return new Response("Not a WebSocket or VMess request", { status: 400 });
  },
};

// Fungsi untuk menangani koneksi WebSocket
async function handleWebSocket(request) {
  try {
    // Proses untuk menghubungkan ke WebSocket server
    const response = await fetch(WS_SERVER);

    // Mengembalikan status keberhasilan koneksi
    if (response.ok) {
      console.log("Successfully connected to WebSocket server.");
      return new Response("WebSocket connection established", {
        status: 101,  // Status untuk upgrade koneksi
        headers: { "Connection": "Upgrade", "Upgrade": "websocket" }
      });
    } else {
      console.log("Failed to connect to WebSocket server.");
      return new Response("Failed to connect to WebSocket server", { status: 500 });
    }
  } catch (error) {
    // Jika gagal menghubungkan ke WebSocket
    console.log(`WebSocket error: ${error.message}`);
    return new Response(`Failed to connect to WebSocket server: ${error.message}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

// Fungsi untuk menangani koneksi VMess
async function handleVMess(request) {
  try {
    // Contoh format VMess URL
    const pathFixed = encodeURIComponent(PATH_VMESS);  // Encoding path
    const vlessUrl = `vless://${UUID}@${VMESS_SERVER}:${VMESS_PORT}?encryption=none&security=tls&sni=${VMESS_SERVER}&fp=randomized&type=ws&host=${VMESS_SERVER}&path=${pathFixed}#${VMESS_SERVER}`;
    
    console.log("Generated VMess URL:", vlessUrl);

    // Mengembalikan konfigurasi VMess dalam bentuk respons
    return new Response(vlessUrl, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    // Jika ada masalah dengan VMess
    console.log(`VMess error: ${error.message}`);
    return new Response(`Failed to generate VMess URL: ${error.message}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
