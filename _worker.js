addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'GET') {
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Ganti Domain Akun V2Ray</title>
          <style>
              body { font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; }
              textarea { width: 100%; height: 150px; padding: 10px; font-size: 14px; margin-bottom: 10px; }
              button { padding: 10px 15px; background-color: #4CAF50; color: white; font-size: 16px; border: none; cursor: pointer; }
              button:hover { background-color: #45a049; }
              .results { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
              .result-column { width: 45%; padding: 10px; background-color: #282c34; color: #f8f8f2; border-radius: 5px; }
              pre { white-space: pre-wrap; word-wrap: break-word; font-size: 14px; padding: 10px; background-color: #333; color: white; }
          </style>
      </head>
      <body>

          <h1>Ganti Domain Akun V2Ray</h1>
          <p>Tempelkan akun V2Ray Anda di kolom berikut untuk mengganti domain dan UUID secara otomatis:</p>

          <h2>Vidio</h2>
          <textarea id="input-acount-1" placeholder="Tempelkan akun V2Ray JSON di sini..."></textarea>

          <h2>Game</h2>
          <textarea id="input-acount-2" placeholder="Tempelkan akun V2Ray JSON di sini..."></textarea>

          <h2>Kolom 3</h2>
          <textarea id="input-acount-3" placeholder="Tempelkan akun V2Ray JSON di sini..."></textarea>

          <h2>Kolom 4</h2>
          <textarea id="input-acount-4" placeholder="Tempelkan akun V2Ray JSON di sini..."></textarea>

          <h2>Kolom 5</h2>
          <textarea id="input-acount-5" placeholder="Tempelkan akun V2Ray JSON di sini..."></textarea>

          <button onclick="processAccounts()">Proses Akun</button>

          <h2>Hasil Akun yang Diperbarui</h2>
          <div class="results">
              <div class="result-column" id="output-acount-1"></div>
              <div class="result-column" id="output-acount-2"></div>
              <div class="result-column" id="output-acount-3"></div>
              <div class="result-column" id="output-acount-4"></div>
              <div class="result-column" id="output-acount-5"></div>
          </div>

          <script>
              function processAccounts() {
                  for (let i = 1; i <= 5; i++) {
                      var accountInput = document.getElementById('input-acount-' + i).value;
                      var updatedAccount = accountInput.replace(/"add":\s*"[^"]+"/g, function(match) {
                          // Ganti domain sesuai dengan kolom
                          if (i === 1) {
                              return '"add": "quiz.vidio.com"';  // Kolom pertama
                          } else if (i === 2) {
                              return '"add": "cdn.appsflyer.com"';  // Kolom kedua
                          } else {
                              return match;  // Kolom lainnya tetap sama atau bisa diganti jika perlu
                          }
                      }).replace(/"id":\s*"[^"]+"/g, function(match) {
                          // Ganti UUID menjadi "quiz-vidio-uuid"
                          return '"id": "quiz-vidio-uuid-' + generateUUID() + '"';
                      });

                      document.getElementById('output-acount-' + i).innerHTML = "<pre>" + updatedAccount + "</pre>";
                  }
              }

              // Fungsi untuk menghasilkan UUID acak
              function generateUUID() {
                  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                      var r = Math.random() * 16 | 0,
                          v = c === 'x' ? r : (r & 0x3 | 0x8);
                      return v.toString(16);
                  });
              }
          </script>

      </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } })
  }

  return new Response('Method Not Allowed', { status: 405 })
}
