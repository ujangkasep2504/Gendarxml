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
            font-size
