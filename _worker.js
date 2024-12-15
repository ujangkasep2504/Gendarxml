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
        .link-button {
            background-color: #008CBA;
        }
        .link-button:hover {
            background-color: #0077B3;
        }
        .error {
            color: red;
        }
        .success {
            color: green;
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

            // Menggunakan fetch untuk mencoba request ke subdomain
            fetch('https://' + fullDomain, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        resultElement.innerHTML = '<span class="success">Subdomain ' + fullDomain + ' ditemukan dan aktif! </span>';
                        resultElement.innerHTML += '<br><button class="link-button" onclick="window.location.href=\'https://' + fullDomain + '\'">Lanjutkan ke ' + fullDomain + '</button>';
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
