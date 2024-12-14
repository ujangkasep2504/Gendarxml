<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buat Akun VLESS</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .container {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 400px;
    }
    h1 {
      text-align: center;
      font-size: 24px;
    }
    input {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      width: 100%;
      padding: 10px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
    }
    button:hover {
      background-color: #45a049;
    }
    .message {
      margin-top: 10px;
      text-align: center;
    }
  </style>
</head>
<body>

  <div class="container">
    <h1>Buat Akun VLESS</h1>
    <form id="vlessForm">
      <label for="domain">Domain:</label>
      <input type="text" id="domain" name="domain" required placeholder="Masukkan domain">

      <label for="uuid">UUID:</label>
      <input type="text" id="uuid" name="uuid" required placeholder="Masukkan UUID (opsional)" value="">

      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required placeholder="Masukkan password">

      <button type="submit">Buat Akun</button>
    </form>
    <div class="message" id="message"></div>
  </div>

  <script>
    document.getElementById('vlessForm').addEventListener('submit', async function(event) {
      event.preventDefault();

      const domain = document.getElementById('domain').value;
      let uuid = document.getElementById('uuid').value;
      const password = document.getElementById('password').value;

      // Jika UUID kosong, generate secara otomatis
      if (!uuid) {
        uuid = crypto.randomUUID(); // Generate UUID jika tidak diisi
      }

      const messageElement = document.getElementById('message');
      messageElement.innerText = 'Memproses...';
      messageElement.style.color = 'blue';

      try {
        const response = await fetch('https://your-worker-name.workers.dev', { // Ganti dengan URL Worker Anda
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ domain, uuid, password })
        });

        const result = await response.json();

        if (response.ok) {
          messageElement.style.color = 'green';
          messageElement.innerHTML = `
            <p>${result.message}</p>
            <pre>${JSON.stringify(result.vlessConfig, null, 2)}</pre>
          `;
        } else {
          throw new Error(result.message || 'Terjadi kesalahan.');
        }
      } catch (error) {
        messageElement.style.color = 'red';
        messageElement.innerText = `Error: ${error.message}`;
      }
    });
  </script>

</body>
</html>
