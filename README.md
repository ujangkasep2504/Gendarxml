           CUMA UBAH FILE 
           wrangler.toml
    contoh: name = "gendarxmlb" # todo
    Selanjutnya Klik Deploy Di bawah
    
Edit Wrangler Di bawah

https://github.com/Gendarxml/Gendarxml/edit/main/wrangler.toml


edit worker.js

https://github.com/Gendarxml/Gendarxml/edit/main/_worker.js


cek domain

https://cek-domain.ari-andika.site




KLIK DEPLOY

   [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Gendarxml/Gendarxml)

Jika sudah Maka masukan ID Cloudflare Anda
Dan juga Token Cloudflare anda


cek domain yuhu

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
          <title>Cek Subdomain dan Salin URL</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  background-color: #f4f4f4;
              }
              input[type="text"], select {
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
              .share-button {
                  padding: 10px;
                  background-color: #25D366;  /* WhatsApp color */
                  color: white;
                  font-size: 16px;
                  border: none;
                  cursor: pointer;
              }
              .share-button:hover {
                  background-color: #128C7E;
              }
              .email-button {
                  padding: 10px;
                  background-color: #D44638;  /* Email icon color */
                  color: white;
                  font-size: 16px;
                  border: none;
                  cursor: pointer;
              }
              .email-button:hover {
                  background-color: #C1351D;
              }
          </style>
      </head>
      <body>

          <h1>Cek Subdomain dan Salin URL</h1>
          <p>Masukkan nama subdomain yang ingin Anda gabungkan:</p>

          <input type="text" id="subdomain" placeholder="Masukkan subdomain (contoh: gendar)">
          <p>Pilih domain:</p>
          <select id="domain-selector">
              <option value="ari-andika.site">ari-andika.site</option>
              <option value="ari-andikha.web.id">ari-andikha.web.id</option>
              <option value="gendarxml.web.id">gendarxml.web.id</option>
          </select>
          <button onclick="generateUrl()">Gabungkan URL</button>

          <div id="result"></div>

          <script>
              function generateUrl() {
                  var subdomain = document.getElementById('subdomain').value;
                  var selectedDomain = document.getElementById('domain-selector').value;
                  var fullDomain = subdomain + '.' + selectedDomain;
                  var resultElement = document.getElementById('result');

                  // Membuat URL lengkap dengan https://
                  var url = 'https://' + fullDomain;

                  // Menampilkan hasil URL yang bisa disalin
                  resultElement.innerHTML = 'URL lengkap: ' + url;

                  // Menampilkan input untuk menyalin URL
                  resultElement.innerHTML += '<br><input type="text" id="copy-url" value="' + url + '" readonly style="width: 300px; padding: 8px; font-size: 16px;">';

                  // Menampilkan tombol salin
                  resultElement.innerHTML += '<br><button class="copy-button" onclick="copyUrl()">Salin URL</button>';

                  // Menambahkan opsi untuk berbagi
                  resultElement.innerHTML += '<br><button class="share-button" onclick="shareOnWhatsApp(\'' + url + '\')">Bagikan ke WhatsApp</button>';
                  resultElement.innerHTML += '<br><button class="email-button" onclick="shareViaEmail(\'' + url + '\')">Bagikan via Email</button>';
              }

              // Fungsi untuk menyalin URL menggunakan Clipboard API
              async function copyUrl() {
                  try {
                      var copyText = document.getElementById("copy-url");
                      await navigator.clipboard.writeText(copyText.value);

                      // Feedback ke user
                      alert("URL disalin: " + copyText.value);
                  } catch (err) {
                      alert("Terjadi kesalahan saat menyalin URL.");
                  }
              }

              // Fungsi untuk berbagi di WhatsApp
              function shareOnWhatsApp(url) {
                  var whatsappUrl = "https://wa.me/?text=" + encodeURIComponent(url);
                  window.open(whatsappUrl, "_blank");
              }

              // Fungsi untuk berbagi via Email
              function shareViaEmail(url) {
                  var emailSubject = "URL Subdomain";
                  var emailBody = "Berikut adalah URL yang telah digenerate: " + url;
                  var mailtoUrl = "mailto:?subject=" + encodeURIComponent(emailSubject) + "&body=" + encodeURIComponent(emailBody);
                  window.location.href = mailtoUrl;
              }
          </script>

      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  return new Response('Method Not Allowed', { status: 405 })
}












Jika bingung Bisa tanya lewat 

<b>Facebook

https://m.facebook.com/ariy.tool/

<b>Whatsapp

https://wa.link/d982tb
