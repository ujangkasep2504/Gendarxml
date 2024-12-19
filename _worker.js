export default {
    async fetch(request) {
        const clientIP = request.headers.get("CF-Connecting-IP");
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Jual Kuota VPN</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                header {
                    background-color: #0078d7;
                    color: white;
                    padding: 20px 0;
                    text-align: center;
                }
                .container {
                    width: 90%;
                    max-width: 600px;
                    margin: 20px auto;
                    background: white;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                h2 {
                    color: #0078d7;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                }
                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                .button {
                    display: inline-block;
                    background: #0078d7;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                .button:hover {
                    background: #005bb5;
                }
                .info {
                    background-color: #f9f9f9;
                    padding: 10px;
                    border: 1px solid #ddd;
                    margin-bottom: 20px;
                }
                footer {
                    text-align: center;
                    margin-top: 20px;
                    padding: 10px 0;
                    background: #0078d7;
                    color: white;
                }
            </style>
        </head>
        <body>
            <header>
                <h1>Jual Kuota VPN</h1>
            </header>

            <div class="container">
                <div class="info">
                    <p><strong>IP Address Anda:</strong> ${clientIP}</p>
                </div>

                <h2>Formulir Pemesanan</h2>
                <form method="POST" action="/submit">
                    <div class="form-group">
                        <label for="name">Nama Lengkap:</label>
                        <input type="text" id="name" name="name" placeholder="Masukkan nama Anda" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" placeholder="Masukkan email Anda" required>
                    </div>
                    <div class="form-group">
                        <label for="package">Pilih Paket:</label>
                        <select id="package" name="package" required>
                            <option value="10GB - Rp20.000">Kuota 10GB - Rp20.000</option>
                            <option value="50GB - Rp80.000">Kuota 50GB - Rp80.000</option>
                            <option value="Unlimited - Rp150.000">Kuota Unlimited - Rp150.000</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="message">Pesan Tambahan:</label>
                        <textarea id="message" name="message" rows="4" placeholder="Tuliskan pesan tambahan (opsional)"></textarea>
                    </div>
                    <button type="submit" class="button">Pesan Sekarang</button>
                </form>
            </div>

            <footer>
                <p>&copy; 2024 Jual Kuota VPN. Semua Hak Dilindungi.</p>
            </footer>
        </body>
        </html>
        `;

        if (request.method === "POST") {
            const formData = await request.formData();
            const name = formData.get("name");
            const email = formData.get("email");
            const packageSelected = formData.get("package");
            const message = formData.get("message");

            // Kirimkan response konfirmasi
            return new Response(`
                <!DOCTYPE html>
                <html lang="id">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Pesanan Diterima</title>
                </head>
                <body>
                    <h1>Terima Kasih, ${name}!</h1>
                    <p>Pesanan Anda telah diterima.</p>
                    <p><strong>Detail Pesanan:</strong></p>
                    <ul>
                        <li>Email: ${email}</li>
                        <li>Paket: ${packageSelected}</li>
                        <li>Pesan: ${message || "Tidak ada pesan tambahan."}</li>
                        <li>IP Address: ${clientIP}</li>
                    </ul>
                </body>
                </html>
            `, { headers: { "Content-Type": "text/html" } });
        }

        return new Response(htmlContent, {
            headers: { "Content-Type": "text/html" },
        });
    },
};
