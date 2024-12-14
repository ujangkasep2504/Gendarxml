addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Cek apakah path mengandung username
  const pathParts = url.pathname.split('/');
  const username = pathParts[1];  // Ambil username dari URL (misalnya /username123)

  if (!username) {
    return new Response('Username tidak ditemukan', { status: 400 });
  }

  // Membuat custom domain menggunakan username
  const customDomain = `${username}.ari-andika.site`;

  // Proses pembuatan akun VLESS berdasarkan username
  const vlessConfig = await generateVlessAccount(username);

  // Menampilkan konfigurasi VLESS dan custom domain
  return new Response(`
    <html>
      <head><title>Akun VLESS ${username}</title></head>
      <body>
        <h1>Selamat datang, ${username}!</h1>
        <p>Custom Domain Anda: <strong>${customDomain}</strong></p>
        <h3>Konfigurasi VLESS:</h3>
        <pre>${vlessConfig}</pre>
      </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' },
  });
}

async function generateVlessAccount(username) {
  // Ini adalah contoh pembuatan konfigurasi VLESS, Anda bisa sesuaikan dengan sistem yang ada
  // Format: vless://username@domain:port?security=tls&encryption=none&alterId=64
  return `vless://${username}@${username}.ari-andika.site:443?security=tls&encryption=none&alterId=64`;
}
