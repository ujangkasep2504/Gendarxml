addEventListener('fetch', event => {
  event.respondWith(new Response(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Jual Kuota Internet</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f9;
                margin: 0;
                padding: 0;
            }
            header {
                background-color: #3498db;
                color: white;
                text-align: center;
                padding: 20px;
            }
            .container {
                width: 80%;
                margin: 0 auto;
                padding: 20px;
            }
            .card {
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                margin: 10px 0;
                padding: 20px;
                text-align: center;
            }
            .card h2 {
                color: #3498db;
            }
            .price {
                font-size: 1.5em;
                color: #2ecc71;
            }
            .btn {
                background-color: #3498db;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                text-decoration: none;
            }
            .btn:hover {
                background-color: #2980b9;
            }
            /* Style untuk Formulir */
            .form-container {
                display: none;
                background-color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                margin: 20px auto;
                width: 300px;
            }
            .form-container input {
                width: 100%;
                padding: 10px;
                margin: 10px 0;
                border: 1px solid #ccc;
                border-radius: 5px;
            }
            .form-container button {
                background-color: #3498db;
                color: white;
                padding: 10px;
                border: none;
                border-radius: 5px;
                width: 100%;
                cursor: pointer;
            }
            .form-container button:hover {
                background-color: #2980b9;
            }
        </style>
    </head>
    <body>
        <header>
            <h1>Jual Kuota Internet</h1>
            <p>Temukan Paket Kuota Terbaik untuk Anda!</p>
        </header>

        <div class="container">
            <div class="card">
                <h2>Paket 5GB</h2>
                <p>Kuota data untuk kebutuhan sehari-hari.</p>
                <p class="price">Rp 50.000</p>
                <button class="btn" onclick="showForm()">Beli Sekarang</button>
            </div>

            <div class="card">
                <h2>Paket 10GB</h2>
                <p>Kuota data untuk streaming dan browsing.</p>
                <p class="price">Rp 90.000</p>
                <button class="btn" onclick="showForm()">Beli Sekarang</button>
            </div>

            <div class="card">
                <h2>Paket 20GB</h2>
                <p>Kuota data untuk kebutuhan lebih banyak.</p>
                <p class="price">Rp 150.000</p>
                <button class="btn" onclick="showForm()">Beli Sekarang</button>
            </div>
        </div>

        <!-- Formulir untuk Memasukkan Nomor HP -->
        <div class="form-container" id="form-container">
            <h2>Masukkan Nomor HP Anda</h2>
            <form id="phone-form">
                <input type="tel" id="phone-number" name="phone" placeholder="Masukkan nomor HP" required>
                <button type="submit">Kirim</button>
            </form>
        </div>

        <script>
            // Menampilkan formulir saat tombol "Beli Sekarang" diklik
            function showForm() {
                document.getElementById('form-container').style.display = 'block';
            }

            // Menangani pengiriman formulir
            document.getElementById('phone-form').addEventListener('submit', function(event) {
                event.preventDefault(); // Mencegah reload halaman
                var phoneNumber = document.getElementById('phone-number').value;
                if (phoneNumber) {
                    alert("Nomor HP yang dimasukkan: " + phoneNumber);
                    // Anda bisa menambahkan kode untuk mengirim data ke server atau API di sini
                    document.getElementById('form-container').style.display = 'none'; // Menyembunyikan formulir setelah pengiriman
                } else {
                    alert("Nomor HP tidak valid");
                }
            });
        </script>

    </body>
  </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  }));
});
