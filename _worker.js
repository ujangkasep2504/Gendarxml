<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cek Subdomain dan Salin URL</title>
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
        .copy-button {
            padding: 10px;
            background-color: #008CBA;
            color: white;
            font-size: 16px;
            border: none;
            cursor: pointer;
        }
        .copy-button:hover {
            background-color: #006f8c;
        }
    </style>
</head>
<body>

    <h1>Cek Subdomain dan Salin URL</h1>
    <p>Masukkan nama subdomain yang ingin Anda gabungkan:</p>

    <input type="text" id="subdomain" placeholder="Masukkan subdomain (contoh: gendar)">
    <button onclick="generateUrl()">Gabungkan URL</button>

    <div id="result"></div>

    <script>
        function generateUrl() {
            var subdomain = document.getElementById('subdomain').value;
            var domain = 'ari-andika.site';  // Ganti dengan domain Anda
            var fullDomain = subdomain + '.' + domain;
            var resultElement = document.getElementById('result');

            // Membuat URL lengkap dengan https://
            var url = 'https://' + fullDomain;

            // Menampilkan hasil URL yang bisa disalin
            resultElement.innerHTML = 'URL lengkap: ' + url;
            
            // Menampilkan input untuk menyalin URL
            resultElement.innerHTML += '<br><input type="text" id="copy-url" value="' + url + '" readonly style="width: 300px; padding: 8px; font-size: 16px;">';
            
            // Menampilkan tombol salin
            resultElement.innerHTML += '<br><button class="copy-button" onclick="copyUrl()">Salin URL</button>';
        }

        // Fungsi untuk menyalin URL
        function copyUrl() {
            var copyText = document.getElementById("copy-url");
            copyText.select();
            copyText.setSelectionRange(0, 99999); // Untuk perangkat mobile

            // Salin ke clipboard
            document.execCommand("copy");

            // Feedback ke user
            alert("URL disalin: " + copyText.value);
        }
    </script>

</body>
</html>
