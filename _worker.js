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
              .copy-button {
                  padding: 10px;
                  background-color: #008CBA;
                  color: white;
                  font-size: 16px;
                  border: none;
                  cursor: pointer;
              }
              .copy-button:hover {
                  background-color: #006f8c;
              }
              #copy-url {
                  width: 300px;
                  padding: 8px;
                  font-size: 16px;
                  margin-top: 10px;
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
                              
                              // Menampilkan link yang bisa diklik
                              resultElement.innerHTML += '<br><a href="https://' + fullDomain + '" target="_blank" style="font-size: 18px; color: blue; text-decoration: underline;">Klik di sini untuk melanjutkan ke ' + fullDomain + '</a>';

                              // Menambahkan input untuk salin URL dengan awalan https://
                              resultElement.innerHTML += '<br><button class="copy-button" onclick="copyUrl()">Salin URL Subdomain</button>';
                              resultElement.innerHTML += '<br><input type="text" id="copy-url" value="https://' + fullDomain + '" readonly>';
                          } else {
                              resultElement.innerHTML = '<span class="error">Subdomain ' + fullDomain + ' tidak ditemukan.</span>';
                          }
                      })
                      .catch(error => {
                          resultElement.innerHTML = '<span class="error">Subdomain ' + fullDomain + ' tidak dapat diakses.</span>';
                      });
              }

              // Fungsi untuk menyalin URL ke clipboard
              function copyUrl() {
                  var copyText = document.getElementById("copy-url");
                  copyText.select();
                  copyText.setSelectionRange(0, 99999); // Untuk perangkat mobile

                  // Salin ke clipboard
                  document.execCommand("copy");

                  // Feedback ke user
                  alert("URL disalin: " + copyText.value);
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
