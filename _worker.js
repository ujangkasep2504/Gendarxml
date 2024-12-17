const CF_API_URL = "https://api.cloudflare.com/client/v4";
const CF_API_TOKEN = "SGPJHkPrC_EaaFQDCKuFPakgz0-qtwWCjQIAFOW2"; // Ganti dengan API Token Anda
const CF_ZONE_ID = "d65078e43dbc7be09d9e019fc1201012"; // Ganti dengan Zone ID Anda

export default {
  async fetch(request) {
    if (request.method === "POST") {
      const requestBody = await request.json();
      const { subdomain, domain } = requestBody;

      if (!subdomain || !domain) {
        return new Response(
          JSON.stringify({ error: "Subdomain atau domain tidak valid!" }),
          { status: 400 }
        );
      }

      const recordName = `${subdomain}.${domain}`;

      try {
        // Membuat DNS CNAME record untuk subdomain yang diminta
        const dnsResponse = await createDnsRecord(recordName, domain);
        if (dnsResponse.success) {
          return new Response(
            JSON.stringify({
              message: `Subdomain ${recordName} berhasil dibuat!`,
              url: `https://${recordName}`,
            }),
            { status: 200 }
          );
        } else {
          return new Response(
            JSON.stringify({ error: "Gagal membuat subdomain." }),
            { status: 500 }
          );
        }
      } catch (error) {
        return new Response(
          JSON.stringify({ error: `Error: ${error.message}` }),
          { status: 500 }
        );
      }
    } else {
      return new Response(
        `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Subdomain</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f0f4f8;
        }
        .container {
            background: white;
            padding: 30px 40px;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
        }
        h1 {
            margin-bottom: 20px;
            font-size: 24px;
            color: #333;
        }
        input, select, button {
            padding: 12px;
            font-size: 16px;
            margin: 10px 0;
            width: 100%;
            border-radius: 8px;
            border: 1px solid #ccc;
        }
        button {
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
        #message {
            margin-top: 20px;
            font-size: 16px;
            color: red;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Create Subdomain</h1>
        <p>Masukkan subdomain yang ingin Anda buat dan pilih domain:</p>

        <input type="text" id="subdomainInput" placeholder="Masukkan subdomain">
        
        <select id="domainSelect">
            <option value="ari-andika2.site">ari-andika2.site</option>
            <option value="ari-andikha.web.id">ari-andika.web.id</option>
            <option value="gendarxml.web.id">gendarxml.web.id</option>
        </select>

        <button onclick="createSubdomain()">Buat Subdomain</button>

        <div id="message"></div>
    </div>

    <script>
        async function createSubdomain() {
            const subdomain = document.getElementById('subdomainInput').value.trim();
            const domain = document.getElementById('domainSelect').value;
            const message = document.getElementById('message');

            if (subdomain === '') {
                message.innerHTML = "Subdomain tidak boleh kosong!";
                message.style.color = "red";
                return;
            }

            const response = await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subdomain, domain })
            });

            const result = await response.json();
            if (response.status === 200) {
                message.innerHTML = `Subdomain berhasil dibuat! Klik <a href="${result.url}" target="_blank">${result.url}</a>`;
                message.style.color = "green";
            } else {
                message.innerHTML = `Error: ${result.error}`;
                message.style.color = "red";
            }
        }
    </script>
</body>
</html>`,
      { headers: { "Content-Type": "text/html;charset=UTF-8" } });
  },
};

// Fungsi untuk membuat DNS CNAME record
async function createDnsRecord(recordName, domain) {
  const url = `${CF_API_URL}/zones/${CF_ZONE_ID}/dns_records`;
  const headers = {
    "Authorization": `Bearer ${CF_API_TOKEN}`,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    type: "CNAME",
    name: recordName,
    content: "@", // Mengarah ke domain utama (root)
    ttl: 3600,
    proxied: false,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: body,
  });

  const data = await response.json();
  return data.success;
}
