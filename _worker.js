addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // Jika request adalah POST, berarti form sedang dikirim
  if (request.method === 'POST') {
    const formData = await request.formData()
    const username = formData.get('username')
    const password = formData.get('password')

    // Tangani data form di sini, misalnya kirim ke server atau database
    return new Response(`Akun berhasil dibuat! Username: ${username}, Password: ${password}`, {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  // Menampilkan form HTML jika bukan POST request
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Buat Akun Trojan</title>
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
          color: #333;
        }
        label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
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
        <h1>Buat Akun Trojan</h1>
        <form method="POST">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" required placeholder="Masukkan username">

          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required placeholder="Masukkan password">

          <button type="submit">Buat Akun</button>
        </form>
        <div class="message"></div>
      </div>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' },
  })
}
