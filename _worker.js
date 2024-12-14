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
    const { username, port, alterId } = data

    // Membuat konfigurasi VLESS
    const vlessConfig = generateVlessConfig(username, port, alterId)

    // Membentuk URL custom domain berdasarkan username yang dimasukkan
    const customDomainUrl = `https://${username}.ari-andika.site`

    // Redirect ke custom domain yang mengandung username
    return Response.redirect(customDomainUrl, 303)
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
            input[type="text"], input[type="number"], button { width: 100%; padding: 10px; margin: 10px 0; border-radius: 4px; border: 1px solid #ccc; }
            button { background-color: #4CAF50; color: white; cursor: pointer; }
            button:hover { background-color: #45a049; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Buat Akun VLESS</h1>
            
            <form id="vlessForm">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
                
                <label for="port">Port</label>
                <input type="number" id="port" name="port" required>
                
                <label for="alterId">AlterId</label>
                <input type="number" id="alterId" name="alterId" required>
                
                <button type="submit">Buat Akun</button>
            </form>
            <div id="result" style="margin-top: 20px; display: none;">
                <h3>Konfigurasi VLESS Anda:</h3>
                <pre id="vlessConfig"></pre>
            </div>
        </div>

        <script>
            document.getElementById('vlessForm').addEventListener('submit', function (e) {
                e.preventDefault();

                const username = document.getElementById('username').value;
                const port = document.getElementById('port').value;
                const alterId = document.getElementById('alterId').value;

                // Kirim data ke custom domain Worker
                fetch('/create-account', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, port, alterId })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.vlessConfig) {
                        document.getElementById('vlessConfig').textContent = data.vlessConfig;
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
function generateVlessConfig(username, port, alterId) {
  return `
    {
      "vless": {
        "username": "${username}",
        "port": ${port},
        "alterId": ${alterId}
      }
    }
  `
}
