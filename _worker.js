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

    // Mengambil data dari request
    const { username } = data

    // Menghasilkan konfigurasi VLESS
    const vlessConfig = generateVlessConfig(username)

    // Membuat custom domain berdasarkan username yang dimasukkan
    const customDomainUrl = `https://${username}.ari-andika.site`

    // Mengembalikan data konfigurasi VLESS dan custom domain
    return new Response(JSON.stringify({ vlessConfig, customDomainUrl }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response('Not Found', { status: 404 })
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

            <!-- Hasil Akun VLESS dan Custom Domain akan ditampilkan di sini -->
            <div id="result" style="display: none;">
                <h3>Konfigurasi VLESS Anda:</h3>
                <pre id="vlessConfig"></pre>
                <h3>Custom Domain Anda:</h3>
                <a id="customDomain" target="_blank">Kunjungi Custom Domain</a>
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
                    if (data.vlessConfig) {
                        // Tampilkan konfigurasi VLESS dan link custom domain
                        document.getElementById('vlessConfig').textContent = JSON.stringify(data.vlessConfig, null, 2);
                        document.getElementById('customDomain').href = data.customDomainUrl;
                        document.getElementById('customDomain').textContent = data.customDomainUrl;
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

// Fungsi untuk menghasilkan konfigurasi VLESS
function generateVlessConfig(username) {
  return {
    vless: {
      username: username,
      port: 443 // Anda bisa menyesuaikan port jika diperlukan
    }
  }
}
