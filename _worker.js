addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// Fungsi untuk menangani request ke worker
async function handleRequest(request) {
  const url = new URL(request.url)

  // Cek apakah ini request GET untuk menampilkan form HTML
  if (request.method === 'GET') {
    return new Response(await generateForm(url), {
      headers: { 'Content-Type': 'text/html' }
    })
  }

  // Cek apakah ini request POST untuk menerima data form
  if (request.method === 'POST' && request.url.endsWith('/create-account')) {
    const data = await request.json()

    const { username } = data
    const uuid = generateUUID() // Generate UUID untuk akun VLESS
    const customDomainUrl = `${username}.ari-andika.site`

    // Tambahkan DNS record ke Cloudflare
    const dnsResponse = await createCloudflareDNSRecord(customDomainUrl)

    // Mengembalikan custom domain jika sukses
    if (dnsResponse.success) {
      return new Response(JSON.stringify({ customDomainUrl, uuid }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      return new Response(JSON.stringify({ error: 'Gagal membuat DNS record' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  return new Response('Not Found', { status: 404 })
}

// Fungsi untuk membuat UUID unik
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Fungsi untuk menambahkan DNS record ke Cloudflare
async function createCloudflareDNSRecord(customDomainUrl) {
  const apiToken = 'N64dCpz_OhKDsC2DetlG2s50qU52qRK-Hl2b1k_v'  // Ganti dengan token API yang valid
  const zoneId = 'YOUR_ZONE_ID' // ID Zona DNS untuk domain Anda (ganti dengan Zone ID yang benar)

  const recordData = {
    type: 'CNAME', // Tipe record yang digunakan
    name: customDomainUrl, // Nama domain yang akan ditambahkan
    content: 'andisaputra', // Konten CNAME (misalnya subdomain atau domain tujuan)
    ttl: 3600, // Waktu hidup record dalam detik
    proxied: false // Nonaktifkan proxy jika tidak ingin menggunakan Cloudflare proxy
  }

  const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recordData)
  })

  const result = await response.json()
  return result.success ? result : { success: false, message: 'Gagal menambahkan DNS record' }
}

// Fungsi untuk menghasilkan form HTML
async function generateForm(url) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pembuatan Akun VLESS</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
            .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); border-radius: 8px; margin-top: 50px; }
            h1 { text-align: center; }
            input[type="text"], button { width: 100%; padding: 10px; margin: 10px 0; border-radius: 4px; border: 1px solid #ccc; }
            button { background-color: #4CAF50; color: white; cursor: pointer; }
            button:hover { background-color: #45a049; }
            #result { margin-top: 20px; }
            pre { background-color: #f1f1f1; padding: 15px; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Buat Akun VLESS</h1>
            
            <form id="vlessForm">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
                
                <button type="submit">Buat Akun</button>
            </form>

            <!-- Hasil Custom Domain akan ditampilkan di sini -->
            <div id="result" style="display: none;">
                <h3>Custom Domain Anda:</h3>
                <a id="customDomain" target="_blank">Kunjungi Custom Domain</a>
                <p>UUID: <span id="uuid"></span></p>
            </div>
        </div>

        <script>
            document.getElementById('vlessForm').addEventListener('submit', function (e) {
                e.preventDefault();

                const username = document.getElementById('username').value;

                // Kirim data ke worker untuk membuat akun VLESS
                fetch('/create-account', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.customDomainUrl) {
                        // Tampilkan link custom domain dan UUID
                        document.getElementById('customDomain').href = data.customDomainUrl;
                        document.getElementById('customDomain').textContent = data.customDomainUrl;
                        document.getElementById('uuid').textContent = data.uuid;
                        document.getElementById('result').style.display = 'block';
                    } else {
                        alert('Terjadi kesalahan. Coba lagi!');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            });
        </script>
    </body>
    </html>
  `
}
