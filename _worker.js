const CF_API_URL = "https://api.cloudflare.com/client/v4";
const CF_API_TOKEN = "BewsLzm3Vy786rUrkmX2jhMTJ0o1uTiS7URlsYEm"; // Token API Anda
const CF_ZONE_ID = "d65078e43dbc7be09d9e019fc1201012"; // Zone ID untuk domain Anda

export default {
  async fetch(request) {
    if (request.method === "POST") {
      try {
        // Parsing data dari permintaan POST
        const { subdomain, domain } = await request.json();

        if (!subdomain || !domain) {
          return new Response(
            JSON.stringify({ error: "Subdomain atau domain tidak valid." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // Format nama subdomain lengkap
        const fullDomain = `${subdomain}.${domain}`;

        // Proses pembuatan DNS Record di Cloudflare
        const response = await createSubdomain(fullDomain);
        if (response.success) {
          return new Response(
            JSON.stringify({
              success: true,
              message: `Subdomain ${fullDomain} berhasil dibuat.`,
              url: `https://${fullDomain}`,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        } else {
          return new Response(
            JSON.stringify({
              success: false,
              error: response.errors?.[0]?.message || "Gagal membuat subdomain.",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      } catch (err) {
        return new Response(
          JSON.stringify({ error: `Terjadi kesalahan: ${err.message}` }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Halaman Form HTML
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buat Subdomain</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 0;
      margin: 0;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f8f9fa;
    }
    .container {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      width: 400px;
    }
    input, select, button {
      padding: 10px;
      margin: 10px 0;
      width: 100%;
      border-radius: 5px;
      border: 1px solid #ccc;
      font-size: 16px;
    }
    button {
      background-color: #007bff;
      color: white;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
    #message {
      margin-top: 15px;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Buat Subdomain</h1>
    <input id="subdomainInput" type="text" placeholder="Masukkan Subdomain">
    <select id="domainSelect">
      <option value="ari-andika2.site">ari-andika2.site</option>
      <option value="ari-andikha.web.id">ari-andikha.web.id</option>
      <option value="gendarxml.web.id">gendarxml.web.id</option>
    </select>
    <button onclick="createDomain()">Buat Subdomain</button>
    <div id="message"></div>
  </div>
  <script>
    async function createDomain() {
      const subdomain = document.getElementById("subdomainInput").value.trim();
      const domain = document.getElementById("domainSelect").value;
      const message = document.getElementById("message");

      if (!subdomain) {
        message.textContent = "Subdomain tidak boleh kosong!";
        message.style.color = "red";
        return;
      }

      try {
        const response = await fetch("/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subdomain, domain }),
        });

        const result = await response.json();
        if (result.success) {
          message.innerHTML = `Subdomain berhasil dibuat! Klik <a href="${result.url}" target="_blank">${result.url}</a>`;
          message.style.color = "green";
        } else {
          message.textContent = `Error: ${result.error}`;
          message.style.color = "red";
        }
      } catch (err) {
        message.textContent = `Terjadi kesalahan: ${err.message}`;
        message.style.color = "red";
      }
    }
  </script>
</body>
</html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  },
};

// Fungsi untuk membuat subdomain
async function createSubdomain(fullDomain) {
  const dnsRecord = {
    type: "CNAME",
    name: fullDomain,
    content: "@", // Ganti jika perlu, misal: "yourmain.domain"
    ttl: 3600,
    proxied: true,
  };

  const response = await fetch(`${CF_API_URL}/zones/${CF_ZONE_ID}/dns_records`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dnsRecord),
  });

  return response.json();
}
