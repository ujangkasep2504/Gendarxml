<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cek Subdomain</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f4f4f4;
        }
        input[type="text"] {
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
        .error {
            color: red;
        }
        .success {
            color: green;
        }
        .ok-button {
            background-color: #28a745;
        }
        .ok-button:hover {
            background-color: #218838;
        }
    </style>
</head>
<body>

    <h1>Cek Subdomain</h1>
    <p>Masukkan subdomain yang ingin Anda cek:</p>
    
    <input type="text" id="subdomain" placeholder="Masukkan subdomain (contoh: gendar)">
    <button onclick="checkSubdomain()">Cek Subdomain</button>

    <div id="result"></div>

    <script>
        function checkSubdomain() {
            var subdomain = document.getElementById('subdomain').value;
            if (!subdomain) {
                document.getElementById('result').innerHTML = 'Harap masukkan subdomain terlebih dahulu.';
                return;
            }

            var domain = 'ari-andika.site';  // Ganti dengan domain Anda
            var fullDomain = subdomain + '.' + domain;

            var resultElement = document.getElementById('result');
            resultElement.innerHTML = 'Memeriksa...';

            // Mengirim request ke Cloudflare Worker untuk memeriksa subdomain
            fetch('/check-subdomain?subdomain=' + subdomain)
                .then(response => response.json())
                .then(data => {
                    if (data.exists) {
                        resultElement.innerHTML = '<span class="success">Subdomain ' + fullDomain + ' ditemukan dan aktif! </span>';
                        resultElement.innerHTML += '<br><button class="ok-button" onclick="window.location.href=\'https://' + fullDomain + '\'">OK, Lanjutkan ke ' + fullDomain + '</button>';
                    } else {
                        resultElement.innerHTML = '<span class="error">Subdomain ' + fullDomain + ' tidak ditemukan atau tidak aktif.</span>';
                    }
                })
                .catch(error => {
                    resultElement.innerHTML = '<span class="error">Subdomain ' + fullDomain + ' tidak dapat diakses atau terjadi kesalahan.</span>';
                });
        }
    </script>

</body>
</html>
