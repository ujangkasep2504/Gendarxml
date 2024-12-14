async function createCloudflareDNSRecord(customDomainUrl) {
  const apiToken = 'N64dCpz_OhKDsC2DetlG2s50qU52qRK-Hl2b1k_v';  // Ganti dengan token API yang valid
  const zoneId = '6667f4f556a99898afdadf0a48749568'; // Ganti dengan Zone ID yang baru

  const recordData = {
    type: 'CNAME', // Tipe record yang digunakan
    name: customDomainUrl, // Nama domain yang akan ditambahkan
    content: 'andisaputra', // Konten CNAME (misalnya subdomain atau domain tujuan)
    ttl: 3600, // Waktu hidup record dalam detik
    proxied: false // Nonaktifkan proxy jika tidak ingin menggunakan Cloudflare proxy
  }

  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recordData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Error: ${result.errors.map(err => err.message).join(', ')}`);
    }

    return result.success ? result : { success: false, message: 'Gagal menambahkan DNS record' };
  } catch (error) {
    return { success: false, message: `Terjadi kesalahan: ${error.message}` };
  }
}
