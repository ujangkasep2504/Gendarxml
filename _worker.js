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
              textarea { width: 100%; height: 200px; padding: 10px; font-size: 14px; margin-bottom: 10px; }
              button { padding: 10px 15px; background-color: #4CAF50; color: white; font-size: 16px; border: none; cursor: pointer; }
              button:hover { background-color: #45a049; }
              pre { background-color: #282c34; color: #f8f8f2; padding: 15px; border-radius: 5px; white-space: pre-wrap; word-wrap: break-word; font-size: 14px; }
          </style>
      </head>
      <body>

          <h1>Ganti Domain Akun V2Ray</h1>
          <p>Tempelkan akun V2Ray Anda di kolom berikut untuk mengganti domain dan UUID secara otomatis:</p>

          <textarea id="input-acount" placeholder="Tempelkan akun V2Ray JSON di sini..."></textarea>
          <button onclick="processAccount()">Proses Akun</button>

          <h2>Hasil Akun yang Diperbarui</h2>
          <pre><code id="output-acount"></code></pre>

          <script>
              function processAccount() {
                  var accountInput = document.getElementById('input-acount').value;
                  var updatedAccount = accountInput.replace(/"add":\s*"[^"]+"/g, '"add": "quiz.vidio.com"') // Ganti domain
                                                   .replace(/"id":\s*"[^"]+"/g, function(match) {
                                                       // Ganti UUID menjadi "quiz-vidio-uuid"
                                                       return '"id": "quiz-vidio-uuid-' + generateUUID() + '"';
                                                   });

                  document.getElementById('output-acount').textContent = updatedAccount;
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
