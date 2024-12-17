export default {
  async fetch(request) {
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generate HTTPS URL</title>
    <style>
        /* Latar belakang gradasi */
        body {
            font-family: 'Arial', sans-serif;
            text-align: center;
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #6a11cb, #2575fc); /* Gradasi warna */
            color: white;
        }

        /* Kotak input dan elemen lainnya */
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

        <button onclick="generateUrl()">Salin URL</button>
        <button onclick="openUrl()">Buka URL</button>

        <div id="message"></div>
    </div>

    <script>
        let generatedUrl = "";

        function generateUrl() {
            const subdomain = document.getElementById('subdomainInput').value.trim();
            const domain = document.getElementById('domainSelect').value;
            const message = document.getElementById('message');

            if (subdomain === '') {
                message.innerHTML = "Subdomain tidak boleh kosong!";
                message.className = 'red';
                return;
            }

            generatedUrl = `https://${subdomain}.${domain}`;

            navigator.clipboard.writeText(generatedUrl)
                .then(() => {
                    message.innerHTML = `URL "${generatedUrl}" berhasil disalin!`;
                    message.className = 'green';
                })
                .catch(() => {
                    message.innerHTML = "Gagal menyalin URL!";
                    message.className = 'red';
                });
        }

        function openUrl() {
            if (generatedUrl) {
                window.open(generatedUrl, "_blank");
            } else {
                const message = document.getElementById('message');
                message.innerHTML = "Harap buat URL terlebih dahulu!";
                message.className = 'red';
            }
        }
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
