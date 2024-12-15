addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Cek apakah request adalah untuk mendapatkan halaman HTML
  if (request.method === 'GET') {
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cek Subdomain dan Redirect</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  background-color: #f4f4f4;
              }
              input[type="text"] {
                  padding: 10px;
                  margin: 10px 0;
                  width: 300px;
                  font-size: 16px;
              }
              button {
                  padding: 10px 15px;
                  background-color: #4CAF50;
                  color: white;
                  font-size: 16px;
                  border: none;
                  cursor: pointer;
              }
              button:hover {
                  background-color: #45a049;
              }
              #result {
                  margin-top: 20px;
                  font-size: 18px;
              }
              .error {
                  color: red;
              }
              .success {
                  color: green;
              }
          </style>
      </head>
      <body>

          <h1>Cek Subdomain</h1>
          <p>Masukkan subdomain yang ingin Anda cek:</p>

          <input type="text" id="subdomain" placeholder="Masukkan subdomain (contoh: gendar)">
          <button onclick="checkSubdomain()">Cek Subdomain</button>

          <div id="result"></div>

          <script>
              function checkSubdomain() {
                  var subdomain = document.getElementById('subdomain').value;
                  var domain = 'ari-andika.site';  // Ganti dengan domain Anda
                  var fullDomain = subdomain + '.' + domain;

                  var resultElement = document.getElementById('result');
                  resultElement.innerHTML = 'Memeriksa...';

                  // Menggunakan fetch untuk mencoba request ke subdomain
                  fetch('https://' + fullDomain, { method: 'HEAD' })
                      .then(response => {
                          if (response.ok) {
                              resultElement.innerHTML = '<span class="success">Subdomain ' + fullDomain + ' ditemukan dan aktif!</span>';
                              resultElement.innerHTML += '<br><button onclick="window.location.href=\'https://' + fullDomain + '\'">OK, Lanjutkan ke ' + fullDomain + '</button>';
                          } else {
                              resultElement.innerHTML = '<span class="error">Subdomain ' + fullDomain + ' tidak ditemukan.</span>';
                          }
                      })
                      .catch(error => {
                          resultElement.innerHTML = '<span class="error">Subdomain ' + fullDomain + ' tidak dapat diakses.</span>';
                      });
              }
          </script>

      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  // Return a response for unsupported methods (only GET supported here)
  return new Response('Method Not Allowed', { status: 405 })
}
