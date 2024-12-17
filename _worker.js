export default {
  async fetch(request) {
    // Mendapatkan IP Address dari header Cloudflare
    const ipAddress = request.headers.get('CF-Connecting-IP') || 'Tidak dapat mendeteksi IP';

    let country = 'Negara tidak diketahui';
    let city = 'Kota tidak diketahui';

    // Mengambil data geolokasi IP untuk menampilkan negara
    try {
      const geoData = await fetch(`https://ipinfo.io/${ipAddress}/json`);
      const geoJson = await geoData.json();
      country = geoJson.country || 'Negara tidak diketahui';
      city = geoJson.city || 'Kota tidak diketahui';
    } catch (error) {
      console.error('Error fetching geolocation:', error);
    }

    // Menambahkan elemen untuk menampilkan IP Address dan Kecepatan Jaringan
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generate HTTPS URL</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            text-align: center;
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            color: white;
        }

        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px 40px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            max-width: 500px;
            width: 100%;
        }

        h1 {
            margin-bottom: 20px;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 1px;
        }

        input, select, button {
            width: 100%;
            padding: 14px;
            margin: 10px 0;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }

        input, select {
            background: rgba(255, 255, 255, 0.8);
            color: #333;
        }

        button {
            background: #ff6b6b;
            color: white;
            cursor: pointer;
        }

        button:hover {
            background: #ee5253;
            transform: translateY(-2px);
        }

        button:active {
            transform: translateY(2px);
        }

        #message {
            margin-top: 20px;
            font-size: 14px;
        }

        #message.green {
            color: #00ff6b;
        }

        #message.red {
            color: #ff6b6b;
        }

        #network-info {
            margin-top: 20px;
            font-size: 16px;
            font-weight: bold;
            color: #ffd700;
        }

        .info {
            font-size: 20px;
            color: #ff4500;
            font-weight: bold;
        }

        .speed {
            font-size: 18px;
            color: #ff6f61;
            font-weight: bold;
        }

        .flag {
            width: 25px;
            height: 15px;
            vertical-align: middle;
            margin-left: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Generate HTTPS URL</h1>
        <p>Masukkan subdomain dan pilih domain:</p>

        <input type="text" id="subdomainInput" placeholder="Masukkan subdomain">
        
        <select id="domainSelect">
            <option value="ari-andika2.site">ari-andika2.site</option>
            <option value="ari-andikha.web.id">ari-andikha.web.id</option>
            <option value="gendarxml.web.id">gendarxml.web.id</option>
        </select>

        <button onclick="openUrl()">Buka URL</button>

        <div id="message"></div>

        <!-- Informasi IP dan Kecepatan Jaringan -->
        <div id="network-info">
            <p class="info">Subdomain VPN Anda: <span id="subdomain"></span></p>
            <p>IP Address Anda: <span id="ipAddress">${ipAddress}</span></p>
            <p class="info">Lokasi Anda: ${city}, ${country} <img src="https://cdn.jsdelivr.net/npm/country-flag-icons@1.0.0/flags/24/${country.toLowerCase()}.png" alt="Flag" class="flag"/></p>
            <p class="speed" id="networkSpeed">Kecepatan Jaringan: Menghitung...</p>
        </div>
    </div>

    <script>
        let generatedUrl = "";

        function openUrl() {
            const subdomain = document.getElementById('subdomainInput').value.trim();
            const domain = document.getElementById('domainSelect').value;
            const message = document.getElementById('message');

            if (subdomain === '') {
                message.innerHTML = "Subdomain tidak boleh kosong!";
                message.className = 'red';
                return;
            }

            generatedUrl = `https://${subdomain}.${domain}`;
            window.location.href = generatedUrl;  // Meneruskan langsung ke URL yang digabungkan

            // Update subdomain info
            document.getElementById('subdomain').innerHTML = subdomain;
        }

        // Fungsi untuk mengukur kecepatan jaringan (menggunakan API Browser)
        async function getNetworkSpeed() {
            const networkSpeedElement = document.getElementById('networkSpeed');
            try {
                const startTime = performance.now();
                const image = new Image();
                image.src = 'https://www.gstatic.com/webp/gallery/2.jpg';  // Menggunakan gambar sebagai sumber untuk pengukuran
                await image.decode();
                const endTime = performance.now();
                const duration = endTime - startTime;
                const speed = (image.width * image.height) / (duration * 1000); // Kecepatan dalam KB/ms
                networkSpeedElement.innerHTML = 'Kecepatan Jaringan: ' + speed.toFixed(2) + ' KB/ms';
            } catch (error) {
                networkSpeedElement.innerHTML = 'Tidak dapat mengukur kecepatan';
            }
        }

        // Memanggil fungsi getNetworkSpeed saat halaman dimuat
        getNetworkSpeed();
    </script>
</body>
</html>`,
      {
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
        },
      }
    );
  },
};
