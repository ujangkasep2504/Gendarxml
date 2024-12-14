<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pembuatan Akun Vmess</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            margin-top: 50px;
        }
        h1 {
            text-align: center;
        }
        input[type="text"], input[type="number"], button {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
            border: 1px solid #ccc;
        }
        button {
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Buat Akun Vmess</h1>
        <form id="vmessForm">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required>
            
            <label for="port">Port</label>
            <input type="number" id="port" name="port" required>
            
            <label for="alterId">AlterId</label>
            <input type="number" id="alterId" name="alterId" required>
            
            <button type="submit">Buat Akun</button>
        </form>
        <div id="result" style="margin-top: 20px; display: none;">
            <h3>Konfigurasi Vmess Anda:</h3>
            <pre id="vmessConfig"></pre>
        </div>
    </div>

    <script>
        document.getElementById('vmessForm').addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const port = document.getElementById('port').value;
            const alterId = document.getElementById('alterId').value;

            // Kirim data ke Worker
            fetch('https://coba.ari-andika.workers.dev/generate-vmess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, port, alterId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.vmessConfig) {
                    document.getElementById('vmessConfig').textContent = data.vmessConfig;
                    document.getElementById('result').style.display = 'block';
                } else {
                    alert('Terjadi kesalahan. Coba lagi!');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    </script>
</body>
</html>
