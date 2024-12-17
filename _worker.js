export default {
  async fetch(request) {
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generate URL</title>
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
        <option value="ari.andika2.site">ari.andika2.site</option>
        <option value="ari-andikha.web.id">ari-andikha.web.id</option>
        <option value="gendarxml.web.id">gendarxml.web.id</option>
    </select>
    <button onclick="generateUrl()">Salin URL</button>
    <div id="message"></div>

    <script>
        function generateUrl() {
            const subdomain = document.getElementById('subdomainInput').value.trim();
            const domain = document.getElementById('domainSelect').value;
            const message = document.getElementById('message');

            if (subdomain === '') {
                message.innerHTML = "Subdomain tidak boleh kosong!";
                message.style.color = "red";
                return;
            }

            const fullUrl = \`http://\${subdomain}.\${domain}\`;
            navigator.clipboard.writeText(fullUrl)
                .then(() => {
                    message.innerHTML = \`URL "\${fullUrl}" berhasil disalin!\`;
                    message.style.color = "green";
                })
                .catch(() => {
                    message.innerHTML = "Gagal menyalin URL!";
                    message.style.color = "red";
                });
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
