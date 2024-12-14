addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // HTML Konten yang ingin Anda tampilkan
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="id">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Jual Kuota VPN</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              margin: 0;
              padding: 0;
          }
          .container {
              width: 80%;
              margin: auto;
              overflow: hidden;
          }
          header {
              background: #333;
              color: #fff;
              padding: 10px 0;
              text-align: center;
          }
          header h1 {
              font-size: 36px;
          }
          .product-info {
              background: #fff;
              padding: 20px;
              margin: 20px 0;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .product-info h2 {
              font-size: 28px;
          }
          .product-info p {
              font-size: 18px;
              margin: 10px 0;
          }
          .price {
              font-size: 24px;
              color: #27ae60;
          }
          .payment-info {
              background: #fff;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              margin-top: 20px;
          }
          .payment-info h3 {
              font-size: 24px;
          }
          .payment-info p {
              font-size: 18px;
              margin: 10px 0;
          }
          .qr-code {
              text-align: center;
              margin-top: 20px;
          }
          .button {
              display: inline-block;
              background-color: #27ae60;
              color: #fff;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-size: 18px;
              transition: background-color 0.3s;
          }
          .button:hover {
              background-color: #2ecc71;
          }
      </style>
  </head>
  <body>
      <header>
          <h1>Jual Kuota VPN</h1>
      </header>

      <div class="container">
          <div class="product-info">
              <h2>Akun VPN Premium</h2>
              <p>Kuota VPN yang stabil dan cepat untuk browsing tanpa batasan. Nikmati akses ke situs favorit Anda tanpa gangguan.</p>
              <p class="price">Harga: Rp 100.000</p>
              <p>Dapatkan akses selama 30 hari penuh dengan kuota VPN yang dapat digunakan kapan saja.</p>
          </div>

          <div class="payment-info">
              <h3>Pembayaran dengan QRIS</h3>
              <p>Pilih QRIS untuk pembayaran cepat dan mudah. Scan kode QR di bawah untuk melakukan pembayaran.</p>

              <div class="qr-code">
                  <!-- Ganti link QR sesuai dengan QRIS Anda -->
                  <img src="https://via.placeholder.com/300x300.png?text=QRIS+Payment" alt="QRIS Payment" />
              </div>

              <p>Setelah melakukan pembayaran, Anda akan menerima informasi akun VPN melalui WhatsApp atau Email.</p>
          </div>

          <div class="qr-code">
              <a href="https://wa.link/d982tb" class="button">Hubungi Kami via WhatsApp</a>
          </div>
      </div>
  </body>
  </html>
  `;

  // Mengembalikan response HTML
  return new Response(htmlContent, {
    headers: { 'Content-Type': 'text/html' }
  });
}
