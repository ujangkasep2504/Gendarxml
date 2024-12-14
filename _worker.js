export default {
  async fetch(request) {
    // Konfigurasi server VMess
    const VMESS_SERVER = "coba.ari-andika.site";
    const VMESS_PORT = 443;
    const PATH = "/vmess";
    const UUID = "904fccc7-7941-4a2e-99f4-0a220347a156";

    const targetUrl = `wss://${VMESS_SERVER}:${VMESS_PORT}${PATH}`;

    try {
      console.log("Attempting to connect to:", targetUrl); // Menambahkan log untuk melihat URL yang dicoba
      const socket = new WebSocket(targetUrl);

      socket.onopen = () => {
        console.log("WebSocket connection opened.");
        socket.send(`VMess ${UUID}`);
      };

      socket.onmessage = (event) => {
        console.log("Message received:", event.data); // Log pesan yang diterima
        return new Response(event.data, { status: 101, headers: { "Connection": "Upgrade" } });
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error); // Menambahkan log error
        return new Response(`Failed to connect to VMess server: ${error.message}`, {
          status: 500,
          headers: { "Content-Type": "text/plain" },
        });
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed.");
      };

      return new Response("WebSocket connection opened", {
        status: 101,
        headers: { "Connection": "Upgrade" },
      });

    } catch (error) {
      console.error("Connection failed:", error);
      return new Response(`Failed to connect to VMess server: ${error.message}`, {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
};
