export default {
  async fetch(request) {
    // Konfigurasi server WebSocket dan VMess
    const WS_SERVER = "ws://your-server-ip:8080";  // Ganti dengan IP dan port WebSocket server Anda
    const VMESS_PATH = "/vmess";  // Path untuk mengakses VMess config
    const WS_PATH = "/websocket";  // Path untuk mengakses WebSocket

    // Cek apakah permintaan menggunakan WebSocket
    const upgradeHeader = request.headers.get("Upgrade");
    const url = new URL(request.url);

    if (upgradeHeader === "websocket" && url.pathname === WS_PATH) {
      // Jika permintaan adalah WebSocket, arahkan ke server WebSocket eksternal
      try {
        const wsResponse = await fetch(WS_SERVER);

        if (wsResponse.ok) {
          return new Response("Connected to WebSocket server", {
            status: 101,  // Status untuk upgrade koneksi WebSocket
            headers: { "Connection": "Upgrade", "Upgrade": "websocket" }
          });
        } else {
          return new Response("Failed to connect to WebSocket server", {
            status: 500,
            headers: { "Content-Type": "text/plain" }
          });
        }
      } catch (error) {
        return new Response(`Error connecting to WebSocket server: ${error.message}`, {
          status: 500,
          headers: { "Content-Type": "text/plain" }
        });
      }
    } else if (url.pathname === VMESS_PATH) {
      // Jika permintaan adalah untuk VMess
      try {
        const allConfigVless = await getVmessConfig(request.headers.get("Host"));
        return new Response(allConfigVless, {
          status: 200,
          headers: { "Content-Type": "text/html;charset=utf-8" }
        });
      } catch (error) {
        return new Response(`Error fetching VMess config: ${error.message}`, {
          status: 500,
          headers: { "Content-Type": "text/plain" }
        });
      }
    } else {
      // Jika path tidak cocok untuk WebSocket atau VMess
      return new Response("Not a WebSocket or VMess request", {
        status: 400,
        headers: { "Content-Type": "text/plain" }
      });
    }
  }
};

// Fungsi untuk mengambil konfigurasi VMess
async function getVmessConfig(hostName) {
  try {
    // Konfigurasi proxy
    const listProxy = [
      { path: "/MALASIA", proxy: "45.195.69.98:30726" },
      { path: "/INDONESIA", proxy: "172.232.239.151:587" },
      { path: "/SINGAPORE", proxy: "143.198.213.197:8443" },
      // Tambah proxy lain sesuai kebutuhan
    ];

    let vlessConfigs = "";
    for (const entry of listProxy) {
      const { path, proxy } = entry;
      const [proxyAddress, proxyPort] = proxy.split(":");

      // Mendapatkan informasi lokasi dari ip-api
      const response = await fetch(`http://ip-api.com/json/${proxyAddress}`);
      const data = await response.json();

      const pathFixed = encodeURIComponent(path);
      const vlessTls = `vless://${generateUUIDv4()}@${hostName}:443?encryption=none&security=tls&sni=${hostName}&fp=randomized&type=ws&host=${hostName}&path=${pathFixed}#${hostName} (${data.countryCode})`;
      const vlessNtls = `vless://${generateUUIDv4()}@${hostName}:80?path=${pathFixed}&security=none&encryption=none&host=${hostName}&fp=randomized&type=ws#${data.isp} (${data.countryCode})`;

      const vlessTlsFixed = vlessTls.replace(/ /g, "+");
      const vlessNtlsFixed = vlessNtls.replace(/ /g, "+");

      vlessConfigs += `
        <div class="config-section">
          <p><strong>ISP: ${data.isp} (${data.countryCode})</strong></p>
          <div>
            <h3>TLS:</h3>
            <p class="config">${vlessTlsFixed}</p>
          </div>
          <div>
            <h3>NTLS:</h3>
            <p class="config">${vlessNtlsFixed}</p>
          </div>
        </div>
        <hr class="config-divider" />
      `;
    }

    return vlessConfigs;
  } catch (error) {
    throw new Error(`Failed to fetch VMess config: ${error.message}`);
  }
}

// Fungsi untuk menghasilkan UUID
function generateUUIDv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
