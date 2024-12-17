export default {
  async fetch(request) {
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generate & Open URL</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 50px;
        }
        select, input, button {
            padding: 10px;
            font-size: 16px;
            margin: 5px;
        }
        #message {
            margin-top: 20px;
            color: green;
        }
    </style>
</head>
<body>
    <h1>Generate URL</h1>
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

    <script>
        let generatedUrl = ""; 

        function generateUrl() {
            const subdomain = document.getElementById('subdomainInput').value.trim();
            const domain = document.getElementById('domainSelect').value;
            const message = document.getElementById('message');

            if (subdomain === '') {
                message.innerHTML = "Subdomain tidak boleh kosong!";
                message.style.color = "red";
                return;
            }

            generatedUrl = \`http://\${subdomain}.\${domain}\`;

            navigator.clipboard.writeText(generatedUrl)
                .then(() => {
                    message.innerHTML = \`URL "\${generatedUrl}" berhasil disalin!\`;
                    message.style.color = "green";
                })
                .catch(() => {
                    message.innerHTML = "Gagal menyalin URL!";
                    message.style.color = "red";
                });
        }

        function openUrl() {
            if (generatedUrl) {
                window.open(generatedUrl, "_blank");
            } else {
                const message = document.getElementById('message');
                message.innerHTML = "Harap buat URL terlebih dahulu!";
                message.style.color = "red";
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
