import re
import asyncio
import json
import logging
import ipaddress
from telethon import TelegramClient, events
from telethon.tl.types import InputPeerUser
import aiohttp

SERVER_VLESS = 'Telegram-vless.ari-andika.site'
SERVER_TROJAN = 'Telegram-trojan.ari-andika.site'
PASS_UID = 'AKUN-GENDAR-ORII'  # Ganti PASSUID SETERAH KALIAN
API_URL = 'https://apix.sonzaix.workers.dev/?ip='
API_ID = 7266145698  # Ganti dengan API ID Klean
API_HASH = '7266145698:AAFVUosuzdffYWtSLvARrxiHHpbe94Aruug'  # Ganti dengan API Hash Klean

client = TelegramClient('userbot_session', API_ID, API_HASH)

logging.basicConfig(
    format='%(asctime)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

def is_valid_ip(ip):
    """
    Memvalidasi apakah string adalah alamat IPv4 atau IPv6 yang valid.
    """
    try:
        ipaddress.ip_address(ip)
        return True
    except ValueError:
        return False

# JANGAN UBAH
async def fetch_proxy_status(proxy_ip, port='443', retries=3, backoff_factor=1.0, timeout=10):
    """
    Mengambil status proxy dari API eksternal dengan mekanisme retry.
    
    Parameters:
        proxy_ip (str): Alamat IP proxy.
        port (str): Port proxy.
        retries (int): Jumlah maksimal percobaan ulang.
        backoff_factor (float): Faktor penundaan antar percobaan.
        timeout (int): Waktu tunggu maksimum untuk setiap permintaan (dalam detik).
    
    Returns:
        tuple: (data, error)
    """
    url = f"{API_URL}{proxy_ip}:{port}"
    attempt = 0

    while attempt < retries:
        try:
            timeout_obj = aiohttp.ClientTimeout(total=timeout)
            async with aiohttp.ClientSession(timeout=timeout_obj) as session:
                async with session.get(url) as response:
                    if response.status == 200:
                        data = await response.json()
                        logger.info(f"Berhasil mendapatkan data dari API pada percobaan {attempt + 1}")
                        return data, None
                    elif 500 <= response.status < 600:
                        # Kesalahan server, bisa mencoba lagi
                        error_message = f"API merespon dengan kode status {response.status}"
                        attempt += 1
                        logger.warning(f"Percobaan {attempt}/{retries} gagal: {error_message}")
                        if attempt < retries:
                            delay = backoff_factor * (2 ** (attempt - 1))
                            logger.info(f"Menunggu {delay} detik sebelum mencoba lagi...")
                            await asyncio.sleep(delay)
                            continue
                        else:
                            return None, error_message
                    else:
                        error_message = f"API merespon dengan kode status {response.status}"
                        logger.error(f"Permintaan gagal dengan status {response.status}")
                        return None, error_message
        except asyncio.TimeoutError:
            # Timeout, bisa mencoba lagi
            error_message = "Permintaan ke API timeout."
            attempt += 1
            logger.warning(f"Percobaan {attempt}/{retries} gagal: {error_message}")
            if attempt < retries:
                delay = backoff_factor * (2 ** (attempt - 1))
                logger.info(f"Menunggu {delay} detik sebelum mencoba lagi...")
                await asyncio.sleep(delay)
                continue
            else:
                return None, error_message
        except Exception as e:
            error_message = str(e)
            attempt += 1
            logger.error(f"Percobaan {attempt}/{retries} gagal dengan exception: {e}")
            if attempt < retries:
                delay = backoff_factor * (2 ** (attempt - 1))
                logger.info(f"Menunggu {delay} detik sebelum mencoba lagi...")
                await asyncio.sleep(delay)
                continue
            else:
                return None, error_message

    return None, "Gagal setelah beberapa percobaan."

def format_vless_config(data):
    """
    Memformat konfigurasi VLESS berdasarkan respons API.
    """
    encoded_isp = re.sub(r'\s+', '%20', data['isp'])
    config = f"""[===========VLESS===========]
{data['isp']} {data['flag']}
{data['proxyHost']}:{data['proxyPort']}
[===========VLESS===========]

**VLESS TLS**
```
vless://{PASS_UID}@{SERVER_VLESS}:443?encryption=none&security=tls&sni={SERVER_VLESS}&fp=randomized&type=ws&host={SERVER_VLESS}&path=%2Fbysonzaiex%3D{data['proxyHost']}%3D{data['proxyPort']}#{encoded_isp}%20{data['flag']}```
**VLESS NTLS**
```
vless://{PASS_UID}@{SERVER_VLESS}:80?path=%2Fbysonzaiex%3D{data['proxyHost']}%3D{data['proxyPort']}&security=none&encryption=none&host={SERVER_VLESS}&fp=randomized&type=ws&sni={SERVER_VLESS}#{encoded_isp}%20{data['flag']}```
**CLASH VLESS**
```
proxies:
- name: {data['isp']} {data['flag']}
  server: {SERVER_VLESS}
  port: 443
  type: vless
  uuid: {PASS_UID}
  cipher: auto
  tls: true
  skip-cert-verify: true
  network: ws
  servername: {SERVER_VLESS}
  ws-opts:
    path: /bysonzaiex={data['proxyHost']}={data['proxyPort']}
    headers:
      Host: {SERVER_VLESS}
  udp: true```
"""
    return config

def format_trojan_config(data):
    """
    Memformat konfigurasi TROJAN berdasarkan respons API.
    """
    encoded_isp = re.sub(r'\s+', '%20', data['isp'])
    config = f"""[===========TROJAN===========]
{data['isp']} {data['flag']}
{data['proxyHost']}:{data['proxyPort']}
[===========TROJAN===========]

**TROJAN TLS**
```
trojan://{PASS_UID}@{SERVER_TROJAN}:443?encryption=none&security=tls&sni={SERVER_TROJAN}&fp=randomized&type=ws&host={SERVER_TROJAN}&path=%2Fbysonzaix%3D{data['proxyHost']}%3D{data['proxyPort']}#{encoded_isp}%20{data['flag']}```
**TROJAN NTLS**
```
trojan://{PASS_UID}@{SERVER_TROJAN}:80?path=%2Fbysonzaix%3D{data['proxyHost']}%3D{data['proxyPort']}&security=none&encryption=none&host={SERVER_TROJAN}&fp=randomized&type=ws&sni={SERVER_TROJAN}#{encoded_isp}%20{data['flag']}```
**CLASH TROJAN**
```
proxies:
- name: {data['isp']} {data['flag']}
  server: {SERVER_TROJAN}
  port: 443
  type: trojan
  password: {PASS_UID}
  skip-cert-verify: true
  network: ws
  sni: {SERVER_TROJAN}
  ws-opts:
    path: /bysonzaix={data['proxyHost']}={data['proxyPort']}
    headers:
      Host: {SERVER_TROJAN}
  udp: true```"""
    return config

async def send_message(event, message):
    """
    Mengirim pesan ke pengguna.
    """
    message_with_link = message + "\n[Developed by Sonzai X ã·](https://t.me/November2k)"
    await event.respond(message_with_link, parse_mode='markdown')

@client.on(events.NewMessage(pattern=r'^\.create (vless|trojan) ([\d\.]+)(?::(\d+))?$'))
async def handle_create(event):
    """
    Menangani perintah .create untuk menghasilkan konfigurasi VLESS atau TROJAN.
    """
    command = event.pattern_match.group(1).lower()
    proxy_ip = event.pattern_match.group(2)
    port = event.pattern_match.group(3) or '443' 

    logger.info(f"Menerima perintah .create dengan command={command}, proxy_ip={proxy_ip}, port={port}")

    if not is_valid_ip(proxy_ip):
        await send_message(event, "â **Error:** Alamat IP tidak valid. Silakan berikan alamat IPv4 atau IPv6 yang benar.")
        logger.warning(f"Alamat IP tidak valid: {proxy_ip}")
        return

    if not port.isdigit() or not (1 <= int(port) <= 65535):
        await send_message(event, "â **Error:** Port harus berupa angka antara 1 dan 65535.")
        logger.warning(f"Port tidak valid: {port}")
        return

    await event.respond("ð **Sedang memeriksa status proxy...**")
    logger.info(f"Memeriksa status proxy untuk IP: {proxy_ip}, Port: {port}")

    data, error = await fetch_proxy_status(proxy_ip, port)

    if error:
        await send_message(event, f"â **Error saat mengambil data dari API:** {error}")
        logger.error(f"Error saat mengambil data dari API: {error}")
        return

    if not data or 'proxyStatus' not in data:
        await send_message(event, "â **Error:** Respons API tidak terduga. Silakan coba lagi nanti.")
        logger.error(f"Respons API tidak terduga: {data}")
        return

    if data['proxyStatus'] != 'â ALIVE â':
        await send_message(event, "â **Anda tidak bisa membuat konfigurasi menggunakan proxy IP tersebut. Tolong cari proxy IP yang valid atau coba lagi untuk memastikan status proxy.**")
        logger.warning(f"Proxy status tidak ALIVE: {data['proxyStatus']}")
        return

    if command == 'vless':
        config = format_vless_config(data)
        logger.info("Menghasilkan konfigurasi VLESS")
    else:
        config = format_trojan_config(data)
        logger.info("Menghasilkan konfigurasi TROJAN")

    await send_message(event, config)
    logger.info("Konfigurasi berhasil dikirim ke pengguna.")

def main():
    print("âï¸ Memulai Telegram Userbot...")
    logger.info("Memulai Telegram Userbot...")
    client.start()
    print("â Userbot berjalan.")
    logger.info("Userbot berjalan.")
    client.run_until_disconnected()

if __name__ == '__main__':
    main()
