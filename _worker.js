addEventListener('fetch', event => {
  event.respondWith(
    new Response(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Jual Kuota Internet</title>
        <style>
          /* CSS Styling Anda */
        </style>
      </head>
      <body>
        <header>
          <h1>Jual Kuota Internet</h1>
          <p>Temukan Paket Kuota Terbaik untuk Anda!</p>
        </header>
        <div class="container">
          <!-- Konten Blog -->
        </div>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })
  );
});
